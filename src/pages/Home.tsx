import { Link } from 'react-router-dom';
import { assets, specialityData } from '../assets/assets';
import { DoctorCard } from '../components/DoctorCard';
import { useAppSelector } from '../store/hooks';

const Home = () => {
  const { doctors } = useAppSelector(state => state.doctors);
  return (
    <>
      {/* Hero Section */}
      <section className="bg-purple h-140 mt-8 rounded-lg text-white flex">
        {/* Hero Text */}
        <div className="flex-1 flex pl-12 justify-center flex-col">
          <h1 className="text-5xl leading-14 font-bold">
            Book Appointment
            <br /> With Trusted Doctors
          </h1>
          {/* Users group with text */}
          <div className="mt-4 flex items-center gap-x-3">
            <img
              src={assets.group_profiles}
              alt="users profile group icon"
              width={100}
            />
            <p className="leading-5">
              Simply browse through our extensive list of trusted doctors,
              <br />
              schedule your appointment hassle-free.
            </p>
          </div>
          {/* Hero Section Button */}
          <a
            href="#top-doctors"
            className="bg-white w-fit text-black/70 text-sm px-6 py-2 rounded-full cursor-pointer flex items-center gap-x-4 justify-center mt-4 hover:scale-105 transition-all">
            Book appointment
            <img
              src={assets.arrow_icon}
              alt="arrow icon"
              className="align-baseline"
              width={16}
            />
          </a>
        </div>
        {/* Hero Image */}
        <div className="flex-1 relative">
          <img src={assets.header_img} className="absolute bottom-0 right-16" />
        </div>
      </section>

      {/* Speciality Section */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-semibold">Find by Speciality</h2>
        <p className="mt-4 text-sm">
          Simply browse through our extensive list of trusted doctors,
          <br /> schedule your appointment hassle-free.
        </p>
        <div className="flex justify-center gap-x-6 mt-12">
          {specialityData.map(sp => (
            <Link
              key={sp.speciality}
              to={'/doctors/' + sp.speciality.toLowerCase()}>
              <div className="hover:-mt-4 cursor-pointer transition-all duration-500">
                <img src={sp.image} alt="Speciality Image" width={100} />
                <span className="text-sm">{sp.speciality}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Doctors Section */}
      <section id="top-doctors" className="text-center py-16">
        <h2 className="text-3xl font-semibold">Top Doctors to Book</h2>
        <p className="mt-4 text-sm">
          Simply browse through our extensive list of trusted
          <br /> doctors.
        </p>
        <div className="grid grid-cols-4 w-fit mx-auto gap-6 mt-12">
          {doctors.slice(0, 10).map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
        {doctors.length > 10 && (
          <Link to="/doctors">
            <button className="bg-purple/15 py-2 text-gray-600 px-12 cursor-pointer rounded-full mt-12">
              more
            </button>
          </Link>
        )}
      </section>

      {/* Create Account Banner */}
      <section className="bg-purple h-100 mt-8 rounded-lg text-white flex my-16">
        {/* Hero Text */}
        <div className="flex-1 flex pl-24 justify-center flex-col">
          <h1 className="text-5xl font-bold">
            Book Appointment
            <br /> With 100+ Trusted Doctors
          </h1>
          {/* Hero Section Button */}
          <Link
            to="/register"
            className="bg-white w-fit text-black/70 px-6 py-2 rounded-full cursor-pointer flex items-center gap-x-4 justify-center mt-4 hover:scale-105 transition-all">
            Create account
          </Link>
        </div>
        {/* Hero Image */}
        <div className="flex-1 relative">
          <img
            src={assets.appointment_img}
            className="absolute bottom-0 right-24"
            width={350}
          />
        </div>
      </section>
    </>
  );
};

export default Home;
