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
  contentSpeed?: number;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  heroImage: string;
  description: string;
  challenge: string;
  solution: string;
  hasDemo?: boolean; // New flag to indicate if a live demo exists
  stats: {
    role: string;
    client: string;
    timeline: string;
    stack: string[];
  };
  gallery: string[];
}