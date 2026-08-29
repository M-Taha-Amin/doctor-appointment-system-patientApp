import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import { lazy, useEffect } from 'react';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from './store/hooks';
import { logout, setUser } from './store/authSlice';
import { axiosClient } from './lib/axios';
import { assets } from './assets/assets';
import ScrollToTop from './components/scrollToTop';
import { setDoctors } from './store/doctorSlice';

const App = () => {
  const About = lazy(() => import('./pages/About'));
  const Contact = lazy(() => import('./pages/Contact'));
  const Doctors = lazy(() => import('./pages/Doctors'));
  const Register = lazy(() => import('./pages/Register'));
  const Login = lazy(() => import('./pages/Login'));
  const Profile = lazy(() => import('./pages/Profile'));
  const BookAppointment = lazy(() => import('./pages/BookAppointment'));
  const MyAppointments = lazy(() => import('./pages/MyAppointments'));

  const dispatch = useAppDispatch();

  const getMeQuery = useQuery({
    queryKey: ['auth/me'],
    queryFn: async () => {
      const res = await axiosClient(
        `${import.meta.env.VITE_SERVER_URL}/auth/me`,
      );
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const doctorsQuery = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await axiosClient(
        `${import.meta.env.VITE_SERVER_URL}/doctors`,
      );
      return res.data.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (getMeQuery.isSuccess) {
      dispatch(setUser(getMeQuery.data.user));
    }
    if (getMeQuery.isError) {
      dispatch(logout());
    }
  }, [getMeQuery, getMeQuery.isSuccess, getMeQuery.isError]);

  useEffect(() => {
    if (doctorsQuery.isSuccess) {
      dispatch(setDoctors(doctorsQuery.data));
    }
    if (doctorsQuery.isError) {
      dispatch(setDoctors([]));
    }
  }, [getMeQuery, getMeQuery.isSuccess, getMeQuery.isError]);

  const isLoading = getMeQuery.isLoading || doctorsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <img className="animate-bounce" src={assets.logo} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer autoClose={1500} position="top-right" />
      <ScrollToTop />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/appointment/:doctorId" element={<BookAppointment />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/appointments" element={<MyAppointments />} />
          </Route>
        </Route>
        <Route element={<RootLayout hideFooter />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
