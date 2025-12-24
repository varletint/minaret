import { Play, Pause, X, Radio, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export interface AudioPlayerProps {
    mosqueName: string
    location: string
    isPlaying: boolean
    isLive?: boolean
    onPlayPause: () => void
    onClose: () => void
    className?: string
}

export function AudioPlayer({
    mosqueName,
    location,
    isPlaying,
    isLive = false,
    onPlayPause,
    onClose,
    className,
}: AudioPlayerProps) {
    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-lg shadow-2xl",
                "transform transition-transform duration-300 ease-out",
                className
            )}
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center gap-4">
                    {/* Play/Pause Button */}
                    <Button
                        size="icon"
                        onClick={onPlayPause}
                        className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                    >
                        {isPlaying ? (
                            <Pause className="h-5 w-5" fill="currentColor" />
                        ) : (
                            <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                        )}
                    </Button>

                    {/* Mosque Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="font-heading font-semibold text-foreground truncate">
                                {mosqueName}
                            </h4>
                            {isLive && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-bold text-primary uppercase shrink-0">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                                    </span>
                                    Live
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{location}</p>
                    </div>

                    {/* Audio Visualizer (when playing) */}
                    {isPlaying && (
                        <div className="hidden sm:flex items-center gap-1 px-3">
                            <Radio className="h-4 w-4 text-primary mr-2" />
                            <span className="flex gap-0.5">
                                <span className="w-0.5 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                                <span className="w-0.5 h-6 bg-primary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                                <span className="w-0.5 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                                <span className="w-0.5 h-5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "450ms" }} />
                                <span className="w-0.5 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "600ms" }} />
                            </span>
                        </div>
                    )}

                    {/* Volume Control */}
                    <div className="hidden md:flex items-center gap-2 w-32">
                        <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Slider
                            defaultValue={[75]}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Close Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
