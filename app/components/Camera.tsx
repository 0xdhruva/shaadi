'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Camera, XCircle } from 'lucide-react'

interface CameraProps {
  onCapture: (imageData: string) => void
  remainingPhotos: number
}

export function CameraComponent({ onCapture, remainingPhotos }: CameraProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    console.log('Starting camera...')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      console.log('Camera stream obtained')
      streamRef.current = stream
      setIsCapturing(true)
      setError(null)
    } catch (error) {
      console.error('Error accessing camera:', error)
      setError(`Unable to access camera: ${(error as Error).message}. Please check your permissions.`)
    }
  }, [])

  useEffect(() => {
    console.log('Effect running, isCapturing:', isCapturing)
    if (isCapturing && streamRef.current) {
      console.log('Attempting to set video stream')
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current
        console.log('Video stream set to video element')
      } else {
        console.error('Video ref is null in effect')
        setError('Failed to initialize video element')
      }
    }
  }, [isCapturing])

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...')
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        console.log('Track stopped:', track.label)
      })
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCapturing(false)
    console.log('Camera stopped')
  }, [])

  const capturePhoto = useCallback(() => {
    console.log('Capturing photo...')
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg')
      console.log('Photo captured, size:', imageData.length)
      onCapture(imageData)
      stopCamera()
    } else {
      console.error('Video ref is null when trying to capture photo')
      setError('Failed to capture photo')
    }
  }, [onCapture, stopCamera])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <Card className="p-4">
      {error ? (
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <Button onClick={startCamera}>Try Again</Button>
        </div>
      ) : !isCapturing ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100">
          <Camera className="w-16 h-16 mb-4 text-gray-400" />
          <Button onClick={startCamera} disabled={remainingPhotos === 0} className="bg-red-600 hover:bg-red-700 text-white">
            {remainingPhotos > 0 ? 'Take Photo' : 'No more photos'}
          </Button>
        </div>
      ) : (
        <div className="relative">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-64 bg-gray-200 mb-4" 
          />
          <div className="absolute top-2 right-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={stopCamera}
            >
              <XCircle className="h-6 w-6" />
            </Button>
          </div>
          <Button onClick={capturePhoto} className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white">
            Capture Photo
          </Button>
        </div>
      )}
    </Card>
  )
}

