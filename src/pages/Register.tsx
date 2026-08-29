import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { axiosClient } from '../lib/axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { useAppSelector } from '../store/hooks';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Email must be valid email address'),
  password: z.string().min(8, 'Password must be 8 characters long'),
});

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  type FormData = z.infer<typeof registerSchema>;

  const registerMutation = useMutation<unknown, Error, FormData>({
    mutationFn: async userData => {
      const res = await axiosClient(
        `${import.meta.env.VITE_SERVER_URL}/auth/register`,
        {
          method: 'POST',
          data: userData,
        },
      );
      return res.data;
    },
    onSuccess: () => {
      return navigate('/login');
    },
  });

  const onSubmit = async (data: FormData) => {
    toast.promise(registerMutation.mutateAsync(data), {
      pending: 'Registering',
      error: 'Failed to Register',
      success: 'Account Created',
    });
  };

  return (
    <div className="shadow-md p-8 w-100 ring ring-gray-200 mt-8 mx-auto rounded-lg text-gray-700">
      <h1 className="text-2xl font-bold mb-2">Create Account</h1>
      <p className="text-sm mb-4">Please sign up to book appointment</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">
            Full Name
          </label>
          <input
            {...register('name')}
            type="text"
            className="border border-gray-300 rounded-sm p-1"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
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
          Create account
        </button>
      </form>
      <p className="mt-10 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-purple underline cursor-pointer">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
