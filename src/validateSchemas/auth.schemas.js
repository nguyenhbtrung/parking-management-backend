import { z } from 'zod';

const phoneRegex = /^[0-9+\-() ]*$/;

export const registerSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.email({ message: 'Email format is invalid' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    phone: z
        .string()
        .max(20, "Phone number must not exceed 20 characters")
        .regex(phoneRegex, "Phone numbers can only contain numbers, +, -, (), and spaces")
        .optional()
});

export const loginSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' })
});
