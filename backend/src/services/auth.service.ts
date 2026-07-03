import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (data: unknown) => {
  const parsedData = registerSchema.parse(data);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: parsedData.email }, { phone: parsedData.phone }],
    },
  });

  if (existingUser) {
    if (existingUser.email === parsedData.email) {
      throw new Error("Email already exists");
    }
    if (existingUser.phone === parsedData.phone) {
      throw new Error("Phone number already exists");
    }
  }
  const hashedPassword = await bcrypt.hash(parsedData.password, 10);
  const user = await prisma.user.create({
    data: {
      name: parsedData.name,
      email: parsedData.email,
      password: hashedPassword,
      phone: parsedData.phone,
      role: parsedData.role,

      street: parsedData.street,
      village: parsedData.village,
      city: parsedData.city,
      pincode: parsedData.pincode,
    },
  });
  const token = generateToken(user.id, user.role);
  const { password, ...userWithoutPassword } = user;
  return {
    message: "User registered successfully",
    user: userWithoutPassword,
    token,
  };
};

export const login = async (data: unknown) => {
  const parsedData = loginSchema.parse(data);
  const user = await prisma.user.findUnique({
    where: {
      email: parsedData.email,
    },
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isPasswordCorrect = await bcrypt.compare(
    parsedData.password,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id, user.role);
  const { password, ...userWithoutPassword } = user;
  return {
    message: "Login successful",
    user: userWithoutPassword,
    token,
  };
};
