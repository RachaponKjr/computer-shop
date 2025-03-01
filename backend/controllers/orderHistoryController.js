import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

const SalesHistory = asyncHandler(async (req, res) => {
  const { startDate, endDate, year, month } = req.query;

  let matchStage = {
    status: "paid",
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate + "T00:00:00"),
      $lt: new Date(endDate + "T23:59:59"),
    };
  } else if (year && month) {
    matchStage.createdAt = {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1),
    };
  } else if (year) {
    // กรณีที่เลือกแค่ปี
    matchStage.createdAt = {
      $gte: new Date(year, 0, 1),
      $lt: new Date(parseInt(year) + 1, 0, 1),
    };
  } else {
    const currentYear = new Date().getFullYear();
    matchStage.createdAt = {
      $gte: new Date(currentYear, 0, 1),
      $lt: new Date(currentYear + 1, 0, 1),
    };
  }

  const groupStage = {
    $group: {
      _id: month
        ? {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          }
        : year
        ? { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }
        : { year: { $year: "$createdAt" } },
      totalSales: { $sum: "$totalPrice" },
    },
  };

  const sortStage = {
    $sort: {
      "_id.year": 1,
      "_id.month": 1,
      "_id.day": 1,
    },
  };

  const pipeline = [{ $match: matchStage }, groupStage, sortStage];

  const salesHistory = await Order.aggregate(pipeline);

  if (salesHistory.length === 0) {
    return res.status(200).json({
      year: year || new Date().getFullYear(),
      month: month || null,
      sumTotal: 0,
      sale: [],
    });
  }

  const sumTotal = salesHistory.reduce((acc, item) => acc + item.totalSales, 0);

  const response = {
    year: year || new Date().getFullYear(),
    month: month || null,
    sumTotal,
    sale: salesHistory.map((item) => ({
      date: month
        ? `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(
            item._id.day
          ).padStart(2, "0")}`
        : year
        ? `${item._id.year}-${String(item._id.month).padStart(2, "0")}`
        : `${item._id.year}`,
      total: item.totalSales,
    })),
  };

  res.status(200).json(response);
});

export { SalesHistory };
