import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  Calendar,
  Play,
  Pause,
  Share2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import type { DisplayStation } from "@/types/station";
import type { Show } from "@/types/show";

// Mock data - will be replaced with API call
const mockMosqueDetails: Record<string, DisplayStation> = {
  "Massalacin Zawiyya": {
    id: "1",
    name: "Massalacin Zawiyya",
    description:
      "A historic mosque serving the community of Kontagora for over 50 years. Known for its Friday prayers and regular Quranic lectures.",
    location: "Kontagora, Niger State",
    listeners: 500,
    isLive: true,
    logo: undefined,
    streamUrl: "https://example.com/stream",
    ownerId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schedule: [
      {
        id: "s1",
        title: "Fajr Prayer",
        startTime: "5:30 AM",
        endTime: "6:00 AM",
        isRecurring: true,
        recurringDays: [0, 1, 2, 3, 4, 5, 6],
        stationId: "1",
        description: "",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "s2",
        title: "Dhuhr Prayer",
        startTime: "1:00 PM",
        endTime: "1:30 PM",
        isRecurring: true,
        recurringDays: [0, 1, 2, 3, 4, 5, 6],
        stationId: "1",
        description: "",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "s3",
        title: "Jumu'ah Prayer",
        startTime: "1:30 PM",
        endTime: "2:30 PM",
        isRecurring: false,
        stationId: "1",
        description: "",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "s4",
        title: "Asr Prayer",
        startTime: "4:30 PM",
        endTime: "5:00 PM",
        isRecurring: true,
        recurringDays: [0, 1, 2, 3, 4, 5, 6],
        stationId: "1",
        description: "",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "s5",
        title: "Maghrib Prayer",
        startTime: "6:30 PM",
        endTime: "7:00 PM",
        isRecurring: true,
        recurringDays: [0, 1, 2, 3, 4, 5, 6],
        stationId: "1",
        description: "",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "s6",
        title: "Isha Prayer",
        startTime: "8:00 PM",
        endTime: "8:30 PM",
        isRecurring: true,
        recurringDays: [0, 1, 2, 3, 4, 5, 6],
        stationId: "1",
        description: "",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "s7",
        title: "Weekly Tafsir",
        startTime: "After Maghrib",
        endTime: "8:00 PM",
        isRecurring: true,
        recurringDays: [0], // Sunday
        stationId: "1",
        description: "",
        createdAt: "",
        updatedAt: "",
      },
    ],
  },
  "Central Mosque": {
    id: "3",
    name: "Central Mosque",
    description:
      "The main mosque of Kontagora, serving as the central gathering place for the Muslim community.",
    location: "Kontagora, Niger State",
    listeners: 1200,
    isLive: false,
    logo: undefined,
    streamUrl: undefined,
    ownerId: "3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schedule: [
      {
        id: "s8",
        title: "Jumu'ah Prayer",
        startTime: "1:30 PM",
        endTime: "2:30 PM",
        isRecurring: false,
        stationId: "3",
        description: "",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "s9",
        title: "Eid Prayers",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        isRecurring: false,
        stationId: "3",
        description: "",
        createdAt: "",
        updatedAt: "",
      },
    ],
  },
};

export function MosqueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // Decode the mosque name from URL
  const mosqueName = decodeURIComponent(id || "");

  // Get mosque details (mock for now)
  const mosque = mockMosqueDetails[
    mosqueName as keyof typeof mockMosqueDetails
  ] || {
    id: "0",
    name: mosqueName || "Unknown Mosque",
    description: "Mosque information not available.",
    location: "Location unknown",
    listeners: 0,
    isLive: false,
    logo: undefined,
    streamUrl: undefined,
    ownerId: "",
    createdAt: "",
    updatedAt: "",
    schedule: [],
  };

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

  return (
    <>
      <div className='container mx-auto px-4 py-8 pb-32'>
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
              <div className='w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center'>
                <span className='text-4xl md:text-5xl'>🕌</span>
              </div>
            </div>

            {/* Mosque Info */}
            <div className='flex-1'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div className='flex items-center gap-3 mb-2'>
                    <h1 className='text-2xl md:text-3xl font-bold font-heading'>
                      {mosque.name}
                    </h1>
                    {mosque.isLive && (
                      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-medium'>
                        <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse' />
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-2 text-muted-foreground mb-4'>
                    <MapPin className='h-4 w-4' />
                    <span>{mosque.location}</span>
                  </div>
                  <p className='text-muted-foreground max-w-2xl'>
                    {mosque.description}
                  </p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className='flex flex-wrap items-center gap-4 mt-6'>
                <div className='flex items-center gap-2 text-sm'>
                  <Users className='h-4 w-4 text-emerald-500' />
                  <span>
                    {mosque.listeners?.toLocaleString() ?? 0} listeners
                  </span>
                </div>

                <div className='flex gap-2 ml-auto'>
                  <Button variant='outline' size='icon-sm'>
                    <Share2 className='h-4 w-4' />
                  </Button>
                  <Button variant='outline' size='icon-sm'>
                    <Heart className='h-4 w-4' />
                  </Button>
                  <Button
                    onClick={handlePlayPause}
                    disabled={!mosque.isLive}
                    className='bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'>
                    {isPlaying ? (
                      <>
                        <Pause className='h-4 w-4 mr-2' />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className='h-4 w-4 mr-2' />
                        {mosque.isLive ? "Listen Live" : "Offline"}
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

          {mosque.schedule && mosque.schedule.length > 0 ? (
            <div className='grid gap-3'>
              {mosque.schedule.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className='bg-card border border-border rounded-xl p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='p-2 rounded-lg bg-emerald-500/10'>
                      <Clock className='h-4 w-4 text-emerald-500' />
                    </div>
                    <div>
                      <p className='font-medium'>{item.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        {/* {item.day ? `${item.day} • ` : "Daily • "} */}
                        {item.startTime}
                      </p>
                    </div>
                  </div>
                  {item.isRecurring && (
                    <span className='text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500'>
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
          mosqueName={mosque.name}
          location={mosque.location}
          isLive={mosque.isLive}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onClose={handleClosePlayer}
        />
      )}
    </>
  );
}
