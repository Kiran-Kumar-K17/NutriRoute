import { z } from "zod";

export const FoodSchema = z.object({
  name: z.string().min(3).max(100),

  description: z.string().min(10),

  price: z.coerce.number().positive(),

  category: z.string(),

  stock: z.coerce.number().int().nonnegative(),

  isAvailable: z.coerce.boolean().optional().default(true),
});

export type FoodSchemaInput = z.infer<typeof FoodSchema>;

export const UpdateFoodSchema = FoodSchema.partial();
