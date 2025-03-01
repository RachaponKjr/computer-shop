import mongoose from 'mongoose';

const getMongooseType = (fieldType) => {
  const typeMap = {
    'text': String,
    'number': Number,
    'boolean': Boolean,
    'select': String,
    'multiselect': [String],
    'date': Date,
    'image': [String],
    'rich-text': String,
    'color': String,
    'json': mongoose.Schema.Types.Mixed,
    'url': String
  };
  return typeMap[fieldType] || String;
};

export const createProductSchema = (categorySchema) => {
  const schemaDefinition = {
    category_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  };

  categorySchema.fields.forEach(field => {
    // Create basic schema definition
    const fieldDefinition = {
      type: getMongooseType(field.type),
      required: field.required || false
    };

    // Handle validations based on field type
    if (field.validation) {
      if (field.type === 'number') {
        // Handle number-specific validations
        if (field.validation.min !== undefined) {
          fieldDefinition.min = Number(field.validation.min);
        }
        if (field.validation.max !== undefined) {
          fieldDefinition.max = Number(field.validation.max);
        }
        // Remove enum validation for number fields
        delete fieldDefinition.enum;
      } else {
        // Handle other field types
        if (field.validation.pattern) {
          fieldDefinition.match = new RegExp(field.validation.pattern);
        }
        if (field.validation.options && Array.isArray(field.validation.options)) {
          fieldDefinition.enum = field.validation.options;
        }
      }
      
      // Handle image validation
      if (field.type === 'image' && field.validation.maxImages) {
        fieldDefinition.validate = {
          validator: function(v) {
            return Array.isArray(v) && v.length <= field.validation.maxImages;
          },
          message: `Cannot upload more than ${field.validation.maxImages} images`
        };
      }
    }

    schemaDefinition[field.name] = fieldDefinition;
  });

  return new mongoose.Schema(schemaDefinition);
};

export const getProductModel = async (categoryName) => {
  try {
    const modelName = `Product_${categoryName}`;
    
    // Return existing model if it exists
    if (mongoose.models[modelName]) {
      return mongoose.models[modelName];
    }

    const CategorySchema = mongoose.models.CategorySchema;
    const categorySchema = await CategorySchema.findOne({ name: categoryName });
    
    if (!categorySchema) {
      throw new Error(`Category schema ${categoryName} not found`);
    }

    const productSchema = createProductSchema(categorySchema);
    return mongoose.model(modelName, productSchema, 'products');
  } catch (error) {
    console.error('Error creating product model:', error);
    throw error;
  }
};