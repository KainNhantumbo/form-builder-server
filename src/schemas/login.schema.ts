import { z } from 'zod';
import { validatePasswords } from '../lib/password-utils';

export const LoginSchema = z.object({
  body: z
    .object({
      email: z.string().email({ message: 'Please verify your email.' }),
      password: z
        .string()
        .min(8, { message: 'Password must have at least 8 characters.' })
    })
    .refine(async ({ password }) => await validatePasswords(password), {
      message: 'Please check your password and try again.',
      path: ['password']
    })
});
