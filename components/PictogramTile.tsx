
import React from 'react';
import { Pictogram } from '../types';

interface PictogramTileProps {
  pictogram: Pictogram;
  onClick: (p: Pictogram) => void;
  size?: 'sm' | 'md' | 'lg';
}

const PictogramTile: React.FC<PictogramTileProps> = ({ pictogram, onClick, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-[10px]',
    md: 'aspect-square w-full min-h-[110px] text-xs',
    lg: 'w-32 h-32 text-base',
  };

  return (
    <button
      onClick={() => onClick(pictogram)}
      className={`${sizeClasses[size]} flex flex-col items-center justify-center rounded-[2rem] border-2 border-transparent hover:border-indigo-400 active:scale-90 transition-all duration-200 shadow-lg ${pictogram.color} p-3 group relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span className="text-4xl mb-2 drop-shadow-md group-hover:scale-110 transition-transform">{pictogram.emoji}</span>
      <span className="font-black text-center leading-tight uppercase tracking-tight">{pictogram.label}</span>
    </button>
  );
};

export default PictogramTile;
