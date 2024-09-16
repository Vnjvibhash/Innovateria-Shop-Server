import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './utils/db.js';
import userRoute from './routes/userRoute.js';
import posterRoute from './routes/posterRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import subCategoryRoute from './routes/subCategoryRoute.js';
import brandRoute from './routes/brandRoute.js';
import variantRoute from './routes/variantRoute.js';
import variantTypeRoute from './routes/variantTypeRoute.js';
import productRoute from './routes/productRoute.js';
import couponRoute from './routes/couponRoute.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({ origin: '*' }))
app.use(bodyParser.json());

// All APIs
app.use("/api/v1/user", userRoute);
app.use("/api/v1/posters", posterRoute)
app.use("/api/v1/categories", categoryRoute)
app.use("/api/v1/sub-category", subCategoryRoute)
app.use("/api/v1/brand", brandRoute)
app.use("/api/v1/variant", variantRoute)
app.use("/api/v1/variant-type", variantTypeRoute)
app.use("/api/v1/procucts", productRoute)
app.use("api/v1/coupon", couponRoute)

// Global error handler
app.use((error, req, res, next) => {
  res.status(500).json({ success: false, message: error.message, data: null });
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
