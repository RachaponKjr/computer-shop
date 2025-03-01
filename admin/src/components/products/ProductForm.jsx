import axios from 'axios';
import { backendUrl } from '../../App';
import { useState, useEffect } from 'react';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ isEdit = false, initialData = null, categorySlug = '', onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || '');
  const [imagePreviews, setImagePreviews] = useState({});
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/list`);
      
      if (response.data.success) {
        const transformedCategories = response.data.categories.map(category => ({
          value: category.name,
          label: category.name.toUpperCase(),
          fields: category.fields
        }));
        setCategories(transformedCategories);

        // If editing, set the initial category and fields
        if (isEdit && categorySlug) {
          const category = transformedCategories.find(cat => cat.value === categorySlug);
          if (category) {
            setSelectedCategory(categorySlug);
            setFields(category.fields);

            // Set initial image previews
            const imageFields = category.fields.filter(field => field.type === 'image');
            const previews = {};
            imageFields.forEach(field => {
              if (initialData[field.name]) {
                previews[field.name] = initialData[field.name];
              }
            });
            setImagePreviews(previews);
          }
        }
      } else {
        toast.error(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    if (!isEdit) {
      setSelectedCategory(event.target.value);
      setFormData({});
      setErrors({});
      const category = categories.find(cat => cat.value === event.target.value);
      if (category) {
        setFields(category.fields);
      }
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const handleImageChange = (fieldName, newFiles) => {
    setFormData((prev) => {
      const existingFiles = prev[fieldName] || [];
      
      const combinedFiles = [...Array.from(existingFiles), ...Array.from(newFiles)];
      
      const field = fields.find(f => f.name === fieldName);
      const maxImages = field?.validation?.maxImages || 1;
      
      const finalFiles = combinedFiles.slice(0, maxImages);
      
      const dataTransfer = new DataTransfer();
      finalFiles.forEach(file => dataTransfer.items.add(file));
      
      return {
        ...prev,
        [fieldName]: dataTransfer.files
      };
    });

    setImagePreviews((prev) => {
      let existingPreviews = prev[fieldName] || [];
      // If the existing previews are URLs (from initial data), keep them
      if (typeof existingPreviews === 'string' || (Array.isArray(existingPreviews) && existingPreviews.length > 0 && typeof existingPreviews[0] === 'string')) {
        existingPreviews = Array.isArray(existingPreviews) ? existingPreviews : [existingPreviews];
      } else {
        existingPreviews = [];
      }
      
      const newPreviews = Array.from(newFiles).map((file) => URL.createObjectURL(file));
      
      const field = fields.find(f => f.name === fieldName);
      const maxImages = field?.validation?.maxImages || 1;
      
      const combinedPreviews = [...existingPreviews, ...newPreviews].slice(0, maxImages);
      
      return {
        ...prev,
        [fieldName]: combinedPreviews
      };
    });
  };

  const removeImage = (fieldName, index) => {
    setFormData((prev) => {
      const files = Array.from(prev[fieldName] || []);
      files.splice(index, 1);
      
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      
      return {
        ...prev,
        [fieldName]: dataTransfer.files
      };
    });

    setImagePreviews((prev) => {
      const previews = [...(prev[fieldName] || [])];
      // Don't revoke URL if it's an existing image URL
      if (!previews[index].startsWith('http')) {
        URL.revokeObjectURL(previews[index]);
      }
      previews.splice(index, 1);
      return {
        ...prev,
        [fieldName]: previews
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.display?.label || field.name} is required`;
      }
      if (field.type === 'number' && formData[field.name] < 0) {
        newErrors[field.name] = `${field.display?.label || field.name} must be positive`;
      }
      if (field.type === 'image' && formData[field.name]) {
        const fileCount = formData[field.name].length;
        const maxImages = field.validation?.maxImages || 1;
        if (fileCount > maxImages) {
          newErrors[field.name] = `Maximum ${maxImages} images allowed`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('categoryName', selectedCategory.toLowerCase());
      
      const thaiToAscii = (str) => {
        return encodeURIComponent(str);
      };
      
      Object.entries(formData).forEach(([key, value]) => {
        const asciiKey = thaiToAscii(key);
        if (value instanceof FileList) {
          Array.from(value).forEach(file => {
            formDataToSubmit.append(asciiKey, file);
          });
        } else {
          formDataToSubmit.append(asciiKey, value);
        }
      });

      if (onSubmit) {
        await onSubmit(formDataToSubmit);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField 
        label="หมวดหมู่สินค้า" 
        error={errors.category}
      >
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={isEdit}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">เลือกหมวดหมู่สินค้า</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </FormField>

      {selectedCategory && fields.map((field) => (
        <FormField 
          key={field.id} 
          label={`${field.display?.label || field.name}${field.required ? ' *' : ''}`}
          error={errors[field.name]}
        >
          {field.type === 'text' && (
            <input
              type="text"
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.display?.placeholder}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          )}

          {field.type === 'number' && (
            <input
              type="number"
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.display?.placeholder}
              min="0"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          )}

          {field.type === 'rich-text' && (
            <textarea
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.display?.placeholder}
              rows={4}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          )}

          {field.type === 'boolean' && (
            <input
              type="checkbox"
              checked={formData[field.name] || false}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          )}

          {field.type === 'image' && (
            <div>
              <input
                type="file"
                multiple={field.validation?.maxImages > 1}
                accept="image/*"
                onChange={(e) => handleImageChange(field.name, e.target.files)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                {`Selected ${imagePreviews[field.name]?.length || 0} of ${field.validation?.maxImages} images allowed`}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviews[field.name]?.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 rounded-md object-cover border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(field.name, index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormField>
      ))}

      {selectedCategory && (
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/products')}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            {isEdit ? 'อัพเดตสินค้า' : 'บันทึกสินค้า'}
          </Button>
        </div>
      )}
      </form>
  );
};

export default ProductForm;