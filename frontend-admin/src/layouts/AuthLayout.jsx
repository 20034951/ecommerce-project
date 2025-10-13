import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext.jsx';

function AuthLayoutContent() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary floating shapes */}
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-30 blur-3xl transition-all duration-1000 ${
          isDarkMode ? 'bg-blue-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'
        } animate-pulse`} 
        style={{
          animationDelay: '0s',
          animationDuration: '4s'
        }} />
        
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-30 blur-3xl transition-all duration-1000 ${
          isDarkMode ? 'bg-purple-500' : 'bg-gradient-to-br from-purple-400 to-pink-500'
        } animate-pulse`}
        style={{
          animationDelay: '2s',
          animationDuration: '5s'
        }} />

        {/* Secondary floating shapes */}
        <div className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-25 blur-2xl transition-all duration-1000 ${
          isDarkMode ? 'bg-indigo-400' : 'bg-gradient-to-br from-indigo-300 to-blue-400'
        } animate-bounce`}
        style={{
          animationDelay: '1s',
          animationDuration: '6s'
        }} />

        <div className={`absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full opacity-30 blur-xl transition-all duration-1000 ${
          isDarkMode ? 'bg-pink-400' : 'bg-gradient-to-br from-pink-300 to-rose-400'
        } animate-pulse`}
        style={{
          animationDelay: '3s',
          animationDuration: '7s'
        }} />

        {/* Subtle grid pattern */}
        <div className={`absolute inset-0 transition-all duration-1000 ${
          isDarkMode ? 'opacity-5 bg-white' : 'opacity-15 bg-gray-600'
        }`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />

        {/* Gradient overlay for depth */}
        <div className={`absolute inset-0 transition-all duration-1000 ${
          isDarkMode 
            ? 'bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/30' 
            : 'bg-gradient-to-t from-white/70 via-transparent to-blue-100/50'
        }`} />
      </div>

      {/* Content container with glassmorphism effect */}
      <div className={`relative z-10 w-full max-w-md backdrop-blur-sm rounded-3xl p-1 transition-all duration-500 max-h-[90vh] overflow-y-auto scrollbar-hide ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800/20 to-gray-900/20 shadow-2xl shadow-black/50' 
          : 'bg-gradient-to-br from-white/60 to-blue-100/40 shadow-2xl shadow-blue-500/20'
      }`}>
        <div className={`rounded-3xl transition-all duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/60' 
            : 'bg-gradient-to-br from-white/90 to-blue-50/80'
        } backdrop-blur-md`}>
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full opacity-40 transition-colors duration-1000 ${
              isDarkMode ? 'bg-blue-400' : 'bg-blue-700'
            }`}
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${10 + (i * 12)}%`,
              animation: `floatParticle${i} ${3 + (i * 0.5)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Global styles for animations and scrollbar hiding */}
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          @keyframes floatParticle0 {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
            25% { transform: translateY(-10px) translateX(5px); opacity: 0.5; }
            50% { transform: translateY(-20px) translateX(-5px); opacity: 0.3; }
            75% { transform: translateY(-10px) translateX(3px); opacity: 0.6; }
          }
          @keyframes floatParticle1 {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
            25% { transform: translateY(-12px) translateX(3px); opacity: 0.6; }
            50% { transform: translateY(-18px) translateX(-7px); opacity: 0.2; }
            75% { transform: translateY(-8px) translateX(4px); opacity: 0.5; }
          }
          @keyframes floatParticle2 {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
            25% { transform: translateY(-8px) translateX(6px); opacity: 0.4; }
            50% { transform: translateY(-15px) translateX(-3px); opacity: 0.5; }
            75% { transform: translateY(-12px) translateX(2px); opacity: 0.3; }
          }
          @keyframes floatParticle3 {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.5; }
            25% { transform: translateY(-14px) translateX(4px); opacity: 0.3; }
            50% { transform: translateY(-22px) translateX(-6px); opacity: 0.4; }
            75% { transform: translateY(-9px) translateX(5px); opacity: 0.6; }
          }
          @keyframes floatParticle4 {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
            25% { transform: translateY(-11px) translateX(7px); opacity: 0.5; }
            50% { transform: translateY(-19px) translateX(-4px); opacity: 0.2; }
            75% { transform: translateY(-13px) translateX(3px); opacity: 0.4; }
          }
          @keyframes floatParticle5 {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
            25% { transform: translateY(-9px) translateX(2px); opacity: 0.6; }
            50% { transform: translateY(-16px) translateX(-8px); opacity: 0.3; }
            75% { transform: translateY(-11px) translateX(6px); opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}

export function AuthLayout() {
  return (
    <ThemeProvider>
      <AuthLayoutContent />
    </ThemeProvider>
  );
}