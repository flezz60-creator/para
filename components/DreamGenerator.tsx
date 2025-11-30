import React, { useState } from 'react';
import { generateDreamImage } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface DreamGeneratorProps {
  onImageGenerated: (img: GeneratedImage) => void;
}

const DreamGenerator: React.FC<DreamGeneratorProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const base64Image = await generateDreamImage(prompt + ", zelda breath of the wild style, digital art, soft lighting, masterpiece, clean lines");
      
      if (base64Image) {
        onImageGenerated({ base64: base64Image, prompt });
        setPrompt(''); 
      } else {
        setError("Verbindung fehlgeschlagen.");
      }
    } catch (err) {
      setError("Systemfehler.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(14,165,233,0.1)] max-w-2xl mx-auto mt-10 relative overflow-hidden group">
      {/* Sheikah-Tech Accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-sky-400/30 rounded-tl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-sky-400/30 rounded-br-3xl"></div>
      
      <div className="text-center mb-10">
        <span className="text-sky-600 font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Prototype Engine V.2.5</span>
        <h3 className="text-3xl font-bold text-slate-800 font-display">
          Nanobanana Interface
        </h3>
        <p className="text-slate-500 mt-4 max-w-lg mx-auto leading-relaxed">
          Nutze unsere KI, um Prototypen für deine Welt zu visualisieren. 
        </p>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col gap-6 relative z-10">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Beschreibe deine Vision..."
            className="w-full bg-white/60 hover:bg-white/80 focus:bg-white border border-slate-200 text-slate-800 rounded-2xl py-5 px-6 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all placeholder-slate-400 text-lg text-center shadow-inner"
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm text-center font-bold bg-red-50 py-2 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`
            py-5 px-10 rounded-full font-bold tracking-widest uppercase transition-all duration-300 shadow-lg text-sm
            ${isLoading 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-sky-400/30 hover:scale-[1.02]'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Verarbeite...
            </span>
          ) : (
            'Generieren'
          )}
        </button>
      </form>
    </div>
  );
};

export default DreamGenerator;