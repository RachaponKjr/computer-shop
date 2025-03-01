import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter } from 'lucide-react';

const InvoiceHeader = ({ 
  totalItems,
  searchTerm, 
  setSearchTerm, 
  showFilters, 
  setShowFilters 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">ใบส่งของ</h1>
        <p className="text-gray-600 mt-1">{totalItems} รายการ</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block rounded-md w-full pl-10 pr-3 py-2 border border-gray-300 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="ค้นหาเลขที่หรือชื่อลูกค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Filter size={20} />
          ตัวกรอง
        </button>
        <Link 
          to="/invoices/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <FileText size={20} />
          สร้างใบส่งของ
        </Link>
      </div>
    </div>
  );
};

export default InvoiceHeader;