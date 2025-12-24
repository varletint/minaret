import { type Mosque, usePlayerStore } from '../stores/playerStore'
import './MosqueCard.css'

interface MosqueCardProps {
    mosque: Mosque
    isLive?: boolean
    listeners?: number
}

export const MosqueCard = ({ mosque, isLive = false, listeners = 0 }: MosqueCardProps) => {
    const { currentMosque, setCurrentMosque, setIsPlaying } = usePlayerStore()
    const isCurrentlyPlaying = currentMosque?.id === mosque.id

    const handlePlay = () => {
        if (isCurrentlyPlaying) {
            setIsPlaying(false)
            setCurrentMosque(null)
        } else {
            setCurrentMosque(mosque)
            setIsPlaying(true)
        }
    }

    return (
        <div className={`mosque-card ${isCurrentlyPlaying ? 'mosque-card--active' : ''}`}>
            <div className="mosque-card__header">
                <div className="mosque-card__icon">🕌</div>
                <div className="mosque-card__info">
                    <h3 className="mosque-card__name">{mosque.name}</h3>
                    <p className="mosque-card__location">{mosque.location}</p>
                </div>
                {isLive ? (
                    <span className="live-indicator">Live</span>
                ) : (
                    <span className="offline-indicator">Offline</span>
                )}
            </div>

            {mosque.description && (
                <p className="mosque-card__description">{mosque.description}</p>
            )}

            <div className="mosque-card__footer">
                {isLive && listeners > 0 && (
                    <span className="mosque-card__listeners">
                        👥 {listeners} listening
                    </span>
                )}

                <button
                    className={`mosque-card__button ${isCurrentlyPlaying ? 'mosque-card__button--playing' : ''}`}
                    onClick={handlePlay}
                    disabled={!isLive}
                >
                    {isCurrentlyPlaying ? '⏸️ Pause' : '▶️ Play'}
                </button>
            </div>
        </div>
    )
}
