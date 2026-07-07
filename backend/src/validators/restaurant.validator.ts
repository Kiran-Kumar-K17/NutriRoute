import { z } from "zod";

export const RestaurantSchema = z.object({
  name: z.string().min(3).max(100),

  description: z.string().min(10),

  phone: z.string().regex(/^\d{10}$/),

  email: z.email(),

  street: z.string(),

  area: z.string(),

  city: z.string(),

  state: z.string(),

  pincode: z.string().regex(/^\d{6}$/),

  cuisine: z.array(z.string()),

  openingTime: z.string(),

  closingTime: z.string(),
});

export type RestaurantInput = z.infer<typeof RestaurantSchema>;

export const UpdateRestaurantSchema = RestaurantSchema.partial();
