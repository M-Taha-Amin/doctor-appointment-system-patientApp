import { Link } from 'react-router-dom';
import type { Doctor } from '../types/custom';

type DoctorCardProps = {
  doctor: Doctor;
  width?: number;
};

export const DoctorCard = ({ doctor, width = 55 }: DoctorCardProps) => {
  return (
    <Link to={`/appointment/${doctor.id}`}>
      <div
        className={`flex flex-col w-${width} border-gray-200 border-2 rounded-lg select-none cursor-pointer hover:-mt-3 hover:mb-3 transition-all duration-500`}>
        {/* Doctor Image */}
        <div className="bg-purple/8">
          <img
            className="w-62 h-62 object-cover object-center"
            src={doctor.image}
            alt="doctor image"
          />
        </div>

        {/* Doctor Details */}
        <div className="text-left py-4 px-4">
          <p>
            <span className="size-2 bg-green-500 inline-block rounded-full"></span>
            <span className="inline-block ml-2 text-sm font-medium text-green-400">
              Available
            </span>
          </p>
          <h3 className="text-lg font-semibold">{doctor.name}</h3>
          <p className="text-gray-600 text-sm">{doctor.speciality}</p>
        </div>
      </div>
    </Link>
  );
};
