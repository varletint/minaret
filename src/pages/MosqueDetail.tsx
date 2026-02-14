import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Users,
  Clock,
  Calendar,
  Play,
  Pause,
  Share2,
  Heart,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useStation } from "@/hooks/useStations";
import { useStationSchedule } from "@/hooks/useShows";
import { formatTime } from "@/lib/time-utils";
import { SEO } from "@/components/SEO";

const formatRecurrenceDays = (daysOfWeek?: number[]): string => {
  if (!daysOfWeek || daysOfWeek.length === 0) return "";

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (daysOfWeek.length === 7) return "Daily";

  if (daysOfWeek.length === 5 && daysOfWeek.every((d) => d >= 1 && d <= 5)) {
    return "Weekdays";
  }

  if (
    daysOfWeek.length === 2 &&
    daysOfWeek.includes(0) &&
    daysOfWeek.includes(6)
  ) {
    return "Weekends";
  }

  return daysOfWeek
    .sort((a, b) => a - b)
    .map((d) => dayNames[d])
    .join(", ");
};

export function MosqueDetailPage() {
  const { id: stationId } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const {
    data: stationData,
    isLoading: isLoadingStation,
    isError: isStationError,
  } = useStation(stationId || "");
  const { data: scheduleData, isLoading: isLoadingSchedule } =
    useStationSchedule(stationId || "");

  const station = stationData?.data?.station;
  const schedule = (scheduleData?.data?.shows || []).filter(
    (show) => show.title !== "Live Stream"
  );

  const handlePlayPause = () => {
    if (!showPlayer) {
      setShowPlayer(true);
    }
    setIsPlaying(!isPlaying);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setIsPlaying(false);
  };

  const handleShare = useCallback(async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: station?.name || "Mosque",
      text: `Listen to ${station?.name || "this mosque"} on Minaret Live`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    }
  }, [station?.name]);

  if (isLoadingStation) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      </div>
    );
  }

  if (isStationError || !station) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Link
          to='/mosques'
          className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6'>
          <ArrowLeft className='h-4 w-4' />
          Back to Mosques
        </Link>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold mb-2'>Station Not Found</h2>
          <p className='text-muted-foreground'>
            The station you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const location =
    typeof station.mosqueId === "object" && station.mosqueId?.location
      ? station.mosqueId.location
      : station.description || "Location unknown";

  return (
    <>
      {/* {station && ( */}
      <SEO
        title={station.name}
        description={
          station.description || `Listen to ${station.name} live on Minaret`
        }
        url={window.location.href}
      />
      {/* )} */}
      <div className='container mx-auto px-4 py-8 pb-32 pt-16'>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}>
          <Link
            to='/mosques'
            className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6'>
            <ArrowLeft className='h-4 w-4' />
            Back to Mosques
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-border rounded-2xl p-6 md:p-8 mb-8'>
          <div className='flex flex-col md:flex-row gap-6'>
            {/* Mosque Logo/Icon */}
            <div className='shrink-0'>
              <div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary flex items-center justify-center'>
                {/* <span className='text-4xl md:text-5xl'></span> */}
              </div>
            </div>

            {/* Mosque Info */}
            <div className='flex-1'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div className='flex items-center gap-3 mb-2'>
                    <h1 className='text-2xl md:text-3xl font-bold font-heading'>
                      {station.name}
                    </h1>
                    {station.isLive && (
                      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-medium'>
                        <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse' />
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-2 text-muted-foreground mb-4'>
                    <MapPin className='h-4 w-4' />
                    <span>{location}</span>
                  </div>
                  <p className='text-muted-foreground max-w-2xl'>
                    {station.description}
                  </p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className='flex flex-wrap items-center gap-4 mt-6'>
                <div className='flex items-center gap-2 text-sm'>
                  <Users className='h-4 w-4 text-emerald-500' />
                  <span>
                    {station.stats?.totalListeners?.toLocaleString() ?? 0}{" "}
                    listeners
                  </span>
                </div>

                <div className='flex gap-2 ml-auto'>
                  <Button
                    variant='outline'
                    size='icon-sm'
                    onClick={handleShare}>
                    <Share2 className='h-4 w-4' />
                  </Button>
                  <Button variant='outline' size='icon-sm'>
                    <Heart className='h-4 w-4' />
                  </Button>
                  <Button
                    onClick={handlePlayPause}
                    disabled={!station.isLive}
                    className='bg-primary hover:from-emerald-600 hover:to-teal-700'>
                    {isPlaying ? (
                      <>
                        <Pause className='h-4 w-4 mr-2' />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className='h-4 w-4 mr-2' />
                        {station.isLive ? "Listen Live" : "Offline"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Schedule Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          <h2 className='text-xl font-bold font-heading mb-4 flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-emerald-500' />
            Broadcast Schedule
          </h2>

          {isLoadingSchedule ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='h-6 w-6 animate-spin text-emerald-500' />
            </div>
          ) : schedule && schedule.length > 0 ? (
            <div className='grid gap-3'>
              {schedule.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className='bg-card border border-border rounded-xl p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-4 flex-1'>
                    <div className='p-2 rounded-lg bg-emerald-500/10'>
                      <Clock className='h-4 w-4 text-emerald-500' />
                    </div>
                    <div className='flex-1'>
                      <p className='font-medium'>{item.title}</p>
                      {item.hostName && (
                        <p className='text-xs text-muted-foreground flex items-center gap-1'>
                          <User className='h-3 w-3' />
                          {item.hostName}
                        </p>
                      )}
                      <p className='text-sm text-muted-foreground'>
                        {formatTime(item.scheduledStart)} -{" "}
                        {formatTime(item.scheduledEnd)}
                      </p>
                      {item.isRecurring && item.recurrence?.daysOfWeek && (
                        <p className='text-xs text-muted-foreground mt-0.5'>
                          {formatRecurrenceDays(item.recurrence.daysOfWeek)}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.isRecurring && (
                    <span className='text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-medium'>
                      Recurring
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='bg-card border border-border rounded-xl p-8 text-center'>
              <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-3' />
              <p className='text-muted-foreground'>No schedule available</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Audio Player */}
      {showPlayer && (
        <AudioPlayer
          mosqueName={station.name}
          location={location}
          streamUrl={station.streamUrl}
          currentTrack={station.currentTrack}
          isLive={station.isLive}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onClose={handleClosePlayer}
        />
      )}
    </>
  );
}
