import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import { useState } from "react";
import useUserStore from "../../stores/userStore";
import { GetUser } from "../../../libs/getUser";
import { toast } from "react-toastify";

import Cookies from 'js-cookie'

function Register() {
    const navigate = useNavigate();
    const { setUser, user } = useUserStore()
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [dataRegister, setDataRegister] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
    });


    const handleChange = (e) => {
        setDataRegister((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (dataRegister.password !== dataRegister.confirmPassword) {
                alert("รหัสผ่านไม่ตรงกัน");
                return;
            }
            const response = await fetch(`${backendUrl}/api/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: dataRegister.name,
                    surname: dataRegister.surname,
                    email: dataRegister.email,
                    password: dataRegister.password,
                    address: dataRegister.address,
                }),
            });
            const result = await response.json();
            if (result.success) {
                await Cookies.set('accept_token', result.token)
                await GetUser(result.token).then((user) => {
                    setUser(user);
                    navigate("/");
                    toast.success("สมัครสมาชิกสําเร็จ");
                })
                return
            }
            toast.error("ไม่สามารถสมัครสมาชิกได้");
        } catch (error) {
            console.error(error);
        }
    };



    console.log(user);
    return (
        <div className="container mx-auto my-10 px-4 flex items-center">
            <div className="w-[25rem] mx-auto p-4 bg-white shadow-md rounded">
                <div className="flex gap-4 flex-col items-center">
                    <span className="text-xl text-center">สมัครสมาชิก</span>
                    <form onSubmit={handleSubmit} className="w-full space-y-2">
                        <Input onChange={(e) => handleChange(e)} name="name" title="Name" type="text" placeholder="ชื่อ" />
                        <Input onChange={(e) => handleChange(e)} name="surname" title="Surname" type="text" placeholder="นามสกุล" />
                        <Input onChange={(e) => handleChange(e)} name="email" title="Email" type="email" placeholder="อีเมล์" />
                        <Input onChange={(e) => handleChange(e)} name="password" title="Password" type="password" placeholder="รหัสผ่าน" />
                        <Input onChange={(e) => handleChange(e)} name="confirmPassword" title="Confirm Password" type="password" placeholder="ยืนยันรหัสผ่าน" />
                        <Input onChange={(e) => handleChange(e)} name="address" title="Address" type="text" placeholder="ที่อยู่" />
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">สมัครสมาชิก</button>
                    </form>
                </div>
                <div className="w-full h-[1px] my-4 bg-gray-500" />
                <button onClick={() => { navigate('/login') }} className="w-full bg-red-500 text-white p-2 rounded">มีบัญชีอยู่แล้ว</button>
            </div>
        </div>
    );
}

export default Register;
