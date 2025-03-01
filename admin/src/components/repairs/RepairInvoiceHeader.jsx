import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter } from 'lucide-react';

const RepairInvoiceHeader = ({
  totalItems,
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  categoryFilter,
  setCategoryFilter
}) => {
  return (
    <div className="space-y-4">
      {/* Title and Create Button - Mobile */}
      <div className="flex flex-col sm:hidden gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">ใบเสนอราคาซ่อมอุปกรณ์</h1>
          <Link
            to="/repairs/new"
            className="bg-blue-600 text-white px-3 py-2 rounded-lg inline-flex items-center gap-1.5 hover:bg-blue-700 transition-colors text-sm"
          >
            <FileText size={18} />
            <span>สร้างใหม่</span>
          </Link>
        </div>
        <p className="text-gray-600 text-sm -mt-2">{totalItems} รายการ</p>
      </div>

      {/* Title and Create Button - Desktop */}
      <div className="hidden sm:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">ใบเสนอราคาซ่อมอุปกรณ์</h1>
          <p className="text-gray-600 mt-1">{totalItems} รายการ</p>
        </div>
        <Link
          to="/repairs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FileText size={20} />
          สร้างใบส่งของ
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg pl-10 pr-3 py-2 border border-gray-300 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="ค้นหาเลขที่หรือเรื่อง..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 sm:flex-none">
          <div className="flex gap-3 sm:flex-none">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 sm:flex-none px-4 py-2 text-gray-600 bg-gray-100 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors justify-center"
            >
              <Filter size={20} />
              <span className="sm:inline">ตัวกรอง</span>
            </button>
          </div>
          <div className="flex gap-3 sm:flex-none">
            <select
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border p-2 h-11 rounded shadow-sm  text-sm sm:text-base">
              <option value="">หมวดหมู่</option>
              <option value="อุปกรณ์คอมพิวเตอร์">อุปกรณ์คอมพิวเตอร์</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairInvoiceHeader;