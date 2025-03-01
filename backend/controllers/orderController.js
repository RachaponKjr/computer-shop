import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import mongoose from "mongoose";

const createOrder = asyncHandler(async (req, res) => {
  const { user_id, orderItems } = req.body;

  // ตรวจสอบว่าได้รับ user_id และ orderItems หรือไม่
  if (!user_id || !orderItems || orderItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "ไม่ได้กรอก user_id หรือ orderItems",
    });
  }

  const productIds = orderItems.map((item) => item.product_id);
  try {
    // เข้าถึง collection 'products'
    const productCollection = mongoose.connection.collection("products");

    // ค้นหาสินค้าที่ตรงกับ productIds ที่ส่งมา
    const products = await productCollection
      .find({
        _id: {
          $in: productIds.map((id) =>
            mongoose.Types.ObjectId.createFromHexString(id)
          ),
        },
      })
      .toArray();

    if (products.length !== orderItems.length) {
      return res.status(400).json({
        success: false,
        message: "พบสินค้าไม่ถูกต้อง หรือสินค้าบางตัวไม่มีอยู่ในระบบ",
      });
    }

    const totalPrice = orderItems.reduce((acc, item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product_id
      );

      if (product && !isNaN(product["ราคา"]) && !isNaN(item.quantity)) {
        return acc + product["ราคา"] * item.quantity;
      } else {
        return acc;
      }
    }, 0);

    const order = new Order({
      user_id,
      orderItems,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "สร้างคำสั่งซื้อสำเร็จ",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
    });
  }
});

const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatus = ["pending", "paid", "delivered", "cancel"];

  if (!validStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "สถานะไม่ถูกต้อง",
    });
  }

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "ไม่พบคำสั่งซื้อ",
    });
  }

  order.status = status;
  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: "อัปเดตสถานะคำสั่งซื้อสำเร็จ",
    order: updatedOrder,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user_id", "name email"); // ดึงเฉพาะ name, email ของ user

  if (!orders || orders.length === 0) {
    return res.status(404).json({
      success: false,
      message: "ไม่พบคำสั่งซื้อ",
    });
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // ค้นหาคำสั่งซื้อ
  const order = await Order.findById(id).populate("user_id", "name email");

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "ไม่พบคำสั่งซื้อ",
    });
  }

  const orderItemsWithProductDetails = await Promise.all(
    order.orderItems.map(async (item) => {
      const product = await mongoose.connection
        .collection("products")
        .findOne({ _id: item.product_id });

      if (!product) {
        return {
          product: null,
          quantity: item.quantity,
          message: "ไม่พบข้อมูลสินค้า",
        };
      }

      return {
        product,
        quantity: item.quantity,
      };
    })
  );

  res.status(200).json({
    success: true,
    order: {
      _id: order._id,
      user: order.user_id,
      orderItems: orderItemsWithProductDetails,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    },
  });
});

export { createOrder, updateOrder, getOrders, getOrderById };
