import React, { useState, useEffect, useRef } from 'react';

interface Entity {
  id: number;
  x: number;
  y: number;
  z: number; // Depth: 0 (close) to 100 (far)
  type: 'tree' | 'firefly' | 'item';
  itemType?: 'mushroom' | 'flower' | 'crystal';
  collected?: boolean;
}

const ForestDemo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [basket, setBasket] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Procedural Generation
  useEffect(() => {
    const newEntities: Entity[] = [];
    
    // Background Trees (Far)
    for (let i = 0; i < 40; i++) {
      newEntities.push({
        id: i,
        x: Math.random() * 100 - 50, // -50% to 50%
        y: Math.random() * 20 - 10,
        z: Math.random() * 50 + 50, // 50-100 depth
        type: 'tree'
      });
    }

    // Foreground Trees (Close)
    for (let i = 0; i < 15; i++) {
      newEntities.push({
        id: i + 100,
        x: Math.random() * 120 - 60,
        y: Math.random() * 20 - 5,
        z: Math.random() * 40, // 0-40 depth
        type: 'tree'
      });
    }

    // Items to Collect
    const itemTypes = ['mushroom', 'flower', 'crystal'] as const;
    for (let i = 0; i < 5; i++) {
      newEntities.push({
        id: i + 200,
        x: Math.random() * 60 - 30,
        y: Math.random() * 30 + 10, // Lower on screen
        z: Math.random() * 30 + 10,
        type: 'item',
        itemType: itemTypes[Math.floor(Math.random() * itemTypes.length)]
      });
    }

    // Fireflies
    for (let i = 0; i < 30; i++) {
        newEntities.push({
          id: i + 300,
          x: Math.random() * 100 - 50,
          y: Math.random() * 60 - 30,
          z: Math.random() * 80 + 10,
          type: 'firefly'
        });
      }

    setEntities(newEntities.sort((a, b) => b.z - a.z)); // Sort by depth (painters algo)
  }, []);

  // Parallax Mouse Handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (e.clientX / innerWidth) * 2 - 1, // -1 to 1
      y: (e.clientY / innerHeight) * 2 - 1
    });
  };

  const handleCollect = (id: number, type: string) => {
    setEntities(prev => prev.map(e => e.id === id ? { ...e, collected: true } : e));
    setBasket(prev => [...prev, type]);
    
    // Trigger Checkout after 3 items
    if (basket.length + 1 >= 3) {
      setTimeout(() => setShowCheckout(true), 1500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[110] bg-[#051a14] overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
    >
        {/* UI Overlay */}
        <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-start pointer-events-none">
            <div>
                <h3 className="text-emerald-400 font-display font-bold text-xl tracking-widest uppercase">Forest Sanctuary</h3>
                <p className="text-emerald-600/60 text-xs tracking-widest uppercase mt-1">Prototype Build v0.9</p>
            </div>
            
            <button onClick={onClose} className="pointer-events-auto bg-black/20 hover:bg-black/40 text-white p-2 rounded-full border border-white/10 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Basket UI */}
        <div className="absolute bottom-8 right-8 z-50 pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md border border-emerald-500/30 p-6 rounded-2xl">
                <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">Satchel ({basket.length}/3)</h4>
                <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="w-12 h-12 rounded-lg bg-black/40 border border-emerald-500/20 flex items-center justify-center">
                            {basket[i] && (
                                <span className="animate-pop text-xl">
                                    {basket[i] === 'mushroom' ? '🍄' : basket[i] === 'flower' ? '🌸' : '💎'}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
             <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-[#0a2f25] border border-emerald-500/50 p-10 rounded-3xl max-w-md text-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        ✨
                    </div>
                    <h2 className="text-3xl font-display text-white mb-2">Collection Complete</h2>
                    <p className="text-emerald-200/60 mb-8 leading-relaxed">
                        You have gathered the essence of the forest. The checkout process seamlessly integrates this gathering mechanic.
                    </p>
                    <button 
                        onClick={onClose}
                        className="bg-emerald-500 hover:bg-emerald-400 text-[#051a14] font-bold uppercase tracking-widest py-4 px-8 rounded-full transition-all hover:scale-105"
                    >
                        Complete Order
                    </button>
                </div>
             </div>
        )}

        {/* Custom Cursor */}
        <div 
            className="fixed w-8 h-8 rounded-full border border-emerald-400/50 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 mix-blend-screen"
            style={{ left: mousePos.x * window.innerWidth / 2 + window.innerWidth / 2, top: mousePos.y * window.innerHeight / 2 + window.innerHeight / 2 }}
        >
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-emerald-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* The World Container */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center perspective-[1000px]">
             {entities.map(entity => {
                 // Calculate Parallax position
                 // Closer items (low z) move MORE than far items (high z)
                 const depthFactor = (100 - entity.z) / 100; // 1 = close, 0 = far
                 const parallaxX = mousePos.x * -50 * depthFactor;
                 const parallaxY = mousePos.y * -20 * depthFactor;
                 
                 // Scale and Blur based on depth
                 const scale = 1.5 - (entity.z / 100);
                 const blur = Math.max(0, (entity.z - 60) / 10);
                 const opacity = 1 - (entity.z / 150);

                 if (entity.type === 'tree') {
                     return (
                         <div 
                            key={entity.id}
                            className="absolute bottom-0 w-[20vw] h-[60vh] md:h-[80vh] bg-[#0c3b2e] origin-bottom transition-transform duration-100 ease-out"
                            style={{
                                left: `${50 + entity.x}%`,
                                transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0) scale(${scale})`,
                                filter: `blur(${blur}px)`,
                                opacity: opacity,
                                zIndex: Math.floor(100 - entity.z),
                                borderRadius: '40% 40% 0 0' // Simple tree shape
                            }}
                         >
                            {/* Tree Detail */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20%] h-full bg-[#051a14]"></div>
                         </div>
                     );
                 }

                 if (entity.type === 'item' && !entity.collected) {
                     return (
                         <button
                            key={entity.id}
                            onClick={() => handleCollect(entity.id, entity.itemType!)}
                            className="absolute w-16 h-16 flex items-center justify-center transition-transform duration-300 hover:scale-125 cursor-none pointer-events-auto"
                            style={{
                                left: `${50 + entity.x}%`,
                                bottom: `${20 + (entity.y)}%`, // items are on the ground
                                transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0) scale(${scale})`,
                                zIndex: Math.floor(100 - entity.z) + 1
                            }}
                         >
                             <div className={`
                                w-8 h-8 rounded-full animate-pulse shadow-[0_0_30px]
                                ${entity.itemType === 'mushroom' ? 'bg-red-500 shadow-red-500/50' : 
                                  entity.itemType === 'flower' ? 'bg-pink-500 shadow-pink-500/50' : 
                                  'bg-cyan-400 shadow-cyan-400/50'}
                             `}></div>
                             <span className="absolute top-full mt-2 text-[10px] text-white font-bold uppercase tracking-widest opacity-0 hover:opacity-100">Gather</span>
                         </button>
                     );
                 }
                 
                 if (entity.type === 'firefly') {
                     return (
                         <div
                            key={entity.id}
                            className="absolute w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_10px_yellow]"
                            style={{
                                left: `${50 + entity.x}%`,
                                top: `${50 + entity.y}%`,
                                transform: `translate3d(${parallaxX * 1.5}px, ${parallaxY * 1.5}px, 0)`,
                                opacity: Math.random() * 0.5 + 0.5,
                                animation: `float ${Math.random() * 5 + 3}s infinite ease-in-out`
                            }}
                         ></div>
                     )
                 }

                 return null;
             })}
             
             {/* Atmosphere/Fog */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#051a14] via-transparent to-[#051a14]/50 pointer-events-none z-[100]"></div>
        </div>
        
        <style>{`
            .perspective-[1000px] { perspective: 1000px; }
            @keyframes pop {
                0% { transform: scale(0); }
                50% { transform: scale(1.5); }
                100% { transform: scale(1); }
            }
            .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fade-in 0.5s ease-out; }
        `}</style>
    </div>
  );
};

export default ForestDemo;