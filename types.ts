export interface GeneratedData {
  timestamp: number;
  prompt: string;
  data: any; // Can be object or array
  raw: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: 'e-commerce' | 'social' | 'fintech' | 'system';
}

export enum GeneratorStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}