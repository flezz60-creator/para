
import React, { useState } from 'react';

interface SkillNode {
  id: string;
  label: string;
  level: number; // 1-100
  type: 'design' | 'dev' | 'core';
  x: number; // Prozentuale Position X (0-100)
  y: number; // Prozentuale Position Y (0-100)
  description: string;
  connections: string[]; // IDs der verbundenen Nodes
}

const skills: SkillNode[] = [
  // CORE
  { id: 'core', label: 'Core', level: 100, type: 'core', x: 50, y: 50, description: 'The heart of creation. Combining strategy with creative vision.', connections: ['ui', 'frontend', '3d'] },
  
  // DESIGN BRANCH
  { id: 'ui', label: 'UI/UX', level: 95, type: 'design', x: 20, y: 30, description: 'Designing interfaces that feel natural and intuitive.', connections: ['figma', 'motion'] },
  { id: 'figma', label: 'Figma', level: 90, type: 'design', x: 10, y: 15, description: 'Rapid prototyping and high-fidelity design systems.', connections: [] },
  { id: 'motion', label: 'Motion', level: 85, type: 'design', x: 30, y: 15, description: 'Bringing static layouts to life with meaningful transitions.', connections: [] },

  // DEV BRANCH
  { id: 'frontend', label: 'Frontend', level: 98, type: 'dev', x: 80, y: 30, description: 'Building robust, scalable applications.', connections: ['react', 'ts'] },
  { id: 'react', label: 'React', level: 95, type: 'dev', x: 90, y: 15, description: 'Component-based architecture for complex UIs.', connections: [] },
  { id: 'ts', label: 'TypeScript', level: 90, type: 'dev', x: 70, y: 15, description: 'Type-safe code for enterprise-grade reliability.', connections: [] },

  // 3D BRANCH
  { id: '3d', label: 'WebGL', level: 80, type: 'dev', x: 50, y: 85, description: 'Immersive 3D experiences in the browser.', connections: ['three', 'blender'] },
  { id: 'three', label: 'Three.js', level: 85, type: 'dev', x: 35, y: 95, description: 'Rendering complex 3D scenes performantly.', connections: [] },
  { id: 'blender', label: 'Blender', level: 75, type: 'design', x: 65, y: 95, description: 'Asset creation and environmental modeling.', connections: [] },
];

const SkillTreeSection: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState<SkillNode>(skills[0]);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Helper um Koordinaten für SVG Linien zu berechnen
  const getNodePos = (id: string) => skills.find(s => s.id === id);

  return (
    <div className="py-24 bg-gradient-to-b from-white to-sky-50 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ 
          backgroundImage: 'radial-gradient(#0EA5E9 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-16 items-center">
        
        {/* LEFT: Description Panel (RPG Quest Log Style) */}
        <div className="w-full md:w-1/3">
           <div className="mb-8">
             <span className="text-sky-500 font-bold tracking-[0.2em] text-xs uppercase block mb-2">Character Stats</span>
             <h2 className="text-4xl font-display text-slate-900 font-bold">Ability Tree</h2>
             <p className="text-slate-500 mt-4 leading-relaxed">
               Click on the nodes to inspect technical proficiencies and unlocked capabilities.
             </p>
           </div>

           {/* Active Skill Card */}
           <div className="bg-white/60 backdrop-blur-xl border border-white shadow-xl rounded-2xl p-8 relative overflow-hidden transition-all duration-300 min-h-[250px]">
             <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300 ${activeSkill.type === 'design' ? 'bg-purple-400' : activeSkill.type === 'dev' ? 'bg-sky-500' : 'bg-slate-800'}`}></div>
             
             <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold font-display text-slate-800">{activeSkill.label}</h3>
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Lvl {activeSkill.level}</span>
             </div>
             
             <p className="text-slate-600 mb-6 leading-relaxed text-sm">
               {activeSkill.description}
             </p>

             {/* Progress Bar */}
             <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ease-out ${activeSkill.type === 'design' ? 'bg-purple-400' : activeSkill.type === 'dev' ? 'bg-sky-500' : 'bg-slate-800'}`}
                 style={{ width: `${activeSkill.level}%` }}
               ></div>
             </div>
             <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
               <span>Novice</span>
               <span>Master</span>
             </div>
           </div>
        </div>

        {/* RIGHT: Interactive Tree (The Constellation) */}
        <div className="w-full md:w-2/3 aspect-square md:aspect-[4/3] relative bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/50 shadow-inner p-8 select-none">
          
          {/* SVG Connections Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {skills.map(skill => (
              skill.connections.map(targetId => {
                const target = getNodePos(targetId);
                if (!target) return null;
                return (
                  <line 
                    key={`${skill.id}-${targetId}`}
                    x1={`${skill.x}%`} 
                    y1={`${skill.y}%`} 
                    x2={`${target.x}%`} 
                    y2={`${target.y}%`} 
                    stroke={hoveredSkill === skill.id || hoveredSkill === targetId || activeSkill.id === skill.id ? "#0EA5E9" : "#CBD5E1"} 
                    strokeWidth="2"
                    className="transition-all duration-500"
                    strokeDasharray={activeSkill.id === skill.id ? "none" : "4 4"}
                  />
                );
              })
            ))}
          </svg>

          {/* Nodes Layer */}
          {skills.map((skill) => {
             const isActive = activeSkill.id === skill.id;
             const isHovered = hoveredSkill === skill.id;
             
             return (
               <button
                 key={skill.id}
                 onClick={() => setActiveSkill(skill)}
                 onMouseEnter={() => setHoveredSkill(skill.id)}
                 onMouseLeave={() => setHoveredSkill(null)}
                 className={`
                    absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center z-10 transition-all duration-500
                    ${isActive 
                      ? 'bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.5)] scale-110' 
                      : 'bg-white shadow-md hover:scale-110 hover:shadow-lg'
                    }
                    ${skill.type === 'core' ? 'w-16 h-16 -ml-8 -mt-8 ring-4 ring-sky-100' : ''}
                 `}
                 style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
               >
                 {/* Inner Dot */}
                 <span className={`
                    w-3 h-3 rounded-full transition-colors duration-300
                    ${isActive ? 'bg-white' : skill.type === 'design' ? 'bg-purple-300' : skill.type === 'dev' ? 'bg-sky-300' : 'bg-slate-800'}
                 `}></span>
                 
                 {/* Label Tooltip */}
                 <span className={`
                    absolute top-full mt-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300
                    ${isActive ? 'text-sky-600 translate-y-0 opacity-100' : 'text-slate-400 translate-y-[-5px] opacity-0 group-hover:opacity-100'}
                 `}>
                   {skill.label}
                 </span>
               </button>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillTreeSection;
