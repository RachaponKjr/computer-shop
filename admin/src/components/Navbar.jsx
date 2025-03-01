import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="pl-4 md:pl-14 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 md:hidden"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <a href="/categories" className="text-xl md:text-2xl font-bold text-gray-800">
            เอ อาร์ คอมพิวเตอร์
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;