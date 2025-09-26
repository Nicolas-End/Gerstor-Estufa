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
            <a href="#home" className="text-[#fff] font-bold hover:text-[#115a4d]">Home</a>
            <a href="#projeto" className="text-[#fff] font-bold hover:text-[#115a4d]">Projeto</a>
            <a href="#criadores" className="text-[#fff] font-bold hover:text-[#115a4d]">Criadores</a>
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
            <a href="#home" className="block hover:text-[#115a4d]">Home</a>
            <a href="#projeto" className="block hover:text-[#115a4d]">Projeto</a>
            <a href="#criadores" className="block hover:text-[#115a4d]">Criadores</a>
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
      id="home"
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
    <section className="bg-[#e0edba] py-16 px-8" id="projeto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Imagem só no desktop */}
          {!isMobile && (
            <div
              className="md:w-1/2 flex justify-center md:justify-start md:mr-[300px]"
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

function MobileTeamCarousel(): React.ReactElement {
  const team = [
    { file: "Digão.jpeg", name: "Digão", role: "Design" },
    { file: "Torreli.jpeg", name: "Torreli", role: "Analista" },
    { file: "Mathias.jpeg", name: "Mathias", role: "Programador" },
    { file: "Giovani.jpeg", name: "Giovani", role: "Analista" },
    { file: "Nicolas.jpeg", name: "Nicolas", role: "Programador" },
    { file: "Luis.jpeg", name: "Luis", role: "Programador" },
    { file: "Luan.jpeg", name: "Luan", role: "Design" },
  ];

  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef<number | null>(null);
  const deltaXRef = useRef<number>(0);

  const next = () => setIndex((i) => (i + 1) % team.length);
  const prev = () => setIndex((i) => (i - 1 + team.length) % team.length);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      startXRef.current = e.touches[0].clientX;
      deltaXRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startXRef.current == null) return;
      const current = e.touches[0].clientX;
      deltaXRef.current = current - startXRef.current;
      if (Math.abs(deltaXRef.current) > 10) e.preventDefault();
    };

    const onTouchEnd = () => {
      const d = deltaXRef.current;
      if (d > 50) prev();
      else if (d < -50) next();
      startXRef.current = null;
      deltaXRef.current = 0;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart as any);
      el.removeEventListener("touchmove", onTouchMove as any);
      el.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [team.length]);

  return (
    <div className="block md:hidden px-4 py-8" aria-label="Carrossel polaroid da equipe">
      <h3 className="text-center text-2xl font-semibold text-[#04291f] mb-6">Equipe</h3>

      <div className="relative">
        <div ref={containerRef} className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }} role="list" aria-live="polite">
            {team.map((m, i) => {
              const rot = i % 3 === 0 ? -6 : i % 3 === 1 ? 4 : -2;

              return (
                <div role="listitem" key={m.name} className="w-full flex-shrink-0 px-6" aria-hidden={i !== index}>
                  <div className="mx-auto max-w-xs">
                    <div className="bg-white rounded-xl shadow-2xl p-4 transform" style={{ transform: `rotate(${rot}deg)`, boxShadow: "0 18px 40px rgba(6,22,17,0.18)" }}>
                      <div className="bg-white border border-gray-200 rounded-md overflow-hidden relative" style={{ padding: "6px" }}>
                        <div className="bg-white polaroid-frame overflow-hidden rounded-sm">
                          <img src={`/${m.file}`} alt={`${m.name} - ${m.role}`} className="w-full h-64 object-cover rounded-sm block" loading="lazy" />
                        </div>

                        <div className="mt-3 text-center">
                          <div className="text-lg font-bold text-[#04291f]">{m.name}</div>
                          <div className="text-sm text-gray-600">{m.role}</div>
                        </div>

                        <div className="mt-4 text-xs text-center text-gray-500">Contribuição no projeto</div>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <button aria-label="Ver anterior" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 shadow-md mr-4" onClick={prev} type="button">‹</button>

                      <button aria-label="Ver próximo" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 shadow-md" onClick={next} type="button">›</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {team.map((_, i) => (
            <button key={i} aria-label={`Ir para ${i + 1}`} onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full ${i === index ? "bg-[#04291f]" : "bg-gray-300"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

const TeamSection: React.FC = () => {
  const team = [
    { file: "Digão.jpeg", name: "Digão", role: "Design" },
    { file: "Torreli.jpeg", name: "Torreli", role: "Analista" },
    { file: "Mathias.jpeg", name: "Mathias", role: "Programador" },
    { file: "Giovani.jpeg", name: "Giovani", role: "Analista" },
    { file: "Nicolas.jpeg", name: "Nicolas", role: "Programador" },
    { file: "Luis.jpeg", name: "Luis", role: "Programador" },
    { file: "Luan.jpeg", name: "Luan", role: "Design" },
  ];

  return (
    <section id="criadores" className="bg-[#bdd96b] py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#04291f] mb-8">Equipe</h2>

        {/* Mobile: carrossel */}
        <div className="block md:hidden">
          <MobileTeamCarousel />
        </div>

        {/* Desktop: grade */}
        <div className="hidden md:flex flex-wrap md:flex-nowrap justify-center gap-8 md:gap-10 items-start">
          {team.map((member, idx) => {
            const aos = idx % 2 === 0 ? "fade-down" : "fade-up";
            return (
              <div key={member.name} data-aos={aos} className="flex flex-col items-center w-40 md:w-48 text-center">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden shadow-md team-photo-hover">
                  <img src={`/${member.file}`} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                </div>

                <div className="mt-3">
                  <div className="text-lg font-semibold text-[#04291f]">{member.name}</div>
                  <div className="text-sm text-gray-600">{member.role}</div>
                </div>
              </div>
            );
          })}
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
      <TeamSection />
    </div>
  );
};

export default App;