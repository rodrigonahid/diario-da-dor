'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; 

interface TreatmentFormData {
  painComparison: string; 
  painPattern: string;    
  painType: string;       
  painRelief: string;     
  painWorse: string;      
  interference: string;   
  sleepQuality: string;   
  exercisesDone: string;  
  exercisesEffect: string;
}

interface TreatmentFormProps {
  onSubmit: (data: TreatmentFormData) => void;
  loading?: boolean;
}

const painComparisonOptions = [
  { value: 'melhorou', label: 'Melhorou' },
  { value: 'igual', label: 'Igual' },
  { value: 'piorou', label: 'Piorou' },
];

const painPatternOptions = [
  { value: 'constante', label: 'Constante' },
  { value: 'intermitente', label: 'Intermitente' },
  { value: 'piora-movimento', label: 'Piora em certos movimentos e/ou momentos' },
];

const painTypeOptions = [
  { value: 'pontada', label: 'Pontada' },
  { value: 'queimacao', label: 'Queimação' },
  { value: 'peso', label: 'Peso' },
  { value: 'choque', label: 'Choque' },
  { value: 'ardencia', label: 'Ardência' },
  { value: 'outro', label: 'Outro' },
];

const painReliefOptions = [
  { value: 'repouso', label: 'Repouso' },
  { value: 'movimento', label: 'Movimento' },
  { value: 'medicacao', label: 'Medicação' },
  { value: 'gelo-calor', label: 'Gelo/calor' },
  { value: 'fisioterapia', label: 'Sessão de fisioterapia' },
  { value: 'nada', label: 'Nada aliviou' },
  { value: 'outro', label: 'Outro' },
];

const painWorseOptions = [
  { value: 'movimento', label: 'Movimento' },
  { value: 'repouso', label: 'Repouso' },
  { value: 'subir-escadas', label: 'Subir escadas' },
  { value: 'trabalhar', label: 'Trabalhar' },
  { value: 'domesticas', label: 'Atividades domésticas' },
  { value: 'outro', label: 'Outro' },
];

const interferenceOptions = [
  { value: 'nao', label: 'Não' },
  { value: 'pouco', label: 'Pouco' },
  { value: 'moderadamente', label: 'Moderadamente' },
  { value: 'muito', label: 'Muito' },
  { value: 'totalmente', label: 'Totalmente' },
];

const sleepQualityOptions = [
  { value: 'dormi-bem-sem-dor', label: 'Dormi bem, sem dor' },
  { value: 'incomodou-pouco', label: 'A dor incomodou um pouco' },
  { value: 'acordei-dor', label: 'Acordei por causa da dor' },
  { value: 'dormi-mal-dor', label: 'Dormi mal devido à dor' },
];

const exercisesDoneOptions = [
  { value: 'sim-todos', label: 'Sim – todos' },
  { value: 'sim-parcialmente', label: 'Sim – parcialmente' },
  { value: 'nao-consegui', label: 'Não consegui fazer' },
];

const exercisesEffectOptions = [
  { value: 'melhor', label: 'Melhor' },
  { value: 'igual', label: 'Igual' },
  { value: 'pior', label: 'Pior' },
  { value: 'nao-fiz', label: 'Não fiz' },
];

interface SelectFieldProps {
    id: keyof TreatmentFormData;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

const SelectField = ({ id, label, options, value, onChange, required }: SelectFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <Select 
      onValueChange={onChange} 
      value={value}
      required={required}
    >
      <SelectTrigger id={id} className="w-full h-12">
        <SelectValue placeholder="Selecione..." />
      </SelectTrigger>
      
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);


export default function TreatmentForm({ onSubmit, loading = false }: TreatmentFormProps) {
  const [formData, setFormData] = useState<TreatmentFormData>({
    painComparison: '',
    painPattern: '',
    painType: '',
    painRelief: '',
    painWorse: '',
    interference: '',
    sleepQuality: '',
    exercisesDone: '',
    exercisesEffect: '',
  });

  const handleChange = (field: keyof TreatmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSelectChange = (field: keyof TreatmentFormData) => (value: string) => {
    handleChange(field, value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Informações Adicionais
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SelectField
          id="painComparison"
          label="Como você classificaria sua dor hoje em relação a ontem?"
          options={painComparisonOptions}
          value={formData.painComparison}
          onChange={handleSelectChange('painComparison')}
          required
        />

        <SelectField
          id="painPattern"
          label="A dor é constante ou varia durante o dia?"
          options={painPatternOptions}
          value={formData.painPattern}
          onChange={handleSelectChange('painPattern')}
          required
        />

        <SelectField
          id="painType"
          label="Tipo da dor (você sente como):"
          options={painTypeOptions}
          value={formData.painType}
          onChange={handleSelectChange('painType')}
          required
        />

        <SelectField
          id="painRelief"
          label="O que mais aliviou a dor hoje?"
          options={painReliefOptions}
          value={formData.painRelief}
          onChange={handleSelectChange('painRelief')}
          required
        />
        
        <SelectField
          id="painWorse"
          label="O que mais piorou a dor hoje?"
          options={painWorseOptions}
          value={formData.painWorse}
          onChange={handleSelectChange('painWorse')}
          required
        />

        <SelectField
          id="interference"
          label="A dor interferiu em suas atividades diárias hoje?"
          options={interferenceOptions}
          value={formData.interference}
          onChange={handleSelectChange('interference')}
          required
        />

        <SelectField
          id="sleepQuality"
          label="Como foi seu sono na última noite em relação à dor?"
          options={sleepQualityOptions}
          value={formData.sleepQuality}
          onChange={handleSelectChange('sleepQuality')}
          required
        />

        <SelectField
          id="exercisesDone"
          label="Você realizou os exercícios orientados?"
          options={exercisesDoneOptions}
          value={formData.exercisesDone}
          onChange={handleSelectChange('exercisesDone')}
          required
        />

        <SelectField
          id="exercisesEffect"
          label="Após os exercícios, como você se sentiu?"
          options={exercisesEffectOptions}
          value={formData.exercisesEffect}
          onChange={handleSelectChange('exercisesEffect')}
          required
        />

        

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