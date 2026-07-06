import { z } from "zod";
import { RestaurantSchema } from "./restaurant.validator.js";
export const updateRestaurantSchema = RestaurantSchema.partial();
