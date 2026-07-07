import { FoodSchema, UpdateFoodSchema } from "../validators/food.validator.js";
import prisma from "../config/prisma.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

export const createFood = async (
  data: unknown,
  file: Express.Multer.File | undefined,
  ownerId: string,
) => {
  if (!file) {
    throw new Error("Food image is required.");
  }

  const parsedData = FoodSchema.parse(data);

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }

  const uploadedImage = await uploadToCloudinary(file, "foods");
  const food = await prisma.food.create({
    data: {
      name: parsedData.name,
      description: parsedData.description,

      price: parsedData.price,

      category: parsedData.category,

      stock: parsedData.stock,

      isAvailable: parsedData.isAvailable,

      image: uploadedImage.secure_url,
      imagePublicId: uploadedImage.public_id,

      restaurantId: restaurant.id,
    },
  });
  return food;
};
export const getAllFoods = async () => {
  const foods = await prisma.food.findMany({
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          city: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return foods;
};
export const getFoodById = async (id: string) => {
  const food = await prisma.food.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: true,
    },
  });

  if (!food) {
    throw new Error("Food not found.");
  }

  return food;
};
export const getMyFoods = async (ownerId: string) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }

  const foods = await prisma.food.findMany({
    where: {
      restaurantId: restaurant.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return foods;
};

export const updateFood = async (
  foodId: string,
  ownerId: string,
  data: unknown,
  file?: Express.Multer.File,
) => {
  const parsedData = UpdateFoodSchema.parse(data);

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      ownerId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }

  const food = await prisma.food.findFirst({
    where: {
      id: foodId,
      restaurantId: restaurant.id,
    },
  });

  if (!food) {
    throw new Error("Food not found.");
  }

  let image = food.image;
  let imagePublicId = food.imagePublicId;

  if (file) {
    await deleteFromCloudinary(food.imagePublicId);

    const uploaded = await uploadToCloudinary(file, "foods");

    image = uploaded.secure_url;
    imagePublicId = uploaded.public_id;
  }

  const updatedFood = await prisma.food.update({
    where: {
      id: food.id,
    },
    data: {
      ...parsedData,

      image,
      imagePublicId,
    },
  });

  return updatedFood;
};
export const deleteFood = async (foodId: string, ownerId: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      ownerId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }

  const food = await prisma.food.findFirst({
    where: {
      id: foodId,
      restaurantId: restaurant.id,
    },
  });

  if (!food) {
    throw new Error("Food not found.");
  }

  await deleteFromCloudinary(food.imagePublicId);

  await prisma.food.delete({
    where: {
      id: food.id,
    },
  });
};
export const toggleFoodAvailability = async (
  foodId: string,
  ownerId: string,
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      ownerId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }

  const food = await prisma.food.findFirst({
    where: {
      id: foodId,
      restaurantId: restaurant.id,
    },
  });

  if (!food) {
    throw new Error("Food not found.");
  }

  const updatedFood = await prisma.food.update({
    where: {
      id: food.id,
    },
    data: {
      isAvailable: !food.isAvailable,
    },
  });

  return updatedFood;
};
export const searchFoods = async (query: string) => {
  const foods = await prisma.food.findMany({
    where: {
      isAvailable: true,
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          city: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return foods;
};
