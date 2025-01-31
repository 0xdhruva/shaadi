'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks for more consistent chunking

export function VideoRecorder({ onRecordingComplete }: { onRecordingComplete: (videoUrl: string) => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const logVideoInfo = useCallback((videoBlob: Blob) => {
    console.log('Recorded video info:')
    console.log('Size:', videoBlob.size, 'bytes')
    console.log('Type:', videoBlob.type)
    
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      console.log('Duration:', video.duration, 'seconds')
      console.log('Width:', video.videoWidth, 'px')
      console.log('Height:', video.videoHeight, 'px')
    }
    video.src = URL.createObjectURL(videoBlob)
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280, min: 640, max: 1920 },
          height: { ideal: 720, min: 360, max: 1080 },
          frameRate: { ideal: 30, min: 24, max: 30 }
        }, 
        audio: {
          channelCount: 1,
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      streamRef.current = stream
      setError(null)
      return stream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      setError(`Failed to access camera and microphone. Please ensure you have granted the necessary permissions. Error: ${error}`)
      return null
    }
  }, [])

  const startRecording = useCallback(async () => {
    const stream = await startCamera()
    if (!stream) {
      setError('No active camera stream. Please ensure you have granted the necessary permissions.')
      return
    }

    try {
      const mimeType = 'video/mp4'
      console.log('Using MIME type for recording:', mimeType)

      const options = { 
        mimeType, 
        videoBitsPerSecond: 2500000, // 2.5 Mbps
        audioBitsPerSecond: 128000 // 128 kbps
      }
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setRecordedBlob(blob)
        setIsReviewing(true)
        stopCamera()
        logVideoInfo(blob)
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      setCountdown(15)
      setError(null)
    } catch (error) {
      console.error('Error starting recording:', error)
      setError(`Failed to start recording. Please try again. Error: ${error}`)
      stopCamera()
    }
  }, [startCamera, stopCamera, logVideoInfo])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setCountdown(15)
    }
  }, [isRecording])

  const uploadChunked = useCallback(async (blob: Blob, name: string) => {
    const totalChunks = Math.ceil(blob.size / CHUNK_SIZE);
    const chunkUrls: string[] = [];
    const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substr(2);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, blob.size);
      const chunk = blob.slice(start, end);
    
      const formData = new FormData();
      const filename = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${uniqueSuffix}-chunk-${chunkIndex}.mp4`;
      formData.append('video', chunk, filename);
      formData.append('name', name);
      formData.append('chunkIndex', chunkIndex.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('mimeType', blob.type);
      formData.append('uniqueSuffix', uniqueSuffix);
    
      try {
        const response = await fetch('/api/upload-wish', {
          method: 'POST',
          body: formData,
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Server response for chunk ${chunkIndex}:`, errorData);
          throw new Error(errorData.details || `Failed to upload chunk ${chunkIndex}`);
        }

        const result = await response.json();
        console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded:`, result);
      
        if (result.blobUrl) {
          chunkUrls.push(result.blobUrl);
        }

        if (chunkIndex === totalChunks - 1 && result.videoUrl) {
          return result.videoUrl;
        }
      } catch (error) {
        console.error(`Error uploading chunk ${chunkIndex}:`, error);
        throw error;
      }
    }

    // If we've uploaded all chunks but didn't get a final URL, make a final request to combine chunks
    if (chunkUrls.length === totalChunks) {
      try {
        const response = await fetch('/api/combine-chunks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            uniqueSuffix,
            totalChunks,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to combine chunks');
        }

        const result = await response.json();
        return result.videoUrl;
      } catch (error) {
        console.error('Error combining chunks:', error);
        throw error;
      }
    }

    return chunkUrls[0].split('-chunk-')[0] + '.mp4';
  }, []);

  const handleSubmit = useCallback(async () => {
    console.log('Submit button clicked, recordedBlob:', recordedBlob);
    if (recordedBlob) {
      try {
        setError(null);
        setIsUploading(true);
        const videoUrl = await uploadChunked(recordedBlob, 'video-wish');
        console.log('Video upload completed successfully, URL:', videoUrl);
        onRecordingComplete(videoUrl);
        setIsReviewing(false);
        setRecordedBlob(null);
        chunksRef.current = [];
      } catch (error) {
        console.error('Error uploading video:', error);
        setError(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    }
  }, [onRecordingComplete, recordedBlob, uploadChunked]);

  const handleReRecord = useCallback(() => {
    setIsReviewing(false)
    setRecordedBlob(null)
    chunksRef.current = []
    stopCamera()
  }, [stopCamera])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRecording) {
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer)
            stopRecording()
            return 0
          }
          return prevCount - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRecording, stopRecording])

  useEffect(() => {
    if (isReviewing && recordedBlob && videoRef.current) {
      const url = URL.createObjectURL(recordedBlob)
      videoRef.current.src = url
      videoRef.current.muted = false
      videoRef.current.loop = false
      videoRef.current.play().catch(error => console.error('Error playing video:', error))
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [isReviewing, recordedBlob])

  return (
    <Card className="p-4 bg-gray-800 border-gray-700">
      <div className="relative">
        <video 
          ref={videoRef} 
          playsInline 
          controls
          muted={!isReviewing}
          loop={false}
          className="w-full h-64 bg-gray-900 mb-4 rounded-md object-cover"
        />
        {isRecording && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm">
            Recording: {countdown}s
          </div>
        )}
      </div>
      <div className="flex flex-col items-center space-y-4">
        {error && (
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        <div className="flex justify-center items-center space-x-4">
          {!isRecording && !isReviewing && (
            <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700 text-white">
              Start Recording
            </Button>
          )}
          {isRecording && (
            <Button onClick={stopRecording} variant="destructive">
              Stop Recording
            </Button>
          )}
          {isReviewing && (
            <>
              <Button onClick={handleReRecord} variant="outline" className="border-red-500 text-red-500 hover:bg-red-900">
                Re-record
              </Button>
              <Button onClick={handleSubmit} disabled={isUploading} className="bg-red-600 hover:bg-red-700 text-white">
                {isUploading ? 'Uploading...' : 'Submit'}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

