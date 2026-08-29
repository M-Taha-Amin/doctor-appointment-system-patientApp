import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { axiosClient } from '../lib/axios';
import { useAppSelector } from '../store/hooks';
import type { ApiResponse, Appointment } from '../types/custom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const MyAppointments = () => {
  const { user } = useAppSelector(state => state.auth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const payment = searchParams.get('payment');

    if (payment === 'success') {
      toast.success('Paid Successfully');
    } else if (payment === 'cancelled') {
      toast.error('Cancelled by User');
    }

    if (payment) {
      navigate('/appointments', { replace: true });
    }
  }, []);

  const appointmentsQuery = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      const res = await axiosClient<ApiResponse<Appointment[]>>(
        `/api/appointments/patient?patient_id=${user!.id}`,
      );
      console.log(res.data.data);
      return res.data.data;
    },
    enabled: !!user?.id,
    staleTime: 'static',
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async ({
      appointmentId,
      patientId,
    }: {
      appointmentId: string;
      patientId: string;
    }) => {
      const res = await axiosClient(
        `/api/appointments/${appointmentId}/cancel`,
        {
          method: 'POST',
          data: {
            patientId,
          },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', user?.id] });
    },
  });

  async function cancelAppointment(appointmentId: string, patientId: string) {
    toast.promise(
      cancelAppointmentMutation.mutateAsync({ appointmentId, patientId }),
      {
        pending: 'Cancelling...',
        success: 'Cancelled',
        error: 'Failed to Cancel',
      },
    );
  }

  if (appointmentsQuery.isPending) {
    return (
      <div className="mt-64 animate-bounce flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-16 mb-48">
      <h1 className="text-gray-600 font-semibold text-xl">My Appointments</h1>
      <hr className="border border-gray-300 rounded-lg my-6" />
      <div className="flex flex-col gap-3">
        {appointmentsQuery.data?.map((apt: Appointment) => (
          <Appointment appointment={apt} onCancel={cancelAppointment} />
        ))}
      </div>
    </div>
  );
};

const Appointment = ({
  appointment,
  onCancel,
}: {
  appointment: Appointment;
  onCancel: (appointmentId: string, patientId: string) => void;
}) => {
  async function createSession() {
    const res = await axiosClient.post(
      `${import.meta.env.VITE_SERVER_URL}/payments/create-session`,
      {
        appointmentId: appointment.id,
        patientId: appointment.patient_id,
      },
    );
    window.location.href = res.data.url;
  }

  return (
    <>
      <div className="flex gap-4 items-center">
        <img
          width={200}
          className="bg-purple/10 rounded-lg"
          src={appointment.doctor_image}
          alt="doctor image"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{appointment.doctor_name}</h3>
          <p className="text-gray-600">{appointment.doctor_speciality}</p>
          <p className="mt-4 text-gray-600 font-semibold text-sm">Address:</p>
          <p className="mt-1 text-gray-600">{appointment.doctor_address}</p>
          <p className="mt-3 text-sm text-gray-600">
            <span className="mt-4 font-semibold">Date & Time:</span>{' '}
            {format(appointment.booked_at, 'dd MMM, yyyy')} |{' '}
            {format(appointment.booked_at, 'h:mm a')}
          </p>
        </div>
        {appointment.status === 'pending' && (
          <div className="flex flex-col gap-2">
            {appointment.paid ? (
              <button className="px-20 text-white rounded-sm py-2 text-sm bg-green-500">
                Paid
              </button>
            ) : (
              <>
                <button
                  className="px-8 text-white rounded-sm py-2 text-sm bg-purple cursor-pointer hover:bg-purple/85"
                  onClick={createSession}>
                  Pay Online
                </button>
                <button
                  className="text-gray-600 border border-gray-600 py-2 px-8 text-sm rounded-sm cursor-pointer hover:bg-gray-600 hover:text-white"
                  onClick={() =>
                    onCancel(appointment.id, appointment.patient_id)
                  }>
                  Cancel appointment
                </button>
              </>
            )}
          </div>
        )}
        {appointment.status === 'cancelled' && (
          <button className="px-16 text-red-500 rounded-sm py-2 text-sm border border-red-500">
            Cancelled
          </button>
        )}
        {appointment.status === 'completed' && (
          <button className="px-16 text-green-500 rounded-sm py-2 text-sm border border-green-500">
            Completed
          </button>
        )}
      </div>
      <hr className="border border-gray-300 rounded-lg my-3" />
    </>
  );
};

export default MyAppointments;
