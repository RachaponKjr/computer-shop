const ProductDetails = ({ product }) => {
  const filterFields = (entries) => {
    return entries.filter(([key, value]) => {
      const skipFields = ['_id', 'category_id', 'created_at', 'updated_at', '__v', 'categoryName', 'ราคา', 'ชื่อ', 'แบรนด์'];
      return !skipFields.includes(key) && !(Array.isArray(value) && value[0]?.startsWith('http'));
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">รายละเอียดสินค้า</h2>
        <div className="grid grid-cols-1 gap-4">
          {filterFields(Object.entries(product)).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-4 py-3 border-b last:border-0">
              <div className="font-medium text-gray-700">{key}</div>
              <div className="col-span-2">{
                Array.isArray(value) ? value.join(', ') : value
              }</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;