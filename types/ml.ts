export interface ImageClassificationResult {
  type: 'plant' | 'human' | 'animal' | 'other';
  confidence: number;
}

export interface MLClassificationResult {
  prediction: ImageClassificationResult | null;
  isUncertain: boolean;
  error?: string;
}
