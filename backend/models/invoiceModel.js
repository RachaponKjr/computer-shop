import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  specifications: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

const invoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  vat: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

invoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const lastInvoice = await this.constructor.findOne({
      invoiceNumber: new RegExp(`^INV${year}${month}`)
    }).sort({ invoiceNumber: -1 });
    
    let sequence = '001';
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-3));
      sequence = String(lastSequence + 1).padStart(3, '0');
    }
    
    this.invoiceNumber = `INV${year}${month}${sequence}`;
  }
  next();
});

export default mongoose.model('Invoice', invoiceSchema);