import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// 
export interface Mosque {
  id: string
  name: string
  location: string
  mountPoint: string
  description?: string
}

interface PlayerState {
  currentMosque: Mosque | null
  isPlaying: boolean
  volume: number
  setCurrentMosque: (mosque: Mosque | null) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  togglePlay: () => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentMosque: null,
      isPlaying: false,
      volume: 0.8,
      setCurrentMosque: (mosque) => set({ currentMosque: mosque, isPlaying: false }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({ volume: state.volume }),
    }
  )
)
