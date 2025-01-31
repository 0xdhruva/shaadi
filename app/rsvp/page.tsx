'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

export default function RSVP() {
  const [response, setResponse] = useState<string | null>(null)
  const [plusOne, setPlusOne] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleSubmit = () => {
    if (!response) {
      toast({
        title: "Error",
        description: "Please select an RSVP option",
        variant: "destructive",
      })
      return
    }
    // Here you would typically send this data to your backend
    console.log({ response, plusOne })
    setSubmitted(true)
    toast({
      title: "RSVP Submitted",
      description: "Thank you for your response!",
    })
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Thank You!</CardTitle>
            <CardDescription>Your RSVP has been recorded.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Response: {response}</p>
            {response === 'Yes' && <p>Plus One: {plusOne ? 'Yes' : 'No'}</p>}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>RSVP</CardTitle>
          <CardDescription>Please confirm your attendance for Rahul and Priya's wedding.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={(value) => setResponse(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="yes" />
              <Label htmlFor="yes">Yes, I'll be there</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="no" />
              <Label htmlFor="no">Sorry, I can't make it</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Maybe" id="maybe" />
              <Label htmlFor="maybe">I'm not sure yet</Label>
            </div>
          </RadioGroup>
          {response === 'Yes' && (
            <div className="mt-4">
              <Label htmlFor="plusOne">Will you bring a plus one?</Label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="plusOne"
                  checked={plusOne}
                  onChange={(e) => setPlusOne(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
                <Label htmlFor="plusOne">Yes, I'll bring a guest</Label>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Submit RSVP</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

