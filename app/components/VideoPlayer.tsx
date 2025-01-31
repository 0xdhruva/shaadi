'use client'

import { useState, useEffect, useRef } from 'react'

interface VideoPlayerProps {
  src: string
  className?: string
}

export function VideoPlayer({ src, className = '' }: VideoPlayerProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setIsLoading(false)
      console.log('Video can play:', src)
    }

    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement
      console.error('Error playing video:', {
        error: target.error,
        errorCode: target.error ? target.error.code : 'N/A',
        errorMessage: target.error ? target.error.message : 'Unknown error',
        src: src,
        readyState: target.readyState,
        networkState: target.networkState,
      })
      setError(`Error playing video: ${target.error ? target.error.message : 'Unknown error'} (Code: ${target.error ? target.error.code : 'N/A'})`)
      setIsLoading(false)
    }

    const handleLoadStart = () => {
      console.log('Video load started:', src)
    }

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded:', src)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    // Attempt to load the video
    video.load()

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [src])

  return (
    <div className={`relative ${className}`}>
      <video 
        ref={videoRef}
        controls 
        className="w-full h-full bg-gray-200"
        src={src}
        crossOrigin="anonymous"
      >
        Your browser does not support the video tag.
      </video>
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200">
          Loading video...
        </div>
      )}
      {error && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-2 text-center">
          {error}
        </div>
      )}
    </div>
  )
}

