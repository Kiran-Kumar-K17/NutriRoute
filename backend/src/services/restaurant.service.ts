import { RestaurantSchema } from "../validators/restaurant.validator.js";
import prisma from "../config/prisma.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";
import { updateRestaurantSchema } from "../validators/restaurant_update.validator.js";

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

export const getRestaurantById = async (id: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id,
    },
    include: {
      foods: true,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }

  return restaurant;
};
export const getMyRestaurant = async (ownerId: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      ownerId,
    },
    include: {
      foods: true,
    },
  });
  return restaurant;
};

export const updateRestaurant = async (
  ownerId: string,
  data: unknown,
  file: Express.Multer.File | undefined,
) => {
  const parsedData = updateRestaurantSchema.parse(data);

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId,
    },
  });
  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }
  let image = restaurant.image;
  let imagePublicId = restaurant.imagePublicId;

  if (file) {
    await deleteFromCloudinary(restaurant.imagePublicId);
    const uploadedImage = await uploadToCloudinary(file, "restaurants");
    image = uploadedImage.secure_url;
    imagePublicId = uploadedImage.public_id;
  }
  const updatedRestaurant = await prisma.restaurant.update({
    where: {
      id: restaurant.id,
    },
    data: {
      ...parsedData,
      image,
      imagePublicId,
    },
  });
  return updatedRestaurant;
};

export const deleteRestaurant = async (ownerId: string) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId,
    },
  });
  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }
  if (restaurant.imagePublicId) {
    await deleteFromCloudinary(restaurant.imagePublicId);
  }
  await prisma.restaurant.delete({
    where: {
      id: restaurant.id,
    },
  });
};
