import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import Customer from "../models/customerModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { email, name, surname, password, address } = req.body;

    // ตรวจสอบว่าข้อมูลครบหรือไม่
    if (!email || !name || !surname || !password || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }

    // ตรวจสอบอีเมล
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // ตรวจสอบรหัสผ่าน
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters",
        });
    }

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const findEmail = await userModel.findOne({ email });
    if (findEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่
    const newUser = await userModel.create({
      name,
      surname,
      email,
      password: hashedPassword,
      address,
    });

    // สร้างข้อมูลลูกค้า
    await Customer.create({ name, address });

    // สร้าง Token
    const token = createToken(newUser._id);

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }

    const user = await userModel.findOne({ email });

    if (!user || !user.password) {
      return res
        .status(401)
        .json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res
        .status(401)
        .json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const token = createToken(user._id);

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { adminLogin, registerUser, userLogin, getUser };
