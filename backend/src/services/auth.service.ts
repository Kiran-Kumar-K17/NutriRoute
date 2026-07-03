import { registerSchema } from "../validators/auth.validator.js";
export const register = async (data: unknown) => {
  const parsedData = registerSchema.parse(data);
  return {
    message: "Register Service Working",
    data: parsedData,
  };
};
