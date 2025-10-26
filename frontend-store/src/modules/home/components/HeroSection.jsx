import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function HeroSection() {
  const navigate = useNavigate();
  const [currentPhrase, setCurrentPhrase] = useState(0);

  const phrases = [
    "Comercio Online",
    "Compras Inteligentes",
    "Mejores Precios",
    "Calidad Garantizada",
    "Envíos Rápidos",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [phrases.length]);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesConfig = {
    fullScreen: { enable: false },
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 120,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.4,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 100,
      },
      opacity: {
        value: 0.6,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 4 },
      },
    },
    detectRetina: true,
  };

  return (
    <section className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white py-16 overflow-hidden">
      {/* Partículas de fondo */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesConfig}
          className="w-full h-full"
        />
      </div>

      {/* Círculos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* Contenido del Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-2xl">
          Descubre el Futuro del
          <span
            key={currentPhrase}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-yellow-200 mt-2 animate-phrase-change"
          >
            {phrases[currentPhrase]}
          </span>
        </h1>
      </div>
    </section>
  );
}
