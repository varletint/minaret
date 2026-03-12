import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import {
  Radio,
  MapPin,
  Clock,
  Heart,
  Play,
  Pause,
  Users,
  ChevronRight,
  Headphones,
  User,
} from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";
import { useStations } from "@/hooks/useStations";
import type { StationListItem } from "@/types/station";
import { useRecordings } from "@/hooks/useRecordings";
import type { Recording } from "@/types/recording";
import { SEO } from "@/components/SEO";
import { formatDuration, getRelativeTime } from "@/lib/time-utils";

// Quick nav links
const quickLinks = [
  { label: "Live", icon: Radio, to: "/mosques", color: "text-red-500" },
  { label: "Mosques", icon: MapPin, to: "/mosques", color: "text-blue-500" },
  {
    label: "Prayer Times",
    icon: Clock,
    to: "/prayer-times",
    color: "text-purple-500",
  },
  { label: "Community", icon: Heart, to: "/mosques", color: "text-pink-500" },
];

export function HomePage() {
  const { currentMosque, isPlaying, setCurrentMosque, setIsPlaying } =
    usePlayerStore();
  const { data: stationsData } = useStations();
  const { data: recordingsData } = useRecordings({ limit: 8 });

  const stations = stationsData?.data?.stations || [];
  const recordings = recordingsData?.data?.recordings || [];

  const liveStations = stations.filter((s) => s.isLive);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const handlePlay = (station: StationListItem) => {
    if (currentMosque?.id === station._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentMosque({
        id: station._id,
        name: station.name,
        location: station.mosqueId.location,
        mountPoint: station.name,
        streamUrl: station.streamUrl,
        currentTrack: station.currentTrack,
        isLive: station.isLive,
      });
      setIsPlaying(true);
    }
  };

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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    setCurrentMosque(null);
    setIsPlaying(false);
  };

  return (
    <>
      <SEO />
      <main className='min-h-screen pb-28 pt-16'>
        {/* ─── Greeting + Quick Nav Pills ─── */}
        <div className='container mx-auto px-4 pt-6'>
          <h1 className='text-2xl md:text-3xl font-bold font-heading mb-1'>
            {greeting}
          </h1>
          <p className='text-sm text-muted-foreground mb-4'>
            Your mosque community hub
          </p>

          <div className='flex gap-2 overflow-x-auto hide-scrollbar pb-2'>
            {quickLinks.map((link) => (
              <Link key={link.label} to={link.to}>
                <div className='flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 whitespace-nowrap group cursor-pointer'>
                  <link.icon
                    className={`h-4 w-4 ${link.color} group-hover:scale-110 transition-transform`}
                  />
                  <span className='text-sm font-medium text-foreground/80 group-hover:text-foreground'>
                    {link.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── Sponsor Banner (compact) ─── */}
        <section className='container mx-auto px-4 mt-8'>
          <div className='flex items-center gap-4 p-4 rounded-xl bg-card border border-border/60 hover:border-primary/20 transition-colors group'>
            <div className='w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-white p-1'>
              <img
                src='/sponsor.jpg'
                alt='N.Adams Herbal and Islamic Medicine'
                className='w-full h-full object-contain rounded-md'
              />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5'>
                Sponsor
              </p>
              <p className='text-sm font-semibold text-foreground truncate'>
                N.Adams Herbal and Islamic Medicine
              </p>
              <p className='text-xs text-muted-foreground truncate'>
                Holistic treatments for your total wellness
              </p>
            </div>
          </div>
        </section>

        {/* ─── Live Now ─── */}
        {stations.length > 0 && (
          <section className='mt-10'>
            <div className='container mx-auto px-4'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Radio className='h-5 w-5 text-primary' />
                  <h2 className='text-xl font-bold font-heading'>
                    {liveStations.length > 0 ? "Live Now" : "All Stations"}
                  </h2>
                  {liveStations.length > 0 && (
                    <span className='text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
                      {liveStations.length}
                    </span>
                  )}
                </div>
                <Link
                  to='/mosques'
                  className='text-sm text-primary hover:text-primary/80 flex items-center gap-0.5 font-medium'>
                  See all <ChevronRight className='h-4 w-4' />
                </Link>
              </div>
            </div>

            <div className='overflow-x-auto hide-scrollbar'>
              <div className='flex gap-4 px-4 container mx-auto pb-2'>
                {stations.map((station) => {
                  const stationPlaying =
                    currentMosque?.id === station._id && isPlaying;

                  return (
                    <div
                      key={station._id}
                      className='shrink-0 w-[160px] md:w-[180px] group/card'>
                      {/* Station tile */}
                      <div className='relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/15 mb-3 shadow-sm border border-border/40 group-hover/card:border-primary/30 group-hover/card:shadow-md transition-all'>
                        {/* Gradient overlay with icon */}
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <Headphones className='h-12 w-12 text-primary/20' />
                        </div>

                        {/* Live badge */}
                        {station.isLive && (
                          <div className='absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/90 backdrop-blur-sm'>
                            <span className='relative flex h-1.5 w-1.5'>
                              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75' />
                              <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-white' />
                            </span>
                            <span className='text-[9px] font-bold text-white uppercase'>
                              Live
                            </span>
                          </div>
                        )}

                        {/* Listeners */}
                        {station.stats.totalListeners > 0 && (
                          <div className='absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm'>
                            <Users className='h-2.5 w-2.5 text-white/80' />
                            <span className='text-[9px] text-white/80 font-medium'>
                              {station.stats.totalListeners}
                            </span>
                          </div>
                        )}

                        {/* Now playing indicator */}
                        {stationPlaying && (
                          <div className='absolute bottom-2 left-2 flex items-center gap-1'>
                            <span className='flex gap-[2px] items-end h-3'>
                              {[0, 0.15, 0.3].map((delay, i) => (
                                <span
                                  key={i}
                                  className='w-[2px] rounded-full bg-primary'
                                  style={{
                                    animation: `audioBar 1.2s ease-in-out ${delay}s infinite`,
                                    height: "60%",
                                  }}
                                />
                              ))}
                            </span>
                          </div>
                        )}

                        {/* Play button overlay */}
                        <Link
                          to={`/mosques/${station.slug}`}
                          className='absolute inset-0'>
                          <div className='absolute inset-0 flex items-center justify-center bg-black/0 group-hover/card:bg-black/20 transition-colors'>
                            {station.isLive && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handlePlay(station);
                                }}
                                className={`h-11 w-11 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 ${
                                  stationPlaying
                                    ? "bg-primary text-primary-foreground scale-100 opacity-100"
                                    : "bg-white/90 text-foreground opacity-0 group-hover/card:opacity-100 scale-90 group-hover/card:scale-100 hover:bg-primary hover:text-primary-foreground"
                                }`}>
                                {stationPlaying ? (
                                  <Pause
                                    className='h-4 w-4'
                                    fill='currentColor'
                                  />
                                ) : (
                                  <Play
                                    className='h-4 w-4 ml-0.5'
                                    fill='currentColor'
                                  />
                                )}
                              </button>
                            )}
                          </div>
                        </Link>
                      </div>

                      {/* Station name */}
                      <Link to={`/mosques/${station.slug}`}>
                        <h3 className='text-sm font-semibold text-foreground truncate group-hover/card:text-primary transition-colors'>
                          {station.name}
                        </h3>
                        {station.currentTrack?.artist && (
                          <p className='text-xs text-muted-foreground truncate capitalize mt-0.5'>
                            {station.currentTrack.artist}
                          </p>
                        )}
                        {!station.currentTrack?.artist && (
                          <p className='text-xs text-muted-foreground truncate mt-0.5'>
                            {station.isLive ? "Broadcasting" : "Offline"}
                          </p>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ─── Recent Recordings (Track List) ─── */}
        {recordings.length > 0 && (
          <section className='container mx-auto px-4 mt-10'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <Headphones className='h-5 w-5 text-primary' />
                <h2 className='text-xl font-bold font-heading'>
                  Recent Recordings
                </h2>
              </div>
              <Link
                to='/recordings'
                className='text-sm text-primary hover:text-primary/80 flex items-center gap-0.5 font-medium'>
                View all <ChevronRight className='h-4 w-4' />
              </Link>
            </div>

            <div className='rounded-xl border border-border/60 bg-card overflow-hidden divide-y divide-border/40'>
              {recordings.map((recording, index) => {
                const recPlaying =
                  currentMosque?.id === recording._id && isPlaying;

                return (
                  <div
                    key={recording._id}
                    onClick={() => handlePlayRecording(recording)}
                    className={`flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30 group/track ${
                      recPlaying ? "bg-primary/5" : ""
                    }`}>
                    {/* Track number / play */}
                    <div className='w-8 h-8 flex items-center justify-center shrink-0'>
                      <span
                        className={`text-sm tabular-nums text-muted-foreground group-hover/track:hidden ${
                          recPlaying ? "hidden" : ""
                        }`}>
                        {index + 1}
                      </span>
                      <div
                        className={`group-hover/track:flex items-center justify-center ${
                          recPlaying ? "flex" : "hidden"
                        }`}>
                        {recPlaying ? (
                          <span className='flex gap-[2px] items-end h-4'>
                            {[0, 0.15, 0.3].map((delay, i) => (
                              <span
                                key={i}
                                className='w-[2px] rounded-full bg-primary'
                                style={{
                                  animation: `audioBar 1.2s ease-in-out ${delay}s infinite`,
                                  height: "60%",
                                }}
                              />
                            ))}
                          </span>
                        ) : (
                          <Play
                            className='h-4 w-4 text-foreground'
                            fill='currentColor'
                          />
                        )}
                      </div>
                    </div>

                    {/* Artwork placeholder */}
                    <div className='w-10 h-10 md:w-11 md:h-11 rounded-lg shrink-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center border border-border/30'>
                      <Radio className='h-4 w-4 text-primary/40' />
                    </div>

                    {/* Title & info */}
                    <div className='flex-1 min-w-0'>
                      <h3
                        className={`text-sm font-medium truncate ${
                          recPlaying ? "text-primary" : "text-foreground"
                        }`}>
                        {recording.title ||
                          recording.showId?.title ||
                          "Untitled Recording"}
                      </h3>
                      <div className='flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5'>
                        <User className='h-3 w-3 shrink-0' />
                        <span className='truncate'>
                          {recording.hostName ||
                            recording.showId?.hostName ||
                            recording.stationId?.name ||
                            "Unknown"}
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <span className='hidden sm:block text-xs text-muted-foreground shrink-0'>
                      {getRelativeTime(
                        recording.startedAt || recording.createdAt
                      )}
                    </span>

                    {/* Duration */}
                    <span className='text-xs text-muted-foreground tabular-nums shrink-0 w-12 text-right'>
                      {formatDuration(recording.totalDurationSecs)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {currentMosque && (
        <AudioPlayer
          mosqueName={currentMosque.name}
          location={currentMosque.location}
          isLive={currentMosque.isLive}
          isPlaying={isPlaying}
          streamUrl={currentMosque.streamUrl}
          currentTrack={currentMosque.currentTrack}
          onPlayPause={handlePlayPause}
          onEnded={() => usePlayerStore.getState().playNextChunk()}
          onClose={handleClose}
        />
      )}
    </>
  );
}
