import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation } from 'react-router-dom';
import z from 'zod';
import { axiosClient } from '../lib/axios';
import { toast } from 'react-toastify';
import { login } from '../store/authSlice';
import type { ApiResponse } from '../types/custom';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const loginSchema = z.object({
  email: z.string().email('Email must be valid email address'),
  password: z.string().min(8, 'Password must be 8 characters long'),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  type FormData = z.infer<typeof loginSchema>;

  const loginMutation = useMutation<ApiResponse, Error, FormData>({
    mutationFn: async userData => {
      const res = await axiosClient(
        `${import.meta.env.VITE_SERVER_URL}/auth/login`,
        {
          method: 'POST',
          data: userData,
        },
      );
      return res.data;
    },
    onSuccess: response => {
      dispatch(login(response?.data));
    },
  });

  if (user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: FormData) => {
    toast.promise(loginMutation.mutateAsync(data), {
      pending: 'Loading',
      error: 'Failed to Login',
    });
  };

  return (
    <div className="shadow-md p-8 w-100 ring ring-gray-200 mt-8 mx-auto rounded-lg text-gray-700">
      <h1 className="text-2xl font-bold mb-2">Login</h1>
      <p className="text-sm mb-4">Please login to book appointment</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="border border-gray-300 rounded-sm p-1"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            className="border border-gray-300 rounded-sm p-1"
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button className="bg-purple text-white rounded-lg py-2 text-sm font-semibold hover:bg-purple/90 cursor-pointer">
          Login
        </button>
      </form>
      <p className="mt-10 text-sm">
        Not Registered?{' '}
        <Link to="/register" className="text-purple underline cursor-pointer">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
