import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Play } from "lucide-react";
import { RecordingCard } from "@/components/RecordingCard";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useRecordings } from "@/hooks/useRecordings";
import { usePlayerStore } from "@/stores/playerStore";
import type { Recording } from "@/types/recording";
import { SEO } from "@/components/SEO";

export function PublicRecordingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentMosque, isPlaying, setCurrentMosque, setIsPlaying } =
    usePlayerStore();

  const { data, isLoading, isError } = useRecordings({ limit: 50 });

  const recordings = data?.data?.recordings || [];

  const filteredRecordings = recordings.filter((recording) => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch =
      recording.title?.toLowerCase().includes(searchLower) ||
      recording.showId?.title?.toLowerCase().includes(searchLower);
    const hostMatch =
      recording.hostName?.toLowerCase().includes(searchLower) ||
      recording.showId?.hostName?.toLowerCase().includes(searchLower);
    const stationMatch = recording.stationId?.name
      ?.toLowerCase()
      .includes(searchLower);

    return titleMatch || hostMatch || stationMatch;
  });

  const handlePlayRecording = (recording: Recording) => {
    if (currentMosque?.id === recording._id) {
      setIsPlaying(!isPlaying);
    } else {
      const recordingChunks =
        recording.chunks
          ?.filter((c) => c.publicUrl)
          .map((c) => ({ url: c.publicUrl, duration: c.durationSecs })) || [];

      setCurrentMosque({
        id: recording._id,
        name: recording.title || recording.showId?.title || "Recording",
        location: recording.stationId?.name,
        mountPoint: "recording",
        streamUrl:
          recording.chunks?.[0]?.publicUrl ||
          recording.url ||
          `/api/v1/recordings/${recording._id}/stream`,
        currentTrack: {
          title: recording.title || recording.showId?.title || "Untitled",
          artist: recording.stationId?.name || "Unknown Station",
        },
        isLive: false,
        recordingChunks,
        currentChunkIndex: 0,
      });
      setIsPlaying(true);
    }
  };

  const handleClosePlayer = () => {
    setCurrentMosque(null);
    setIsPlaying(false);
  };

  return (
    <>
      <SEO
        title='Recent Broadcasts'
        description='Listen to past broadcasts and recordings.'
      />

      <div className='container mx-auto px-4 py-8 pt-16 pb-24'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold font-heading flex items-center gap-3'>
            <Play className='h-8 w-8 text-primary shrink-0' />
            Recent Broadcasts
          </h1>
          <p className='text-muted-foreground mt-2'>
            Listen to past recordings from stations around the world
          </p>
        </motion.div>

        {/* Sponsor Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='mb-8 w-full bg-linear-to-r from-emerald-900/10 via-teal-900/5 to-transparent rounded-2xl overflow-hidden shadow-sm border border-emerald-500/20 flex flex-col sm:flex-row items-center relative group'>
          <div className='w-full sm:w-1/3 md:w-1/4 max-w-[280px] shrink-0 bg-white p-2'>
            <img
              src='/sponsor.jpg'
              alt='N.Adams Herbal and Islamic Medicine'
              className='w-full h-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.02]'
            />
          </div>
          <div className='p-6 md:p-8 flex-1 text-center sm:text-left relative z-10'>
            <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs rounded-full mb-3 uppercase tracking-wider'>
              Official Sponsor
            </span>
            <h3 className='text-xl md:text-2xl font-bold mb-2'>
              Total Wellness is Possible!
            </h3>
            <p className='text-muted-foreground text-sm md:text-base max-w-2xl'>
              This program is proudly sponsored by{" "}
              <strong>N.Adams Herbal and Islamic Medicine</strong>. Discover our
              holistic treatments designed for your total wellness.
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='flex flex-col sm:flex-row gap-4 mb-8'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search recordings by title, host, or station...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all'
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className='text-center py-4 text-sm text-destructive bg-destructive/10 rounded-lg'>
            <p>Failed to load recordings. Please try again later.</p>
          </div>
        )}

        {/* Recordings List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='flex flex-col gap-2 max-w-4xl'>
          {filteredRecordings.map((recording, index) => (
            <motion.div
              key={recording._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(0.05 * index, 0.5) }}>
              <RecordingCard
                recording={recording}
                isPlaying={currentMosque?.id === recording._id && isPlaying}
                onPlay={() => handlePlayRecording(recording)}
                onStop={() => setIsPlaying(false)}
                variant='list'
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredRecordings.length === 0 && !isLoading && !isError && (
          <div className='text-center py-12 bg-card rounded-xl border border-border mt-4'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4'>
              <Search className='h-8 w-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-medium'>No recordings found</h3>
            <p className='text-muted-foreground mt-1'>
              {searchQuery
                ? "Try adjusting your search terms"
                : "Check back later for new recordings"}
            </p>
          </div>
        )}
      </div>

      {/* Fixed Audio Player */}
      {currentMosque && (
        <AudioPlayer
          mosqueName={currentMosque.name}
          location={currentMosque.location}
          streamUrl={currentMosque.streamUrl}
          currentTrack={currentMosque.currentTrack}
          isLive={false}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onEnded={() => usePlayerStore.getState().playNextChunk()}
          onClose={handleClosePlayer}
        />
      )}
    </>
  );
}
