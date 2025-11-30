
import React, { useState, useEffect, useRef } from 'react';

// E-Commerce Product Type Definition
interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    accentColor: string;
}

const PRODUCTS: Product[] = [
    { 
        id: 'p1', 
        name: 'Pine Resin Serum', 
        price: 45, 
        description: 'Organic pine extract for revitalization. Harvested sustainably.', 
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', 
        accentColor: 'text-amber-400' 
    },
    { 
        id: 'p2', 
        name: 'Bamboo Noise Cancel', 
        price: 120, 
        description: 'Headphones encased in renewable bamboo fibers.', 
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', 
        accentColor: 'text-emerald-400' 
    },
    { 
        id: 'p3', 
        name: 'Artisan Clay Vase', 
        price: 85, 
        description: 'Hand-turned ceramic from riverbed clay.', 
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80', 
        accentColor: 'text-orange-400' 
    },
    { 
        id: 'p4', 
        name: 'Mountain Focus Tea', 
        price: 12, 
        description: 'Rare herbal blend for mental clarity.', 
        image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80', 
        accentColor: 'text-green-400' 
    },
    { 
        id: 'p5', 
        name: 'Wild Silk Robe', 
        price: 250, 
        description: 'Ethically sourced wild silk. Naturally dyed.', 
        image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=400&q=80', 
        accentColor: 'text-purple-400' 
    },
];

interface TreeEntity {
    id: number;
    x: number; // %
    y: number; // %
    size: number; // px
    color: string;
    zIndex: number;
}

const ForestDemo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [view, setView] = useState<'forest' | 'cart'>('forest');
    const [cart, setCart] = useState<Product[]>([]);
    const [trees, setTrees] = useState<TreeEntity[]>([]);
    
    // Initial Generation of the Forest Map
    useEffect(() => {
        const newTrees: TreeEntity[] = [];
        const colors = ['#064e3b', '#065f46', '#047857', '#10b981', '#059669'];
        
        // Generate dense forest coverage
        for (let i = 0; i < 300; i++) {
            const size = 60 + Math.random() * 100;
            newTrees.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100, // Spread across the tall container
                size,
                color: colors[Math.floor(Math.random() * colors.length)],
                zIndex: Math.floor(Math.random() * 10)
            });
        }
        setTrees(newTrees.sort((a, b) => a.zIndex - b.zIndex));
    }, []);

    const addToCart = (product: Product) => {
        setCart(prev => [...prev, product]);
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

    // RENDER: COZY SHOP CHECKOUT VIEW
    if (view === 'cart') {
        return (
            <div className="fixed inset-0 z-[120] bg-[#2c1810] overflow-hidden font-sans flex flex-col items-center justify-end">
                
                {/* 1. BACK WALL & AMBIANCE */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0a] to-[#3e2723]"></div>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 49px, #000 50px)' }}></div>
                
                {/* --- DECOR: BACKGROUND SHELVES (New) --- */}
                <div className="absolute top-1/4 left-10 w-64 h-2 bg-[#1a0f0a] shadow-xl rounded-full opacity-50 hidden md:block">
                     {/* Potions/Jars on shelf */}
                     <div className="absolute bottom-2 left-4 w-8 h-10 bg-emerald-900/50 rounded-t-lg border-2 border-emerald-800"></div>
                     <div className="absolute bottom-2 left-16 w-10 h-8 bg-amber-900/50 rounded-full border-2 border-amber-800"></div>
                     <div className="absolute bottom-2 left-32 w-6 h-12 bg-purple-900/50 rounded-t-sm border-2 border-purple-800"></div>
                </div>
                <div className="absolute top-1/3 right-10 w-48 h-2 bg-[#1a0f0a] shadow-xl rounded-full opacity-50 hidden md:block">
                     <div className="absolute bottom-2 right-8 w-8 h-8 bg-slate-700 rounded-sm border border-slate-600 rotate-12"></div> {/* Box */}
                     <div className="absolute bottom-2 right-20 w-12 h-6 bg-red-900/30 rounded-t-full border border-red-900"></div> {/* Bowl */}
                </div>

                {/* --- DECOR: HANGING SIGN (Extended Banner) --- */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                    {/* Chains */}
                    <div className="w-[80vw] md:w-[500px] flex justify-between px-12 h-20">
                        <div className="w-1 h-full bg-gradient-to-b from-neutral-800 to-neutral-600"></div>
                        <div className="w-1 h-full bg-gradient-to-b from-neutral-800 to-neutral-600"></div>
                    </div>
                    {/* The Board */}
                    <div className="bg-[#4e342e] w-[90vw] md:w-[600px] border-4 border-[#3e2723] rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-6 text-center relative -mt-2">
                        {/* Screws */}
                        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#8d6e63] shadow-inner"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#8d6e63] shadow-inner"></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#8d6e63] shadow-inner"></div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#8d6e63] shadow-inner"></div>
                        
                        <h1 className="font-display font-bold text-3xl md:text-5xl tracking-widest uppercase text-[#f3e5ab] drop-shadow-md mb-2">
                            EcoSanctuary
                        </h1>
                        <div className="flex items-center justify-center gap-4 opacity-80">
                            <span className="h-[1px] w-12 bg-[#f3e5ab]"></span>
                            <span className="font-serif italic text-[#ffcc80] text-sm md:text-base">Purveyors of Fine Forest Goods</span>
                            <span className="h-[1px] w-12 bg-[#f3e5ab]"></span>
                        </div>
                    </div>
                    {/* Hanging Herbs (CSS Decoration) */}
                    <div className="absolute top-20 -left-16 hidden md:block origin-top animate-swing-slow">
                         <div className="w-1 h-16 bg-green-900/60 mx-auto"></div>
                         <div className="w-8 h-8 rounded-full bg-green-800/60 -mt-2 blur-[1px]"></div>
                    </div>
                </div>

                {/* Navigation Back */}
                <button 
                    onClick={() => setView('forest')}
                    className="absolute top-8 left-8 z-50 text-amber-100 hover:text-white flex items-center gap-2 uppercase text-xs font-bold tracking-widest bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm transition-all hover:bg-black/40"
                >
                    ← Back to Forest
                </button>

                {/* 2. THE SHOPKEEPER (CSS GRANDMA) */}
                <div className="relative z-10 flex flex-col items-center animate-bob mt-32">
                    
                    {/* Speech Bubble */}
                    <div className="mb-4 relative bg-white text-slate-900 p-4 rounded-2xl rounded-bl-none shadow-lg max-w-xs text-center transform -translate-x-12 animate-pop-in">
                        <p className="font-display font-bold text-lg mb-1">
                            {cart.length === 0 
                                ? "Oh my, empty hands?" 
                                : `Ah! ${cart.length} lovely treasures!`}
                        </p>
                        <p className="text-sm text-slate-500">
                            {cart.length === 0 
                                ? "Go find something nice in the woods, dearie." 
                                : `That will be ${cartTotal} rupees, please.`}
                        </p>
                    </div>

                    {/* Head */}
                    <div className="w-32 h-32 bg-[#e6cbb3] rounded-full relative shadow-md">
                         {/* Hair Bun */}
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-24 bg-slate-300 rounded-t-full"></div>
                         {/* Glasses */}
                         <div className="absolute top-12 left-4 w-10 h-10 border-4 border-slate-800 rounded-full bg-white/20"></div>
                         <div className="absolute top-12 right-4 w-10 h-10 border-4 border-slate-800 rounded-full bg-white/20"></div>
                         <div className="absolute top-16 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-800"></div> {/* Bridge */}
                         {/* Smile */}
                         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-4 border-b-4 border-slate-700 rounded-full"></div>
                         {/* Blush */}
                         <div className="absolute top-16 left-2 w-6 h-4 bg-rose-300/50 rounded-full blur-sm"></div>
                         <div className="absolute top-16 right-2 w-6 h-4 bg-rose-300/50 rounded-full blur-sm"></div>
                    </div>
                    {/* Body */}
                    <div className="w-56 h-40 bg-emerald-800 rounded-t-[4rem] relative -mt-4 shadow-lg flex justify-center">
                         <div className="w-20 h-full bg-emerald-700/50"></div> {/* Apron detail */}
                         {/* Necklace */}
                         <div className="absolute top-8 w-12 h-12 border-b-4 border-amber-400 rounded-full"></div>
                    </div>
                </div>

                {/* 3. THE COUNTER & ITEMS */}
                <div className="w-full h-[40vh] bg-[#3e2723] relative z-20 border-t-8 border-[#27150f] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex items-end justify-center pb-0">
                    {/* Wood Texture */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 11px)' }}></div>
                    
                    <div className="container mx-auto h-full flex relative">
                        
                        {/* LEFT: Items on Counter */}
                        <div className="flex-1 flex items-end justify-center md:justify-start gap-4 px-8 pb-12 overflow-x-auto">
                            {cart.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="relative group shrink-0 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="w-24 md:w-32 aspect-[3/4] relative">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-full h-full object-contain drop-shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-300" 
                                        />
                                        <button 
                                            onClick={() => removeFromCart(idx)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {/* Shadow on counter */}
                                    <div className="h-2 w-20 bg-black/40 blur-md rounded-full mx-auto mt-[-5px]"></div>
                                </div>
                            ))}
                            {cart.length === 0 && (
                                <div className="text-white/20 font-display text-2xl font-bold self-center mb-12">
                                    (Counter Empty)
                                </div>
                            )}
                        </div>

                        {/* RIGHT: The Receipt / Ledger */}
                        <div className="w-80 md:w-96 bg-[#f3e5ab] text-slate-800 p-8 shadow-2xl transform rotate-1 border-t-4 border-white/50 relative hidden md:block self-end mb-[-20px] rounded-t-lg min-h-[50%]">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#8b4513] shadow-inner"></div> {/* Nail/Pin */}
                            
                            <h3 className="font-display font-bold text-center text-xl border-b-2 border-slate-800/20 pb-4 mb-4 uppercase tracking-widest">
                                The Bill
                            </h3>

                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar text-sm font-mono mb-6">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                                        <span className="truncate w-32">{item.name}</span>
                                        <span>${item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between text-xl font-bold font-display border-t-2 border-slate-800 pt-4">
                                <span>Total:</span>
                                <span>${cartTotal}</span>
                            </div>

                            <button className="w-full mt-6 bg-emerald-700 text-amber-50 font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-emerald-600 transition-colors shadow-lg">
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes bob {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-5px); }
                    }
                    .animate-bob { animation: bob 4s ease-in-out infinite; }
                    
                    @keyframes slideUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
                    
                    @keyframes popIn {
                        from { transform: scale(0.8) translateX(-3rem); opacity: 0; }
                        to { transform: scale(1) translateX(-3rem); opacity: 1; }
                    }
                    .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

                    @keyframes swingSlow {
                        0%, 100% { transform: rotate(-5deg); }
                        50% { transform: rotate(5deg); }
                    }
                    .animate-swing-slow { animation: swingSlow 6s ease-in-out infinite; }
                    
                    /* Scrollbar for receipt */
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { bg: #ccc; border-radius: 4px; }
                `}</style>
            </div>
        );
    }

    // RENDER: FOREST EXPLORATION VIEW (UNCHANGED)
    return (
        <div className="fixed inset-0 z-[110] bg-[#020b0a] overflow-x-hidden overflow-y-auto">
            
            {/* HUD */}
            <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
                {/* Brand Logo */}
                <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 pointer-events-auto shadow-lg">
                     <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_0_10px_rgba(5,150,105,0.6)]">
                         <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                         </svg>
                     </div>
                     <span className="text-emerald-100 font-display font-bold tracking-widest uppercase text-sm">EcoSanctuary</span>
                </div>
                
                <div className="pointer-events-auto flex items-center gap-4">
                     <button 
                        onClick={() => setView('cart')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                     >
                        <span>Basket</span>
                        <span className="bg-black/20 px-2 py-0.5 rounded-full text-[10px]">{cart.length}</span>
                     </button>
                     <button onClick={onClose} className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur transition-colors">
                        ✕
                     </button>
                </div>
            </div>

            {/* SCROLLABLE WORLD CONTAINER */}
            <div className="relative w-full h-[400vh] bg-[#051a15]">
                
                {/* 1. FOREST FLOOR (Procedural Trees) */}
                <div className="absolute inset-0 overflow-hidden">
                    {trees.map(tree => (
                        <div
                            key={tree.id}
                            className="absolute rounded-full shadow-2xl"
                            style={{
                                left: `${tree.x}%`,
                                top: `${tree.y}%`,
                                width: `${tree.size}px`,
                                height: `${tree.size}px`,
                                backgroundColor: tree.color,
                                zIndex: tree.zIndex,
                                opacity: 0.8,
                                boxShadow: 'inset 10px 10px 20px rgba(255,255,255,0.05), 10px 10px 30px rgba(0,0,0,0.3)'
                            }}
                        />
                    ))}
                </div>

                {/* 2. PRODUCT CLEARINGS */}
                {PRODUCTS.map((product, index) => {
                    const topPos = 15 + (index * 18);
                    const isEven = index % 2 === 0;

                    return (
                        <div 
                            key={product.id}
                            className={`absolute z-30 flex items-center gap-8 ${isEven ? 'left-[10%] flex-row' : 'right-[10%] flex-row-reverse'}`}
                            style={{ top: `${topPos}%` }}
                        >
                            <div className="relative group cursor-pointer" onClick={() => addToCart(product)}>
                                <div className={`absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 group-hover:bg-white/30 transition-all duration-500`}></div>
                                
                                <div className="relative w-64 h-64 rounded-3xl overflow-hidden border-4 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-4">
                                        <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2">Click to Collect</p>
                                        <div className="bg-emerald-500 text-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl max-w-xs transition-all duration-700 hover:bg-black/60`}>
                                <h3 className={`text-2xl font-display font-bold ${product.accentColor} mb-2`}>{product.name}</h3>
                                <p className="text-emerald-100/70 text-sm leading-relaxed mb-4">{product.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-white font-bold text-lg">${product.price}</span>
                                    <button 
                                        onClick={() => addToCart(product)}
                                        className="text-xs uppercase font-bold tracking-widest text-white/50 hover:text-white transition-colors"
                                    >
                                        Add to Basket
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* 3. ATMOSPHERE OVERLAYS */}
                <div className="absolute inset-0 pointer-events-none z-40 opacity-30 mix-blend-multiply" 
                     style={{ 
                         backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
                         backgroundSize: '200px'
                     }}>
                </div>
                
                <div className="absolute inset-0 pointer-events-none z-40 opacity-20 animate-drift">
                     <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-white blur-[100px] rounded-full"></div>
                     <div className="absolute top-[40%] right-[10%] w-[50vw] h-[50vw] bg-white blur-[120px] rounded-full"></div>
                     <div className="absolute top-[70%] left-[30%] w-[30vw] h-[30vw] bg-white blur-[80px] rounded-full"></div>
                </div>

                <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-50 opacity-20 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
            </div>

            <style>{`
                @keyframes drift {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.02); }
                    100% { transform: translateY(0) scale(1); }
                }
                .animate-drift {
                    animation: drift 20s infinite ease-in-out;
                }
                ::-webkit-scrollbar { width: 0px; }
            `}</style>
        </div>
    );
};

export default ForestDemo;
