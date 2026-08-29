import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type RootLayoutProps = {
  hideFooter?: boolean;
};

const RootLayout = ({ hideFooter = false }: RootLayoutProps) => {
  return (
    <div className="mx-30">
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default RootLayout;
