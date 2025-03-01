const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          ‹
        </button>
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`px-3 py-1 border rounded hover:bg-gray-100 
              ${currentPage === index + 1 ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          ›
        </button>
      </div>
    );
  };

  export default Pagination;