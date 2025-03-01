import express from 'express';
import { createInvoice, getInvoices, getInvoice, updateInvoice, deleteInvoice } from '../controllers/invoiceController.js';
import multer from 'multer';
import adminAuth from '../middleware/adminAuth.js';
const upload = multer({ dest: 'uploads/'});

const invoiceRouter = express.Router();

// Invoice routes
invoiceRouter.post('/create', adminAuth, upload.any(), createInvoice);
invoiceRouter.get('/list', getInvoices);
invoiceRouter.get('/:id', getInvoice);
invoiceRouter.put('/update/:id', adminAuth, upload.any(), updateInvoice);
invoiceRouter.delete('/delete/:id', adminAuth, deleteInvoice);

export default invoiceRouter;