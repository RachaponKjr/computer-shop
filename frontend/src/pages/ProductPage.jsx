import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductImage from '../components/ProductImage';
import ProductInfo from '../components/ProductInfo';
import ProductDetails from '../components/ProductDetails';
import RelatedProducts from '../components/RelatedProducts';
import { ShopContext } from '../context/ShopContext';
import useUserStore from '../stores/userStore';

const ProductPage = () => {
  const { category, id } = useParams();
  const { fetchProductById, fetchRelatedProducts } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore()

  console.log(user);
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        const [productData, relatedProductsData] = await Promise.all([
          fetchProductById(category, id),
          fetchRelatedProducts(category, id)
        ]);

        setProduct(productData);
        setRelatedProducts(relatedProductsData);
      } catch (error) {
        console.error('Error loading product data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [category, id, fetchProductById, fetchRelatedProducts]);

  const getAllImages = (product) => {
    if (!product) return ['/placeholder-product.png'];

    const images = [];
    for (const [key, value] of Object.entries(product)) {
      if (Array.isArray(value) && value.length > 0 &&
        typeof value[0] === 'string' && value[0].startsWith('http')) {
        images.push(...value);
      }
    }
    return images.length > 0 ? images : ['/placeholder-product.png'];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="flex gap-2">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ProductImage images={getAllImages(product)} />
        <ProductInfo product={product} user={user} />
      </div>

      <ProductDetails product={product} />

      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <RelatedProducts products={relatedProducts} category={category} />
        </div>
      )}
    </div>
  );
};

export default ProductPage;