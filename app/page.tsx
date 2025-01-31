import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Camera, TrendingUp, BrainCircuit, Music } from 'lucide-react'

const miniApps = [
  {
    title: "Ashirvad Express",
    description: "Share your 15-second video wishes for Raj and Simran",
    href: "/wishes",
    icon: Video,
  },
  {
    title: "Shaadi Snap",
    description: "Take 10 one-shot photos during the wedding",
    href: "/photos",
    icon: Camera,
  },
  {
    title: "Mauke Pe Chauka",
    description: "Place your bets on fun wedding events",
    href: "/predictions",
    icon: TrendingUp,
  },
  {
    title: "Jodi Quiz",
    description: "How well do you know Raj and Simran?",
    href: "/jodi-quiz",
    icon: BrainCircuit,
  },
  {
    title: "DJ Waale Babu",
    description: "Add your song requests for the DJ",
    href: "/dj-requests",
    icon: Music,
  },
]

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8 text-red-500">Welcome to Shaadi.fun!</h1>
      <p className="mb-8 text-gray-300">Explore our fun mini-apps for Raj and Simran's wedding celebration:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {miniApps.map((app, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-red-400">
                <app.icon className="w-6 h-6 mr-2" />
                <span>{app.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 mb-4">{app.description}</CardDescription>
              <Link 
                href={app.href} 
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Try Now
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

