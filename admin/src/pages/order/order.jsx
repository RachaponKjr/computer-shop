import axios from "axios";
import { Check, Eye, X } from "lucide-react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from '../../App';
import { toast } from "react-toastify";
import StatusBar from "../../components/order/status-bar";
import { formatDate } from "../../libs/format";

function Order() {
    const navigate = useNavigate();

    const [product, setProduct] = useState([]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/order/getorder`);
            if (response.data.success) {
                setProduct(response.data.orders);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`${backendUrl}/api/order/update/${id}`, {
                status
            }).then((res) => {
                if (res.data.success) {
                    toast.success("อัปเดตสถานะสำเร็จ");
                    fetchProduct();
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        fetchProduct();
    }, []);

    console.log(product);

    return (
        <>
            <div className="max-w-7xl mx-auto p-2">
                <div className="flex flex-col w-full">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">ใบสั่งซื้อ</h1>
                        <span className="text-gray-600/80 text-sm">({product.length} รายการ)</span>
                    </div>

                    {/* Table */}
                    <div>
                        {/* Desktop Table View */}
                        <div className="md:block overflow-x-auto">
                            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้ซื้อ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {product.map((item, index) => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 flex flex-col gap-1">
                                                    <span>
                                                        {item.user_id === null ? "ผู้ซื้อที่ยังไม่ได้ลงทะเบียน" : item.user_id.name}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                        {item.user_id === null ? "" : item.user_id.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(item.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                                ฿{item.totalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium place-items-end">
                                                <StatusBar status={item.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(item._id, "paid")}
                                                        className="text-blue-600 hover:text-blue-800 p-2"
                                                    >
                                                        <Check color="green" size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(item._id, "cancel")}
                                                        className="text-blue-600 hover:text-blue-800 p-2"
                                                    >
                                                        <X color="red" size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(item._id)}
                                                        className="text-blue-600 hover:text-blue-800 p-2"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        {/* <div className="md:hidden space-y-4">
                            {items.map((item) => (
                                <itemCard key={item._id} item={item} />
                            ))}
                        </div> */}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Order