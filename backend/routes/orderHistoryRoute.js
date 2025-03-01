import express from "express";
import { SalesHistory } from "../controllers/orderHistoryController.js";

const orderHistoryRouter = express.Router();

orderHistoryRouter.get("/", SalesHistory);

export default orderHistoryRouter;
