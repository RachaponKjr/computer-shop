import { useNavigate } from "react-router-dom"
import Input from "../../components/ui/Input"
import { useState } from "react"
import { toast } from "react-toastify"
import { GetUser } from "../../../libs/getUser"

import Cookies from 'js-cookie'
import useUserStore from "../../stores/userStore"

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setUser } = useUserStore()
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (response.ok) {
                toast.success("เข้าสู่ระบบสําเร็จ");
                await Cookies.set('accept_token', result.token)
                await GetUser(result.token).then((user) => {
                    localStorage.setItem('user', JSON.stringify(user))
                    setUser(user);
                    navigate("/");
                })
                return
            }
            toast.error("ไม่สามารถเข้าสู่ระบบได้");
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    return (
        <div className="container mx-auto my-10 px-4 flex items-center">
            <div className="w-[25rem] mx-auto p-4 bg-white shadow-md rounded">
                <div className="flex gap-4 flex-col items-center">
                    <span className="text-xl text-center">เข้าสู่ระบบ</span>
                    <form onSubmit={onSubmitHandler} className="w-full space-y-2">
                        <Input name="email" onChange={(e) => { setEmail(e.target.value) }} title="Email" type="email" placeholder="email" />
                        <Input name="password" onChange={(e) => { setPassword(e.target.value) }} title="Password" type="password" placeholder="password" />
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">เข้าสู่ระบบ</button>
                    </form>
                </div>
                <div className="w-full h-[1px] my-4 bg-gray-500" />
                <button onClick={() => { navigate('/register') }} className="w-full bg-red-500 text-white p-2 rounded">สร้างบัญชีใหม่</button>
            </div>
        </div>
    )
}

export default Login