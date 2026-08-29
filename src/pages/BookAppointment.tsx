import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import {
  addDays,
  addMinutes,
  format,
  getDate,
  isAfter,
  isBefore,
  isSunday,
  parse,
  set,
} from 'date-fns';
import { useEffect, useState } from 'react';
import { DoctorCard } from '../components/DoctorCard';
import { useAppSelector } from '../store/hooks';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse } from '../types/custom';
import { axiosClient } from '../lib/axios';
import type { AxiosError } from 'axios';

type AppointmentRequest = {
  doctor_id: string;
  patient_id: string;
  booked_at: Date;
};

function getDays() {
  const today = new Date();
  const days = [];
  // we skip the very next slot, so if it's 19:55 (7:55), 8:00pm slot will be skipped leaving only the 8:30pm slot, if it's more than 7:55 then after that there are no slots for today
  const slotsLeftForToday = isBefore(today, new Date().setHours(19, 55, 0, 0));

  if (slotsLeftForToday) {
    days.push(today);
  } else days.push(addDays(today, 1));

  while (days.length !== 7) {
    const lastDay: Date = days[days.length - 1];
    let nextDay = addDays(lastDay, 1);
    if (isSunday(nextDay)) nextDay = addDays(nextDay, 1);
    days.push(nextDay);
  }
  return days;
}

function generateTimeSlots(firstSlot: string, lastSlot: string) {
  const slots: string[] = [];

  let current = parse(firstSlot, 'h:mm a', new Date());
  const end = parse(lastSlot, 'h:mm a', new Date());

  while (current <= end) {
    slots.push(format(current, 'h:mm a'));
    current = addMinutes(current, 30);
  }

  return slots;
}

const slots = generateTimeSlots('10:00 AM', '08:30 PM');

function getFirstSlotIndex(today: Date) {
  for (let i = 0; i < slots.length; i++) {
    const slotTime = parse(slots[i], 'h:mm a', today);

    // if current slot we are looking at is in the future
    // then we skip the current one, and return the next
    if (isAfter(slotTime, today)) {
      return i + 1;
    }
  }

  return 0;
}

function getSlots(selectedDate: Date) {
  const todaySelected = getDate(new Date()) === getDate(selectedDate);
  if (todaySelected) {
    return slots.slice(getFirstSlotIndex(selectedDate));
  } else return slots;
}

const BookAppointment = () => {
  const { doctorId } = useParams();
  const { doctors } = useAppSelector(state => state.doctors);
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const doctor = doctors.find(doc => doc.id === doctorId);

  const [activeDayIdx, setactiveDayIdx] = useState(0);
  const [activeSlotIdx, setActiveSlotIdx] = useState(-1);

  useEffect(() => {
    setActiveSlotIdx(-1);
  }, [activeDayIdx]);

  const days = getDays();
  const slots = getSlots(days[activeDayIdx]);

  if (!doctor) return;

  const relatedDocs = doctors
    .filter(doc => doc.speciality === doctor.speciality && doc.id !== doctor.id)
    .slice(0, 5);

  function bookAppointment() {
    if (activeSlotIdx === -1) {
      toast.error('Please choose a time first');
      return;
    }
    const selectedDate = days[activeDayIdx];
    const timeString = slots[activeSlotIdx];

    const time = parse(timeString, 'h:mm a', selectedDate);

    const timestamp = set(selectedDate, {
      hours: time.getHours(),
      minutes: time.getMinutes(),
      seconds: 0,
      milliseconds: 0,
    });

    toast.promise(
      bookAppointmentMutation.mutateAsync({
        doctor_id: doctor!.id,
        booked_at: timestamp,
        patient_id: user!.id,
      }),
      {
        success: 'Appointment Booked',
        pending: 'Booking...',
      },
    );
  }

  const bookAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentRequest) => {
      const res = await axiosClient<ApiResponse<AppointmentRequest>>(
        `${import.meta.env.VITE_SERVER_URL}/appointments`,
        {
          method: 'POST',
          data,
        },
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(error.response?.data.message);
    },
  });

  return (
    <div className="mt-8 mb-60">
      {/* Doctor Image & Details */}
      <div className="flex gap-4">
        {/* Doctor Image */}
        <div>
          <img
            src={doctor.image}
            alt="doctor's image"
            className="bg-purple rounded-lg w-70 h-62 object-cover object-center"
          />
        </div>
        <div className="ring ring-gray-300 shadow-sm rounded-lg p-8 w-full">
          {/* Doctor Details */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl flex gap-2 items-center font-semibold">
              {doctor.name}
              <img
                src={assets.verified_icon}
                className="mt-1 align-middle"
                alt="verified icon"
              />
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              {doctor.education_degree} - {doctor.speciality}{' '}
              <span className="border border-gray-500 px-2 py-1 rounded-full">
                {doctor.years_of_experience}{' '}
                {doctor.years_of_experience > 1 ? 'Years' : 'Year'}
              </span>
            </p>
            <h3 className="flex gap-1 font-semibold items-center">
              About{' '}
              <img
                className="w-4 mt-1"
                src={assets.info_icon}
                alt="info icon"
              />
            </h3>
            <p className="text-gray-500">{doctor.about}</p>
            <p className="text-gray-700 text-sm">
              Appointment fee:{' '}
              <span className="text-gray-800 font-semibold">
                ${doctor.fee_per_appointment}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Booking */}
      <div className="ml-60 mt-10">
        <h3 className="text-gray-700 font-semibold mb-4">Booking slots</h3>
        <div>
          <div className="flex gap-2">
            {days.map((date, index) => (
              <div
                key={index}
                onClick={() => setactiveDayIdx(index)}
                className={`flex flex-col justify-center items-center py-8 border border-gray-400 rounded-full min-w-18 text-gray-600 font-semibold text-lg select-none cursor-pointer ${activeDayIdx === index && 'bg-purple text-white border-purple'}`}>
                <span>{format(date, 'EEE')}</span>
                <span>{getDate(date)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex overflow-scroll gap-2 my-4 scrollbar-none">
          {slots.map((slot, index) => (
            <div
              key={slot}
              onClick={() => setActiveSlotIdx(index)}
              className={`border border-gray-400 text-gray-400 text-center px-4 py-1 text-nowrap rounded-full min-w-fit text-sm cursor-pointer ${activeSlotIdx === index && 'bg-purple text-white border-purple'}`}>
              {slot}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            if (!user) {
              return navigate('/register');
            } else bookAppointment();
          }}
          className="bg-purple hover:bg-purple/85 text-sm text-white px-12 py-3 rounded-full cursor-pointer">
          Book an appointment
        </button>
      </div>

      {/* Related doctors */}
      {relatedDocs.length > 0 && (
        <section className="text-center py-16">
          <h2 className="text-3xl font-semibold">Related Doctors</h2>
          <p className="mt-4 text-sm">
            Simply browse through our extensive list of trusted doctors.
          </p>
          <div className="flex justify-center gap-6 mt-12">
            {relatedDocs.map(doc => (
              <div className="max-w-60" key={doc.id}>
                <DoctorCard doctor={doc} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BookAppointment;
