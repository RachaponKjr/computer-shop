import Invoice from '../models/invoiceModel.js';
import { v2 as cloudinary } from "cloudinary";

const createInvoice = async (req, res) => {
  try {
    const items = JSON.parse(req.body.items);
    
    if (req.files && Array.isArray(req.files)) {
      try {
        for (let i = 0; i < items.length; i++) {
          const imageFiles = req.files.filter(file => file.fieldname === `images[${i}]`);
          
          if (imageFiles.length > 0) {
            if (!cloudinary.uploader) {
              throw new Error('Cloudinary configuration is missing');
            }

            const uploadResult = await cloudinary.uploader.upload(imageFiles[0].path, {
              resource_type: 'image'
            });
            
            items[i].image = uploadResult.secure_url;
          }
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: `Image upload failed: ${uploadError.message}`
        });
      }
    }

    const invoiceData = {
      customerName: req.body.customerName,
      address: req.body.address,
      invoiceNumber: req.body.invoiceNumber,
      date: req.body.date,
      items: items.map(item => ({
        description: item.description,
        specifications: item.specifications,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        image: item.image || null
      })),
      subtotal: parseFloat(req.body.subtotal),
      vat: parseFloat(req.body.vat),
      total: parseFloat(req.body.total)
    };

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      details: error.errors || error.stack
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const items = JSON.parse(req.body.items);

    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลใบกำกับภาษี'
      });
    }

    // Handle image uploads
    if (req.files && Array.isArray(req.files)) {
      try {
        for (let i = 0; i < items.length; i++) {
          const imageFiles = req.files.filter(file => file.fieldname === `images[${i}]`);
          
          if (imageFiles.length > 0) {
            if (!cloudinary.uploader) {
              throw new Error('Cloudinary configuration is missing');
            }

            const uploadResult = await cloudinary.uploader.upload(imageFiles[0].path, {
              resource_type: 'image'
            });
            
            items[i].image = uploadResult.secure_url;
          }
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: `Image upload failed: ${uploadError.message}`
        });
      }
    }

    const invoiceData = {
      customerName: req.body.customerName,
      address: req.body.address,
      invoiceNumber: req.body.invoiceNumber,
      date: req.body.date,
      items: items.map(item => ({
        description: item.description,
        specifications: item.specifications,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        image: item.image || null
      })),
      subtotal: parseFloat(req.body.subtotal),
      vat: parseFloat(req.body.vat),
      total: parseFloat(req.body.total)
    };

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      invoiceData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'อัพเดทใบกำกับภาษีเรียบร้อยแล้ว',
      invoice: updatedInvoice
    });

  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [invoices, total] = await Promise.all([
      Invoice.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Invoice.countDocuments()
    ]);
    
    res.json({
      success: true,
      invoices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    res.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลใบกำกับภาษี'
      });
    }

    await Invoice.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'ลบใบกำกับภาษีเรียบร้อยแล้ว'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล'
    });
  }
};

export { createInvoice, getInvoices, getInvoice, updateInvoice, deleteInvoice };