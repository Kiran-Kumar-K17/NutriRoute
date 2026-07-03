import { generateToken } from "../utils/jwt.js";
import { User } from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      address: { street, village, city, pincode },
    } = req.body;

    const address = { street, village, city, pincode };

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({
          message: "Phone number already registered",
        });
      }
    }
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      address,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Account not found, Please create an account to continue.",
      });
    }
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const response = user.toObject();
    delete response.password;
    const token = generateToken(user._id, user.role);
    res.status(200).json({
      message: "Login successful",
      response,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
