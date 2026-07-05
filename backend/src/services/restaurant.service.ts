import { RestaurantSchema } from "../validators/restaurant.validator.js";
import prisma from "../config/prisma.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const createRestaurant = async (
  data: unknown,
  file: Express.Multer.File | undefined,
  ownerId: string,
) => {
  const parsedData = RestaurantSchema.parse(data);
  const existingRestaurant = await prisma.restaurant.findUnique({
    where: {
      ownerId,
    },
  });
  if (existingRestaurant) {
    throw new Error("You already own a restaurant.");
  }
  const duplicateRestaurant = await prisma.restaurant.findFirst({
    where: {
      OR: [{ email: parsedData.email }, { phone: parsedData.phone }],
    },
  });

  if (duplicateRestaurant) {
    if (duplicateRestaurant.email === parsedData.email) {
      throw new Error("Restaurant email already exists.");
    }

    if (duplicateRestaurant.phone === parsedData.phone) {
      throw new Error("Restaurant phone already exists.");
    }
  }
  if (!file) {
    throw new Error("Restaurant image is required.");
  }

  const { secure_url, public_id } = await uploadToCloudinary(
    file,
    "restaurants",
  );

  const restaurant = await prisma.restaurant.create({
    data: {
      name: parsedData.name,
      description: parsedData.description,
      image: secure_url,
      imagePublicId: public_id,
      phone: parsedData.phone,
      email: parsedData.email,
      street: parsedData.street,
      area: parsedData.area,
      city: parsedData.city,
      state: parsedData.state,
      pincode: parsedData.pincode,
      cuisine: parsedData.cuisine,
      openingTime: parsedData.openingTime,
      closingTime: parsedData.closingTime,
      ownerId,
    },
  });
  return {
    restaurant,
  };
};

export const getAllRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    restaurants,
  };
};
