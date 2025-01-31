import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WalletProps {
  balance: number;
  currency: string;
}

export function Wallet({ balance, currency }: WalletProps) {
  return (
    <Card className="mb-4 bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-yellow-500">Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-yellow-400">{currency}{balance.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}

