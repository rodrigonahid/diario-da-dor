'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; 
import { Textarea } from '@/components/ui/textarea'; 

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

const durationOptions = [
  { value: 'menos-1-dia', label: 'Menos de 1 dia' },
  { value: '1-3-dias', label: '1 a 3 dias' },
  { value: '1-semana', label: 'Cerca de 1 semana' },
  { value: '2-4-semanas', label: '2 a 4 semanas' },
  { value: '1-3-meses', label: '1 a 3 meses' },
  { value: 'mais-3-meses', label: 'Mais de 3 meses' },
];

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
  
  const handleDurationChange = (value: string) => {
    handleChange('duration', value);
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
          <Textarea
            id="symptoms"
            value={formData.symptoms}
            onChange={(e) => handleChange('symptoms', e.target.value)}
            placeholder="Como você descreveria a dor? (queimação, pontada, latejante, etc.)"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Há quanto tempo sente essa dor?
          </label>
          
          <Select 
            onValueChange={handleDurationChange} 
            value={formData.duration}
            required
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="triggers" className="block text-sm font-medium text-gray-700 mb-2">
            O que pode ter causado ou piorado a dor?
          </label>
          <Textarea
            id="triggers"
            value={formData.triggers}
            onChange={(e) => handleChange('triggers', e.target.value)}
            placeholder="Movimento específico, atividade, postura, etc."
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="previousTreatments" className="block text-sm font-medium text-gray-700 mb-2">
            Tratamentos já realizados
          </label>
          <Textarea
            id="previousTreatments"
            value={formData.previousTreatments}
            onChange={(e) => handleChange('previousTreatments', e.target.value)}
            placeholder="Fisioterapia, massagem, compressas, repouso, etc."
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-2">
            Medicamentos utilizados
          </label>
          <Textarea
            id="medications"
            value={formData.medications}
            onChange={(e) => handleChange('medications', e.target.value)}
            placeholder="Anti-inflamatórios, analgésicos, relaxantes musculares, etc."
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Observações adicionais
          </label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Qualquer informação adicional que considere importante"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </form>
    </div>
  );
}