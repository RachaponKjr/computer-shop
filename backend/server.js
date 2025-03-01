import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import schemaRouter from "./routes/schemaRoute.js";
import productRouter from "./routes/productRoute.js";
import invoiceRouter from "./routes/invoiceRoute.js";
import repairInvoiceRouter from "./routes/repairInvoiceRoute.js";
import orderRouter from "./routes/orderRouter.js";
import orderHistoryRouter from "./routes/orderHistoryRoute.js";
import customerRouter from "./routes/customerRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/category", schemaRouter);
app.use("/api/product", productRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/order", orderRouter);
app.use("/api/repair", repairInvoiceRouter);
app.use("/api/sales-history", orderHistoryRouter);
app.use("/api/customer", customerRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT: " + port));
