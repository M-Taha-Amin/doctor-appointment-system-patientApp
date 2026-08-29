export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  role: 'patient';
  image?: any;
  created_at: Date;
}

export type Doctor = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  speciality: string;
  image: string;
  available: boolean;
  education_degree: string;
  years_of_experience: number;
  about: string | null;
  fee_per_appointment: number;
  address: string;
};

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  doctor_image: string;
  doctor_name: string;
  doctor_address: string | null;
  doctor_speciality: string;
  status: 'pending' | 'completed' | 'cancelled';
  paid: boolean;
  created_at: Date;
  booked_at: Date;
}
