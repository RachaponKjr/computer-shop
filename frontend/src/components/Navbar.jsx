import { useState, useContext, useRef, useEffect } from 'react';
import { Search, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

import { FiLogIn } from "react-icons/fi";
import useUserStore from '../stores/userStore';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { searchProducts } = useContext(ShopContext);
  const { user } = useUserStore()

  const menuItems = [
    { id: 1, name: 'หน้าแรก', href: '/' },
    { id: 2, name: 'เกี่ยวกับเรา', href: '#' },
    { id: 3, name: 'ติดต่อเรา', href: '#' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      try {
        const results = await searchProducts(query);
        setSearchResults(results);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleProductSelect = (product) => {
    setSearchQuery('');
    setIsDropdownOpen(false);
    navigate(`/product/${product.category_id}/${product._id}`);
  };

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-gray-800">
              เอ อาร์ คอมพิวเตอร์
            </a>
          </div>

          <div className="flex-1 max-w-2xl mx-8 relative" ref={dropdownRef}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="ค้นหาสินค้า"
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {isDropdownOpen && searchResults.length > 0 && (
              <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductSelect(product)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                  >
                    {product.product_image && product.product_image[0] && (
                      <img
                        src={product.product_image[0]}
                        alt={product.ชื่อ || product.product_name}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.ชื่อ || product.product_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ฿{product.ราคา?.toLocaleString() || 'ราคาไม่ระบุ'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {user === null ? (
            <div
              onClick={() => navigate('/login')}
              className='cursor-pointer'>
              <FiLogIn size={24} />
            </div>) : (
            <div className='w-10 h-10 rounded-full overflow-hidden'>
              <img
                src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
                alt="Profile"
              />
            </div>
          )
          }
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 h-12">
            <button className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-md">
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="hidden lg:block text-gray-600 hover:text-red-600 text-sm font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;