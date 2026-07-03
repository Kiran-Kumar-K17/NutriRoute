import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 and at most 50 characters long",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
  email: z.email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  phone: z.string().regex(/^\d{10}$/, {
    message: "Phone number must be exactly 10 digits",
  }),
  role: z.enum(["CUSTOMER", "RESTAURANT", "DELIVERY"]),
  street: z.string().min(2, {
    message: "Street must be at least 2 characters long",
  }),
  village: z.string().min(2, {
    message: "Village must be at least 2 characters long",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters long",
  }),
  pincode: z.string().regex(/^\d{6}$/, {
    message: "Invalid pincode",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
