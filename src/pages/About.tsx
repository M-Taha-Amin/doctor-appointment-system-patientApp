import { assets } from '../assets/assets';

const About = () => {
  return (
    <>
      <div className="py-16">
        <h1 className="uppercase text-2xl text-center text-gray-500">
          About <span className="font-semibold text-black">us</span>
        </h1>
        <div className="flex gap-12 items-center">
          <img src={assets.about_image} alt="about_image" width={400} />
          <div className="space-y-4 text-sm max-w-140 text-black/70">
            <p>
              Welcome to Prescripto, your trusted partner in managing your
              healthcare needs conveniently and efficiently. At Prescripto, we
              understand the challenges individuals face when it comes to
              scheduling doctor appointments and managing their health records.
            </p>
            <p>
              Prescripto is committed to excellence in healthcare technology. We
              continuously strive to enhance our platform, integrating the
              latest advancements to improve user experience and deliver
              superior service. Whether you're booking your first appointment or
              managing ongoing care, Prescripto is here to support you every
              step of the way.
            </p>
            <h3 className="text-black font-bold">Our Vision</h3>
            <p>
              Our vision at Prescripto is to create a seamless healthcare
              experience for every user. We aim to bridge the gap between
              patients and healthcare providers, making it easier for you to
              access the care you need, when you need it.
            </p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="uppercase text-xl text-gray-500">
          Why <span className="font-semibold text-black">choose us</span>
        </h2>
        <div className="grid grid-cols-3 mt-4 mb-40 text-gray-700">
          <div className="border border-gray-300 cursor-pointer hover:bg-purple hover:text-white transition-all duration-300 p-16">
            <h4 className="uppercase mb-4 font-semibold">Efficiency:</h4>
            <p>
              Streamlined appointment scheduling that fits into your busy
              lifestyle.
            </p>
          </div>
          <div className="border border-gray-300 cursor-pointer hover:bg-purple hover:text-white transition-all duration-300 p-16">
            <h4 className="uppercase mb-4 font-semibold">Convenience:</h4>
            <p>
              Access to a network of trusted healthcare professionals in your
              area.
            </p>
          </div>
          <div className="border border-gray-300 cursor-pointer hover:bg-purple hover:text-white transition-all duration-300 p-16">
            <h4 className="uppercase mb-4 font-semibold">Personalization:</h4>
            <p>
              Tailored recommendations and reminders to help you stay on top of
              your health.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
