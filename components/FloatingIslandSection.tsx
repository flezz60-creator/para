import React, { useState, useEffect, useRef } from 'react';
import { generateDreamImage } from '../services/geminiService';

const FloatingIslandSection: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [islandImage, setIslandImage] = useState<string | null>(null);
  const [skyImage, setSkyImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Feste Prompts für exakt den gewünschten Look
  const ISLAND_PROMPT = "isometric view of a magical floating island with a waterfall falling down into void, a small cozy cottage house with smoke from chimney, a large green oak tree with a tire swing, zelda breath of the wild art style, cozy cartoon, soft lighting, 3d render style, isolated on white background, high detail, masterpiece";
  const SKY_PROMPT = "anime style blue sky with fluffy white cumulus clouds, zelda breath of the wild art style, cozy, bright, sunny day, wide angle, panoramic";

  useEffect(() => {
    const loadPermanentAssets = async () => {
      // 1. Prüfen, ob wir die Bilder schon "fest" gespeichert haben
      const savedIsland = localStorage.getItem('traumwelten_island_v3');
      const savedSky = localStorage.getItem('traumwelten_sky_v3');

      if (savedIsland && savedSky) {
        setIslandImage(savedIsland);
        setSkyImage(savedSky);
        setLoading(false);
        return;
      }

      // 2. Wenn nicht, generieren wir sie EINMALIG exakt nach Vorgabe
      try {
        // Wir starten beide Generierungen parallel für Speed
        const [generatedIsland, generatedSky] = await Promise.all([
          generateDreamImage(ISLAND_PROMPT, { aspectRatio: "1:1" }),
          generateDreamImage(SKY_PROMPT, { aspectRatio: "16:9" })
        ]);

        if (generatedIsland) {
          localStorage.setItem('traumwelten_island_v3', generatedIsland);
          setIslandImage(generatedIsland);
        }
        
        if (generatedSky) {
          localStorage.setItem('traumwelten_sky_v3', generatedSky);
          setSkyImage(generatedSky);
        }
      } catch (error) {
        console.error("Fehler beim Erstellen der Welt:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPermanentAssets();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalHeight = rect.height;
      
      const scrollY = -rect.top;
      const maxScroll = totalHeight - viewportHeight;
      
      if (maxScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[250vh] bg-[#0f172a]"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Ladebildschirm (Nur beim allerersten Mal sichtbar) */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-[#0f172a] flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-serif tracking-widest">Erschaffe Insel...</h2>
            <p className="text-sm text-slate-400 mt-2">Die Architektur wird gebaut (dies geschieht nur einmal)</p>
          </div>
        )}

        {/* 1. Hintergrund (Himmel) */}
        <div 
          className="absolute inset-0 w-full h-full bg-sky-300 transition-opacity duration-1000"
          style={{
            opacity: loading ? 0 : 1,
            // Fallback CSS Gradient falls Bild noch lädt oder fehlt
            background: skyImage ? `url(${skyImage})` : 'linear-gradient(to bottom, #87CEEB, #E0F6FF)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${1 + scrollProgress * 0.15})`,
            willChange: 'transform'
          }}
        />

        {/* 2. Vordergrund (Insel) */}
        {islandImage && (
          <div 
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
          >
            <div 
              className="relative w-[85vmin] h-[85vmin] md:w-[60vmin] md:h-[60vmin] transition-transform duration-75 ease-out animate-float"
              style={{
                // Kombinierte Transformation: Schweben + Parallax Zoom auf Nutzer zu
                transform: `
                  translateY(${scrollProgress * 250}px) 
                  scale(${0.6 + (scrollProgress * 3.5)})
                `, 
              }}
            >
              <img 
                src={islandImage} 
                alt="Magical Floating Island" 
                className="w-full h-full object-cover"
                style={{
                  // Maske sorgt für weiche Kanten, damit es nicht viereckig aussieht
                  maskImage: 'radial-gradient(circle at center, black 45%, transparent 68%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 45%, transparent 68%)',
                  filter: 'drop-shadow(0 30px 50px rgba(0,0,100,0.3))'
                }}
              />
            </div>
          </div>
        )}

        {/* Text Overlay */}
        <div 
          className="absolute bottom-10 left-0 right-0 flex justify-center z-20 pointer-events-none transition-all duration-500"
          style={{ 
            opacity: 1 - scrollProgress * 3,
            transform: `translateY(${scrollProgress * 50}px)`
          }}
        >
          <div className="text-center bg-white/10 backdrop-blur-md px-10 py-6 rounded-full border border-white/20 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-0 drop-shadow-md">
              Hylia's Ruhe
            </h1>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingIslandSection;