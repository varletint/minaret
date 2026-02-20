import type { CurrentTrack } from "@/types/station";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface Mosque {
  id: string;
  name: string;
  location: string;
  mountPoint: string;
  description?: string;
  streamUrl?: string;
  currentTrack?: CurrentTrack;
  isLive?: boolean;
  recordingChunks?: { url: string; duration?: number }[];
  currentChunkIndex?: number;
}

interface PlayerState {
  currentMosque: Mosque | null;
  isPlaying: boolean;
  volume: number;
  setCurrentMosque: (mosque: Mosque | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  playNextChunk: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentMosque: null,
      isPlaying: false,
      volume: 0.8,
      setCurrentMosque: (mosque) =>
        set({ currentMosque: mosque, isPlaying: false }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      playNextChunk: () => {
        const state = get();
        if (
          state.currentMosque &&
          state.currentMosque.recordingChunks &&
          state.currentMosque.currentChunkIndex !== undefined
        ) {
          const nextIndex = state.currentMosque.currentChunkIndex + 1;
          if (nextIndex < state.currentMosque.recordingChunks.length) {
            set({
              currentMosque: {
                ...state.currentMosque,
                currentChunkIndex: nextIndex,
                streamUrl: state.currentMosque.recordingChunks[nextIndex].url,
              },
            });
          } else {
            set({ isPlaying: false });
          }
        } else {
          set({ isPlaying: false });
        }
      },
    }),
    {
      name: "player-storage",
      partialize: (state) => ({ volume: state.volume }),
    }
  )
);
