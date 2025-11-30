import React, { useState, useEffect, useRef } from 'react';
import ParallaxSection from './components/ParallaxSection';
import DreamGenerator from './components/DreamGenerator';
import FloatingIslandSection from './components/FloatingIslandSection';
import TypewriterEffect from './components/TypewriterEffect';
import ProjectDetailOverlay from './components/ProjectDetailOverlay';
import { GeneratedImage, Project } from './types';

const App: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Track max progress to prevent XP from decreasing when scrolling up
  const maxScrollProgress = useRef(0);

  // --- PROJECT DATA ---
  const projects: Project[] = [
    {
      id: 'forest',
      title: 'Forest Sanctuary',
      subtitle: 'A serene digital marketplace focusing on sustainability.',
      category: 'E-Commerce',
      heroImage: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2670&auto=format&fit=crop",
      description: "A serene digital marketplace.",
      challenge: "The client needed a platform that didn't feel like a typical shop. They wanted users to feel like they were walking through a forest, discovering sustainable products naturally.",
      solution: "We built a 3D WebGL experience where products are discovered by exploring a procedural forest. The checkout process is seamless, integrated into the environment as a 'gathering' mechanic.",
      hasDemo: true, // Activated the Forest Demo
      stats: {
        role: "Lead Design & Dev",
        client: "EcoCollectives",
        timeline: "4 Months",
        stack: ["React", "Three.js", "Shopify API", "WebGL"]
      },
      gallery: [
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2674&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2544&auto=format&fit=crop"
      ]
    },
    {
      id: 'sky',
      title: 'Sky Archive',
      subtitle: 'Visualizing complex data structures in the cloud.',
      category: 'Education',
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop",
      description: "Interactive learning platform.",
      challenge: "Traditional encyclopedia interfaces are boring. The goal was to make history and data feel like an adventure in the clouds.",
      solution: "A floating UI system where data points are islands. Users navigate by 'flying' between topics. We used React Spring for physics-based interactions that make the UI feel weighty and real.",
      stats: {
        role: "Frontend Architect",
        client: "Global Knowledge Base",
        timeline: "6 Months",
        stack: ["React", "D3.js", "Framer Motion", "Tailwind"]
      },
      gallery: [
        "https://images.unsplash.com/photo-1501862700950-18382cd41497?q=80&w=2519&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1483347752460-c207c76749fa?q=80&w=2669&auto=format&fit=crop"
      ]
    }
  ];

  // Gamification Logic: Scroll = XP (Monotonic Increase)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPx = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const rawProgress = scrollPx / docHeight;
      
      // Only update if we've scrolled further than before
      if (rawProgress > maxScrollProgress.current) {
        maxScrollProgress.current = rawProgress;
        
        // Calculate XP based on max depth (max 1000xp per visit via scrolling)
        const currentXp = Math.floor(rawProgress * 1000);
        
        setXp(currentXp);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Separate effect to handle level changes based on XP
  useEffect(() => {
    const newLevel = Math.floor(xp / 250) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 4000);
    }
  }, [xp, level]);

  const handleNewImage = (img: GeneratedImage) => {
    setGeneratedImages(prev => [img, ...prev]);
    setXp(prev => prev + 150);
    const currentScrollXp = Math.floor(maxScrollProgress.current * 1000);
    
    setTimeout(() => {
      const element = document.getElementById('generated-gallery');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const getLevelTitle = (lvl: number) => {
    if (lvl === 1) return "Visitor";
    if (lvl === 2) return "Explorer";
    if (lvl === 3) return "Adventurer";
    if (lvl === 4) return "Architect";
    return "Hylia Master";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white selection:bg-sky-200 selection:text-sky-900 font-sans">
      
      {/* Project Detail Overlay */}
      {selectedProject && (
        <ProjectDetailOverlay 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {/* Navigation & Player HUD */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg px-6 py-3 rounded-full flex items-center gap-6 md:gap-12 transition-all hover:bg-white/90 hover:shadow-xl">
          <div className="text-lg font-bold tracking-tighter uppercase font-display text-slate-900">
            Hylia<span className="text-sky-500">.</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-xs font-bold tracking-[0.2em] uppercase text-slate-500">
            <a href="#about" className="hover:text-sky-600 transition-colors">Studio</a>
            <a href="#work" className="hover:text-sky-600 transition-colors">Work</a>
            <a href="#lab" className="hover:text-sky-600 transition-colors">Lab</a>
          </div>

          {/* Player XP Bar (Gamification HUD) */}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-600">
                {getLevelTitle(level)}
              </div>
              <div className="text-[10px] font-bold text-slate-400">
                LVL {level}
              </div>
            </div>
            {/* SVG Container */}
            <div className="relative w-11 h-11 flex items-center justify-center p-0.5">
              <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 40 40">
                 <circle cx="20" cy="20" r="16" stroke="#f1f5f9" strokeWidth="3" fill="none" />
                 <circle 
                    cx="20" cy="20" r="16" stroke="#0ea5e9" strokeWidth="3" fill="none" 
                    strokeLinecap="round"
                    strokeDasharray="100" 
                    strokeDashoffset={100 - ((xp % 250) / 250 * 100)}
                    className="transition-all duration-300"
                 />
              </svg>
              <span className="absolute text-[9px] font-bold text-slate-700 select-none">{Math.floor(((xp % 250) / 250) * 100)}%</span>
            </div>
          </div>

          <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-sky-600 transition-colors shadow-md hidden sm:block">
            Connect
          </button>
        </div>
      </nav>

      {/* Level Up Notification */}
      <div 
        className={`fixed top-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-700 ease-out flex flex-col items-center ${
          showLevelUp ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
        }`}
      >
        <div className="relative bg-white/90 backdrop-blur-2xl border border-sky-100 px-10 py-6 rounded-2xl shadow-[0_20px_60px_-15px_rgba(14,165,233,0.3)] flex flex-col items-center gap-2 overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-50"></div>
           <div className="absolute -left-10 top-0 w-20 h-full bg-white/40 skew-x-[20deg] blur-md animate-[shimmer_1s_infinite]"></div>

           <span className="text-sky-500 font-display font-bold text-4xl drop-shadow-sm">{level}</span>
           <div className="w-12 h-[1px] bg-slate-200 my-1"></div>
           <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">Level Up</span>
           <span className="text-sm font-bold font-display text-slate-900">{getLevelTitle(level)}</span>
        </div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-sky-400/20 rounded-full blur-3xl -z-10 transition-opacity duration-1000 ${showLevelUp ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      {/* HERO: The Island Anchor */}
      <FloatingIslandSection />

      {/* SECTION: Philosophy / Studio */}
      <div id="about" className="relative z-20 pt-32 pb-32 -mt-24 px-6 bg-gradient-to-b from-transparent to-white">
        
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <div className="inline-flex items-center gap-2 mb-8 bg-sky-50 border border-sky-100 px-4 py-1.5 rounded-full">
             <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
             <span className="text-xs font-bold tracking-widest text-sky-700 uppercase">System Online</span>
          </div>
          
          <h2 className="text-4xl md:text-7xl font-bold mb-8 text-slate-900 font-display leading-[1.1] min-h-[3.3em] md:min-h-[2.2em]">
            We build worlds, <br/>
            <TypewriterEffect 
              isHeadline={true}
              prefix="not just "
              words={["websites.", "code.", "templates.", "markup."]}
            />
          </h2>
          
          <div className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-light min-h-[4em]">
            <TypewriterEffect 
              isHeadline={false}
              staticText="Combining immersive storytelling with cutting-edge technology to create digital experiences that feel alive."
              highlightWords={["immersive storytelling", "technology", "alive", "digital experiences"]}
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceModule 
              icon={<DesignIcon />}
              title="Visual Alchemy" 
              subtitle="Interface Design"
              desc="UI/UX that feels like an extension of thought. We craft clean, intuitive interfaces that are beautifully functional." 
            />
            <ServiceModule 
              icon={<CodeIcon />}
              title="Core Architecture" 
              subtitle="Development"
              desc="Robust frontend foundations using React and Three.js. Built for performance, scalability, and modern web standards." 
            />
            <ServiceModule 
              icon={<GameIcon />}
              title="Player Immersion" 
              subtitle="Gamification"
              desc="Turning visitors into active participants. We integrate subtle game mechanics to significantly boost engagement." 
            />
          </div>
        </div>
      </div>

      {/* SECTION: Featured Work (Interactive Portals) */}
      <div id="work" className="py-20 bg-white">
        <div className="container mx-auto px-6 mb-20 flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
             <span className="text-sky-500 font-bold tracking-[0.2em] text-xs uppercase block mb-2">Selected Works</span>
             <h2 className="text-4xl md:text-5xl font-display text-slate-900 font-bold">Featured Projects</h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-slate-400 text-sm tracking-wide">CLICK TO EXPLORE</p>
          </div>
        </div>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className="relative group cursor-pointer" 
              onClick={() => setSelectedProject(project)}
            >
              <ParallaxSection 
                backgroundImage={project.heroImage} 
                speed={0.15} 
                contentSpeed={0.08} 
                height="h-[80vh]"
                overlayColor="bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors duration-500"
              >
                <div className={`flex w-full ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`
                    bg-white/90 backdrop-blur-md p-10 md:p-14 rounded-3xl border border-white shadow-2xl max-w-xl text-left 
                    transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-sky-500/20
                    ${index % 2 === 0 ? 'md:-translate-x-12' : 'md:translate-x-12'}
                  `}>
                    <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">
                      {project.category}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 font-display text-slate-900 group-hover:text-sky-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                      {project.subtitle}
                    </p>
                    <button className="group/btn flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                      View Case Study
                      <span className="w-8 h-[1px] bg-slate-900 transition-all group-hover/btn:w-16 group-hover/btn:bg-sky-500"></span>
                    </button>
                  </div>
                </div>
              </ParallaxSection>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: The Lab (AI Generator) */}
      <div id="lab" className="bg-slate-50 py-32 px-6 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="max-w-5xl mx-auto text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 font-display">
            The Laboratory
          </h2>
          <p className="text-slate-500 font-normal text-lg max-w-2xl mx-auto">
             Experimental features and prototypes. Powered by Gemini 2.5 Flash Image.
          </p>
        </div>

        <div className="relative z-10">
          <DreamGenerator onImageGenerated={handleNewImage} />
        </div>

        {/* User Gallery */}
        {generatedImages.length > 0 && (
          <div id="generated-gallery" className="max-w-7xl mx-auto mt-32 relative z-10">
             <div className="flex items-center gap-4 mb-10">
               <span className="w-12 h-[2px] bg-sky-500"></span>
               <h3 className="text-slate-900 text-sm uppercase tracking-widest font-bold">Generated Artifacts</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {generatedImages.map((img, index) => (
                  <div key={index} className="group relative aspect-video overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                    <img src={img.base64} alt="AI Generated" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                      <p className="text-white font-medium text-lg leading-tight">"{img.prompt}"</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Footer - Minimalist */}
      <footer className="bg-white text-slate-500 py-16 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
             <h4 className="text-2xl font-display text-slate-900 font-bold tracking-tight">HYLIA<span className="text-sky-500">.</span></h4>
             <p className="text-xs font-bold tracking-widest uppercase mt-2 text-slate-400">Creative Studio © 2025</p>
          </div>
          
          <div className="flex gap-8 text-xs font-bold tracking-widest uppercase">
            <a href="#" className="hover:text-sky-500 transition-colors">Twitter</a>
            <a href="#" className="hover:text-sky-500 transition-colors">Instagram</a>
            <a href="#" className="hover:text-sky-500 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- ICONS ---
const DesignIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
  </svg>
);

const GameIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- Hylia Tech Module Card ---
const ServiceModule = ({ title, subtitle, desc, icon }: { title: string, subtitle: string, desc: string, icon: React.ReactNode }) => (
  <div className="group relative bg-white/40 backdrop-blur-lg rounded-[2rem] border border-white/60 p-8 hover:bg-white/60 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(14,165,233,0.15)] hover:border-sky-200 overflow-hidden">
    
    {/* Decorative Hylia Lines */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-sky-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    
    <div className="relative z-10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="bg-white/80 p-4 rounded-2xl shadow-sm text-sky-500 group-hover:text-sky-600 group-hover:scale-110 transition-transform duration-300 ring-1 ring-sky-100 group-hover:ring-sky-200">
          {icon}
        </div>
        <div className="text-right">
           <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 group-hover:text-sky-400 transition-colors">Module</span>
           <div className="w-8 h-[2px] bg-slate-200 ml-auto mt-1 group-hover:bg-sky-400 transition-colors"></div>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold font-display text-slate-900 mb-1">{title}</h3>
      <span className="text-xs uppercase tracking-widest font-bold text-sky-600 mb-4 block opacity-80">{subtitle}</span>
      
      <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
        {desc}
      </p>

      {/* Footer / Action */}
      <div className="flex items-center justify-between border-t border-slate-100/50 pt-4 mt-auto">
        <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-sky-500 group-hover:shadow-[0_0_10px_rgba(14,165,233,0.6)] transition-all"></span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-slate-500 transition-colors">Active</span>
      </div>
    </div>
    
    {/* Hover Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-sky-50/0 via-sky-50/0 to-sky-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
  </div>
);

export default App;