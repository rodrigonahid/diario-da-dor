'use client';

interface PainLevelSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function PainLevelSlider({ value, onChange }: PainLevelSliderProps) {
  const getPainColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPainDescription = (level: number) => {
    if (level === 0) return 'Sem dor';
    if (level <= 3) return 'Dor leve';
    if (level <= 6) return 'Dor moderada';
    if (level <= 8) return 'Dor intensa';
    return 'Dor muito intensa';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Nível da Dor
      </h3>
      
      <div className="mb-6">
        <div className={`text-4xl font-bold text-center mb-2 ${getPainColor(value)}`}>
          {value}
        </div>
        <div className={`text-center font-medium ${getPainColor(value)}`}>
          {getPainDescription(value)}
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 30%, #f59e0b 30%, #f59e0b 60%, #ef4444 60%, #ef4444 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      <div className="grid grid-cols-11 gap-1 mb-4">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`h-8 rounded text-xs font-medium transition-colors ${
              value === i
                ? i <= 3
                  ? 'bg-green-500 text-white'
                  : i <= 6
                  ? 'bg-yellow-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-600 text-center">
        <p className="mb-1">0 = Sem dor</p>
        <p>10 = Pior dor imaginável</p>
      </div>
    </div>
  );
}
