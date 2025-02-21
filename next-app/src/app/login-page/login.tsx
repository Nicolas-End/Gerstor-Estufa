
import { acess_data_user } from "@/Components/UserDatas";

import React, { useState } from "react";

const Login: React.FC = () => {
  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [rememberuser, setRememberUser] = useState(false)

  
  return (
    <div className="flex h-screen bg-[#ac53a5]">
      <div className="flex flex-col  w-full md:w-1/2 bg-[#ac53a5] text-white p-10 self-center">
      <div className="flex">
        <img src="Logo.png" alt="Logo" className="w-11 h-10 mr-2" />
          <h1 className="text-3xl font-bold mb-2">Today</h1>
      </div>
      <div className="flex justify-between w-9/12 mb-8">
        <p className="text-sm text-left">Welcome to site</p>
        <a href="#" className="text-white text-sm text-left underline">Register</a>
      </div>
        <label className=" items-center  text-white text-sm drop-shadow-sm">
        Email
        <br></br>
        <input
          value={email}
          type="email"
          className="mb-4 p-3 rounded bg-white text-gray-800 w-60 h-8 shadow-lg"
          onChange={(e)=>{setEmail(e.target.value)}}
        />
        </label>
        <label className=" items-center  text-white text-sm drop-shadow-sm">
        Codigo
        <br></br>
        <input
        value={code}
          type="text"
          className="mb-4 p-3 rounded bg-white text-gray-800 w-60 h-8 shadow-lg"
          onChange={(e)=>{setCode(e.target.value)}}
        />
        </label>

        <label className=" items-center mb-2 text-white text-sm ">
          Senha
          <br></br>
        <input
        value={password}
          type="password"
          className="mb-2 p-3 rounded bg-white text-gray-800 w-60 h-8 shadow-lg"
          onChange={(e)=>{setPassword(e.target.value)}}
        />
        </label>


        <button className="bg-[#512779] text-white rounded w-60 h-8 shadow-lg  transition delay-150 duration-300 ease-in-out hover:bg-[#642e97] hover:-translate-y-1 hover:scale-110"
        onClick={() => acess_data_user(email,code,password)}>
          Login
        </button>

      </div>

      <div className="hidden md:flex items-center justify-center w-4/5 bg-[#f8aad1]">
        <div className="relative">
            <img src="Logo.png" alt="Logo" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Login;