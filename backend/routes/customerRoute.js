import express from "express";
import { getCustomers } from "../controllers/customerController.js";

const customerRouter = express.Router();

customerRouter.get("/", getCustomers);

export default customerRouter;
