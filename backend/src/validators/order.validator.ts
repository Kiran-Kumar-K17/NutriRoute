import { z } from "zod";

export const OrderSchema = z.object({
  items: z
    .array(
      z.object({
        foodId: z.uuid(),
        quantity: z.coerce.number().int().positive(),
      }),
    )
    .min(1, "At least one food item is required."),

  paymentMethod: z.enum(["COD", "UPI", "CARD"]),

  street: z.string().min(3),
  village: z.string().min(3),
  city: z.string().min(2),
  pincode: z.string().length(6),

  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export type OrderSchemaInput = z.infer<typeof OrderSchema>;

export const VerifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;

