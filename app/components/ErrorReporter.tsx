'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle } from 'lucide-react'

export function ErrorReporter() {
  const [errorReport, setErrorReport] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/report-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report: errorReport }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setErrorReport('')
      } else {
        throw new Error('Failed to submit error report')
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Failed to submit error report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Report an Issue</h2>
      {isSubmitted ? (
        <div className="flex items-center space-x-2 text-green-500">
          <CheckCircle size={20} />
          <span>Thank you for your report. We'll investigate the issue.</span>
        </div>
      ) : (
        <>
          <Textarea
            value={errorReport}
            onChange={(e) => setErrorReport(e.target.value)}
            placeholder="Describe the issue you're experiencing..."
            className="mb-4 bg-gray-700 text-white border-gray-600"
            rows={4}
          />
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !errorReport.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </>
      )}
    </div>
  )
}

