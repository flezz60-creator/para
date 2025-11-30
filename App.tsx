import React, { useState } from 'react';
import ParallaxSection from './components/ParallaxSection';
import DreamGenerator from './components/DreamGenerator';
import FloatingIslandSection from './components/FloatingIslandSection';
import { GeneratedImage } from './types';

const App: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  // Default atmospheric images
  const secondImage = "https://picsum.photos/id/1036/1920/1080"; // Winter/Snow
  const thirdImage = "https://picsum.photos/id/1043/1920/1080"; // Abstract lines

  const handleNewImage = (img: GeneratedImage) => {
    setGeneratedImages(prev => [img, ...prev]);
    setTimeout(() => {
      const element = document.getElementById('generated-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen font-sans text-slate-100 selection:bg-purple-500 selection:text-white bg-[#0f172a]">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center text-white mix-blend-overlay">
        <div className="text-2xl font-bold tracking-tighter uppercase font-serif drop-shadow-md">Traumwelten</div>
        <div className="text-xs font-bold tracking-[0.2em] opacity-80 border border-white/30 px-3 py-1 rounded-full">AI PARALLAX</div>
      </nav>

      {/* HERO SECTION: The Auto-Generated Floating Island */}
      <FloatingIslandSection />

      {/* Content Flow Below the Island */}
      <div className="relative z-20 bg-gradient-to-b from-sky-900 to-[#0f172a] pt-24 pb-32 -mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white font-serif tracking-wide">
            Jenseits des Horizonts
          </h2>
          <p className="text-lg text-blue-100/80 leading-loose max-w-2xl mx-auto">
            Was du oben gesehen hast, wurde vollständig von künstlicher Intelligenz erschaffen. 
            Nanobanana (Gemini 2.5) träumte die Insel, den Wasserfall und den Himmel, und wir haben 
            ihnen Tiefe gegeben.
          </p>
        </div>
      </div>

      {/* Parallax Section 2 */}
      <ParallaxSection backgroundImage={secondImage} speed={0.3} height="h-[80vh]">
        <div className="bg-black/30 backdrop-blur-sm p-10 rounded-xl border-l-4 border-white/50 max-w-lg ml-auto mr-4 md:mr-20">
          <h3 className="text-3xl font-bold mb-4">Gefrorene Stille</h3>
          <p className="text-slate-200">
            Jede Welt erzählt eine andere Geschichte. Wenn du weiterscrollst, betrittst du neue Dimensionen.
          </p>
        </div>
      </ParallaxSection>

      {/* Narrative Section */}
      <div className="bg-[#0f172a] py-24 px-6 relative z-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
             <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-100 font-serif">Unendliche Möglichkeiten</h2>
             <p className="text-lg text-slate-400 leading-loose">
               Dies ist mehr als nur eine Webseite. Es ist ein Fenster in die Vorstellungskraft der Maschine.
             </p>
          </div>
          <div className="flex-1 flex justify-center">
             <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 animate-pulse blur-xl opacity-50 absolute"></div>
             <div className="w-full h-64 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-center relative backdrop-blur-sm">
                <span className="text-white/20 font-serif text-4xl italic">AI Core</span>
             </div>
          </div>
        </div>
      </div>

      {/* Generator Section - Still available if user wants to try */}
      <div id="generator" className="bg-black py-24 px-6 relative z-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Erschaffe deine eigene Welt
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Nicht zufrieden mit der Insel? Generiere deine eigene Vision.
          </p>
        </div>

        <DreamGenerator onImageGenerated={handleNewImage} />

        {/* Dynamically Generated Sections */}
        {generatedImages.length > 0 && (
          <div id="generated-section" className="w-full mt-24 space-y-24 pb-24">
            <div className="text-center">
              <h3 className="text-2xl text-slate-300 font-serif border-b border-slate-800 inline-block pb-4 px-10">
                Deine Galerie
              </h3>
            </div>
            {generatedImages.map((img, index) => (
              <div key={index} className="relative group">
                <ParallaxSection backgroundImage={img.base64} speed={0.3} height="h-[80vh]">
                  <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center max-w-2xl mx-auto">
                    <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">Prompt</p>
                    <p className="text-xl italic font-serif text-white">"{img.prompt}"</p>
                  </div>
                </ParallaxSection>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-black text-slate-700 py-8 text-center text-xs tracking-widest uppercase border-t border-slate-900">
        <p>Traumwelten &copy; {new Date().getFullYear()} • Powered by Gemini Nanobanana</p>
      </footer>
    </div>
  );
};

export default App;