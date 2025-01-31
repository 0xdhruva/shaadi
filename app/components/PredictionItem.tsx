import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Prediction, UserPrediction } from '../types/predictions';

interface PredictionItemProps {
  prediction: Prediction;
  userPrediction?: UserPrediction;
  onPredict: (predictionId: string, choice: string, betAmount: number) => void;
  maxBet: number;
}

export function PredictionItem({ prediction, userPrediction, onPredict, maxBet }: PredictionItemProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userPrediction?.choice);
  const [betAmount, setBetAmount] = useState<number>(userPrediction?.betAmount || 0);
  const [potentialWinnings, setPotentialWinnings] = useState<number>(0);

  useEffect(() => {
    if (selectedOption && betAmount > 0) {
      setPotentialWinnings(betAmount * prediction.currentOdds[selectedOption]);
    } else {
      setPotentialWinnings(0);
    }
  }, [selectedOption, betAmount, prediction.currentOdds]);

  const handleSubmit = () => {
    if (selectedOption && betAmount > 0 && betAmount <= maxBet) {
      onPredict(prediction.id, selectedOption, betAmount);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{prediction.event}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
          {prediction.options.map((option) => (
            <div key={option} className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${prediction.id}-${option}`} />
                <Label htmlFor={`${prediction.id}-${option}`}>{option}</Label>
              </div>
              <span>Odds: {prediction.currentOdds[option].toFixed(2)}</span>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-4">
          <Label htmlFor={`bet-${prediction.id}`}>Bet Amount:</Label>
          <Input
            id={`bet-${prediction.id}`}
            type="number"
            min="0"
            max={maxBet}
            value={betAmount || ''}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="mt-1"
            placeholder="Enter bet amount"
          />
        </div>
        <div className="mt-2">
          <p>Potential Winnings: ₹{potentialWinnings.toFixed(2)}</p>
        </div>
        <Button onClick={handleSubmit} className="mt-4" disabled={!selectedOption || betAmount <= 0 || betAmount > maxBet || !!userPrediction}>
          {userPrediction ? 'Bet Placed' : 'Place Bet'}
        </Button>
      </CardContent>
    </Card>
  );
}

