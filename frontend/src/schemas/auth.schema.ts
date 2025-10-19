import { z } from 'zod';

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  
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
});

export type SignUpFormData = z.infer<typeof signUpSchema>;


