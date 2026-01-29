import { useRef, useEffect, useState, useCallback } from "react";
import {
  Play,
  Pause,
  X,
  Radio,
  Volume2,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { CurrentTrack } from "@/types/station";

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // Base delay in ms

export interface AudioPlayerProps {
  mosqueName: string;
  location: string;
  streamUrl?: string;
  currentTrack?: CurrentTrack;
  isPlaying: boolean;
  isLive?: boolean;
  onPlayPause: () => void;
  onClose: () => void;
  className?: string;
}

export function AudioPlayer({
  mosqueName,
  location,
  streamUrl,
  currentTrack,
  isPlaying,
  isLive = false,
  onPlayPause,
  onClose,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [volume, setVolume] = useState(75);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [bufferedSeconds, setBufferedSeconds] = useState(0);

  // Retry function to attempt playback again
  const handleRetry = useCallback(() => {
    if (!audioRef.current || !streamUrl) return;

    setError(null);
    setIsRetrying(true);
    setIsLoading(true);

    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.load();

    audio
      .play()
      .then(() => {
        setRetryCount(0);
        setIsRetrying(false);
      })
      .catch((err) => {
        console.error("Retry failed:", err);
        setIsRetrying(false);
        setError("Retry failed - tap to try again");
      });
  }, [streamUrl]);

  // Auto-retry with exponential backoff
  const attemptAutoRetry = useCallback(() => {
    if (retryCount >= MAX_RETRIES) {
      setError(`Stream unavailable after ${MAX_RETRIES} attempts`);
      return;
    }

    const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount);
    setError(`Reconnecting... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    setIsRetrying(true);

    retryTimeoutRef.current = setTimeout(() => {
      setRetryCount((prev) => prev + 1);
      handleRetry();
    }, delay);
  }, [retryCount, handleRetry]);

  // Handle audio events for loading, error, and buffer progress
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setError(null);
    };
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setIsRetrying(false);
      const mediaError = audio.error;
      console.error("Audio playback error:", mediaError);
      let errorMessage = "Stream unavailable";
      let shouldAutoRetry = false;

      if (mediaError) {
        switch (mediaError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Playback aborted";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Network error - check your connection";
            shouldAutoRetry = true;
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Stream decode error";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Stream format not supported";
            break;
          default:
            errorMessage = mediaError.message || "Stream unavailable";
        }
      }

      if (shouldAutoRetry && retryCount < MAX_RETRIES) {
        attemptAutoRetry();
      } else {
        setError(errorMessage);
      }
    };
    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        setBufferedSeconds(audio.buffered.end(audio.buffered.length - 1));
      }
    };

    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("progress", handleProgress);

    return () => {
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("progress", handleProgress);
    };
  }, [streamUrl, attemptAutoRetry, retryCount]);

  useEffect(() => {
    if (!audioRef.current || !streamUrl) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setError("Failed to play stream");
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, streamUrl]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    const audio = audioRef.current;
    const retryTimeout = retryTimeoutRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    // Clear any pending retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    setRetryCount(0);
    setError(null);
    onClose();
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-lg shadow-2xl",
        "transform transition-transform duration-300 ease-out",
        className
      )}>
      {/* Hidden audio element for Icecast stream */}
      {streamUrl && <audio ref={audioRef} src={streamUrl} preload='none' />}

      <div className='container mx-auto px-4 py-3'>
        <div className='flex items-center gap-4'>
          <Button
            size='icon'
            onClick={error && !isRetrying ? handleRetry : onPlayPause}
            disabled={!streamUrl || isLoading || isRetrying}
            className={cn(
              "h-12 w-12 rounded-full shrink-0 disabled:opacity-50",
              error && !isRetrying
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : error
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}>
            {isLoading || isRetrying ? (
              <Loader2 className='h-5 w-5 animate-spin' />
            ) : error ? (
              <RotateCcw className='h-5 w-5' />
            ) : isPlaying ? (
              <Pause className='h-5 w-5' fill='currentColor' />
            ) : (
              <Play className='h-5 w-5 ml-0.5' fill='currentColor' />
            )}
          </Button>

          {/* Mosque Info */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2'>
              <h4 className='font-heading font-semibold text-foreground truncate'>
                {mosqueName}
              </h4>
              {isLive && (
                <span className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-bold text-primary uppercase shrink-0'>
                  <span className='relative flex h-1.5 w-1.5'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-primary'></span>
                  </span>
                  Live
                </span>
              )}
            </div>
            {isRetrying ? (
              <p className='text-sm text-amber-500 truncate'>
                {error || "Reconnecting..."}
              </p>
            ) : error ? (
              <p className='text-sm text-destructive truncate'>
                {error} •{" "}
                <span
                  className='underline cursor-pointer'
                  onClick={handleRetry}>
                  Tap to retry
                </span>
              </p>
            ) : isLoading ? (
              <p className='text-sm text-muted-foreground truncate'>
                Connecting to stream...
              </p>
            ) : (
              <p className='text-sm text-muted-foreground truncate capitalize'>
                {currentTrack?.title && currentTrack?.artist
                  ? `${currentTrack.title} - ${currentTrack.artist}`
                  : location}
              </p>
            )}
          </div>

          {/* Buffer indicator (when playing and buffered) */}
          {isPlaying && bufferedSeconds > 0 && !error && (
            <div className='hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50'>
              <span className='text-xs text-muted-foreground'>
                Buffer: {bufferedSeconds.toFixed(1)}s
              </span>
            </div>
          )}

          {/* Audio Visualizer (when playing) */}
          {isPlaying && (
            <div className='hidden sm:flex items-center gap-1 px-3'>
              <Radio className='h-4 w-4 text-primary mr-2' />
              <span className='flex gap-0.5'>
                <span
                  className='w-0.5 h-4 bg-primary rounded-full animate-pulse'
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className='w-0.5 h-6 bg-primary rounded-full animate-pulse'
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className='w-0.5 h-3 bg-primary rounded-full animate-pulse'
                  style={{ animationDelay: "300ms" }}
                />
                <span
                  className='w-0.5 h-5 bg-primary rounded-full animate-pulse'
                  style={{ animationDelay: "450ms" }}
                />
                <span
                  className='w-0.5 h-4 bg-primary rounded-full animate-pulse'
                  style={{ animationDelay: "600ms" }}
                />
              </span>
            </div>
          )}

          {/* Volume Control */}
          <div className='hidden md:flex items-center gap-2 w-32'>
            <Volume2 className='h-4 w-4 text-muted-foreground shrink-0' />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className='w-full'
            />
          </div>

          {/* Close Button */}
          <Button
            size='icon'
            variant='ghost'
            onClick={handleClose}
            className='h-8 w-8 rounded-full text-muted-foreground hover:text-foreground shrink-0'>
            <X className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
