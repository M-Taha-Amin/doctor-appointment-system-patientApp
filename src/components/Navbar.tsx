import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from '../lib/axios';
import { logout } from '../store/authSlice';
import { toast } from 'react-toastify';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'All Doctors', to: '/doctors' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const { user } = useAppSelector(state => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useAppDispatch();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosClient(
        `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
      );
      return res.data;
    },
    onSuccess: () => {
      dispatch(logout());
    },
  });

  return (
    <>
      <nav className="py-3 flex items-center justify-between">
        <Link to="/">
          <img width={150} src={assets.logo} alt="" />
        </Link>
        <ul className="flex gap-x-10 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `uppercase text-xs ${isActive && 'font-semibold underline decoration-purple underline-offset-8 decoration-2'}`
              }>
              {link.name}
            </NavLink>
          ))}
        </ul>

        {user ? (
          <div className="relative">
            <img
              onClick={() => setShowMenu(!showMenu)}
              width={28}
              className="h-7 rounded-full object-center object-cover cursor-pointer"
              src={
                user?.image?.url
                  ? user.image.url
                  : 'https://i.pinimg.com/474x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg'
              }
              alt="user pfp"
            />
            {showMenu && (
              <ul className="absolute bg-white shadow-sm ring ring-gray-200 p-3 flex flex-col gap-y-3 w-45 right-0 z-10 top-10 rounded-sm select-none">
                <Link
                  to="/profile"
                  onClick={() => setShowMenu(false)}
                  className="font-medium text-sm text-gray-700 cursor-pointer">
                  My Profile
                </Link>
                <Link
                  to="/appointments"
                  onClick={() => setShowMenu(false)}
                  className="font-medium text-sm text-gray-700 cursor-pointer">
                  My Appointments
                </Link>
                <li
                  onClick={() => {
                    setShowMenu(false);
                    toast.promise(logoutMutation.mutateAsync(), {
                      pending: 'Logging out',
                    });
                  }}
                  className="font-medium text-sm text-gray-700 cursor-pointer">
                  Logout
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link
            to="/register"
            className="bg-purple hover:bg-purple/85 text-sm text-white px-8 py-3 rounded-full cursor-pointer">
            Create account
          </Link>
        )}
      </nav>
      <hr className="border-gray-300 mt-2" />
    </>
  );
};

export default Navbar;
