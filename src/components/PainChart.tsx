'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PainEntry {
  id: number;
  bodyPart: string;
  painLevel: number;
  createdAt: string;
}

interface PainChartProps {
  entries: PainEntry[];
}

const bodyPartNames: { [key: string]: string } = {
  cabeca: 'Cabeça',
  pescoco: 'Pescoço',
  ombro: 'Ombro',
  costas: 'Costas',
  quadril: 'Quadril',
  perna: 'Perna',
  pes: 'Pés',
};

const bodyPartColors: { [key: string]: string } = {
  cabeca: '#8b5cf6',
  pescoco: '#06b6d4',
  ombro: '#10b981',
  costas: '#f59e0b',
  quadril: '#ef4444',
  perna: '#3b82f6',
  pes: '#f97316',
};

export default function PainChart({ entries }: PainChartProps) {
  // Group entries by body part and sort by date
  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.bodyPart]) {
      acc[entry.bodyPart] = [];
    }
    acc[entry.bodyPart].push(entry);
    return acc;
  }, {} as { [key: string]: PainEntry[] });

  // Sort entries by date for each body part
  Object.keys(groupedEntries).forEach(bodyPart => {
    groupedEntries[bodyPart].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  });

  // Create chart data by combining all entries and sorting by date
  const chartData = entries
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(entry => ({
      date: new Date(entry.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
      fullDate: entry.createdAt,
      [entry.bodyPart]: entry.painLevel,
    }));

  // Merge entries with same date
  const mergedData = chartData.reduce((acc, curr) => {
    const existingEntry = acc.find(item => item.date === curr.date);
    if (existingEntry) {
      Object.assign(existingEntry, curr);
    } else {
      acc.push(curr);
    }
    return acc;
  }, [] as Array<{ date: string; fullDate: string; [key: string]: string | number }>);

  const bodyParts = Object.keys(groupedEntries);

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhum dado disponível para o gráfico</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-subheading mb-4">
          Evolução da Dor por Região
        </h3>
        
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 10]}
                tick={{ fontSize: 12 }}
                label={{ value: 'Nível de Dor', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value}/10`,
                  bodyPartNames[name] || name
                ]}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Legend 
                formatter={(value) => bodyPartNames[value] || value}
              />
              {bodyParts.map(bodyPart => (
                <Line
                  key={bodyPart}
                  type="monotone"
                  dataKey={bodyPart}
                  stroke={bodyPartColors[bodyPart]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual charts for each body part */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bodyParts.map(bodyPart => {
          const bodyPartData = groupedEntries[bodyPart].map(entry => ({
            date: new Date(entry.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            }),
            painLevel: entry.painLevel,
            fullDate: entry.createdAt,
          }));

          return (
            <div key={bodyPart} className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                {bodyPartNames[bodyPart]}
              </h4>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bodyPartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}/10`, 'Nível de Dor']}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="painLevel"
                      stroke={bodyPartColors[bodyPart]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                <p>Registros: {bodyPartData.length}</p>
                <p>
                  Última dor: {bodyPartData[bodyPartData.length - 1]?.painLevel}/10
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
