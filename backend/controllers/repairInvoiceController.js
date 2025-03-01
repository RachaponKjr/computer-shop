import RepairInvoice from '../models/repairInvoiceModel.js';

const createRepairInvoice = async (req, res) => {
  try {
    const items = req.body.items

    const repairInvoiceData = {
      title: req.body.title,
      invoiceNumber: req.body.invoiceNumber,
      date: req.body.date,
      items: items.map(item => ({
        description: item.description,
        specifications: item.specifications,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      })),
      category: req.body.category,
      subtotal: parseFloat(req.body.subtotal),
      vat: parseFloat(req.body.vat),
      total: parseFloat(req.body.total)
    };

    const repairInvoice = new RepairInvoice(repairInvoiceData);
    await repairInvoice.save();

    res.status(201).json({
      success: true,
      message: 'ใบเสนอราคาซ่อมถูกสร้างเรียบร้อยแล้ว',
      repairInvoice
    });
  } catch (error) {
    console.error('Error creating repair invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      details: error.errors || error.stack
    });
  }
};

const updateRepairInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const items = req.body.items

    const existingRepairInvoice = await RepairInvoice.findById(id);
    if (!existingRepairInvoice) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลใบเสนอราคาซ่อม'
      });
    }

    const repairInvoiceData = {
      title: req.body.title,
      invoiceNumber: req.body.invoiceNumber,
      date: req.body.date,
      items: items.map(item => ({
        description: item.description,
        specifications: item.specifications,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
        })),
      category: req.body.category,
      subtotal: parseFloat(req.body.subtotal),
      vat: parseFloat(req.body.vat),
      total: parseFloat(req.body.total)
    };

    const updatedRepairInvoice = await RepairInvoice.findByIdAndUpdate(
      id,
      repairInvoiceData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'อัพเดทใบเสนอราคาซ่อมเรียบร้อยแล้ว',
      repairInvoice: updatedRepairInvoice
    });

  } catch (error) {
    console.error('Error updating repair invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
    });
  }
};

const getRepairInvoices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [repairInvoices, total] = await Promise.all([
      RepairInvoice.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      RepairInvoice.countDocuments()
    ]);
    
    res.json({
      success: true,
      repairInvoices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching repair invoices:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRepairInvoice = async (req, res) => {
  try {
    const repairInvoice = await RepairInvoice.findById(req.params.id);
    if (!repairInvoice) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลใบเสนอราคาซ่อม'
      });
    }
    res.json({
      success: true,
      repairInvoice
    });
  } catch (error) {
    console.error('Error fetching repair invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteRepairInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    const repairInvoice = await RepairInvoice.findById(id);
    if (!repairInvoice) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลใบเสนอราคาซ่อม'
      });
    }

    await RepairInvoice.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'ลบใบเสนอราคาซ่อมเรียบร้อยแล้ว'
    });
  } catch (error) {
    console.error('Error deleting repair invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล'
    });
  }
};

export { createRepairInvoice, getRepairInvoices, getRepairInvoice, updateRepairInvoice, deleteRepairInvoice };