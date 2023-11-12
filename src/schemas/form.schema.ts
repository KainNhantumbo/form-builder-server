import { z } from 'zod';

export const FormSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string'
      })
      .min(4, { message: 'First name field length is too short' })
      .max(64, { message: 'First name field length is too long' }),
    description: z
      .string({
        required_error: 'Description is required',
        invalid_type_error: 'Description must be a string'
      })
      .min(4, { message: 'Description field length is too short' })
      .max(4096, { message: 'Description field length is too long' })
  })
});
