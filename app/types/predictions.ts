export interface Prediction {
  id: string;
  event: string;
  options: string[];
  initialOdds: Record<string, number>;
  currentOdds: Record<string, number>;
  totalBets: Record<string, number>;
}

export interface UserPrediction {
  predictionId: string;
  choice: string;
  betAmount: number;
}

export interface SimulationResult {
  predictionId: string;
  result: string;
  userChoice: string;
  userBetAmount: number;
  userWinnings: number;
  finalOdds: number;
}

export interface BettingStats {
  totalBets: number;
  wonBets: number;
  totalWinnings: number;
  netProfit: number;
}

