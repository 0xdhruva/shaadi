'use client'

import { useState, useCallback } from 'react'
import { CameraComponent } from '../components/Camera'
import { Card, CardContent } from '@/components/ui/card'

const MAX_PHOTOS = 10

export default function Photos() {
  const [photos, setPhotos] = useState<string[]>([])

  const handleCapture = useCallback((imageData: string) => {
    console.log('Photo captured, adding to state...')
    if (photos.length < MAX_PHOTOS) {
      setPhotos(prevPhotos => {
        const newPhotos = [...prevPhotos, imageData]
        console.log('Updated photos count:', newPhotos.length)
        return newPhotos
      })
    } else {
      console.log('Maximum photos reached')
    }
  }, [photos.length])

  console.log('Rendering Photos component, current photo count:', photos.length)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Candid Photos</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Take a Photo</h2>
        <CameraComponent onCapture={handleCapture} remainingPhotos={MAX_PHOTOS - photos.length} />
        <p className="mt-2 text-center">
          {MAX_PHOTOS - photos.length} photos remaining
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Photos</h2>
        {photos.length === 0 ? (
          <p className="text-center text-gray-500">No photos taken yet. Start capturing memories!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {photos.map((photo, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-2">
                  <img 
                    src={photo} 
                    alt={`Candid photo ${index + 1}`} 
                    className="w-full aspect-square object-cover rounded"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

