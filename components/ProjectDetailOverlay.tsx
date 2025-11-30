import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import ForestDemo from './demos/ForestDemo';

interface ProjectDetailOverlayProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetailOverlay: React.FC<ProjectDetailOverlayProps> = ({ project, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeDemo, setActiveDemo] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 500); // Wait for animation
  };

  if (activeDemo && project.id === 'forest') {
    return <ForestDemo onClose={() => setActiveDemo(false)} />;
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${isVisible ? 'bg-slate-900/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}>
      
      {/* Main Content Sheet */}
      <div 
        className={`bg-white w-full h-full md:w-[95%] md:h-[95%] md:rounded-3xl shadow-2xl overflow-y-auto relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-95'}`}
      >
        
        {/* Close Button - Sticky */}
        <button 
          onClick={handleClose}
          className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg hover:bg-sky-50 transition-colors group border border-slate-100"
        >
          <svg className="w-6 h-6 text-slate-900 group-hover:text-sky-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* HERO IMAGE */}
        <div className="h-[50vh] md:h-[70vh] relative w-full overflow-hidden group">
          <img 
            src={project.heroImage} 
            alt={project.title} 
            className="w-full h-full object-cover animate-pan-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col md:flex-row items-end justify-between gap-8">
            <div>
                <span className="inline-block bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                {project.category}
                </span>
                <h2 className="text-5xl md:text-8xl font-black text-slate-900 font-display leading-none mb-2 mix-blend-multiply">
                {project.title}
                </h2>
                <p className="text-xl md:text-2xl text-slate-500 font-light max-w-2xl">
                {project.subtitle}
                </p>
            </div>

            {/* DEMO BUTTON */}
            {project.hasDemo && (
                <button 
                    onClick={() => setActiveDemo(true)}
                    className="bg-slate-900 hover:bg-sky-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3 animate-bounce-subtle"
                >
                    <span>Launch Experience</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            )}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Left Column: Stats (Sheikah Data Style) */}
            <div className="md:col-span-4 space-y-8 sticky top-24 self-start">
               <div className="border-t-2 border-slate-100 pt-6">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Role</h4>
                 <p className="text-lg font-bold text-slate-900">{project.stats.role}</p>
               </div>
               
               <div className="border-t-2 border-slate-100 pt-6">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Client</h4>
                 <p className="text-lg font-bold text-slate-900">{project.stats.client}</p>
               </div>

               <div className="border-t-2 border-slate-100 pt-6">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Timeline</h4>
                 <p className="text-lg font-bold text-slate-900">{project.stats.timeline}</p>
               </div>

               <div className="border-t-2 border-slate-100 pt-6">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Tech Stack</h4>
                 <div className="flex flex-wrap gap-2">
                   {project.stats.stack.map(tech => (
                     <span key={tech} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                       {tech}
                     </span>
                   ))}
                 </div>
               </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="md:col-span-8 space-y-16">
               <div>
                 <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">The Challenge</h3>
                 <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                   {project.challenge}
                 </p>
               </div>

               {/* Gallery Image 1 */}
               {project.gallery[0] && (
                 <div className="rounded-2xl overflow-hidden shadow-2xl">
                   <img src={project.gallery[0]} alt="Detail 1" className="w-full h-auto hover:scale-105 transition-transform duration-1000" />
                 </div>
               )}

               <div>
                 <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">The Solution</h3>
                 <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                   {project.solution}
                 </p>
               </div>

               {/* Gallery Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {project.gallery.slice(1).map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-80">
                      <img src={img} alt={`Detail ${i+2}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                 ))}
               </div>
            </div>

          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 py-16 text-center">
            <button onClick={handleClose} className="inline-flex items-center gap-2 text-slate-900 font-bold uppercase tracking-widest hover:text-sky-600 transition-colors">
              <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Back to Portfolio
            </button>
        </div>
      </div>
      
      <style>{`
        @keyframes panSlow {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-pan-slow {
          animation: panSlow 20s ease-out infinite alternate;
        }
        @keyframes bounceSubtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
            animation: bounceSubtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ProjectDetailOverlay;