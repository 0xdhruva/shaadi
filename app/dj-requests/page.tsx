'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { searchYouTube, type YouTubeSearchResult } from '../utils/youtube-api'
import debounce from 'lodash/debounce'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

interface SelectedSong extends YouTubeSearchResult {
  url: string;
}

export default function DJRequests() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([])
  const [selectedSong, setSelectedSong] = useState<SelectedSong | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSelectedResult, setIsSelectedResult] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim() === '') {
        setSearchResults([])
        return
      }

      setIsLoading(true)

      try {
        const results = await searchYouTube(query)
        setSearchResults(results)
        setShowDropdown(true)
      } catch (error) {
        console.error('Search error:', error)
        toast({
          title: "Error",
          description: "Failed to search for songs. Please try again.",
          variant: "destructive",
        })
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    if (!isSelectedResult) {
      debouncedSearch(searchQuery)
    } else {
      setIsSelectedResult(false)
    }
    return () => {
      debouncedSearch.cancel()
    }
  }, [searchQuery, debouncedSearch, isSelectedResult])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (song: YouTubeSearchResult) => {
    const url = `https://www.youtube.com/watch?v=${song.id}`
    setSelectedSong({ ...song, url })
    setSearchQuery(song.title)
    setShowDropdown(false)
    setIsSelectedResult(true)
  }

  const handleSubmit = () => {
    if (selectedSong) {
      setIsSubmitted(true)
      toast({
        title: "Song Request Submitted!",
        description: `Your request for "${selectedSong.title}" has been sent to the DJ.`,
      })
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-red-500">Your DJ Request</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src={selectedSong?.thumbnail || ''}
                alt={selectedSong?.title || ''}
                width={120}
                height={90}
                className="rounded-lg"
              />
            </div>
            <p className="text-xl font-semibold mb-2 text-gray-300">{selectedSong?.title}</p>
            <p className="text-gray-400">by {selectedSong?.channelTitle}</p>
            <a 
              href={selectedSong?.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 text-sm mt-2 inline-block"
            >
              View on YouTube
            </a>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-gray-400">Your request has been submitted. Get ready to dance!</p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-500">DJ Waale Babu</h1>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-200">Request Your Song</CardTitle>
          <CardDescription className="text-gray-400">You can only request one song, so choose wisely!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search for a song or artist" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsSelectedResult(false)
              }}
              className="bg-gray-700 text-gray-200 border-gray-600"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
            {showDropdown && searchResults.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg"
              >
                {searchResults.map((song) => (
                  <div 
                    key={song.id} 
                    className="flex items-center gap-2 p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelect(song)}
                  >
                    <Image 
                      src={song.thumbnail}
                      alt={song.title}
                      width={45}
                      height={34}
                      className="rounded"
                    />
                    <div>
                      <p className="text-sm text-gray-200">{song.title}</p>
                      <p className="text-xs text-gray-400">{song.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedSong} 
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Submit Song Request
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

