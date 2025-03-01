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

      {/* Navbar fixa no topo */}
      <nav className="bg-[#fff] p-4 fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo alinhada à esquerda */}
          <div className="flex-shrink-0">
            <a href="#">
              <img src="Logo com titulo.png" alt="Logo menu" className="h-12" /> {/* Ajuste o tamanho da logo conforme necessário */}
            </a>
          </div>

          {/* Links de Navegação para Desktop alinhados à direita */}
          <div className="hidden md:flex items-center space-x-8">
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
          <div className="md:hidden mt-4 space-y-4 text-[#2b192e] bg-[#fff] p-4 rounded-lg shadow-lg">
            <a href="#" className="block hover:text-[#2b192e]">Home</a>
            <a href="/about" className="block hover:text-[#2b192e]">Sobre</a>
            <a href="/services" className="block bg-[#9c47a6] text-white px-4 py-2 rounded-lg hover:bg-[#2b192e] transition">Registre-se</a>
            <a href="./login" className="block bg-[#56235f] text-white px-4 py-2 rounded-lg hover:bg-[#2b192e] transition">Entrar</a>
          </div>
        )}
      </nav>
    </>
  );
};

const Home = () => {
  return (
    <section className="flex flex-col md:flex-row-reverse items-center justify-center px-8 py-12 mt-16 min-h-screen"> {/* Centralizado e com altura mínima da tela */}
      {/* Imagem do lado direito (oculta em celulares) */}
      <div className="hidden md:flex md:w-1/2 justify-center"> {/* Ocultar em celulares e exibir em telas maiores */}
        <img src="Celular - home.png" alt="Imagem ilustrativa" className="max-w-full h-auto" />
      </div>

      {/* Texto centralizado */}
      <div className="md:w-1/2 text-center md:pr-12"> {/* Texto centralizado */}
        <h2 className="text-5xl font-bold text-gray-900">Gestão Inteligente para Resultados de Verdade</h2> {/* Fonte aumentada */}
        <p className="mt-6 text-gray-700 text-xl"> {/* Fonte aumentada */}
          Na ToDay, transformamos a complexidade da gestão empresarial em soluções simples e eficazes. Com tecnologia, estratégia e foco no crescimento, ajudamos sua empresa a prosperar todos os dias.
        </p>
        <div className="mt-8">
          <a href="./login" className="bg-[#56235f] text-[#fff] px-6 py-3 rounded-lg hover:bg-[#2b192e] transition text-lg">Entrar</a> {/* Botão com fonte aumentada */}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section className="bg-[#56235f] py-16 px-8"> {/* Fundo da mesma cor do botão "Entrar" */}
      <div className="container mx-auto text-center text-white"> {/* Centraliza o conteúdo e define texto branco */}
        <h2 className="text-4xl font-bold">Sobre Nós</h2>
        <p className="mt-6 text-xl max-w-2xl mx-auto"> {/* Limita a largura do texto para melhor leitura */}
          Na ToDay, estamos comprometidos em oferecer soluções inovadoras que ajudam empresas a alcançar seus objetivos de forma eficiente e eficaz. Nossa equipe de especialistas está sempre pronta para ajudar você a transformar desafios em oportunidades.
        </p>
      </div>
    </section>
  );
};

// Criando um componente único que junta Navbar, Home e About
const App = () => {
  return (
    <div>
      <Navbar />
      <Home />
      <About />
    </div>
  );
};

export default App;