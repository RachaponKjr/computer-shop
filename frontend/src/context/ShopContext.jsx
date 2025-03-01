import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/category/list`);
            
            if (response.data.success) {
                setCategories(response.data.categories);
            } else {
                throw new Error(response.data.message || 'Failed to fetch categories');
            }
        } catch (error) {
            setError(error.message);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsByCategory = async (category) => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list/${category}`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch products');
            }
            
            return response.data.products;
        } catch (error) {
            toast.error('Failed to load products');
            throw error;
        }
    };

    const fetchProductById = async (category, id) => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/${category}/${id}`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch product');
            }
            
            return response.data.product;
        } catch (error) {
            toast.error('Failed to load product');
            throw error;
        }
    };

    const fetchRelatedProducts = async (category, currentProductId) => {
        try {
            const products = await fetchProductsByCategory(category);
            return products.filter(p => p._id !== currentProductId);
        } catch (error) {
            toast.error('Failed to load related products');
            throw error;
        }
    };

    const searchProducts = async (query) => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch products');
            }

            const products = response.data.products;
            const searchLower = query.toLowerCase();
            
            return products.filter(product => 
                product.ชื่อ?.toLowerCase().includes(searchLower) ||
                product.product_description?.toLowerCase().includes(searchLower)
            ).slice(0, 5);
            
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search products');
            return [];
        }
    };

    const contextValue = {
        categories,
        loading: loading,
        error,
        refreshCategories: fetchCategories,
        searchProducts,
        fetchProductsByCategory,
        fetchProductById,
        fetchRelatedProducts
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;