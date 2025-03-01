import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { backendUrl } from '../../App'
import { ChevronLeft } from 'lucide-react'

function OrderDetail() {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const getProduct = async () => {
        const response = await axios.post(`${backendUrl}/api/order/getorder/${id}`)
        setOrder(response.data.order)
    }

    useEffect(() => {
        try {
            setLoading(true)
            getProduct()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [])

    if (loading || !order) {
        return <div className='flex justify-center items-center h-screen'>
            <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900'></div>
        </div>
    }
    return (
        <div className='container mx-auto space-y-4'>
            <ChevronLeft className='cursor-pointer' onClick={() => navigate("/order")} />
            <h1 className='text-2xl font-bold'> รายการ ในใบสั่งซื้อ </h1>
            <div className=' gap-4 w-full'>
                <div className='bg-white p-4 rounded-lg shadow-md space-y-4 overflow-hidden'>
                    <div className='flex justify-start gap-2 items-center'>
                        <h2 className='text-lg font-bold'> รายการสินค้า </h2>
                        <span className='text-sm text-gray-500'> ( {order.orderItems.length} รายการ ) </span>
                    </div>
                    <div className='flex flex-col md:flex-row justify-between  md:items-center'>
                        <div className='flex gap-2 items-center'>
                            <span className='font-semibold'>
                                ชื่อลูกค้า :
                            </span>
                            <div className='flex gap-2 items-center'>
                                <span>
                                    {order.user?.name || 'ไม่มีชื่อ'}
                                </span>
                                <span className='text-sm text-gray-500'>
                                    ({order.user?.email || 'ไม่มีอีเมล'})
                                </span>
                            </div>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <span className='font-semibold'>สถานะ : </span>
                            <div className='flex gap-2'>
                                <span className={`text-sm text-gray-500 ${order.status === 'pending' ? 'text-yellow-500' : order.status === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                                    {order.status === 'pending' ? 'รอยืนยัน' : order.status === 'paid' ? 'ยืนยันแล้ว' : 'ยกเลิก'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="text-left px-4 py-2">ลำดับ</th>
                                    <th className="text-left px-4 py-2">รูปภาพ</th>
                                    <th className="text-left px-4 py-2">ชื่อสินค้า</th>
                                    <th className="text-left px-4 py-2">ข้อมูล</th>
                                    <th className="text-left px-4 py-2">ราคา</th>
                                    <th className="text-left px-4 py-2">จำนวน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems.map((item, index) => (
                                    <>
                                        <tr className="border-t">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2">
                                                <img src={item.product.รูปภาพ[0]} alt="Product Image" className="w-16 h-16 object-cover rounded" />
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className='line-clamp-1'>
                                                    {item.product.ชื่อ}
                                                </span>
                                                <span className='text-sm text-gray-500'>
                                                    {item.product.แบรนด์}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className='line-clamp-2'>
                                                    {item.product.สเปค}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 min-w-[150px]">{item.product.ราคา} บาท</td>
                                            <td className="px-4 py-2">{item.quantity}</td>
                                        </tr>
                                    </>
                                ))}
                                <tr className="border-t">
                                    <td className="px-4 py-2" colSpan={6}>
                                        <div className='flex justify-end gap-2 font-bold text-lg'>
                                            <span>
                                                ราคารวม
                                            </span>
                                            <span>{order.totalPrice} บาท</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default OrderDetail