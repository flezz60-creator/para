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
      const base64Image = await generateDreamImage(prompt + ", surreal, cinematic, high quality, 8k, dreamscape style");
      
      if (base64Image) {
        onImageGenerated({ base64: base64Image, prompt });
        setPrompt(''); // Clear input on success
      } else {
        setError("Das Bild konnte nicht generiert werden. Bitte versuche es erneut.");
      }
    } catch (err) {
      setError("Ein Fehler ist aufgetreten. Überprüfe deine Verbindung oder den API-Schlüssel.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl mx-auto mt-10">
      <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Erschaffe deine eigene Realität
      </h3>
      <p className="text-slate-300 mb-6 text-sm">
        Nutze die Macht von <strong>Gemini Nanobanana</strong>, um eine neue Parallax-Ebene zu generieren. Beschreibe deinen Traum.
      </p>

      <form onSubmit={handleGenerate} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="z.B. Eine schwebende Stadt aus Kristallen im Sonnenuntergang..."
            className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg py-4 px-5 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-slate-500"
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-900/50">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`
            py-4 px-6 rounded-lg font-bold text-white tracking-wide uppercase transition-all duration-300
            ${isLoading 
              ? 'bg-slate-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transform hover:-translate-y-1'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generiere Traum...
            </span>
          ) : (
            'Visualisieren'
          )}
        </button>
      </form>
    </div>
  );
};

export default DreamGenerator;