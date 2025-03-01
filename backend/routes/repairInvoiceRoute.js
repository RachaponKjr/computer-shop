import express from 'express';
import { createRepairInvoice, getRepairInvoices, getRepairInvoice, updateRepairInvoice, deleteRepairInvoice } from '../controllers/repairInvoiceController.js';
import adminAuth from '../middleware/adminAuth.js';

const repairInvoiceRouter = express.Router();

// Repair Invoice routes
repairInvoiceRouter.post('/create', adminAuth, createRepairInvoice);
repairInvoiceRouter.get('/list', getRepairInvoices);
repairInvoiceRouter.get('/:id', getRepairInvoice);
repairInvoiceRouter.put('/update/:id', adminAuth, updateRepairInvoice);
repairInvoiceRouter.delete('/delete/:id', adminAuth, deleteRepairInvoice);

export default repairInvoiceRouter;