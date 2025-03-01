import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Category from './pages/Category'
import ChatBubble from './components/ChatBubble'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

const App = () => {
  return (
    <div className='bg-gray-50'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/product/:category/:id" element={<ProductPage />} />
        <Route path="/category/:category" element={<Category />} />
      </Routes>
      <ChatBubble />
      <Footer />
    </div>
  )
}

export default App