import { Delivery } from "../models/delivery.model.js";

export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const delivery = await Delivery.findOneAndUpdate(
      {
        userId: req.user.id,
      },
      {
        $set: {
          currentLocation: {
            latitude,
            longitude,
            updatedAt: new Date(),
          },
        },
      },
      {
        new: true,
        returnDocument: "after",
      },
    );
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }
    return res.status(200).json({
      success: true,
      location: delivery.currentLocation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAssignedOrders = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({
      userId: req.user.id,
    });

    const orders = await Order.find({
      deliveryPartnerId: delivery._id,
      orderStatus: {
        $in: ["Assigned", "Picked Up", "Out for Delivery"],
      },
    })
      .populate("restaurantId", "name")
      .populate("userId", "name phone");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
