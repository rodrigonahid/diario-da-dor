'use client';

import { useState } from 'react';

interface TreatmentFormData {
  symptoms: string;
  duration: string;
  triggers: string;
  previousTreatments: string;
  medications: string;
  notes: string;
}

interface TreatmentFormProps {
  onSubmit: (data: TreatmentFormData) => void;
  loading?: boolean;
}

export default function TreatmentForm({ onSubmit, loading = false }: TreatmentFormProps) {
  const [formData, setFormData] = useState<TreatmentFormData>({
    symptoms: '',
    duration: '',
    triggers: '',
    previousTreatments: '',
    medications: '',
    notes: '',
  });

  const handleChange = (field: keyof TreatmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Informações Adicionais
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
            Descreva os sintomas
          </label>
          <textarea
            id="symptoms"
            value={formData.symptoms}
            onChange={(e) => handleChange('symptoms', e.target.value)}
            placeholder="Como você descreveria a dor? (queimação, pontada, latejante, etc.)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Há quanto tempo sente essa dor?
          </label>
          <select
            id="duration"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Selecione...</option>
            <option value="menos-1-dia">Menos de 1 dia</option>
            <option value="1-3-dias">1 a 3 dias</option>
            <option value="1-semana">Cerca de 1 semana</option>
            <option value="2-4-semanas">2 a 4 semanas</option>
            <option value="1-3-meses">1 a 3 meses</option>
            <option value="mais-3-meses">Mais de 3 meses</option>
          </select>
        </div>

        <div>
          <label htmlFor="triggers" className="block text-sm font-medium text-gray-700 mb-2">
            O que pode ter causado ou piorado a dor?
          </label>
          <textarea
            id="triggers"
            value={formData.triggers}
            onChange={(e) => handleChange('triggers', e.target.value)}
            placeholder="Movimento específico, atividade, postura, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="previousTreatments" className="block text-sm font-medium text-gray-700 mb-2">
            Tratamentos já realizados
          </label>
          <textarea
            id="previousTreatments"
            value={formData.previousTreatments}
            onChange={(e) => handleChange('previousTreatments', e.target.value)}
            placeholder="Fisioterapia, massagem, compressas, repouso, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-2">
            Medicamentos utilizados
          </label>
          <textarea
            id="medications"
            value={formData.medications}
            onChange={(e) => handleChange('medications', e.target.value)}
            placeholder="Anti-inflamatórios, analgésicos, relaxantes musculares, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Observações adicionais
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Qualquer informação adicional que considere importante"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          {loading ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </form>
    </div>
  );
}
