'use client';

import Image from 'next/image';
// Mantemos apenas o necessário: useState e as interfaces e dados.
import { useState } from 'react';

// A lista de BodyParts é mantida apenas para gerar os botões.
interface BodyPart {
  id: string;
  name: string;
  // x, y, width, height são removidos, pois não são mais usados
}

const bodyParts: BodyPart[] = [
  // Apenas 'id' e 'name' são relevantes agora
  { id: 'cabeca', name: 'Cabeça' },
  { id: 'pescoco', name: 'Pescoço' },
  { id: 'ombro', name: 'Ombro' },
  { id: 'costas', name: 'Costas' },
  { id: 'quadril', name: 'Quadril' },
  { id: 'perna', name: 'Perna' },
  { id: 'pes', name: 'Pés' },
];

interface BodyDiagramProps {
  onBodyPartSelect: (bodyPart: string) => void;
  selectedBodyPart?: string;
}

export default function BodyDiagram({ onBodyPartSelect, selectedBodyPart }: BodyDiagramProps) {
  // O estado hoveredPart não é mais necessário
  // const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Se você precisa exibir a imagem estática:
  // Coloque o caminho correto da sua imagem aqui:

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Selecione a parte do corpo com dor
      </h2>
      
      {/* 🚨 Nova Seção: Imagem Estática (Não Clicável) */}
      <div className="relative mb-6">
        <Image
          src="/boneco.png"
          alt="Diagrama Estático do Corpo Humano"
          height={400}
          width={300}
          className="object-contain border border-gray-200 rounded"
        />
      </div>
      {/* Fim da Imagem Estática */}
      
      {/* Lista de Botões para Seleção (Mantida e Estilizada) */}
      <div className="mt-4 grid grid-cols-2 gap-2 w-full max-w-sm">
        {bodyParts.map((part) => (
          <button
            key={part.id}
            onClick={() => onBodyPartSelect(part.id)}
            // Estilização dos botões para refletir a seleção
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
              selectedBodyPart === part.id
                ? 'bg-red-500 text-white border-red-600 shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
            }`}
          >
            {part.name}
          </button>
        ))}
      </div>
    </div>
  );
}