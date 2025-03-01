import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { Plus, Trash2 } from 'lucide-react'
import Button from '../shared/Button'
import FormField from '../shared/FormField'
import CategoryIcon, { iconMap } from '../shared/CategoryIcon'

const CategoryForm = ({ isEdit = false, initialData = null, onSubmit }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    icon: initialData?.icon || 'cpu',
    customIcon: initialData?.customIcon || '',
    fields: initialData?.fields || [
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
    ]
  });

  const [iconType, setIconType] = useState(initialData?.customIcon ? 'custom' : 'preset');
  const [errors, setErrors] = useState({});

  const handleIconChange = (type, value) => {
    if (type === 'preset') {
      setFormData(prev => ({
        ...prev,
        icon: value,
        customIcon: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        icon: '',
        customIcon: value
      }));
    }
  };

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, {
        id: Date.now().toString(),
        name: '',
        type: 'text',
        required: false,
        display: {
          label: '',
          placeholder: ''
        },
        validation: {},
        config: {
          isFilter: false,
          isSortable: false,
          isSearchable: false,
          isVisible: true
        }
      }]
    }));
  };

  const removeField = (id) => {
    const field = formData.fields.find(f => f.id === id);
    if (field.required) {
      toast.error('ไม่สามารถลบฟิลด์ที่จำเป็นได้');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  };

  const handleFieldChange = (id, changes) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === id ? { ...field, ...changes } : field
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'กรุณาระบุชื่อหมวดหมู่';
    }

    const duplicateFields = formData.fields
      .map(f => f.name)
      .filter((name, index, arr) => arr.indexOf(name) !== index);

    if (duplicateFields.length > 0) {
      newErrors.fields = 'พบชื่อฟิลด์ซ้ำกัน';
    }

    formData.fields.forEach(field => {
      if (!field.name.trim()) {
        newErrors[`field-${field.id}`] = 'กรุณาระบุชื่อฟิลด์';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
        toast.success(isEdit ? 'บันทึกการเปลี่ยนแปลงเรียบร้อย' : 'สร้างหมวดหมู่สำเร็จ');
        navigate('/categories');
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField 
          label="ชื่อหมวดหมู่" 
          error={errors.name}
        >
          <input 
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </FormField>

        <FormField 
          label="สัญลักษณ์"
          error={errors.icon}
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              <select
                value={iconType}
                onChange={(e) => setIconType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="preset">เลือกจากที่มี</option>
                <option value="custom">กำหนด SVG Icon เอง</option>
              </select>
              {iconType === 'preset' && formData.icon ? (
                <CategoryIcon 
                  name={formData.icon} 
                  className="w-6 h-6" 
                />
              ) : iconType === 'custom' && formData.customIcon ? (
                <div 
                  className="w-6 h-6" 
                  dangerouslySetInnerHTML={{ __html: formData.customIcon }}
                />
              ) : null}
            </div>

            {iconType === 'preset' ? (
              <select
                value={formData.icon}
                onChange={(e) => handleIconChange('preset', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm"
              >
                {Object.keys(iconMap).map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            ) : (
              <textarea
                value={formData.customIcon}
                onChange={(e) => handleIconChange('custom', e.target.value)}
                placeholder="วางโค้ด SVG ของคุณที่นี่..."
                className="block w-full rounded-md border-gray-300 shadow-sm h-32 font-mono text-sm"
              />
            )}
          </div>
        </FormField>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">ฟิลด์</h3>
          <Button onClick={addField} type="button">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มฟิลด์
          </Button>
        </div>

        {errors.fields && (
          <div className="text-red-500 text-sm mb-4">{errors.fields}</div>
        )}

        {formData.fields.map((field) => (
          <div key={field.id} className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium">ฟิลด์ {field.name || 'ใหม่'}</h4>
              {!field.required && (
                <Button 
                  variant="danger" 
                  onClick={() => removeField(field.id)}
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="ชื่อฟิลด์"
                error={errors[`field-${field.id}`]}
              >
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => handleFieldChange(field.id, {
                    name: e.target.value,
                    display: { ...field.display, label: e.target.value }
                  })}
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </FormField>

              <FormField label="ประเภท">
                <select
                  value={field.type}
                  onChange={(e) => handleFieldChange(field.id, { type: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="select">Select</option>
                  <option value="multiselect">Multi Select</option>
                  <option value="date">Date</option>
                  <option value="image">Image</option>
                  <option value="rich-text">Rich Text</option>
                </select>
              </FormField>

              <FormField label="ป้ายกำกับ">
                <input
                  type="text"
                  value={field.display?.label || ''}
                  onChange={(e) => handleFieldChange(field.id, {
                    display: { ...field.display, label: e.target.value }
                  })}
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                />
              </FormField>

              <FormField label="ตัวอย่างข้อความ">
                <input
                  type="text"
                  value={field.display?.placeholder || ''}
                  onChange={(e) => handleFieldChange(field.id, {
                    display: { ...field.display, placeholder: e.target.value }
                  })}
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                />
              </FormField>
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => handleFieldChange(field.id, { required: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm">จำเป็น</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={field.config?.isFilter}
                  onChange={(e) => handleFieldChange(field.id, {
                    config: { ...field.config, isFilter: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm">ใช้กรอง</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={field.config?.isSortable}
                  onChange={(e) => handleFieldChange(field.id, {
                    config: { ...field.config, isSortable: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm">เรียงลำดับได้</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={field.config?.isSearchable}
                  onChange={(e) => handleFieldChange(field.id, {
                    config: { ...field.config, isSearchable: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm">ค้นหาได้</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button 
          variant="secondary" 
          type="button"
          onClick={() => navigate('/categories')}
        >
          ยกเลิก
        </Button>
        <Button type="submit">
          {isEdit ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างหมวดหมู่'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;