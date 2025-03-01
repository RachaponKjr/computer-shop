import express from "express";
import { createOrder, getOrderById, getOrders, updateOrder } from "../controllers/orderController.js";
import verifyUser from "../middleware/verifyUser.js";

const orderRouter = express.Router();

// Repair Invoice routes
orderRouter.post("/create", verifyUser, createOrder);
orderRouter.get("/getorder", getOrders);
orderRouter.post("/getorder/:id", getOrderById);
orderRouter.put("/update/:id", updateOrder);

export default orderRouter;
