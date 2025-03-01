import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const RepairInvoicePagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  startIndex,
  endIndex,
  totalItems
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    // Adjust visible pages based on screen size
    const pagesToShow = window.innerWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
    
    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    // Add first page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className="relative hidden md:inline-flex items-center px-3 sm:px-4 py-2 border text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="relative hidden md:inline-flex items-center px-2 sm:px-4 py-2">
            <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`relative inline-flex items-center px-2.5 sm:px-4 py-2 border text-sm font-medium 
            ${currentPage === i
              ? 'z-10 bg-blue-500 border-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
            } ${window.innerWidth < 640 && i !== currentPage ? 'hidden sm:inline-flex' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="relative hidden md:inline-flex items-center px-2 sm:px-4 py-2">
            <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          </span>
        );
      }
      
      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className="relative hidden md:inline-flex items-center px-3 sm:px-4 py-2 border text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="bg-white px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-3 sm:gap-0">
      {/* Mobile View */}
      <div className="flex items-center justify-between w-full sm:hidden">
        <div className="flex flex-1 justify-between max-w-[280px] mx-auto">
          <button
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            ก่อนหน้า
          </button>
          <span className="text-sm text-gray-700 self-center">
            หน้า {currentPage} จาก {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            ถัดไป
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Desktop/Tablet View */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex-shrink-0">
          <p className="text-sm text-gray-700">
            แสดง{' '}
            <span className="font-medium">{startIndex + 1}</span>
            {' '}ถึง{' '}
            <span className="font-medium">
              {Math.min(endIndex, totalItems)}
            </span>
            {' '}จาก{' '}
            <span className="font-medium">{totalItems}</span>
            {' '}รายการ
          </p>
        </div>
        <div className="mt-3 sm:mt-0">
          <nav 
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" 
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
            
            {renderPageNumbers()}
            
            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default RepairInvoicePagination;