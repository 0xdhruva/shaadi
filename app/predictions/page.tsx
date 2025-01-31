'use client'

import { useState, useEffect, useRef } from 'react';
import { PredictionItem } from '../components/PredictionItem';
import { Wallet } from '../components/Wallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Prediction, UserPrediction, SimulationResult, BettingStats } from '../types/predictions';
import { updateOdds, simulateBets, calculateCouplePot } from '../utils/betting';

export interface BettingStats {
  totalBets: number;
  wonBets: number;
  totalWinnings: number;
  netProfit: number;
  couplePot: number;
  yourDonation: number;
}

const initialPredictions: Prediction[] = [
  {
    id: '1',
    event: "First Dance Song",
    options: ["Bollywood Medley", "Sufi Song", "Western Pop Song", "Classical Indian"],
    initialOdds: {"Bollywood Medley": 2, "Sufi Song": 3, "Western Pop Song": 4, "Classical Indian": 5},
    currentOdds: {"Bollywood Medley": 2, "Sufi Song": 3, "Western Pop Song": 4, "Classical Indian": 5},
    totalBets: {"Bollywood Medley": 0, "Sufi Song": 0, "Western Pop Song": 0, "Classical Indian": 0},
  },
  {
    id: '2',
    event: "Bride's Saree Color",
    options: ["Red", "Pink", "Gold", "White"],
    initialOdds: {"Red": 2, "Pink": 3, "Gold": 4, "White": 5},
    currentOdds: {"Red": 2, "Pink": 3, "Gold": 4, "White": 5},
    totalBets: {"Red": 0, "Pink": 0, "Gold": 0, "White": 0},
  },
  {
    id: '3',
    event: "Number of Dishes in Main Course",
    options: ["5-7", "8-10", "11-13", "14+"],
    initialOdds: {"5-7": 2, "8-10": 3, "11-13": 4, "14+": 5},
    currentOdds: {"5-7": 2, "8-10": 3, "11-13": 4, "14+": 5},
    totalBets: {"5-7": 0, "8-10": 0, "11-13": 0, "14+": 0},
  },
  {
    id: '4',
    event: "Groom's Entry",
    options: ["Horse", "Vintage Car", "Elephant", "Palanquin"],
    initialOdds: {"Horse": 2, "Vintage Car": 3, "Elephant": 4, "Palanquin": 5},
    currentOdds: {"Horse": 2, "Vintage Car": 3, "Elephant": 4, "Palanquin": 5},
    totalBets: {"Horse": 0, "Vintage Car": 0, "Elephant": 0, "Palanquin": 0},
  },
  {
    id: '5',
    event: "Duration of Wedding Ceremony",
    options: ["1-2 hours", "2-3 hours", "3-4 hours", "4+ hours"],
    initialOdds: {"1-2 hours": 2, "2-3 hours": 3, "3-4 hours": 4, "4+ hours": 5},
    currentOdds: {"1-2 hours": 2, "2-3 hours": 3, "3-4 hours": 4, "4+ hours": 5},
    totalBets: {"1-2 hours": 0, "2-3 hours": 0, "3-4 hours": 0, "4+ hours": 0},
  },
  {
    id: '6',
    event: "Number of Outfit Changes by Bride",
    options: ["1", "2", "3", "4+"],
    initialOdds: {"1": 2, "2": 3, "3": 4, "4+": 5},
    currentOdds: {"1": 2, "2": 3, "3": 4, "4+": 5},
    totalBets: {"1": 0, "2": 0, "3": 0, "4+": 0},
  },
  {
    id: '7',
    event: "Mehendi Design Theme",
    options: ["Traditional", "Modern", "Fusion", "Minimalist"],
    initialOdds: {"Traditional": 2, "Modern": 3, "Fusion": 4, "Minimalist": 5},
    currentOdds: {"Traditional": 2, "Modern": 3, "Fusion": 4, "Minimalist": 5},
    totalBets: {"Traditional": 0, "Modern": 0, "Fusion": 0, "Minimalist": 0},
  },
  {
    id: '8',
    event: "Wedding Hashtag First Letter",
    options: ["#A", "#K", "#R", "#S"],
    initialOdds: {"#A": 2, "#K": 3, "#R": 4, "#S": 5},
    currentOdds: {"#A": 2, "#K": 3, "#R": 4, "#S": 5},
    totalBets: {"#A": 0, "#K": 0, "#R": 0, "#S": 0},
  },
  {
    id: '9',
    event: "Sangeet Performance Winner",
    options: ["Bride's Side", "Groom's Side", "Couple", "Tie"],
    initialOdds: {"Bride's Side": 2, "Groom's Side": 3, "Couple": 4, "Tie": 5},
    currentOdds: {"Bride's Side": 2, "Groom's Side": 3, "Couple": 4, "Tie": 5},
    totalBets: {"Bride's Side": 0, "Groom's Side": 0, "Couple": 0, "Tie": 0},
  },
  {
    id: '10',
    event: "Wedding Favors",
    options: ["Sweets", "Plants", "Personalized Items", "Charitable Donations"],
    initialOdds: {"Sweets": 2, "Plants": 3, "Personalized Items": 4, "Charitable Donations": 5},
    currentOdds: {"Sweets": 2, "Plants": 3, "Personalized Items": 4, "Charitable Donations": 5},
    totalBets: {"Sweets": 0, "Plants": 0, "Personalized Items": 0, "Charitable Donations": 0},
  },
];

const predeterminedResults: Record<string, string> = {
  '1': "Bollywood Medley",
  '2': "Red",
  '3': "8-10",
  '4': "Horse",
  '5': "2-3 hours",
  '6': "3",
  '7': "Fusion",
  '8': "#K",
  '9': "Couple",
  '10': "Personalized Items",
};

export default function Predictions() {
  const [predictions, setPredictions] = useState<Prediction[]>(initialPredictions);
  const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
  const [wallet, setWallet] = useState<number>(1000);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [bettingStats, setBettingStats] = useState<BettingStats>({
    totalBets: 0,
    wonBets: 0,
    totalWinnings: 0,
    netProfit: 0,
    couplePot: 0,
    yourDonation: 0,
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatedPredictions = simulateBets(predictions, 100, 1000);
    setPredictions(updatedPredictions);
  }, []);

  const handlePredict = (predictionId: string, choice: string, betAmount: number) => {
    if (betAmount > wallet) return;

    const houseCut = betAmount * 0.1;
    const actualBetAmount = betAmount - houseCut;

    const newUserPrediction: UserPrediction = {
      predictionId,
      choice,
      betAmount: actualBetAmount,
      totalBetAmount: betAmount,
    };
    setUserPredictions([...userPredictions, newUserPrediction]);
    setWallet(wallet - betAmount);
    setBettingStats(prev => ({
      ...prev,
      couplePot: prev.couplePot + houseCut,
    }));

    const updatedPredictions = predictions.map(prediction => 
      prediction.id === predictionId ? updateOdds(prediction, newUserPrediction) : prediction
    );
    setPredictions(updatedPredictions);
  };

  const runSimulation = () => {
    const finalPredictions = simulateBets(predictions, 200, 1000);
    setPredictions(finalPredictions);

    const results: SimulationResult[] = userPredictions.map(prediction => {
      const predictionDetails = finalPredictions.find(p => p.id === prediction.predictionId)!;
      const result = predeterminedResults[prediction.predictionId];
      const userWon = prediction.choice === result;
      const finalOdds = predictionDetails.currentOdds[prediction.choice];
      const winnings = userWon ? prediction.betAmount * finalOdds : 0;

      return {
        predictionId: prediction.predictionId,
        result,
        userChoice: prediction.choice,
        userBetAmount: prediction.betAmount,
        totalBetAmount: prediction.totalBetAmount,
        userWinnings: winnings,
        finalOdds,
      };
    });

    setSimulationResults(results);
    setShowResults(true);

    // Calculate betting stats
    const totalBets = results.length;
    const wonBets = results.filter(r => r.userWinnings > 0).length;
    const totalWinnings = results.reduce((sum, r) => sum + r.userWinnings, 0);
    const totalBetAmount = results.reduce((sum, r) => sum + r.totalBetAmount, 0);
    const netProfit = totalWinnings - totalBetAmount;
    const couplePot = calculateCouplePot(finalPredictions, totalBetAmount);

    setBettingStats({
      totalBets,
      wonBets,
      totalWinnings,
      netProfit,
      couplePot,
      yourDonation: 0, // Initialize donation to 0
    });

    // Update wallet
    setWallet(prev => prev + netProfit);
    
    // Scroll to top of results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const resetSimulation = () => {
    setUserPredictions([]);
    setWallet(1000);
    setSimulationResults([]);
    setShowResults(false);
    setBettingStats({
      totalBets: 0,
      wonBets: 0,
      totalWinnings: 0,
      netProfit: 0,
      couplePot: 0,
      yourDonation: 0,
    });
    setPredictions(initialPredictions);
  };

  const handleDonation = (amount: number) => {
    if (amount <= wallet) {
      setWallet(prev => prev - amount);
      setBettingStats(prev => ({
        ...prev,
        yourDonation: prev.yourDonation + amount,
        couplePot: prev.couplePot + amount
      }));
    }
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-4" ref={resultsRef}>
        <h1 className="text-3xl font-bold mb-8 text-center text-red-500">Mauke Pe Chauka</h1>
        <h2 className="text-2xl font-semibold mb-8 text-center text-gray-300">Simulation Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-500">Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-400">{bettingStats.wonBets}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-red-500">Losses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-400">{bettingStats.totalBets - bettingStats.wonBets}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-500">Total Winnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-400">₹{bettingStats.totalWinnings.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className={bettingStats.netProfit >= 0 ? "text-green-500" : "text-red-500"}>Net Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold ${bettingStats.netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {bettingStats.netProfit >= 0 ? '+' : '-'}₹{Math.abs(bettingStats.netProfit).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-yellow-500">Your Final Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-400">₹{(wallet + bettingStats.netProfit).toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-500">Your Donation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-400">₹{bettingStats.yourDonation.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-pink-500">Couple's Pot</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-pink-400 mb-4">₹{bettingStats.couplePot.toFixed(2)}</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Button onClick={() => handleDonation(bettingStats.netProfit)} className="bg-pink-600 hover:bg-pink-700">
                  Donate Profits
                </Button>
                <Button onClick={() => handleDonation(wallet)} className="bg-pink-600 hover:bg-pink-700">
                  Donate All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-center text-gray-300">Detailed Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2 text-left text-gray-300">Event</th>
                  <th className="p-2 text-left text-gray-300">Your Bet</th>
                  <th className="p-2 text-left text-gray-300">Result</th>
                  <th className="p-2 text-left text-gray-300">Total Bet</th>
                  <th className="p-2 text-left text-gray-300">Commission</th>
                  <th className="p-2 text-left text-gray-300">Odds</th>
                  <th className="p-2 text-left text-gray-300">Winnings</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction) => {
                  const result = simulationResults.find(r => r.predictionId === prediction.id);
                  return (
                    <tr key={prediction.id} className={result ? (result.userWinnings > 0 ? 'bg-green-900' : 'bg-red-900') : 'bg-gray-800'}>
                      <td className="p-2 text-gray-300">{prediction.event}</td>
                      <td className="p-2 text-gray-300">{result?.userChoice || '-'}</td>
                      <td className="p-2 text-gray-300">{predeterminedResults[prediction.id]}</td>
                      <td className="p-2 text-gray-300">{result ? `₹${result.totalBetAmount.toFixed(2)}` : '-'}</td>
                      <td className="p-2 text-gray-300">{result ? `₹${(result.totalBetAmount * 0.1).toFixed(2)}` : '-'}</td>
                      <td className="p-2 text-gray-300">{result ? result.finalOdds.toFixed(2) : '-'}</td>
                      <td className="p-2 text-gray-300">{result ? `₹${result.userWinnings.toFixed(2)}` : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-center">
          <Button onClick={resetSimulation} className="bg-red-600 hover:bg-red-700">Reset Simulation</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-500">Mauke Pe Chauka</h1>
      <h2 className="text-2xl font-semibold mb-8 text-center text-gray-300">Wedding Predictions</h2>
      <Wallet balance={wallet} currency="₹" />
      <p className="text-center mb-8 text-gray-400">Place your bets on the wedding events!</p>
      {predictions.map((prediction) => (
        <PredictionItem
          key={prediction.id}
          prediction={prediction}
          userPrediction={userPredictions.find((up) => up.predictionId === prediction.id)}
          onPredict={handlePredict}
          maxBet={wallet}
        />
      ))}
      <div className="text-center mt-8">
        <Button onClick={runSimulation} disabled={userPredictions.length === 0} className="bg-red-600 hover:bg-red-700">
          Run Simulation
        </Button>
      </div>
    </div>
  );
}

