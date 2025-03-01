import express from 'express';
import { addProduct, listProducts, removeProduct, updateProduct, getProduct } from '../controllers/productController.js';
import multer from 'multer';
import adminAuth from '../middleware/adminAuth.js';
const upload = multer({ dest: 'uploads/'});

const productRouter = express.Router();

// Product routes
productRouter.post('/add', adminAuth, upload.any(), addProduct);
productRouter.get('/list', listProducts);
productRouter.get('/list/:categorySlug', listProducts);
productRouter.delete('/remove/:categoryName/:productId', adminAuth, removeProduct);
productRouter.get('/:categoryName/:productId', getProduct);
productRouter.put('/update/:categoryName/:productId', adminAuth, upload.any(), updateProduct);

export default productRouter;