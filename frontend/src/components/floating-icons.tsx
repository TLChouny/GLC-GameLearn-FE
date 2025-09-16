import React from 'react';

export const FloatingIcons: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating icons with different animations and positions */}
      <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">🎈</div>
      <div className="absolute top-40 right-20 text-3xl animate-bounce-gentle animate-delay-200 opacity-15">🎪</div>
      <div className="absolute top-60 left-1/4 text-5xl animate-wiggle animate-delay-300 opacity-10">🎨</div>
      <div className="absolute top-80 right-1/3 text-2xl animate-float animate-delay-100 opacity-25">🎭</div>
      <div className="absolute top-96 left-1/2 text-6xl animate-bounce-gentle animate-delay-500 opacity-5">🎪</div>
      
      <div className="absolute bottom-40 left-20 text-4xl animate-wiggle animate-delay-200 opacity-20">🎯</div>
      <div className="absolute bottom-60 right-10 text-3xl animate-float animate-delay-300 opacity-15">🎲</div>
      <div className="absolute bottom-80 left-1/3 text-5xl animate-bounce-gentle animate-delay-100 opacity-10">🎮</div>
      <div className="absolute bottom-96 right-1/4 text-2xl animate-wiggle animate-delay-500 opacity-25">🎪</div>
      
      {/* Center floating elements */}
      <div className="absolute top-1/2 left-1/4 text-3xl animate-float animate-delay-200 opacity-10">🌟</div>
      <div className="absolute top-1/3 right-1/4 text-4xl animate-bounce-gentle animate-delay-300 opacity-15">✨</div>
      <div className="absolute bottom-1/3 left-1/5 text-2xl animate-wiggle animate-delay-100 opacity-20">🎊</div>
      <div className="absolute bottom-1/2 right-1/5 text-5xl animate-float animate-delay-500 opacity-5">🎉</div>
    </div>
  );
};