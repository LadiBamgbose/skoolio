import { z } from 'zod';

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  
  firstName: z
    .string()
    .min(1, 'First name is required')
    .trim(),
  
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .trim(),
  
  city: z
    .string()
    .min(1, 'City is required')
    .trim(),
  
  state: z
    .string()
    .min(1, 'State is required')
    .trim(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;


