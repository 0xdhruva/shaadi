'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Wish {
  id: number
  name: string
  videoUrl: string
  fileInfo: {
    size: number;
    type: string;
    duration: number;
    width: number;
    height: number;
  } | null;
}

interface GlobalStateContextType {
  wishes: Wish[]
  setWishes: React.Dispatch<React.SetStateAction<Wish[]>>
  userWish: Wish | null
  setUserWish: React.Dispatch<React.SetStateAction<Wish | null>>
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined)

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [userWish, setUserWish] = useState<Wish | null>(null)

  useEffect(() => {
    // Load wishes from localStorage on initial render
    const savedWishes = localStorage.getItem('wishes')
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes))
    }

    const savedUserWish = localStorage.getItem('userWish')
    if (savedUserWish) {
      setUserWish(JSON.parse(savedUserWish))
    }
  }, [])

  useEffect(() => {
    // Save wishes to localStorage whenever it changes
    localStorage.setItem('wishes', JSON.stringify(wishes))
  }, [wishes])

  useEffect(() => {
    // Save userWish to localStorage whenever it changes
    if (userWish) {
      localStorage.setItem('userWish', JSON.stringify(userWish))
    } else {
      localStorage.removeItem('userWish')
    }
  }, [userWish])

  return (
    <GlobalStateContext.Provider value={{ wishes, setWishes, userWish, setUserWish }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

