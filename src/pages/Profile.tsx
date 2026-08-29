import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useRef, useState } from 'react';
import z from 'zod';
import { axiosClient } from '../lib/axios';
import { toast } from 'react-toastify';
import { updateUserProfile } from '../store/authSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const defaultImageUrl =
  'https://i.pinimg.com/474x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg';

const updateProfileSchema = z.object({
  phone_number: z
    .string()
    .regex(/^(?:\+923|03)\d{9}$/, 'Invalid Phone Number')
    .or(z.literal('')),
  address: z.string().optional(),
});

type updateProfileForm = z.infer<typeof updateProfileSchema>;

const Profile = () => {
  const { user } = useAppSelector(state => state.auth);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | undefined>();
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<updateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      phone_number: user?.phone_number ?? '',
      address: user?.address ?? '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axiosClient(
        `${import.meta.env.VITE_SERVER_URL}/auth/users`,
        {
          method: 'PATCH',
          data,
        },
      );
      return res.data.data;
    },
    onSuccess: data => {
      dispatch(updateUserProfile(data));
    },
  });

  function onSubmit(data: updateProfileForm) {
    const formData = new FormData();
    for (const key of Object.keys(data) as Array<keyof updateProfileForm>) {
      if (data[key]!.length > 0) formData.append(key, data[key] as string);
    }
    formData.append('patientId', user!.id);
    if (file) {
      formData.append('image', file);
    }

    toast.promise(updateProfileMutation.mutateAsync(formData), {
      success: 'Profile Updated',
      pending: 'Updating...',
      error: 'Failed to Update Profile',
    });
  }

  if (!user) {
    return (
      <div className="mt-64 animate-bounce flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-12 mb-36 max-w-lg">
      {/* User Avatar */}
      <img
        className="rounded-lg cursor-pointer h-50 object-center object-cover"
        width={150}
        src={
          previewUrl
            ? previewUrl
            : user?.image
              ? user?.image?.url
              : defaultImageUrl
        }
        onClick={() => imageInputRef?.current?.click()}
        alt="user avatar"
      />
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        onChange={e => {
          if (e.target.files) {
            const file = e.target.files[0];
            const blob = new Blob([file], { type: file.type });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setFile(file);
          }
        }}
      />
      <h1 className="mt-6 text-2xl font-semibold">{user.name}</h1>
      <hr className="my-2 border text-gray-400 rounded-lg" />
      <div className="max-w-sm space-y-3 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-semibold">Email id:</span>
          <input
            type="text"
            className="text-purple focus:outline-none border border-gray-400 p-1 rounded-lg"
            value={user!.email}
            readOnly
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-semibold">Phone number:</span>
          <input
            type="text"
            className="text-purple focus:outline-none border border-gray-400 p-1 rounded-lg"
            {...register('phone_number')}
          />
        </div>
        {errors.phone_number && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phone_number.message}
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-semibold">Address:</span>
          <input
            type="text"
            className="text-purple focus:outline-none border border-gray-400 p-1 rounded-lg"
            {...register('address')}
          />
        </div>
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <button className="border border-purple hover:bg-purple hover:text-white font-semibold text-sm text-purple px-8 py-3 rounded-full cursor-pointer mt-6 transition-colors duration-300">
        Update
      </button>
    </form>
  );
};

export default Profile;
