import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Couple() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-500">Raj & Simran: A Modern Love Story</h1>
      <div className="grid gap-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-red-400">How They Met</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>Raj and Simran's love story began not on a train to Europe, but on a flight to New York. Simran, a budding AI researcher, was headed to a conference. Raj, a charismatic startup founder, was off to pitch investors. A seating mix-up led to them sharing a row, and over the 14-hour flight, they found themselves lost in conversation, laughter, and the promise of something special.</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-red-400">Their Journey</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>Despite living in different cities - Simran in Bangalore and Raj in Mumbai - they stayed connected through video calls, memes, and surprise food deliveries. They bonded over their shared love for old Bollywood movies, their dreams of making a difference in the world, and their secret passion for terrible puns. Their relationship blossomed, weathering long distances, career challenges, and the occasional family drama.</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-red-400">The Proposal</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>On their two-year anniversary, Raj surprised Simran with a virtual reality experience. As she put on the headset, Simran found herself in a digital recreation of the mustard fields from DDLJ. Raj's avatar appeared, went down on one knee, and asked her to be his partner for life. Simran said yes, and as she took off the headset, she found Raj in front of her, ring in hand, surrounded by their closest friends and family who had been in on the surprise.</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-red-400">What They Love About Each Other</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <h3 className="font-semibold mb-2 text-red-400">Raj says:</h3>
            <p className="mb-4">"Simran's brilliance and determination inspire me every day. Her kindness and empathy make her not just a great partner, but a truly remarkable human being. Plus, she laughs at my jokes, even the really bad ones!"</p>
            <h3 className="font-semibold mb-2 text-red-400">Simran says:</h3>
            <p>"Raj's energy and optimism are infectious. He has this incredible ability to light up any room he walks into. His support for my dreams and his dedication to making the world a better place make me fall in love with him more each day. And yes, even his terrible puns."</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

