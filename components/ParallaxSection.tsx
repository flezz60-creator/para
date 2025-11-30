import React, { useRef, useEffect, useState } from 'react';
import { ParallaxSectionProps } from '../types';

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  backgroundImage, 
  children, 
  speed = 0.5,
  contentSpeed = 0,
  height = "h-screen",
  overlayColor = "bg-black/40"
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [contentOffsetY, setContentOffsetY] = useState(0);

  // Use requestAnimationFrame for smoother parallax performance
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Calculate offset relative to viewport
        const scrollPosition = window.pageYOffset;
        const sectionTop = sectionRef.current.offsetTop;
        const windowHeight = window.innerHeight;
        
        // Only animate when near viewport to save resources
        const isInView = rect.top < windowHeight && rect.bottom > 0;
        
        if (isInView) {
            const distance = scrollPosition - sectionTop;
            setOffsetY(distance * speed);
            setContentOffsetY(distance * contentSpeed);
        }
      }
    };

    const loop = () => {
      handleScroll();
      animationFrameId = requestAnimationFrame(loop);
    };

    // Initial call
    loop(); 

    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, contentSpeed]);

  return (
    <div 
      ref={sectionRef} 
      className={`relative overflow-hidden ${height} flex items-center justify-center`}
    >
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 w-full h-[120%] pointer-events-none"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          transform: `translateY(${offsetY}px)`,
          willChange: 'transform',
          top: '-10%' // Start slightly higher to allow movement without whitespace
        }}
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayColor}`} />

      {/* Content Layer */}
      <div 
        className="relative z-10 w-full max-w-4xl px-6"
        style={{
            transform: `translateY(${contentOffsetY}px)`,
            willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;