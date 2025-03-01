import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Boxes, Package, ReceiptText, Wrench } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, isActive, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded whitespace-nowrap ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
        }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();

  const handleItemClick = () => {
    // Close sidebar on mobile when item is clicked
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm h-full p-4">
      <div className="space-y-2">
        <SidebarItem
          icon={Boxes}
          label="หมวดหมู่สินค้า"
          to="/categories"
          isActive={location.pathname.startsWith('/categories')}
          onClick={handleItemClick}
        />
        <SidebarItem
          icon={Package}
          label="สินค้า"
          to="/products"
          isActive={location.pathname.startsWith('/products')}
          onClick={handleItemClick}
        />
        <SidebarItem
          icon={ReceiptText}
          label="ใบสั่งซื้อ"
          to="/order"
          isActive={location.pathname.startsWith('/order')}
          onClick={handleItemClick}
        />
        <SidebarItem
          icon={ReceiptText}
          label="ใบส่งของ"
          to="/invoices"
          isActive={location.pathname.startsWith('/invoices')}
          onClick={handleItemClick}
        />
        <SidebarItem
          icon={Wrench}
          label="ใบซ่อมอุปกรณ์"
          to="/repairs"
          isActive={location.pathname.startsWith('/repairs')}
          onClick={handleItemClick}
        />
        <SidebarItem
          icon={ReceiptText}
          label="รายงาน"
          to="/reports"
          isActive={location.pathname.startsWith('/reports')}
          onClick={handleItemClick}
        />
      </div>
    </div>
  );
};

export default Sidebar;