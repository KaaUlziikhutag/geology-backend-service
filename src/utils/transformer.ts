import { ValueTransformer } from 'typeorm';

export const DecimalTransformer: ValueTransformer = {
  to: (value: number): number => value,
  from: (value: string | null): number | null => {
    if (value === null) return null;
    return parseFloat(value);
  },
};
