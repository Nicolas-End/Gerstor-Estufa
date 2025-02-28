"use client";
import React, { useState } from 'react';
import Head from 'next/head';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Head>
      <title>Home - Today</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </Head>

      <nav className="bg-[#f5e8da] p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-white font-bold text-2xl">
            <a href="#"><img src="Logo com titulo.png" alt="Logo menu" /></a>
          </div>

          {/* Links de Navegação para Desktop */}
          <div className="hidden md:flex space-x-8 text-[#2b192e]">
            <a href="#" className="hover:text-[#2b192e] mt-2 fontPop">Home</a>
            <a href="/about" className="hover:text-[#2b192e] mt-2 fontPop">Sobre</a>
            <div className="flex space-x-4">
              <a href="./register" className="bg-[#2b192e] text-[#f5e8da] px-4 py-2 rounded-lg hover:bg-[#2b192e] transition">Registre-se</a>
              <a href="./login" className="bg-[#2b192e] text-[#f5e8da] px-4 py-2 rounded-lg hover:bg-[#2b192e] transition">Entrar</a>
            </div>
          </div>

          {/* Botão do Menu Responsivo */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#2b192e] text-2xl focus:outline-none">
              {isOpen ? '✖' : '☰'}
            </button>
          </div>
        </div>

        {/* Menu Dropdown Responsivo */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 text-[#2b192e] bg-[#f5e8da] p-4 rounded-lg shadow-lg">
            <a href="#" className="block hover:text-[#6c5ce7]">Home</a>
            <a href="/about" className="block hover:text-[#6c5ce7]">Sobre</a>
            <a href="/services" className="block bg-[#6c5ce7] text-white px-4 py-2 rounded-lg hover:bg-[#4b4de7] transition">Registre-se</a>
            <a href="./login" className="block bg-[#00b894] text-white px-4 py-2 rounded-lg hover:bg-[#009b74] transition">Entrar</a>
          </div>
        )}
      </nav>
    </>
  );
};


const About = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-12">
      {/* Imagem do lado esquerdo */}
      <div className="md:w-1/2 flex justify-start">
        <img src="sua-imagem.png" alt="Imagem ilustrativa" className="max-w-full h-auto" />
      </div>

      {/* Texto do lado direito */}
      <div className="md:w-1/2 text-left md:pl-12">
        <h2 className="text-4xl font-bold text-gray-900">Quem trabalha, adora.</h2>
        <p className="mt-4 text-gray-700">
          Otimize fluxos de trabalho e ganhe visibilidade por meio de soluções personalizáveis para projetos, CRM, TI e desenvolvimento de software.
        </p>
      </div>
    </section>
  );
};

// Criando um componente único que junta Navbar e About
const Home = () => {
  return (
    <div>
      <Navbar />
      <About />
    </div>
  );
};

export default Home;
