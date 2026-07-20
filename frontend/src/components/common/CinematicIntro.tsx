import React, { useEffect, useRef, useState } from 'react';
import { School, Check, ChevronRight, Globe, Lock, Moon, Palette, Sun, X, Compass, Github, LogIn, Linkedin } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  // 1. Theme Detection
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [skipped, setSkipped] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSkipBtn, setShowSkipBtn] = useState(false);
  const isSkipping = useRef(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef(Date.now());
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Detect theme
    const savedMode = localStorage.getItem('vidyasanchar-theme');
    let initialMode: 'light' | 'dark' = 'dark';
    if (savedMode === 'light' || savedMode === 'dark') {
      initialMode = savedMode;
    } else {
      // Auto time-based theme
      const hour = new Date().getHours();
      initialMode = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    }
    setThemeMode(initialMode);

    // Disable scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Show skip button after 1 second
    const skipTimer = setTimeout(() => {
      setShowSkipBtn(true);
    }, 1000);

    // Auto complete intro after 2.5 seconds (then calls complete at 3.0s)
    const completeTimer = setTimeout(() => {
      if (!isSkipping.current) {
        isSkipping.current = true;
        setFadeOut(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 2500);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [onComplete]);

  // 2. Canvas Animation (Floating Particles, Volumetric Beams, Dispersion)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic coloring based on Light vs Dark theme
    const particleColor = themeMode === 'dark' ? '#c084fc' : '#3b82f6'; // purple vs blue
    const accentColor = themeMode === 'dark' ? '#60a5fa' : '#818cf8';   // blue vs indigo

    // Particle class
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      fadeSpeed: number;
      color: string;
    }

    const particles: Particle[] = [];
    const maxParticles = 65;

    const createParticle = (fromCenter = false): Particle => {
      const radius = Math.random() * 2 + 0.5;
      
      // Volumetric dispersion starting coordinates
      let x = Math.random() * width;
      let y = Math.random() * height;

      if (fromCenter) {
        // Start within center stage energy circle
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 45;
        x = width / 2 + Math.cos(angle) * dist;
        y = height / 2 + Math.sin(angle) * dist - 30; // slightly offset upward
      }

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(Math.random() * 0.8 + 0.25), // float upward
        radius,
        alpha: Math.random() * 0.65 + 0.2,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        color: Math.random() > 0.4 ? particleColor : accentColor,
      };
    };

    // Pre-populate particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(false));
    }

    let isDispersing = false;
    let dispersionStart = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Soft volumetric light rays (drift effect)
      const time = (Date.now() - startTimeRef.current) * 0.0006;
      const lightX = width / 2 + Math.sin(time * 0.5) * 45;
      const lightY = height / 2 - 30 + Math.cos(time * 0.3) * 20;

      // Draw light beams
      const gradient = ctx.createRadialGradient(
        lightX, lightY, 0,
        lightX, lightY, Math.min(width, height) * 0.45
      );
      if (themeMode === 'dark') {
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0.08)');
        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.03)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.06)');
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.02)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const elapsed = Date.now() - startTimeRef.current;
      
      // Trigger dispersion blast at 2.4s (or on skip)
      if ((elapsed >= 2400 || skipped) && !isDispersing) {
        isDispersing = true;
        dispersionStart = elapsed;
      }

      particles.forEach((p, idx) => {
        // Update physics
        if (isDispersing) {
          const dx = p.x - width / 2;
          const dy = p.y - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          // Apply outward blast velocity
          const force = 10 / (dist / 120 + 1);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          p.radius += 0.05;
          p.alpha -= 0.025; // dissolve faster
        } else {
          // Drifts upward slowly
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.fadeSpeed;
        }

        // Render
        if (p.alpha > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          
          // Glow effect on particles
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.5, p.color + '88');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Recycle particles (if not dispersing)
        if (!isDispersing && (p.alpha <= 0 || p.y < -10 || p.x < -10 || p.x > width + 10)) {
          particles[idx] = createParticle(elapsed > 800); // Spawns from center ring after 0.8s
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResizeWrapper = () => {
      handleResize();
    };

    return () => {
      window.removeEventListener('resize', handleResizeWrapper);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [themeMode, skipped]);

  // 3. Skip Action Handler
  const handleSkip = () => {
    if (isSkipping.current) return;
    isSkipping.current = true;
    setSkipped(true);
    // Instant fadeout
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const isDark = themeMode === 'dark';

  return (
    <div 
      className={`fixed inset-0 w-full h-full z-[9999] flex flex-col justify-center items-center overflow-hidden transition-all select-none duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${
        isDark 
          ? 'bg-gradient-to-b from-[#02040a] via-[#090b14] to-[#050816] text-[#F9FAFB]' 
          : 'bg-gradient-to-b from-[#f8fafc] via-[#e2e8f0] to-[#f1f5f9] text-[#1e293b]'
      }`}
    >
      {/* 60 FPS CSS Definitions for Premium Cinematic Experience */}
      <style>{`
        /* Responsive logo size variables */
        :root {
          --logo-size: 90px;
        }
        @media (min-width: 768px) {
          :root {
            --logo-size: 110px;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --logo-size: 130px;
          }
        }
        @media (min-width: 1280px) {
          :root {
            --logo-size: 140px;
          }
        }

        /* Stage 1: Circular Energy Ring Drawing */
        @keyframes ring-draw {
          from { stroke-dashoffset: 283; transform: rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          to { stroke-dashoffset: 0; transform: rotate(180deg); opacity: 0; }
        }
        .stage1-ring {
          animation: ring-draw 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transform-origin: center;
          animation-delay: 0s;
        }

        /* Stage 2: Volumetric Soft Ambient Glow */
        @keyframes center-glow {
          0% { opacity: 0; transform: scale(0.6); }
          50% { opacity: 0.75; transform: scale(1.05); }
          100% { opacity: 0.45; transform: scale(1); }
        }
        .stage1-glow {
          animation: center-glow 2.5s ease-in-out forwards;
          animation-delay: 0s;
        }

        /* Stage 2: Logo Reveal Animations with Nested Wrappers to Avoid Transform Clash */
        @keyframes logo-reveal {
          0% { opacity: 0; transform: scale(0.75) rotateY(15deg); filter: blur(5px); }
          100% { opacity: 1; transform: scale(1) rotateY(0deg); filter: blur(0); }
        }
        @keyframes logo-float {
          0%, 100% { transform: translateY(0px) rotateY(-2deg) rotateX(1deg); }
          50% { transform: translateY(-8px) rotateY(3deg) rotateX(-2deg); }
        }
        .logo-reveal-container {
          opacity: 0;
          animation: logo-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0s;
          will-change: transform, opacity;
          z-index: 20;
        }
        .logo-float-container {
          animation: logo-float 3s ease-in-out infinite alternate;
          animation-delay: 0.8s;
          transform-origin: center;
        }

        /* Metallic shine sweep overlay */
        @keyframes shine-sweep {
          0% { transform: translateX(-150%) skewX(-30deg); }
          100% { transform: translateX(150%) skewX(-30deg); }
        }
        .metallic-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 35%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 65%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-100%);
          animation: shine-sweep 2.0s ease-in-out infinite;
          animation-delay: 1.2s;
        }

        /* Sequential Text Reveals */
        @keyframes fade-up-sharp {
          0% { opacity: 0; transform: translateY(12px); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        
        .intro-title {
          opacity: 0;
          animation: fade-up-sharp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.8s;
          will-change: transform, opacity, filter;
        }
        .intro-title h1 {
          font-weight: 800;
          font-size: 36px;
          line-height: 1.1;
        }
        @media (min-width: 768px) {
          .intro-title h1 {
            font-size: 52px;
          }
        }
        @media (min-width: 1024px) {
          .intro-title h1 {
            font-size: 64px;
          }
        }
        
        .intro-subtitle {
          opacity: 0;
          animation: fade-up-sharp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 1.0s;
          will-change: transform, opacity, filter;
        }

        .intro-techstack {
          opacity: 0;
          animation: fade-up-sharp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 1.8s;
          will-change: transform, opacity, filter;
        }

        /* Stage 4: Final Logo Blast/Pulse */
        @keyframes logo-pulse {
          0% { transform: scale(1); filter: brightness(1); }
          30% { transform: scale(1.1); filter: brightness(1.6) drop-shadow(0 0 20px ${isDark ? 'rgba(192, 132, 252, 0.7)' : 'rgba(59, 130, 246, 0.7)'}); }
          100% { transform: scale(0.9); filter: brightness(0); opacity: 0; }
        }
        .logo-box.skipped-blast {
          animation: logo-pulse 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        }
        .logo-box.natural-blast {
          animation: logo-pulse 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 2.4s;
        }
      `}</style>

      {/* Background Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Volumetric Center Ambient Lighting */}
      <div 
        className={`absolute top-[45%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] rounded-full blur-[90px] sm:blur-[130px] pointer-events-none mix-blend-screen stage1-glow z-0 ${
          isDark ? 'bg-purple-600/15' : 'bg-blue-400/10'
        }`} 
      />

      {/* Top Right Skip Button */}
      {showSkipBtn && (
        <button
          onClick={handleSkip}
          className={`absolute top-6 right-6 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full border shadow-sm transition-all duration-300 z-50 hover:scale-105 active:scale-95 flex items-center gap-1.5 focus:outline-none focus:ring-1 ${
            isDark 
              ? 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-purple-500/50' 
              : 'bg-black/5 border-black/10 text-black/70 hover:text-black hover:bg-black/10 hover:border-blue-500/50'
          }`}
        >
          <span>Skip Intro</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Cinematic Center Stage */}
      <div className="relative flex flex-col items-center justify-center text-center z-10 -translate-y-8 md:-translate-y-12 scale-90 sm:scale-100">
        
        {/* Stage 1: Circle Energy Ring Overlay */}
        <svg 
          className="w-44 h-44 absolute pointer-events-none select-none z-0" 
          viewBox="0 0 100 100"
        >
          <circle 
            cx="50" 
            cy="50" 
            r="44" 
            stroke={isDark ? 'url(#ring-glow-dark)' : 'url(#ring-glow-light)'} 
            strokeWidth="1.5" 
            fill="none" 
            strokeDasharray="283"
            strokeDashoffset="283"
            className="stage1-ring"
          />
          <defs>
            <linearGradient id="ring-glow-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ring-glow-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Stage 2 & 4: Logo Container (With Nested Animation Wrappers) */}
        <div className="logo-reveal-container">
          <div className="logo-float-container">
            <div 
              className={`logo-box relative rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-5 border border-white/10 ${
                skipped 
                  ? 'skipped-blast' 
                  : 'natural-blast'
              } ${
                isDark 
                  ? 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl' 
                  : 'bg-gradient-to-br from-slate-200/50 to-slate-100/30 backdrop-blur-xl border-black/10'
              }`}
              style={{
                width: 'var(--logo-size)',
                height: 'var(--logo-size)',
              }}
            >
              {/* Internal reflection shine sweeps */}
              <div className="metallic-shine" />

              {/* Logo Symbol (Official School emblem) */}
              <School className="w-1/2 h-1/2 text-primary relative z-10 filter drop-shadow-[0_0_12px_rgba(124,58,237,0.35)]" />
            </div>
          </div>
        </div>

        {/* Title: mt-6 represents refined 24px spacing */}
        <div className="intro-title mt-6">
          <h1 className={`font-extrabold tracking-tight font-sans ${
            isDark 
              ? 'text-white drop-shadow-[0_0_15px_rgba(192,132,252,0.45)]' 
              : 'text-slate-900 drop-shadow-[0_0_15px_rgba(59,130,246,0.35)]'
          }`}>
            Vidya Sanchar
          </h1>
        </div>

        {/* Subtitle: mt-2.5 represents refined 10px spacing */}
        <div className="intro-subtitle mt-2.5">
          <span className="text-xs sm:text-sm font-medium tracking-[0.25em] uppercase text-purple-600 dark:text-purple-400">
            Modern School ERP
          </span>
        </div>

        {/* Tech Stack Info: mt-5 represents refined 20px spacing */}
        <div className="intro-techstack mt-5 flex flex-col items-center">
          <span className={`text-[9px] sm:text-[10px] font-black tracking-widest uppercase mb-1.5 ${
            isDark ? 'text-gray-500' : 'text-slate-400'
          }`}>
            Technology Architecture
          </span>
          <p className={`text-xs font-semibold max-w-sm sm:max-w-md leading-relaxed tracking-wider font-sans ${
            isDark ? 'text-gray-300' : 'text-slate-700'
          }`}>
            React <span className="text-purple-500/70">•</span> TypeScript <span className="text-purple-500/70">•</span> Node.js <span className="text-purple-500/70">•</span> PostgreSQL <span className="text-purple-500/70">•</span> Prisma
          </p>
        </div>

      </div>

      {/* Glossy Reflective Floor (Realistic Logo Mirror Effect) */}
      <div className="absolute bottom-0 left-0 right-0 h-[22vh] pointer-events-none overflow-hidden select-none z-5">
        {/* Mirror Line */}
        <div className={`w-full h-px bg-gradient-to-r from-transparent ${
          isDark ? 'via-white/10' : 'via-black/10'
        } to-transparent`} />
        
        {/* Reflected upside-down elements aligned visually */}
        <div className="flex flex-col items-center justify-start pt-4 scale-y-[-1] origin-top opacity-15 pointer-events-none select-none filter blur-[1.5px] -translate-y-8 md:-translate-y-12 scale-90 sm:scale-100">
          
          {/* Reflected Logo */}
          <div 
            className={`rounded-3xl flex items-center justify-center p-5 border border-white/5 ${
              isDark ? 'bg-white/5' : 'bg-black/5'
            }`}
            style={{
              width: 'var(--logo-size)',
              height: 'var(--logo-size)',
            }}
          >
            <School className="w-1/2 h-1/2 text-primary" />
          </div>

          {/* Reflected Title */}
          <div className="mt-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sans">
              Vidya Sanchar
            </h1>
          </div>
        </div>

        {/* Mirror Floor Gloss/Gradient overlay fading to background */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-transparent ${
            isDark 
              ? 'via-[#02040a]/70 to-[#02040a]' 
              : 'via-[#f8fafc]/70 to-[#f8fafc]'
          }`} 
        />
      </div>

    </div>
  );
};
