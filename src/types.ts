export interface Prediction {
  hourMinute: string;
  multiplier: number;
  timestamp: number;
}

export interface AppState {
  currentPrediction: Prediction | null;
  history: Prediction[];
  isPredicting: boolean;
  onlineCount: number;
}
