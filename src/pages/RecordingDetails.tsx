import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useRecordings } from "@/hooks/useRecordings";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import {
  Play,
  ArrowLeft,
  Calendar,
  Clock,
  Radio,
  User,
  Pause,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/playerStore";
import type { Recording } from "@/types/recording";

export function RecordingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const stateRecording = location.state?.recording as Recording | undefined;

  // Fallback to fetch from list if accessed directly
  const { data: listData, isLoading } = useRecordings(
    { limit: 50 },
    !stateRecording
  );

  const recording =
    stateRecording || listData?.data?.recordings?.find((r) => r._id === id);

  const { currentMosque, isPlaying, setCurrentMosque, setIsPlaying } =
    usePlayerStore();

  if (isLoading && !recording) {
    return (
      <div className='flex items-center justify-center min-h-[50vh]'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <h2 className='text-2xl font-bold mb-4'>Recording Not Found</h2>
        <Button onClick={() => navigate("/recordings")} variant='outline'>
          <ArrowLeft className='mr-2 h-4 w-4' /> Go Back
        </Button>
      </div>
    );
  }

  const isCurrentPlaying = currentMosque?.id === recording._id && isPlaying;

  const handlePlayRecording = () => {
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

  const formatDuration = (seconds?: number) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return "N/A";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <>
      <SEO
        title={
          recording.title || recording.showId?.title || "Recording Details"
        }
        description={`Listen to ${recording.title || "this recording"} from ${
          recording.stationId?.name || "our station"
        }.`}
      />

      <div className='container mx-auto px-4 py-8 pt-16 pb-24 max-w-4xl'>
        <Button
          variant='ghost'
          onClick={() => navigate(-1)}
          className='mb-6 hover:bg-muted'>
          <ArrowLeft className='mr-2 h-4 w-4' /> Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-card border border-border rounded-2xl overflow-hidden shadow-sm'>
          {/* Header/Cover Area */}
          <div className='aspect-[21/9] w-full relative bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center overflow-hidden'>
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

            <Button
              size='icon'
              className={`h-16 w-16 rounded-full shadow-2xl transition-transform hover:scale-105 z-10 border-4 border-background ${
                isCurrentPlaying
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-background hover:bg-primary text-foreground hover:text-primary-foreground"
              }`}
              onClick={handlePlayRecording}>
              {isCurrentPlaying ? (
                <Pause className='h-8 w-8 fill-current' />
              ) : (
                <Play className='h-8 w-8 ml-1 fill-current' />
              )}
            </Button>
          </div>

          <div className='p-6 md:p-8'>
            <div className='flex flex-wrap items-start justify-between gap-4 mb-6'>
              <div>
                <h1 className='text-3xl font-bold font-heading mb-2 text-foreground'>
                  {recording.title ||
                    recording.showId?.title ||
                    "Untitled Recording"}
                </h1>
                <div className='flex flex-wrap items-center gap-4 text-muted-foreground'>
                  <div className='flex items-center gap-1.5'>
                    <Radio className='h-4 w-4 text-primary' />
                    <span className='font-medium'>
                      {recording.stationId?.name || "Unknown Station"}
                    </span>
                  </div>
                  {recording.hostName || recording.showId?.hostName ? (
                    <div className='flex items-center gap-1.5'>
                      <User className='h-4 w-4 text-primary' />
                      <span>
                        {recording.hostName || recording.showId?.hostName}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-8 bg-muted/30 rounded-xl p-4 border border-border/50 mb-8'>
              <div className='flex flex-col gap-1'>
                <span className='text-xs text-muted-foreground uppercase tracking-wider font-semibold'>
                  Date & Time
                </span>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  <Calendar className='h-4 w-4 text-primary/70' />
                  {formatDate(
                    (recording.startedAt || recording.createdAt) as string
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-xs text-muted-foreground uppercase tracking-wider font-semibold'>
                  Duration
                </span>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  <Clock className='h-4 w-4 text-primary/70' />
                  {formatDuration(recording.totalDurationSecs)}
                </div>
              </div>
            </div>

            {/* Chunks List */}
            {recording.chunks && recording.chunks.length > 0 && (
              <div className='mt-8 border-t border-border pt-8'>
                <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                  <Play className='h-5 w-5 text-primary' />
                  Recording Parts ({recording.chunks.length})
                </h3>
                <div className='flex flex-col gap-3'>
                  {recording.chunks.map((chunk, idx) => (
                    <div
                      key={idx}
                      className='flex items-center justify-between p-2 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-sm transition-all group'>
                      <div className='flex items-center gap-4'>
                        <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 shadow-inner'>
                          {idx + 1}
                        </div>
                        <div>
                          <p className='font-medium text-foreground group-hover:text-primary transition-colors'>
                            Part {idx + 1}
                          </p>
                          <div className='flex items-center gap-3 text-sm text-muted-foreground mt-0.5'>
                            <span className='flex items-center gap-1'>
                              <Clock className='h-3 w-3' />
                              {formatDuration(chunk.durationSecs)}
                            </span>
                            {chunk.sizeBytes && (
                              <span className='flex items-center gap-1'>
                                {(chunk.sizeBytes / 1024 / 1024).toFixed(1)} MB
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {chunk.publicUrl && (
                        <Button
                          variant='ghost'
                          size='icon'
                          asChild
                          title='Download Part'
                          className='opacity-100 group-hover:opacity-100 transition-opacity'>
                          <a
                            href={chunk.publicUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            download>
                            <Download className='h-4 w-4 text-muted-foreground hover:text-primary' />
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
