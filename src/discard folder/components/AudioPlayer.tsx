import { useRef, useEffect } from 'react'
import { usePlayerStore } from '../stores/playerStore'
import { ICECAST_URL } from '../data/mosques'
import './AudioPlayer.css'

export const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const { currentMosque, isPlaying, volume, setIsPlaying, setVolume } = usePlayerStore()

    // Handle play/pause
    useEffect(() => {
        if (!audioRef.current || !currentMosque) return

        if (isPlaying) {
            audioRef.current.play().catch((err) => {
                console.error('Failed to play:', err)
                setIsPlaying(false)
            })
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying, currentMosque, setIsPlaying])

    // Handle volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    // Reset audio when mosque changes
    useEffect(() => {
        if (audioRef.current && currentMosque) {
            audioRef.current.src = `${ICECAST_URL}${currentMosque.mountPoint}`
            audioRef.current.load()
            if (isPlaying) {
                audioRef.current.play().catch((err) => {
                    console.error('Failed to play:', err)
                    setIsPlaying(false)
                })
            }
        }
    }, [currentMosque?.id])

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value))
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    if (!currentMosque) return null

    return (
        <div className="audio-player">
            <audio ref={audioRef} preload="none" />

            <div className="audio-player__container">
                <div className="audio-player__info">
                    <span className="audio-player__icon">🎵</span>
                    <div className="audio-player__details">
                        <span className="audio-player__title">{currentMosque.name}</span>
                        <span className="audio-player__subtitle">
                            {isPlaying ? 'Now Playing' : 'Paused'}
                        </span>
                    </div>
                </div>

                <div className="audio-player__controls">
                    <button
                        className="audio-player__play-btn"
                        onClick={togglePlay}
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>

                    <div className="audio-player__volume">
                        <span className="audio-player__volume-icon">
                            {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                        </span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="audio-player__volume-slider"
                        />
                    </div>
                </div>

                <button
                    className="audio-player__close"
                    onClick={() => usePlayerStore.getState().setCurrentMosque(null)}
                >
                    ✕
                </button>
            </div>
        </div>
    )
}
