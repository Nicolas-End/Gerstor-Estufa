"use client";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import AOS from "aos";
import './style.css';
import "aos/dist/aos.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AOS_DURATION = 700;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="style.css" />
      </Head>

      <nav className="bg-[#0a2c26] p-4 fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2 flex items-center justify-center shadow-md">
                <img src="Logo.png" alt="Logo menu" className="h-12 w-12 object-contain" />
              </div>
              <span className="text-white font-extrabold text-xl">
                Controle <span className="text-green-400">Verde</span>
              </span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-[#fff] font-bold hover:text-[#115a4d]">Home</a>
            <a href="/about" className="text-[#fff] font-bold hover:text-[#115a4d]">Projeto</a>
            <a href="/creators" className="text-[#fff] font-bold hover:text-[#115a4d]">Criadores</a>
            <div className="flex space-x-4">
              <a href="./register" className="bg-[#fff] text-[#0a2c26] font-bold px-4 py-2 rounded-lg hover:bg-[#115a4d] hover:text-white transition">Registre-se</a>
              <a href="./home" className="bg-[#fff] text-[#0a2c26] font-bold px-4 py-2 rounded-lg hover:bg-[#115a4d] hover:text-white transition">Entrar</a>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#fff] text-2xl focus:outline-none">
              {isOpen ? (
                <i className="fas fa-x"></i>
              ) : (
                <i className="fas fa-bars"></i>
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 text-[#0a2c26] font-bold bg-[#fff] p-4 rounded-lg shadow-lg">
            <a href="#" className="block hover:text-[#115a4d]">Home</a>
            <a href="/about" className="block hover:text-[#115a4d]">Projeto</a>
            <a href="/creators" className="block hover:text-[#115a4d]">Criadores</a>
            <a href="/services" className="block bg-[#0a2c26] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#115a4d] transition">Registre-se</a>
            <a href="./home" className="block bg-[#0a2c26] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#115a4d] transition">Entrar</a>
          </div>
        )}
      </nav>
    </>
  );
};

const Home = () => {
  return (
    <section
      className="relative flex flex-col md:flex-row-reverse items-center justify-center px-8 py-12 mt-16 min-h-screen"
    >
      {/* Fundo com a imagem Onda Verde */}
      <img
        src="Onda Verde.png"
        alt="Onda Verde"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />

      {/* Imagem*/}
      <div className="hidden md:flex md:w-1/2 justify-center" data-aos="fade-up">
        <img src="Logo.png" alt="Imagem ilustrativa" className="max-w-full h-auto animate-float" />
      </div>

      {/* Card verde*/}
      <div className="md:w-1/2 flex justify-center md:justify-start">
        <div
          role="region"
          aria-label="Apresentação Controle Verde"
          data-aos="fade-right"
          className="bg-[rgba(98,172,13,0.45)] border border-[rgba(98,172,13,0.45)] rounded-2xl p-9 max-w-[520px] w-full shadow-lg flex flex-col justify-center items-start text-[#04291f] md:items-start md:text-left text-center mx-auto"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <h2 className="text-5xl font-bold leading-tight">
            Gestão Inteligente para Resultados de Verdade
          </h2>

          <p className="mt-6 text-xl text-[#0f2e24]">
            No Controle Verde, simplificamos a logística de estufas, gerenciando entregas de flores, hortaliças e alimentos com tecnologia e precisão.
          </p>

          <div className="mt-8 flex justify-center w-full">
            <a
              href="./home"
              className="inline-block bg-[#0a2c26] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#115a4d] transition transform hover:-translate-y-1"
            >
              Entrar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    AOS.init({ duration: AOS_DURATION, once: true, easing: "ease-in-out" });

    const onResize = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      setIsMobile(mobile);
    };

    onResize(); // checa na primeira renderização
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section className="bg-[#e0edba] py-16 px-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Imagem só no desktop */}
          {!isMobile && (
            <div
              className="md:w-1/2 flex justify-center md:justify-start"
              data-aos="fade-right"
            >
              <img
                src="/estufa.png"
                alt="Estufa"
                className="w-[800px] max-w-full h-auto rounded-2xl"
              />
            </div>
          )}

          {/* Conteúdo principal */}
          <div
            className="w-full md:w-1/2 flex flex-col justify-center md:justify-end gap-6"
            data-aos="fade-left"
          >
            {/* Título "Empresa" só no mobile */}
            {isMobile && (
              <div
                className="bg-[rgba(98,172,13,0.45)] border border-[rgba(98,172,13,0.45)] rounded-2xl p-4 w-full shadow-md text-[#04291f] text-center font-bold text-2xl"
                style={{ backdropFilter: "blur(2px)" }}
              >
                <h3 className="text-2xl font-bold text-[28px] text-center">
                  Visão geral do projeto
                </h3>
              </div>
            )}

            {/* Card */}
            <div
              className="bg-[rgba(98,172,13,0.45)] border border-[rgba(98,172,13,0.45)] rounded-2xl p-8 max-w-[560px] w-full shadow-lg text-[#04291f]"
              style={{ backdropFilter: "blur(2px)" }}
              role="article"
              aria-label="Card sobre o projeto Controle Verde"
            >
              <div className=" hidden md:block">
                <h3 className="text-2xl font-bold mb-4 text-[28px] text-center">
                  Visão geral do projeto
                </h3>
              </div>
              <p className="text-base leading-relaxed mb-4 text-[20px] md:text-[24px]">
                O projeto foi desenvolvido dentro da ETEC Pedro Ferreira Alves,
                como parte do Trabalho de Conclusão de Curso (TCC), com o
                propósito de desenvolver uma solução prática e inovadora para
                atender às necessidades das estufas de pequeno e médio porte da
                região de Holambra.
              </p>
              <p className="text-base leading-relaxed mb-4 text-[20px] md:text-[24px]">
                Identificamos que muitos produtores enfrentam desafios no
                gerenciamento de pedidos e entregas, o que impacta diretamente
                na organização, no tempo e na produtividade. Pensando nisso,
                criamos um sistema digital simples, eficiente e acessível, capaz
                de automatizar processos, reduzir erros e oferecer maior
                controle das operações do dia a dia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div>
      <Navbar />
      <Home />
      <About />
    </div>
  );
};

export default App;