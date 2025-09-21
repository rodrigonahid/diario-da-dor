'use client';

import { useState } from 'react';

interface BodyPart {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const bodyParts: BodyPart[] = [
  { id: 'cabeca', name: 'Cabeça', x: 45, y: 5, width: 10, height: 12 },
  { id: 'pescoco', name: 'Pescoço', x: 47, y: 17, width: 6, height: 8 },
  { id: 'ombro', name: 'Ombro', x: 35, y: 25, width: 30, height: 10 },
  { id: 'costas', name: 'Costas', x: 40, y: 35, width: 20, height: 25 },
  { id: 'quadril', name: 'Quadril', x: 42, y: 60, width: 16, height: 12 },
  { id: 'perna', name: 'Perna', x: 35, y: 72, width: 30, height: 20 },
  { id: 'pes', name: 'Pés', x: 40, y: 92, width: 20, height: 6 },
];

interface BodyDiagramProps {
  onBodyPartSelect: (bodyPart: string) => void;
  selectedBodyPart?: string;
}

export default function BodyDiagram({ onBodyPartSelect, selectedBodyPart }: BodyDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Selecione a parte do corpo com dor
      </h2>
      
      <div className="relative bg-gray-50 rounded-lg p-4">
        <svg
          width="300"
          height="400"
          viewBox="0 0 100 100"
          className="border border-gray-200 rounded"
        >
          {bodyParts.map((part) => (
            <rect
              key={part.id}
              x={part.x}
              y={part.y}
              width={part.width}
              height={part.height}
              fill={
                selectedBodyPart === part.id
                  ? '#ef4444'
                  : hoveredPart === part.id
                  ? '#fca5a5'
                  : '#e5e7eb'
              }
              stroke={
                selectedBodyPart === part.id || hoveredPart === part.id
                  ? '#dc2626'
                  : '#9ca3af'
              }
              strokeWidth="0.5"
              className="cursor-pointer transition-colors duration-200"
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => onBodyPartSelect(part.id)}
            />
          ))}
          
          <circle
            cx="50"
            cy="11"
            r="6"
            fill={
              selectedBodyPart === 'cabeca'
                ? '#ef4444'
                : hoveredPart === 'cabeca'
                ? '#fca5a5'
                : '#e5e7eb'
            }
            stroke={
              selectedBodyPart === 'cabeca' || hoveredPart === 'cabeca'
                ? '#dc2626'
                : '#9ca3af'
            }
            strokeWidth="0.5"
            className="cursor-pointer transition-colors duration-200"
            onMouseEnter={() => setHoveredPart('cabeca')}
            onMouseLeave={() => setHoveredPart(null)}
            onClick={() => onBodyPartSelect('cabeca')}
          />
        </svg>
        
        {hoveredPart && (
          <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm">
            {bodyParts.find(p => p.id === hoveredPart)?.name}
          </div>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 w-full max-w-sm">
        {bodyParts.map((part) => (
          <button
            key={part.id}
            onClick={() => onBodyPartSelect(part.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedBodyPart === part.id
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {part.name}
          </button>
        ))}
      </div>
    </div>
  );
}
