'use client'

import { useState, useEffect } from 'react'
import { VideoRecorder } from '../components/VideoRecorder'
import { ErrorReporter } from '../components/ErrorReporter'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "@/components/ui/use-toast"
import { useGlobalState } from '../context/GlobalState'
import { useScrollToTop } from '../hooks/useScrollToTop'

export default function Wishes() {
  const [userName, setUserName] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)
  const { wishes, setWishes, userWish, setUserWish } = useGlobalState()

  useScrollToTop()

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        // For now, we'll use dummy data with working WebM video URLs
        const dummyWishes = [
          { id: 1, name: 'John Doe', videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.360p.webm', fileInfo: null },
          { id: 2, name: 'Jane Smith', videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f1/Sintel_movie_4K.webm/Sintel_movie_4K.webm.360p.webm', fileInfo: null },
        ]
        setWishes(dummyWishes)
      } catch (error) {
        console.error('Error fetching wishes:', error)
        setLoadError(`Failed to load wishes: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    if (wishes.length === 0) {
      fetchWishes()
    }
  }, [wishes.length, setWishes])

  async function handleRecordingComplete(videoUrl: string) {
    console.log('Received video URL:', videoUrl);
    console.log('Recording completed, video URL:', videoUrl);

    try {
      // Add the new wish to the list and set it as the user's wish
      const newWish = { id: Date.now(), name: userName, videoUrl: videoUrl, fileInfo: null }
      setWishes(prevWishes => [newWish, ...prevWishes])
      setUserWish({ id: Date.now(), name: userName, videoUrl: videoUrl, fileInfo: null })

      // Fetch file info with retry logic
      const maxRetries = 10;
      const retryInterval = 1000; // 1 second

      for (let retry = 0; retry < maxRetries; retry++) {
        try {
          const response = await fetch(videoUrl);
          if (response.ok) {
            const blob = await response.blob();
            console.log('Fetched video info:')
            console.log('Size:', blob.size, 'bytes')
            console.log('Type:', blob.type)

            const video = document.createElement('video')
            video.preload = 'metadata'
            await new Promise((resolve, reject) => {
              video.onloadedmetadata = resolve
              video.onerror = reject
              video.src = URL.createObjectURL(blob)
            })

            console.log('Duration:', video.duration, 'seconds')
            console.log('Width:', video.videoWidth, 'px')
            console.log('Height:', video.videoHeight, 'px')

            setUserWish(prev => prev ? {...prev, fileInfo: {
              size: blob.size,
              type: blob.type,
              duration: video.duration,
              width: video.videoWidth,
              height: video.videoHeight
            }} : null)

            URL.revokeObjectURL(video.src)
            break; // Successfully fetched and processed video, exit retry loop
          } else {
            console.log(`Attempt ${retry + 1}: Failed to fetch video. Status: ${response.status}`)
            if (retry === maxRetries - 1) {
              throw new Error(`Failed to fetch video after ${maxRetries} attempts`)
            }
            await new Promise(resolve => setTimeout(resolve, retryInterval))
          }
        } catch (error) {
          console.error(`Attempt ${retry + 1}: Error fetching video info:`, error)
          if (retry === maxRetries - 1) {
            throw error
          }
          await new Promise(resolve => setTimeout(resolve, retryInterval))
        }
      }

      // Clear the user name input
      setUserName('')

      toast({
        title: "Success",
        description: "Your video wish has been uploaded successfully!",
      })

      console.log('New wish added:', newWish);
    } catch (error) {
      console.error('Error handling recording completion:', error)
      toast({
        title: "Error",
        description: `Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Ashirvad Express</h1>
      {loadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{loadError}</span>
        </div>
      )}
      {!userWish ? (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Record Your Wish</h2>
          <div className="mb-4">
            <Label htmlFor="user-name">Your Name</Label>
            <Input
              id="user-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1"
            />
          </div>
          <VideoRecorder onRecordingComplete={handleRecordingComplete} />
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Thank You for Your Wish!</h2>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{userWish.name}</h3>
              <video 
                src={userWish.videoUrl} 
                controls 
                className="w-full h-40 object-cover" 
                playsInline 
                preload="metadata"
                onError={(e) => console.error('Video playback error:', e)}
              >
                Your browser does not support the video tag.
              </video>
            </CardContent>
          </Card>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Wishes from Guests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishes.map((wish) => (
            <Card key={wish.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{wish.name}</h3>
                <video 
                  src={wish.videoUrl} 
                  controls 
                  className="w-full h-40 object-cover" 
                  playsInline 
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <ErrorReporter />
    </div>
  )
}

