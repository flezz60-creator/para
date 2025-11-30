import React, { useState, useEffect, useRef } from 'react';

// Robuste URLs für den Zelda/Cozy Look
const PERMANENT_SKY_URL = "https://images.unsplash.com/photo-1622359051390-4d5154d89d41?q=80&w=2574&auto=format&fit=crop"; 
// Alternative für die Insel: Ein Felsen/Berg, der sich gut freistellen lässt durch die Maske
const PERMANENT_ISLAND_URL = "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

const FloatingIslandSection: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalHeight = rect.height;
      
      // Berechne Fortschritt relativ zur Sektion (0 am Start, 1 am Ende)
      // Wir starten bei top: 0
      const scrollY = -rect.top;
      const maxScroll = totalHeight - viewportHeight;
      
      if (maxScroll <= 0) return;

      // Clamping zwischen 0 und 1
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Outer Container: Definiert die Scroll-Länge (Track)
    <div 
      ref={containerRef} 
      className="relative w-full h-[200vh] bg-[#0f172a]"
    >
      {/* Sticky Container: Das "Fenster", das stehen bleibt */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* 1. Hintergrund (Himmel) */}
        <div 
          className="absolute inset-0 w-full h-full bg-sky-300"
          style={{
            backgroundImage: `url(${PERMANENT_SKY_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${1 + scrollProgress * 0.2})`, // Leichter Zoom
            transition: 'transform 0.1s linear',
            willChange: 'transform'
          }}
        />

        {/* 2. Vordergrund (Insel) */}
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
        >
          <div 
            className="relative w-[70vmin] h-[70vmin] transition-transform duration-100 ease-linear animate-float"
            style={{
              // Parallax Zoom & Bewegung auf den Nutzer zu
              transform: `scale(${0.8 + (scrollProgress * 2.5)}) translateY(${scrollProgress * 100}px)`, 
            }}
          >
            {/* Bild-Container mit Maske */}
            <img 
              src={PERMANENT_ISLAND_URL} 
              alt="Floating Island" 
              className="w-full h-full object-cover"
              style={{
                // Weiche, runde Maske für den "Insel"-Look
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6)) contrast(1.1)'
              }}
              onError={(e) => {
                // Fallback falls Bild nicht lädt
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.backgroundColor = '#4ade80'; // Grüner Fallback
                e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-black font-bold text-2xl">Insel Grafik</div>';
              }}
            />
          </div>
        </div>

        {/* Text Overlay (fadet aus) */}
        <div 
          className="absolute bottom-20 left-0 right-0 flex justify-center z-20 pointer-events-none transition-opacity duration-300"
          style={{ opacity: 1 - scrollProgress * 2 }}
        >
          <div className="text-center bg-black/30 backdrop-blur-md p-8 rounded-2xl border border-white/10 max-w-lg mx-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white font-serif mb-2 text-shadow-lg">
              Die Schwebende Welt
            </h1>
            <p className="text-blue-100 text-lg">
              Scrolle nach unten, um einzutauchen
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .text-shadow-lg {
          text-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

export default FloatingIslandSection;