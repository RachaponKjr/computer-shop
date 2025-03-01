import { getProductModel } from '../models/productModel.js';
import CategorySchema from '../models/schemaModel.js';
import { v2 as cloudinary } from "cloudinary";

const addProduct = async (req, res) => {  
    try {
      const { categoryName } = req.body;
      const files = req.files;
      
      if (!categoryName) {
        return res.status(400).json({ success: false, message: "Category name is required" });
      }
  
      const ProductModel = await getProductModel(categoryName);
      const categorySchema = await CategorySchema.findOne({ name: categoryName });
  
      if (!categorySchema) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      // Decode URL-encoded keys and values
      const productData = {};
      for (const [key, value] of Object.entries(req.body)) {
        if (key !== 'categoryName') {
          const decodedKey = decodeURIComponent(key);
          productData[decodedKey] = value;
        }
      }
      
      // Convert number fields
      categorySchema.fields.forEach(field => {
        if (field.type === 'number' && productData[field.name]) {
          productData[field.name] = Number(productData[field.name]);
        }
      });
  
      const imageFields = categorySchema.fields.filter(field => field.type === 'image');
  
      // Handle image files
      if (imageFields.length > 0 && files) {
        for (const field of imageFields) {
          const fieldFiles = files.filter(file => decodeURIComponent(file.fieldname) === field.name);
          
          if (fieldFiles.length > 0) {
            try {
              const imagesUrl = await Promise.all(
                fieldFiles.map(async (file) => {
                  if (!cloudinary.uploader) {
                    throw new Error('Cloudinary configuration is missing');
                  }
                  const result = await cloudinary.uploader.upload(file.path, {
                    resource_type: 'image'
                  });
                  return result.secure_url;
                })
              );
              productData[field.name] = imagesUrl;
              
            } catch (uploadError) {
              console.error('Image upload error:', uploadError);
              return res.status(400).json({
                success: false,
                message: `Image upload failed: ${uploadError.message}`,
                field: field.name
              });
            }
          }
        }
      }
  
      const product = new ProductModel({
        ...productData,
        category_id: categoryName,
        date: Date.now()
      });
  
      await product.save();
      
      res.json({ success: true, message: "Product Added", product });
      
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message,
        details: error.errors || error.stack
      });
    }
};
  
  // function for list products
  const listProducts = async (req, res) => {
    try {
      const { categorySlug } = req.params;
      
      if (categorySlug) {
        const ProductModel = await getProductModel(categorySlug);
        const products = await ProductModel.find({ category_id: categorySlug });
        return res.json({ success: true, products });
      }
      
      const categories = await CategorySchema.find({});
      let allProducts = [];
      
      for (const category of categories) {
        try {
          const ProductModel = await getProductModel(category.name);
          const products = await ProductModel.find({ category_id: category.name });
          // Add category name to each product for reference
          const productsWithCategory = products.map(product => ({
            ...product.toObject(),
            categoryName: category.name
          }));
          allProducts = [...allProducts, ...productsWithCategory];
        } catch (error) {
          console.error(`Error getting products for category ${category.name}:`, error);
          // Continue with other categories even if one fails
          continue;
        }
      }
      
      res.json({ 
        success: true, 
        products: allProducts,
        total: allProducts.length 
      });
      
    } catch (error) {
      console.error('Error listing products:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // function for remove product
  const removeProduct = async (req, res) => {
      try {
          const { categoryName, productId } = req.params;
          
          const ProductModel = await getProductModel(categoryName);
          
          const product = await ProductModel.findById(productId);
          
          // Delete images from Cloudinary
          for (const field of Object.keys(product.toObject())) {
              if (Array.isArray(product[field]) && product[field].length > 0 && 
                  product[field][0].startsWith('http')) {
                  for (const imageUrl of product[field]) {
                      const publicId = imageUrl.split('/').pop().split('.')[0];
                      await cloudinary.uploader.destroy(publicId);
                  }
              }
          }
          
          await ProductModel.findByIdAndDelete(productId);
          res.json({ success: true, message: "Product Removed" });
          
      } catch (error) {
          console.log(error);
          res.json({ success: false, message: error.message });
      }
  };

const updateProduct = async (req, res) => {
  try {
    const { categoryName, productId } = req.params;
    const files = req.files;
    
    const ProductModel = await getProductModel(categoryName);
    const categorySchema = await CategorySchema.findOne({ name: categoryName });

    if (!categorySchema) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // ดึงข้อมูลสินค้าเดิม
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Decode URL-encoded keys and values
    const productData = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (key !== 'categoryName') {
        const decodedKey = decodeURIComponent(key);
        productData[decodedKey] = value;
      }
    }
    
    // แปลงฟิลด์ตัวเลข
    categorySchema.fields.forEach(field => {
      if (field.type === 'number' && productData[field.name]) {
        productData[field.name] = Number(productData[field.name]);
      }
    });

    const imageFields = categorySchema.fields.filter(field => field.type === 'image');

    // จัดการไฟล์รูปภาพ
    if (imageFields.length > 0 && files) {
      for (const field of imageFields) {
        const fieldFiles = files.filter(file => decodeURIComponent(file.fieldname) === field.name);
        
        if (fieldFiles.length > 0) {
          try {
            // ลบรูปภาพเก่าจาก Cloudinary ถ้ามี
            if (existingProduct[field.name]) {
              const existingImages = Array.isArray(existingProduct[field.name]) 
                ? existingProduct[field.name] 
                : [existingProduct[field.name]];
              
              for (const imageUrl of existingImages) {
                const publicId = imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
              }
            }

            // อัพโหลดรูปภาพใหม่
            const imagesUrl = await Promise.all(
              fieldFiles.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                  resource_type: 'image'
                });
                return result.secure_url;
              })
            );
            productData[field.name] = imagesUrl;
            
          } catch (uploadError) {
            console.error('Image upload error:', uploadError);
            return res.status(400).json({
              success: false,
              message: `Image upload failed: ${uploadError.message}`,
              field: field.name
            });
          }
        }
      }
    }

    // อัพเดทข้อมูลสินค้า
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        ...productData,
        updated_at: Date.now()
      },
      { new: true }
    );
    
    res.json({ 
      success: true, 
      message: "Product Updated", 
      product: updatedProduct 
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: error.errors || error.stack
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const { categoryName, productId } = req.params;
    
    const ProductModel = await getProductModel(categoryName);
    const product = await ProductModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    res.json({ 
      success: true, 
      product: {
        ...product.toObject(),
        categoryName
      }
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
  
export { addProduct, listProducts, removeProduct, updateProduct, getProduct };