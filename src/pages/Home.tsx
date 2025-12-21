import { useState, useEffect } from 'react'
import { MosqueCard } from '../components/MosqueCard'
import { mosques, ICECAST_URL } from '../data/mosques'
import './Home.css'

interface StreamStatus {
    [mountPoint: string]: {
        isLive: boolean
        listeners: number
    }
}

export const Home = () => {
    const [streamStatus, setStreamStatus] = useState<StreamStatus>({})
    const [isLoading, setIsLoading] = useState(true)

    // Fetch Icecast status
    const fetchStreamStatus = async () => {
        try {
            const response = await fetch(`${ICECAST_URL}/status-json.xsl`)
            const data = await response.json()

            const sources = data.icestats?.source || []
            const sourcesArray = Array.isArray(sources) ? sources : [sources]

            const status: StreamStatus = {}
            sourcesArray.forEach((source: any) => {
                if (source.listenurl) {
                    const mount = '/' + source.listenurl.split('/').pop()
                    status[mount] = {
                        isLive: true,
                        listeners: source.listeners || 0,
                    }
                }
            })

            setStreamStatus(status)
        } catch (error) {
            console.log('Could not fetch stream status, using mock data')
            // Mock data for development
            setStreamStatus({
                '/mosque-alnoor': { isLive: true, listeners: 47 },
                '/mosque-central': { isLive: true, listeners: 23 },
                '/mosque-hidayah': { isLive: false, listeners: 0 },
                '/mosque-taqwa': { isLive: true, listeners: 15 },
                '/mosque-furqan': { isLive: false, listeners: 0 },
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStreamStatus()
        // Poll every 10 seconds
        const interval = setInterval(fetchStreamStatus, 10000)
        return () => clearInterval(interval)
    }, [])

    const liveMosques = mosques.filter(m => streamStatus[m.mountPoint]?.isLive)
    const offlineMosques = mosques.filter(m => !streamStatus[m.mountPoint]?.isLive)

    const totalListeners = Object.values(streamStatus).reduce(
        (sum, s) => sum + (s.isLive ? s.listeners : 0),
        0
    )

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero__content">
                    <h1 className="hero__title">
                        Listen to Your Local
                        <span className="hero__highlight"> Mosques Live</span>
                    </h1>
                    <p className="hero__subtitle">
                        Stream prayers, Quran recitations, and lectures from mosques in your community
                    </p>

                    <div className="hero__stats">
                        <div className="stat">
                            <span className="stat__value">{liveMosques.length}</span>
                            <span className="stat__label">Live Now</span>
                        </div>
                        <div className="stat">
                            <span className="stat__value">{totalListeners}</span>
                            <span className="stat__label">Listening</span>
                        </div>
                        <div className="stat">
                            <span className="stat__value">{mosques.length}</span>
                            <span className="stat__label">Mosques</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mosques Grid */}
            <section className="mosques-section">
                {liveMosques.length > 0 && (
                    <>
                        <h2 className="section-title">
                            <span className="live-dot"></span>
                            Live Now
                        </h2>
                        <div className="mosques-grid">
                            {liveMosques.map((mosque) => (
                                <MosqueCard
                                    key={mosque.id}
                                    mosque={mosque}
                                    isLive={true}
                                    listeners={streamStatus[mosque.mountPoint]?.listeners || 0}
                                />
                            ))}
                        </div>
                    </>
                )}

                {offlineMosques.length > 0 && (
                    <>
                        <h2 className="section-title section-title--muted">
                            All Mosques
                        </h2>
                        <div className="mosques-grid">
                            {offlineMosques.map((mosque) => (
                                <MosqueCard
                                    key={mosque.id}
                                    mosque={mosque}
                                    isLive={false}
                                    listeners={0}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}
