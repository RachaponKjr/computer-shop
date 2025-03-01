import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = ({setToken}) => {
    const navigate = useNavigate()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl + '/api/user/admin',{email,password})
            if (response.data.success) {
                setToken(response.data.token)
                navigate('/categories')
            } else {
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full p-4'>
            <div className='bg-white shadow-md rounded-lg px-4 sm:px-8 py-6 w-full max-w-md mx-auto'>
                <h1 className='text-xl sm:text-2xl font-bold mb-6 text-center'>ผู้ดูแล</h1>
                <form onSubmit={onSubmitHandler} className='space-y-4'>
                    <div className='w-full'>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>อีเมล์</label>
                        <input 
                            id="email"
                            onChange={(e)=>setEmail(e.target.value)} 
                            value={email} 
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-200'
                            type="email" 
                            placeholder='อีเมล์' 
                            required 
                        />
                    </div>
                    <div className='w-full'>
                        <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>รหัสผ่าน</label>
                        <input 
                            id="password"
                            onChange={(e)=>setPassword(e.target.value)} 
                            value={password} 
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-200'
                            type="password" 
                            placeholder='รหัสผ่าน' 
                            required 
                        />
                    </div>
                    <button 
                        className='w-full py-2.5 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition duration-200 text-sm sm:text-base font-medium mt-6' 
                        type='submit'
                    > 
                        ลงชื่อเข้าใช้ 
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login