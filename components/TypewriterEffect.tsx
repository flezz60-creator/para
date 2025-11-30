import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  prefix?: string;
  words: string[]; // Die Wörter, die rotieren sollen (für Überschriften)
  staticText?: string; // Für lange Paragraphen, die einmal getippt werden
  delay?: number;
  highlightWords?: string[]; // Wörter im staticText, die blau werden sollen
  className?: string;
  isHeadline?: boolean; // Unterscheidet zwischen Loop-Effekt und einmaligem Tippen
}

export const TypewriterEffect: React.FC<TypewriterProps> = ({ 
  prefix = '', 
  words = [], 
  staticText = '', 
  delay = 100, 
  highlightWords = [],
  className = '',
  isHeadline = false
}) => {
  const [currentText, setCurrentText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  
  // Logic for Infinite Looping Headline (e.g. "not just websites" -> "not just code")
  useEffect(() => {
    if (!isHeadline || words.length === 0) return;

    const typeSpeed = isDeleting ? 50 : 100;
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (isWaiting) {
        setIsWaiting(false);
        setIsDeleting(true);
        return;
      }

      if (isDeleting) {
        setCurrentText(prev => prev.substring(0, prev.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        if (currentText === currentWord) {
          setIsWaiting(true);
        }
      }
    }, isWaiting ? 2000 : typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isWaiting, currentWordIndex, words, isHeadline]);


  // Logic for Static Paragraph Typing (Types once)
  useEffect(() => {
    if (isHeadline || !staticText) return;

    if (currentText.length < staticText.length) {
      const timeout = setTimeout(() => {
        setCurrentText(staticText.substring(0, currentText.length + 1));
      }, 30); // Schnelleres Tippen für Fließtext
      return () => clearTimeout(timeout);
    }
  }, [currentText, staticText, isHeadline]);

  // Renderer Helper for Paragraphs to highlight keywords
  const renderParagraph = () => {
    if (!staticText) return null;

    // Wenn noch nicht fertig getippt, zeige rohen Text
    if (currentText.length < staticText.length) {
      return (
        <span>
          {currentText}
          <span className="animate-pulse border-r-2 border-sky-500 ml-1 inline-block h-[1em] align-middle"></span>
        </span>
      );
    }

    // Wenn fertig, parse nach Keywords
    const parts = staticText.split(new RegExp(`(${highlightWords.join('|')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => {
          const isHighlight = highlightWords.some(hw => hw.toLowerCase() === part.toLowerCase());
          return isHighlight ? (
            <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </span>
    );
  };

  if (!isHeadline) {
    return <div className={className}>{renderParagraph()}</div>;
  }

  return (
    <span className={className}>
      {prefix}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 relative">
        {currentText}
      </span>
      <span className="animate-pulse border-r-4 border-sky-500 ml-1 inline-block h-[0.8em] align-baseline"></span>
    </span>
  );
};

export default TypewriterEffect;