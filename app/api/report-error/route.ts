import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { report } = await request.json()

  // Here you would typically send this report to your error tracking system
  // For now, we'll just log it to the console
  console.log('Error report received:', report)

  // In a real application, you might want to store this in a database or send it to a service like Sentry

  return NextResponse.json({ message: 'Error report received' })
}

