import { Play, Calendar, Clock, Radio, User, Pause } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Recording } from "@/types/recording";

export interface RecordingCardProps {
  recording: Recording;
  isPlaying?: boolean;
  onPlay?: () => void;
  onStop?: () => void;
  className?: string;
  variant?: "grid" | "list";
}

export function RecordingCard({
  recording,
  isPlaying = false,
  onPlay,
  onStop,
  className,
  variant = "grid",
}: RecordingCardProps) {
  const { showId, stationId, totalDurationSecs } = recording;

  // Format duration (e.g., 1h 30m or 45m or < 1m)
  const formatDuration = (seconds?: number) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return "N/A";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 14)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return formatDate(dateString);
  };

  if (variant === "list") {
    return (
      <div
        className={cn(
          "group flex items-center gap-4 cursor-pointer hover:bg-muted/10 p-2 sm:p-3 rounded-2xl transition-all border border-transparent hover:border-border",
          isPlaying && "bg-muted/30 border-border",
          className
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (isPlaying) {
            onStop?.();
          } else {
            onPlay?.();
          }
        }}>
        <div className='relative h-20 w-24 sm:h-24 sm:w-24 md:h-[100px] md:w-[100px] shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center'>
          <div className='absolute inset-0 opacity-20 pointer-events-none'>
            <svg
              className='w-full h-full'
              viewBox='0 0 100 100'
              preserveAspectRatio='none'>
              <path d='M0 100 L0 0 L100 0 L100 100 Z' fill='none' />
              <path
                d='M0 100 Q 50 0 100 100'
                fill='currentColor'
                className='text-primary/20'
              />
            </svg>
          </div>

          <div className='absolute bottom-0 left-0 right-0 h-1 bg-yellow-500/80' />

          {isPlaying ? (
            <div className='z-10 flex items-center justify-center'>
              <Button
                size='icon'
                className='h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground animate-in zoom-in-50 duration-200 border-2 border-background'
                onClick={(e) => {
                  e.stopPropagation();
                  onStop?.();
                }}>
                <Pause className='h-5 w-5 sm:h-6 sm:w-6 fill-current' />
              </Button>
            </div>
          ) : (
            <div className='z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-sm absolute inset-0'>
              <Button
                size='icon'
                className='h-12 w-12 rounded-full shadow-xl bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground border-2 border-background'
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.();
                }}>
                <Play className='h-5 w-5 sm:h-6 sm:w-6 ml-0.5 fill-current' />
              </Button>
            </div>
          )}
        </div>

        <div className='flex-1 min-w-0 py-1 flex flex-col justify-center'>
          <h3
            className='font-bold text-base md:text-lg leading-snug mb-1 line-clamp-2 text-foreground/90'
            title={recording.title || showId?.title || "Untitled Recording"}>
            {recording.title || showId?.title || "Untitled Recording"}
          </h3>
          <div className='flex flex-col text-sm text-muted-foreground/80 mt-1 gap-0.5'>
            <span>
              {getRelativeTime(recording.startedAt || recording.createdAt)}
            </span>
            <span className='truncate'>
              {recording.hostName ||
                showId?.hostName ||
                stationId?.name ||
                "Unknown Author"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "overflow-hidden group hover:shadow-md transition-all flex flex-col h-full",
        className
      )}>
      {/* Aspect Ratio Media/Placeholder Area */}
      <div className='aspect-video w-full relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center overflow-hidden shrink-0'>
        {/* Abstract Pattern / Placeholder */}
        <div className='absolute inset-0 opacity-20'>
          <svg
            className='w-full h-full'
            viewBox='0 0 100 100'
            preserveAspectRatio='none'>
            <path d='M0 100 L0 0 L100 0 L100 100 Z' fill='none' />
            <path
              d='M0 100 Q 50 0 100 100'
              fill='currentColor'
              className='text-primary/20'
            />
          </svg>
        </div>

        {/* Play/Stop Overlay */}
        <div className='z-10 flex items-center gap-4 transition-transform duration-300 group-hover:scale-110'>
          {isPlaying ? (
            <Button
              size='icon'
              className='h-12 w-12 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground animate-in zoom-in-50 duration-200 border-2 border-background'
              onClick={(e) => {
                e.stopPropagation();
                onStop?.();
              }}>
              <Pause className='h-5 w-5 fill-current' />
            </Button>
          ) : (
            <Button
              size='icon'
              className='h-12 w-12 rounded-full shadow-xl bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground border-2 border-background'
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.();
              }}>
              <Play className='h-5 w-5 ml-0.5 fill-current' />
            </Button>
          )}
        </div>

        {/* Badge */}
        <div className='absolute top-0 right-2'>
          <span className='px-2 py-0.5 rounded-full text-[10px] font-medium bg-background/80 backdrop-blur border shadow-sm'>
            Playback
          </span>
        </div>
      </div>

      <CardContent className=' px-4 space-y-1 grow hidden'>
        {/* Title & Show Details */}
        <div>
          <h3
            className='font-semibold text-sm leading-tight line-clamp-2 min-h-[em]'
            title={recording.title || showId?.title || "Untitled Recording"}>
            {recording.title || showId?.title || "Untitled Recording"}
          </h3>

          <div className='space-y-1'>
            <div className='flex items-center gap-2 text-muted-foreground text-sm'>
              <Radio className='h-3.5 w-3.5 shrink-0' />
              <span className='truncate'>
                {stationId?.name || "Unknown Station"}
              </span>
            </div>
            {(recording.hostName || showId?.hostName) && (
              <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                <User className='h-3.5 w-3.5 shrink-0' />
                <span className='truncate'>
                  {recording.hostName || showId?.hostName}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className='p-2 pt-0 text-xs text-muted-foreground flex justify-between items-center border-t border-border/40 bg-muted/10 h-10 mt-auto'>
        <div className=' flex flex-col gap-1'>
          <h3
            className='font-semibold text-sm leading-tight line-clamp-2 min-h-[em]'
            title={recording.title || showId?.title || "Untitled Recording"}>
            {recording.title || showId?.title || "Untitled Recording"}
          </h3>
          <div className='flex items-center gap-1.5 text-xs'>
            <Calendar className='h-3 w-3' />
            <span>
              {formatDate(
                (recording.createdAt as string) ||
                  (showId?.scheduledStart as string)
              )}
            </span>
          </div>
        </div>
        <div className=' flex flex-col gap-1'>
          <div className='flex items-center gap-1.5'>
            <Clock className='h-3.5 w-3.5' />
            <span>{formatDuration(totalDurationSecs)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
