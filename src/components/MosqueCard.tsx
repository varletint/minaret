import { Radio, MapPin, Users, Play, Pause } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface MosqueCardProps {
    name: string
    location: string
    listeners?: number
    isLive?: boolean
    isPlaying?: boolean
    imageUrl?: string
    onPlay?: () => void
    className?: string
}

export function MosqueCard({
    name,
    location,
    listeners = 0,
    isLive = false,
    isPlaying = false,
    imageUrl,
    onPlay,
    className,
}: MosqueCardProps) {
    return (
        <Card
            className={cn(
                "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30",
                isPlaying && "ring-2 ring-primary border-primary",
                className
            )}
        >
            {/* Image / Gradient Background */}
            <div className="relative h-32 w-full overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20" />
                )}

                {/* Live Badge */}
                {isLive && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm border border-primary/30">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-[10px] font-bold text-primary uppercase">Live</span>
                    </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                    <Button
                        size="icon"
                        onClick={onPlay}
                        className={cn(
                            "h-12 w-12 rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100",
                            isPlaying
                                ? "bg-primary text-primary-foreground"
                                : "bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground"
                        )}
                    >
                        {isPlaying ? (
                            <Pause className="h-5 w-5" fill="currentColor" />
                        ) : (
                            <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                        )}
                    </Button>
                </div>
            </div>

            <CardContent className="p-4">
                {/* Mosque Name */}
                <h3 className="font-heading font-semibold text-foreground truncate">
                    {name}
                </h3>

                {/* Location & Listeners */}
                <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{location}</span>
                    </div>

                    {listeners > 0 && (
                        <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>{listeners.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                {/* Now Playing Indicator */}
                {isPlaying && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                        <Radio className="h-3.5 w-3.5" />
                        <span className="font-medium">Now Playing</span>
                        <span className="flex gap-0.5 ml-auto">
                            <span className="w-0.5 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                            <span className="w-0.5 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                            <span className="w-0.5 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
