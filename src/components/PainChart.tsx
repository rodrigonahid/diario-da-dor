'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart, // Necessário para os novos gráficos
  Bar,      // Necessário para os novos gráficos
} from 'recharts';

// 🚨 Interfaces Atualizadas
interface TreatmentFormData {
  symptoms?: string;
  duration?: string;
  triggers?: string;
  previousTreatments?: string;
  medications?: string;
  notes?: string;
  // Campos de Monitoramento
  painComparison?: string;
  painPattern?: string;
  painType?: string;
  painRelief?: string;
  painWorse?: string;
  interference?: string;
  sleepQuality?: string; // Campo usado para correlação
  exercisesDone?: string;
  exercisesEffect?: string;
}

interface PainEntry {
  id: number;
  bodyPart: string;
  painLevel: number;
  createdAt: string;
  treatmentForm?: {
    formData: TreatmentFormData;
  };
}

interface PainChartProps {
  entries: PainEntry[];
}

// --------------------------------------------------
// 🚨 Mapeamento de Dados e Cores
// --------------------------------------------------

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

// Mapeamento e Ordem da Qualidade do Sono (para Correlação)
const sleepQualityOrder: { [key: string]: number } = {
  'dormi-bem-sem-dor': 4,
  'incomodou-pouco': 3,
  'acordei-dor': 2,
  'dormi-mal-dor': 1,
};

const sleepQualityLabels: { [key: string]: string } = {
  'dormi-bem-sem-dor': 'Dormi Bem',
  'incomodou-pouco': 'Incomodou Pouco',
  'acordei-dor': 'Acordei com Dor',
  'dormi-mal-dor': 'Dormi Mal',
};

// Mapeamento e Ordem da Duração (para Frequência)
const durationLabels: { [key: string]: string } = {
  'menos-1-dia': 'Menos de 1 dia',
  '1-3-dias': '1-3 Dias',
  '1-semana': 'Cerca de 1 Semana',
  '2-4-semanas': '2-4 Semanas',
  '1-3-meses': '1-3 Meses',
  'mais-3-meses': 'Mais de 3 Meses',
};
const durationOrder = Object.keys(durationLabels);


export default function PainChart({ entries }: PainChartProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhum dado disponível para o gráfico</p>
      </div>
    );
  }

  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.bodyPart]) {
      acc[entry.bodyPart] = [];
    }
    acc[entry.bodyPart].push(entry);
    return acc;
  }, {} as { [key: string]: PainEntry[] });

  const chartData = entries
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
      fullDate: entry.createdAt,
      [entry.bodyPart]: entry.painLevel,
    }));

  const mergedData = chartData.reduce((acc, curr) => {
    const existingEntry = acc.find((item) => item.date === curr.date);
    if (existingEntry) {
      Object.assign(existingEntry, curr);
    } else {
      acc.push(curr);
    }
    return acc;
  }, [] as Array<{ date: string; fullDate: string; [key: string]: string | number }>);
  
  const bodyParts = Object.keys(groupedEntries);

  // 2. Gráfico de Frequência da Duração da Dor
  const durationData = entries.reduce((acc, entry) => {
    const durationKey = entry.treatmentForm?.formData?.duration;
    if (durationKey) {
      acc[durationKey] = (acc[durationKey] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const durationChartData = durationOrder
    .filter(key => durationData[key] !== undefined)
    .map((key) => ({
      name: durationLabels[key],
      registros: durationData[key],
    }));


  // 3. Gráfico de Correlação Dor vs. Sono (Média de Dor por Categoria de Sono)
  const sleepPainData = entries.reduce((acc, entry) => {
    const sleepKey = entry.treatmentForm?.formData?.sleepQuality;
    const painLevel = entry.painLevel;

    if (sleepKey && painLevel !== undefined) {
        if (!acc[sleepKey]) {
            acc[sleepKey] = {
                totalPain: 0,
                count: 0,
                label: sleepQualityLabels[sleepKey] || sleepKey,
                order: sleepQualityOrder[sleepKey] || 0,
            };
        }
        acc[sleepKey].totalPain += painLevel;
        acc[sleepKey].count += 1;
    }
    return acc;
  }, {} as { [key: string]: { totalPain: number, count: number, label: string, order: number } });

  const sleepChartData = Object.values(sleepPainData)
    .map(data => ({
        name: data.label,
        mediaDor: data.totalPain / data.count, 
        order: data.order,
    }))
    .sort((a, b) => b.order - a.order); 

  // --------------------------------------------------
  // RENDERIZAÇÃO
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      
      {/* 1. Gráfico de Linha Principal: Evolução da Dor por Região */}
      <div className="card">
        <h3 className="text-subheading mb-4">Evolução da Dor por Região</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Nível de Dor',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value}/10`,
                  bodyPartNames[name] || name,
                ]}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Legend formatter={(value) => bodyPartNames[value] || value} />
              {bodyParts.map((bodyPart) => (
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

      {/* 2. Gráfico de Correlação Dor vs. Sono */}
      {sleepChartData.length > 0 && (
          <div className="card">
              <h3 className="text-subheading mb-4">Média de Dor por Qualidade do Sono</h3>
              <p className="text-caption text-gray-500 mb-4">Correlação entre o sono na noite anterior e o nível de dor.</p>
              <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sleepChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={40}/>
                          <YAxis 
                              domain={[0, 10]}
                              tick={{ fontSize: 10 }}
                              label={{
                                  value: "Nível Médio de Dor",
                                  angle: -90,
                                  position: "insideLeft",
                                  fontSize: 12
                              }}
                          />
                          <Tooltip 
                              cursor={{ fill: '#f1f5f9' }}
                              formatter={(value: number) => [`Média: ${value.toFixed(1)}/10`, 'Nível de Dor']}
                          />
                          <Bar 
                              dataKey="mediaDor" 
                              fill="#f97316"
                              radius={[4, 4, 0, 0]}
                          />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      )}

      {/* 3. Gráfico de Frequência da Duração da Dor */}
      {durationChartData.length > 0 && (
          <div className="card">
              <h3 className="text-subheading mb-4">Frequência da Duração da Dor</h3>
              <p className="text-caption text-gray-500 mb-4">Contagem de registros por faixa de duração da dor.</p>
              <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={durationChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                              dataKey="name" 
                              interval={0} 
                              angle={-25}
                              textAnchor="end"
                              height={60}
                              tick={{ fontSize: 10 }} 
                          />
                          <YAxis 
                              allowDecimals={false}
                              label={{
                                  value: "Total de Registros",
                                  angle: -90,
                                  position: "insideLeft",
                                  fontSize: 12
                              }}
                          />
                          <Tooltip 
                              cursor={{ fill: '#f1f5f9' }}
                              formatter={(value: number) => [`${value}x`, 'Registros']}
                          />
                          <Bar 
                              dataKey="registros" 
                              fill="#22c55e"
                              radius={[4, 4, 0, 0]}
                          />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      )}

      {/* 4. Gráficos Individuais para cada bodyPart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bodyParts.map((bodyPart) => {
          const bodyPartData = groupedEntries[bodyPart].map((entry) => ({
            date: new Date(entry.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            }),
            painLevel: entry.painLevel,
            fullDate: entry.createdAt,
          }));

          // Certifica-se que há dados antes de renderizar (embora o 'bodyParts' já garanta isso)
          if (bodyPartData.length === 0) return null;

          return (
            <div
              key={bodyPart}
              className="bg-white rounded-lg p-4 shadow-sm border"
            >
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                {bodyPartNames[bodyPart]}
              </h4>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bodyPartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value}/10`,
                        'Nível de Dor',
                      ]}
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
                  Última dor: {bodyPartData[bodyPartData.length - 1]?.painLevel}
                  /10
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}