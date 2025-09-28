// @/components/ui/spinner.tsx
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number; 
  className?: string;
}

export const Spinner = ({ size = 24, className }: SpinnerProps) => {
  return (
    <Loader2 
      className={`animate-spin ${className}`} 
      size={size} 
    />
  );
};