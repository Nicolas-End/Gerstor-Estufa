"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-free/css/all.min.css';

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

      <nav className="bg-[#fff] p-4">
        <div className="container flex items-center justify-between">
          {/* Logo alinhada à esquerda */}
          <div className="flex-shrink-0">
            <a href="#">
              <img src="Logo com titulo.png" alt="Logo menu" className="h-12" /> {/* Ajuste o tamanho da logo conforme necessário */}
            </a>
          </div>

          {/* Links de Navegação para Desktop alinhados à direita */}
          <div className="hidden md:flex items-center space-x-8 ml-auto"> {/* ml-auto empurra os botões para a direita */}
            <a href="#" className="text-[#2b192e] hover:text-[#9c47a6] fontPop">Home</a>
            <a href="/about" className="text-[#2b192e] hover:text-[#9c47a6] fontPop">Sobre</a>
            <div className="flex space-x-4">
              <a href="./register" className="bg-[#9c47a6] text-[#fff] px-4 py-2 rounded-lg hover:bg-[#56235f] transition">Registre-se</a>
              <a href="./login" className="bg-[#56235f] text-[#fff] px-4 py-2 rounded-lg hover:bg-[#2b192e] transition">Entrar</a>
            </div>
          </div>

          {/* Botão do Menu Responsivo */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#2b192e] text-2xl focus:outline-none">
              {isOpen ? (
                <i className="fas fa-x"></i> // Ícone de fechar (fa-x)
              ) : (
                <i className="fas fa-bars"></i> // Ícone de abrir (fa-bars)
              )}
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