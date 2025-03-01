import mongoose from 'mongoose';

// Define the main category schema
const categorySchemaDefinition = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true, default: 'cpu' },
  customIcon: { type: String, required: false },
  fields: [{
    id: { 
      type: String, 
      required: true,
    },
    name: { type: String, required: true },
    type: { 
      type: String, 
      required: true, 
      enum: [
        'text',
        'number',
        'boolean',
        'select',
        'multiselect',
        'date',
        'image',
        'rich-text'
      ] 
    },
    required: { type: Boolean, default: false },
    validation: {
      min: { type: Number, required: false },
      max: { type: Number, required: false },
      pattern: { type: String, required: false },
      options: [{ type: String, required: false }],
      maxImages: { type: Number, default: 1 }
    },
    display: {
      label: { type: String, required: true },
      placeholder: { type: String, required: false },
      description: String,
      group: String
    },
    config: {
      isFilter: { type: Boolean, default: false },
      isSortable: { type: Boolean, default: false },
      isSearchable: { type: Boolean, default: false },
      isVisible: { type: Boolean, default: true }
    }
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Create compound index for name and fields.id
categorySchemaDefinition.index({ name: 1, 'fields.id': 1 }, { unique: true });

// Update timestamp on save
categorySchemaDefinition.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Ensure required fields exist
categorySchemaDefinition.pre('save', function(next) {
  const requiredFields = [
    { 
      id: '1',
      name: 'ชื่อ',
      type: 'text',
      required: true,
      display: {
        label: 'ชื่อสินค้า',
        placeholder: 'ระบุชื่อสินค้า'
      }
    },
    {
      id: '2',
      name: 'แบรนด์',
      type: 'text',
      required: true,
      display: {
        label: 'แบรนด์',
        placeholder: 'ระบุชื่อแบรนด์'
      }
    },
    {
      id: '3',
      name: 'สเปค',
      type: 'rich-text',
      required: true,
      display: {
        label: 'สเปค',
        placeholder: 'ระบุสเปคของสินค้า'
      }
    },
    {
      id: '4',
      name: 'ราคา',
      type: 'number',
      required: true,
      display: {
        label: 'ราคา',
        placeholder: 'ระบุราคา'
      },
      validation: {
        min: 0
      }
    },
    {
      id: '5',
      name: 'รูปภาพ',
      type: 'image',
      required: true,
      display: {
        label: 'รูปภาพสินค้า'
      },
      validation: {
        maxImages: 5
      }
    },
    {
      id: '6',
      name: 'มีสินค้า',
      type: 'boolean',
      required: true,
      display: {
        label: 'อยู่ในสต็อก'
      }
    }
  ];

  // Ensure all required fields exist and update them with complete data
  requiredFields.forEach(requiredField => {
    const existingFieldIndex = this.fields.findIndex(field => field.name === requiredField.name);
    
    if (existingFieldIndex === -1) {
      this.fields.unshift(requiredField);
    } else {
      // Update existing field with complete data structure
      this.fields[existingFieldIndex] = {
        ...this.fields[existingFieldIndex],
        ...requiredField,
        display: {
          ...this.fields[existingFieldIndex].display,
          ...requiredField.display
        },
        validation: {
          ...this.fields[existingFieldIndex].validation,
          ...requiredField.validation
        }
      };
    }
  });

  next();
});

// Initialize the model
const CategorySchema = mongoose.models.CategorySchema || mongoose.model('CategorySchema', categorySchemaDefinition);

// Try to drop the old index if it exists
mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.collections['categoryschemas']?.dropIndex('id_1');
  } catch (error) {
    // Ignore error if index doesn't exist
    console.log('No existing index to drop or already dropped');
  }
});

export default CategorySchema;