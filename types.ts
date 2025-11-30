import React from 'react';

export interface GeneratedImage {
  base64: string;
  prompt: string;
}

export interface ParallaxSectionProps {
  backgroundImage: string;
  children?: React.ReactNode;
  speed?: number; // Speed factor (0-1 usually, or higher for dramatic effect)
  height?: string;
  overlayColor?: string;
}