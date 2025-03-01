import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";

const ProductInfo = ({ product, user }) => {
  const [quantity, setQuantity] = useState(1);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = Cookies.get('accept_token')
  const formatPrice = (price) => {
    return Number(price).toLocaleString();
  };

  const buyProduct = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user._id,
          orderItems: [
            {
              product_id: product._id,
              quantity: quantity
            }
          ]
        }),
      });

      if (response.ok) {
        toast.success("สั่งซื้อสินค้าเรียบร้อย");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">{product.ชื่อ}</h1>
      <div className="space-y-4">
        {product.แบรนด์ && (
          <div className="flex gap-2">
            <span className="font-medium">แบรนด์:</span>
            <span>{product.แบรนด์}</span>
          </div>
        )}
        <div className="text-xl">
          ราคา: <span className="font-bold">฿{formatPrice(product.ราคา)}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium">สถานะ:</span>
          <span className="text-green-600">มีสินค้า</span>
        </div>
      </div>
      {user != null && (
        <div className="w-full mt-4 flex gap-6">
          <div className="flex gap-4 p-1 justify-start items-center border border-gray-300 rounded-lg w-max">
            <div
              onClick={() => setQuantity((quantity) => quantity + 1)}
              className="cursor-pointer"><Plus size={24} /></div>
            <span>{quantity}</span>
            <div
              onClick={() => setQuantity((quantity) => Math.max(1, quantity - 1))}
              className="cursor-pointer"><Minus size={24} /></div>
          </div>
          <button
            onClick={buyProduct}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >ซื้อสินค้า</button>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;