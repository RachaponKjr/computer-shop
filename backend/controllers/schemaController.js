import CategorySchema from '../models/schemaModel.js';

const createCategory = async (req, res) => {
  try {
      const schemaData = req.body;
      
      if (!schemaData.name) {
          return res.status(400).json({ 
              success: false, 
              message: "Category name is required" 
          });
      }
      
      if (!schemaData.icon) {
          schemaData.icon = 'cpu';
      }
      
      const category = new CategorySchema(schemaData);
      await category.save();
      
      res.json({ success: true, message: "Category Created", category });
      
  } catch (error) {
      console.error('Error creating category:', error);
      res.status(400).json({ 
          success: false, 
          message: error.message
      });
  }
};

const listCategories = async (req, res) => {
  try {
      const categories = await CategorySchema.find({});
      res.json({ success: true, categories });
  } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

const getCategory = async (req, res) => {
  console.log(req.params);
  try {
      const { name } = req.params;
      
      const category = await CategorySchema.findOne({ name });
      if (!category) {
          return res.status(404).json({
              success: false,
              message: "หมวดหมู่ไม่พบ",
          });
      }

    res.json({
      success: true,
      category
    });
    
  } catch (error) {
    console.error('Error in getCategory:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.params;
    const schemaData = req.body;
    
    if (!schemaData.icon) {
      schemaData.icon = 'cpu';
    }
    
    const category = await CategorySchema.findOneAndUpdate(
      { name: name },
      { ...schemaData, updated_at: Date.now() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบหมวดหมู่'
      });
    }
    
    res.json({ success: true, message: "Category Updated", category });
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
      const { name } = req.params;

      const category = await CategorySchema.findOne({ name });
      if (!category) {
          return res.status(404).json({
              success: false,
              message: "หมวดหมู่ไม่พบ",
          });
      }

      await CategorySchema.deleteOne({ name });

      res.json({
          success: true,
          message: "ลบหมวดหมู่สำเร็จ",
      });
  } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({
          success: false,
          message: "ไม่สามารถลบหมวดหมู่ได้",
      });
  }
};

export { createCategory, listCategories, getCategory, updateCategory, deleteCategory };