import asyncHandler from "express-async-handler";
import Customer from "../models/customerModel.js";

// ฟังก์ชันเพื่อ filter ข้อมูลลูกค้า
const getCustomers = asyncHandler(async (req, res) => {
  const { name, address } = req.query; // ใช้ query parameters ในการค้นหา

  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" }; // ค้นหาชื่อลูกค้าแบบไม่แยกตัวพิมพ์ใหญ่/เล็ก
  }
  if (address) {
    filter.address = { $regex: address, $options: "i" }; // ค้นหาตามที่อยู่ลูกค้าแบบไม่แยกตัวพิมพ์ใหญ่/เล็ก
  }

  // ค้นหาข้อมูลลูกค้าตาม filter ที่ตั้งไว้
  const customers = await Customer.find(filter);

  if (!customers || customers.length === 0) {
    res.status(404).json({ message: "ไม่พบข้อมูลลูกค้าที่ตรงกับเงื่อนไข" });
  } else {
    res.status(200).json(customers);
  }
});

const createCustomer = asyncHandler(async (req, res) => {
  const { name, address } = req.body;

  const customer = await Customer.create({ name, address });

  res.status(201).json({ success: true, message: "สร้างลูกค้าเรียบร้อย", customer });
});

export { getCustomers, createCustomer };
