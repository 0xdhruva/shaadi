'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface CustomVideoPlayerProps {
  src: string
  className?: string
}

export function CustomVideoPlayer({ src, className = '' }: CustomVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useNativePlayer, setUseNativePlayer] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const checkVideoFormat = useCallback(async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      const contentType = response.headers.get('content-type')
      console.log('Video content type:', contentType)
      return contentType?.startsWith('video/')
    } catch (error) {
      console.error('Error checking video format:', error)
      return false
    }
  }, [])

  const handleReactPlayerError = useCallback((e: any) => {
    console.error('ReactPlayer error:', e)
    setError(`ReactPlayer error: ${e.toString()}`)
    setUseNativePlayer(true)
  }, [])

  const handleNativeError = useCallback((e: Event) => {
    const videoElement = e.target as HTMLVideoElement
    console.error('Native video player error:', videoElement.error)
    setError(`Native player error: ${videoElement.error?.message || 'Unknown error'}`)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    setUseNativePlayer(false)

    const checkVideo = async () => {
      const isValidFormat = await checkVideoFormat(src)
      if (!isValidFormat) {
        console.error('Invalid video format or inaccessible file')
        setError('Invalid video format or inaccessible file')
        return
      }
      setIsLoading(false)
    }

    checkVideo()
  }, [src, checkVideoFormat])

  if (error) {
    return (
      <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${className}`}>
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (useNativePlayer) {
    return (
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        className={`w-full h-full ${className}`}
        onError={handleNativeError}
      >
        Your browser does not support the video tag.
      </video>
    )
  }

  return (
    <ReactPlayer
      url={src}
      width="100%"
      height="100%"
      controls
      playing={false}
      onError={handleReactPlayerError}
      config={{
        file: {
          attributes: {
            crossOrigin: 'anonymous'
          },
          forceVideo: true,
          forceAudio: true,
          forceHLS: false,
          forceDASH: false,
          forceFLV: false,
          forceMP4: true,
        }
      }}
      className={className}
    />
  )
}

