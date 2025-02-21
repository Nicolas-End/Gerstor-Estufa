
import { acess_data_user } from "@/Components/UserDatas";
import React, { useState } from "react";
import './style.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [rememberuser, setRememberUser ] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-600 to-pink-300 items-center justify-center">
      <div className="flex w-4/5 h-4/5 bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Contêiner do formulário */}
        <div className="w-1/2 bg-purple-700 text-white p-10 flex flex-col justify-center">
          <div className="flex items-center mb-6">
            <img src="Logo.png" alt="Logo" className="w-12 h-12 mr-3" />
            <h1 className="text-4xl font-bold">Today</h1>
          </div>
          <p className="text-sm mb-6">Welcome to the site</p>
          
          <label className="text-sm mb-2">Email</label>
          <input
            value={email}
            type="email"
            className="full-width mb-4 p-3 rounded bg-white text-gray-800 shadow-md"
            onChange={(e) => { setEmail(e.target.value) }}
          />
          
          <label className="text-sm mb-2">Código</label>
          <input
            value={code}
            type="text"
            className="full-width mb-4 p-3 rounded bg-white text-gray-800 shadow-md"
            onChange={(e) => { setCode(e.target.value) }}
          />
          
          <label className="text-sm mb-2">Senha</label>
          <input
            value={password}
            type="password"
            className="full-width mb-4 p-3 rounded bg-white text-gray-800 shadow-md"
            onChange={(e) => { setPassword(e.target.value) }}
          />
          

          
          <button className="full-width bg-pink-500 text-white rounded-lg py-3 shadow-lg transition transform hover:bg-pink-600 hover:-translate-y-1"
            onClick={() => acess_data_user(email, code, password)}>
            Login
          </button>
        </div>


        </div>
      </div>
  );
};

export default Login;