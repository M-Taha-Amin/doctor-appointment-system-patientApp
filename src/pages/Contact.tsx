import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="mt-16 mb-40">
      <h1 className="uppercase text-2xl text-center text-gray-500">
        Contact <span className="font-semibold text-black">us</span>
      </h1>
      <div className="flex gap-12 items-center justify-center mt-8">
        <img src={assets.contact_image} alt="about_image" width={350} />
        <div className="space-y-6 text-sm max-w-140 text-black/70">
          <h3 className="text-xl uppercase font-semibold">Our Office</h3>
          <p>
            00000 Willms Station
            <br />
            Suite 000, Washington, USA
          </p>
          <p></p>
          <p>
            Tel: (000) 000-0000 <br />
            Email: mtahaamin.others@gmail.com
          </p>
          <h3 className="text-xl uppercase font-semibold">
            Careers at prescripto
          </h3>
          <p>Learn more about our teams and job openings.</p>
          <button className="border border-black py-4 px-8 text-black font-semibold hover:bg-black hover:text-white transition-all duration-400 cursor-pointer">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
