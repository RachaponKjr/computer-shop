import express from 'express';
import { createCategory, listCategories, getCategory, updateCategory, deleteCategory } from '../controllers/schemaController.js';
import adminAuth from '../middleware/adminAuth.js';

const schemaRouter = express.Router();

// Category routes
schemaRouter.post('/create', adminAuth, createCategory);
schemaRouter.get('/list', listCategories);
schemaRouter.get('/edit/:name', getCategory);
schemaRouter.post('/update/:name', adminAuth, updateCategory);
schemaRouter.delete('/delete/:name', adminAuth, deleteCategory);

export default schemaRouter;