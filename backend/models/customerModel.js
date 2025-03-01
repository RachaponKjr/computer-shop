import mongoose from "mongoose";

// สร้าง Schema สำหรับ Customer
const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // กำหนดให้ฟิลด์ `name` ต้องมีค่า
    },
    address: {
      type: String,
      required: true, // กำหนดให้ฟิลด์ `address` ต้องมีค่า
    },
  },
  {
    timestamps: true, // เพิ่มฟิลด์ `createdAt` และ `updatedAt` อัตโนมัติ
    autoIndex: false,
  }
);

// ใช้คอลเลกชันที่มีอยู่แล้วใน MongoDB ชื่อ 'customer'
const Customer = mongoose.model("customer", customerSchema, "customer");

export default Customer;
