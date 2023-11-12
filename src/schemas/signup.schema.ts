import { z } from 'zod';

export const SignupSchema = z.object({
  body: z.object({
    fist_name: z
      .string({
        required_error: 'First name is required.',
        invalid_type_error: 'First name must be a string.'
      })
      .min(2, { message: 'First name field length is too short' })
      .max(21, { message: 'First name field length is too long' }),
    last_name: z
      .string({
        required_error: 'Last name is required.',
        invalid_type_error: 'Last name must be a string.'
      })
      .min(2, { message: 'Last name field length is too short' })
      .max(21, { message: 'Last name field length is too long' }),
    email: z.string().email({ message: 'Please verify your email.' }),
    password: z
      .string()
      .min(8, { message: 'Password must have at least 8 characters.' }),
  })
});
