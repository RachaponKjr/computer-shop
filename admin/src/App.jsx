import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CategoryList from './pages/categories/List';
import CategoryNew from './pages/categories/New';
import CategoryEdit from './pages/categories/Edit';
import ProductList from './pages/products/List';
import ProductNew from './pages/products/New';
import ProductEdit from './pages/products/Edit';
import InvoiceList from './pages/invoices/List';
import InvoiceNew from './pages/invoices/New';
import InvoiceView from './pages/invoices/Invoice';
import InvoiceEdit from './pages/invoices/Edit';
import RepairInvoiceList from './pages/repairs/List';
import RepairInvoiceNew from './pages/repairs/New';
import RepairInvoiceView from './pages/repairs/RepairInvoice';
import RepairInvoiceEdit from './pages/repairs/Edit';
import Login from './components/Login'
import Order from './pages/order/order';
import { ToastContainer } from 'react-toastify';
import ReportList from './pages/reports/report-list';
import OrderDetail from './pages/order/order-detail';

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='bg-gray-50 h-screen flex flex-col print:bg-white print:min-h-0 print:h-auto'>
      {token === "" ?
        (<Login setToken={setToken} />) :
        (
          <>
            <div className='print:hidden'>
              <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            </div>
            <hr className='print:hidden' />
            <div className='flex-1 flex bg-gray-100 print:bg-white print:block print:min-h-0' style={{ height: 'calc(100vh - 4rem)' }}>
              {/* Sidebar - Mobile Overlay */}
              <div className={`
              fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300
              ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `} onClick={toggleSidebar}>
              </div>

              {/* Sidebar */}
              <div className={`
              fixed md:static h-full z-30 md:z-auto
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
              py-8 pl-8 print:hidden
            `}>
                <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
              </div>

              {/* Main Content */}
              <div className="flex-1 p-4 md:p-8 print:p-0 w-full">
                <div className="bg-white rounded-lg shadow-sm h-full p-4 md:p-6 overflow-y-auto print:shadow-none print:rounded-none print:p-0 print:overflow-visible">
                  <Routes>
                    <Route path="/categories" element={<CategoryList token={token} />} />
                    <Route path="/categories/new" element={<CategoryNew token={token} />} />
                    <Route path="/categories/edit/:name" element={<CategoryEdit token={token} />} />
                    <Route path="/products" element={<ProductList token={token} />} />
                    <Route path="/products/new" element={<ProductNew token={token} />} />
                    <Route path="/products/edit/:categoryName/:productId/" element={<ProductEdit token={token} />} />
                    <Route path="/invoices" element={<InvoiceList token={token} />} />
                    <Route path="/invoices/new" element={<InvoiceNew token={token} />} />
                    <Route path="/invoices/edit/:invoiceId" element={<InvoiceEdit token={token} />} />
                    <Route path="/invoices/:id" element={<InvoiceView />} />
                    <Route path="/repairs" element={<RepairInvoiceList token={token} />} />
                    <Route path="/repairs/new" element={<RepairInvoiceNew token={token} />} />
                    <Route path="/repairs/edit/:invoiceId" element={<RepairInvoiceEdit token={token} />} />
                    <Route path="/repairs/:id" element={<RepairInvoiceView />} />
                    <Route path="/order" element={<Order />} />
                    <Route path="/order/:id" element={<OrderDetail />} />
                    <Route path="/reports" element={<ReportList />} />
                  </Routes>
                </div>
              </div>
            </div>
          </>
        )
      }
      <ToastContainer />
    </div>
  );
};

export default App;