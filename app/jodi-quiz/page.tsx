'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const quizQuestions = [
  {
    question: "What was Raj's startup focused on?",
    options: ["Social media platform", "Sustainable energy solutions", "E-commerce marketplace", "AI-powered education tools"],
    correctAnswer: "Sustainable energy solutions"
  },
  {
    question: "Which famous landmark did Raj and Simran visit on their first date in New York?",
    options: ["Statue of Liberty", "Central Park", "Empire State Building", "Times Square"],
    correctAnswer: "Central Park"
  },
  {
    question: "What is Simran's specific area of research in AI?",
    options: ["Natural Language Processing", "Computer Vision", "Robotics", "Ethical AI"],
    correctAnswer: "Ethical AI"
  },
  {
    question: "Which hobby did Raj and Simran bond over, besides watching old Bollywood movies?",
    options: ["Cooking fusion cuisine", "Salsa dancing", "Rock climbing", "Karaoke"],
    correctAnswer: "Cooking fusion cuisine"
  },
  {
    question: "What was the name of Raj and Simran's favorite coffee shop where they had their weekly virtual dates?",
    options: ["Brew & Banter", "Chai Chatter", "Latte Love", "Bean There"],
    correctAnswer: "Chai Chatter"
  },
  {
    question: "Which philanthropic cause are both Raj and Simran passionate about?",
    options: ["Wildlife conservation", "Education for underprivileged children", "Mental health awareness", "Clean water initiatives"],
    correctAnswer: "Education for underprivileged children"
  },
  {
    question: "What was the theme of the hackathon where Raj and Simran collaborated for the first time?",
    options: ["Smart Cities", "Healthcare Innovation", "Fintech Solutions", "Green Technology"],
    correctAnswer: "Smart Cities"
  },
  {
    question: "Which song did Raj and Simran dance to at their friends' wedding, leading to their first kiss?",
    options: ["Tujhe Dekha To", "Mehendi Laga Ke Rakhna", "Chaiyya Chaiyya", "Zoobi Doobi"],
    correctAnswer: "Tujhe Dekha To"
  },
  {
    question: "What unique tradition did Raj and Simran start for their monthly anniversaries?",
    options: ["Writing each other poems", "Sending handwritten letters", "Creating themed playlists", "Exchanging small handmade gifts"],
    correctAnswer: "Creating themed playlists"
  },
  {
    question: "Which adventure sport did Simran convince a reluctant Raj to try, which he ended up loving?",
    options: ["Skydiving", "Bungee jumping", "Paragliding", "White water rafting"],
    correctAnswer: "Paragliding"
  }
]

export default function JodiQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResults(true)
    }
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-red-500">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold mb-4 text-gray-300">Your Score: {score} / {quizQuestions.length}</p>
            <p className="text-gray-400">
              {score === quizQuestions.length 
                ? "Perfect score! You know Raj and Simran's story better than they do!" 
                : score >= quizQuestions.length / 2 
                ? "Great job! You're almost an expert on Raj and Simran's love story." 
                : "Looks like you could use a refresher on Raj and Simran's romance."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-500">Jodi Quiz: How Well Do You Know Raj & Simran?</h1>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-200">Question {currentQuestion + 1} of {quizQuestions.length}</CardTitle>
          <CardDescription className="text-gray-400">Score: {score}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4 text-gray-300">{quizQuestions[currentQuestion].question}</p>
          <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-gray-300">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleAnswer} 
            disabled={!selectedAnswer}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {currentQuestion === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

