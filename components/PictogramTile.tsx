
import React from 'react';
import { Pictogram } from '../types';

interface PictogramTileProps {
  pictogram: Pictogram;
  onClick: (p: Pictogram) => void;
  size?: 'sm' | 'md' | 'lg';
}

const PictogramTile: React.FC<PictogramTileProps> = ({ pictogram, onClick, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-32 h-32 text-base',
  };

  return (
    <button
      onClick={() => onClick(pictogram)}
      className={`${sizeClasses[size]} flex flex-col items-center justify-center rounded-xl border-2 border-transparent hover:border-blue-400 active:scale-95 transition-all shadow-sm ${pictogram.color} p-2`}
    >
      <span className="text-3xl mb-1">{pictogram.emoji}</span>
      <span className="font-semibold text-center leading-tight">{pictogram.label}</span>
    </button>
  );
};

export default PictogramTile;
