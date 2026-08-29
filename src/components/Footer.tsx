import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <>
      <div className="grid grid-cols-3">
        {/* Logo Column */}
        <div>
          <img src={assets.logo} alt="logo" width={150} className="mb-4" />
          <p className="text-gray-600 text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Company Column */}
        <div className="ml-auto">
          <h4 className="uppercase text-xl font-semibold">Company</h4>
          <ul className="text-gray-600 text-sm space-y-1 mt-4">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Get in Touch Column */}
        <div className="ml-auto mr-12">
          <h4 className="uppercase text-xl font-semibold">Get in Touch</h4>
          <ul className="text-gray-600 text-sm space-y-1 mt-4">
            <li>+0-000-000-000</li>
            <li>mtahaamin.others@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr className="border-gray-200 border mt-10 mb-6" />
      <p className="text-center mb-8 text-sm">
        Copyright {new Date().getFullYear()} @ developer-taha - All Right
        Reserved.
      </p>
    </>
  );
};

export default Footer;
