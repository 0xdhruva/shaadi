import { Prediction, UserPrediction } from '../types/predictions';

export function calculateOdds(totalBets: Record<string, number>): Record<string, number> {
  const totalAmount = Object.values(totalBets).reduce((sum, bet) => sum + bet, 0);
  const odds: Record<string, number> = {};

  for (const [option, betAmount] of Object.entries(totalBets)) {
    odds[option] = totalAmount / betAmount;
  }

  return odds;
}

export function updateOdds(prediction: Prediction, newBet: UserPrediction): Prediction {
  const updatedTotalBets = { ...prediction.totalBets };
  updatedTotalBets[newBet.choice] += newBet.betAmount;

  const updatedOdds = calculateOdds(updatedTotalBets);

  return {
    ...prediction,
    currentOdds: updatedOdds,
    totalBets: updatedTotalBets,
  };
}

export function simulateBets(predictions: Prediction[], numGuests: number, betPerGuest: number): Prediction[] {
  return predictions.map(prediction => {
    const totalBets = { ...prediction.totalBets };
    
    for (let i = 0; i < numGuests; i++) {
      const randomOption = prediction.options[Math.floor(Math.random() * prediction.options.length)];
      const randomBetAmount = betPerGuest * 0.9; // Accounting for 10% house cut
      totalBets[randomOption] += randomBetAmount;
    }

    const updatedOdds = calculateOdds(totalBets);

    return {
      ...prediction,
      currentOdds: updatedOdds,
      totalBets: totalBets,
    };
  });
}

export function calculateCouplePot(predictions: Prediction[], userTotalBet: number): number {
  const totalSimulatedBets = predictions.reduce((sum, prediction) => 
    sum + Object.values(prediction.totalBets).reduce((a, b) => a + b, 0), 0);
  
  // 300 guests betting 1000 each, plus the user's bet
  const totalBetAmount = 300 * 1000 + userTotalBet;
  
  return totalBetAmount * 0.1;
}

