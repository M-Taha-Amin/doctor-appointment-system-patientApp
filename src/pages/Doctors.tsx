import { Link, useParams } from 'react-router-dom';
import { specialityData } from '../assets/assets';
import { DoctorCard } from '../components/DoctorCard';
import { useAppSelector } from '../store/hooks';

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useAppSelector(state => state.doctors);
  let filteredDocs = doctors;

  if (speciality) {
    filteredDocs = doctors.filter(
      doc => doc.speciality.toLowerCase() === speciality,
    );
  }

  return (
    <div className="mt-8">
      <p className="text-gray-700 mb-8">
        Browse through the doctors specialist.
      </p>
      <div className="flex gap-8 mb-24">
        <div className="flex-1">
          <ul className="space-y-3">
            {specialityData.map(sp => (
              <Link
                className="block"
                to={`/doctors/${sp.speciality.toLowerCase()}`}>
                <li
                  className={`p-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-500 hover:bg-gray-200 hover:text-gray-700 cursor-pointer transition-all duration-300 ${sp.speciality.toLowerCase() === speciality && 'bg-gray-200 text-gray-700'}`}>
                  {sp.speciality}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        {filteredDocs.length > 0 && (
          <div className="grid grid-cols-4 gap-6 mb-40">
            {filteredDocs.map(doctor => (
              <DoctorCard width={54} key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
        {filteredDocs.length === 0 && (
          <p className="flex-8 flex justify-center items-center text-2xl text-gray-500 font-semibold uppercase">
            No Doctors found :{'('}
          </p>
        )}
      </div>
    </div>
  );
};

export default Doctors;
