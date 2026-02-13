import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Radio, MapPin, Users, Loader2 } from "lucide-react";
import { MosqueCard } from "@/components/MosqueCard";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { useStations } from "@/hooks/useStations";
import { usePlayerStore } from "@/stores/playerStore";
import type { DisplayStation } from "@/types/station";
import { SEO } from "@/components/SEO";

const mockStations: DisplayStation[] = [
  {
    id: "1",
    name: "Massalacin Zawiyya",
    location: "Kontagora, Niger State",
    listeners: 500,
    isLive: true,
    description: "A historic mosque",
    ownerId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Massalacin Nasarawa",
    location: "Kontagora, Niger State",
    listeners: 320,
    isLive: true,
    description: "Community mosque",
    ownerId: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Central Mosque",
    location: "Kontagora, Niger State",
    listeners: 1200,
    isLive: false,
    description: "Main central mosque",
    ownerId: "3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Markaz Mosque",
    location: "Kaduna, Kaduna State",
    listeners: 890,
    isLive: true,
    description: "Islamic center",
    ownerId: "4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Sultan Bello Mosque",
    location: "Sokoto, Sokoto State",
    listeners: 2100,
    isLive: false,
    description: "Historic mosque in Sokoto",
    ownerId: "5",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Abubakar Gumi Mosque",
    location: "Kano, Kano State",
    listeners: 1500,
    isLive: true,
    description: "Major mosque in Kano",
    ownerId: "6",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function StationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "live">("all");
  const { currentMosque, isPlaying, setCurrentMosque, setIsPlaying } =
    usePlayerStore();

  const { data, isLoading, isError } = useStations();

  const stations: DisplayStation[] = data?.data?.stations
    ? data.data.stations.map((station) => ({
        _id: station._id,
        id: station._id,
        slug: station.slug,
        name: station.name,
        description: station.description,
        isLive: station.isLive,
        currentTrack: station.currentTrack,
        location:
          typeof station.mosqueId === "object"
            ? station.mosqueId.location
            : station.description || "Location unknown",
        streamUrl: station.streamUrl,
        listeners: station.stats?.totalListeners || 0,
      }))
    : mockStations;

  const filteredStations = stations.filter((mosque) => {
    const matchesSearch =
      mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mosque.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || mosque.isLive;
    return matchesSearch && matchesFilter;
  });

  const liveCount = stations.filter((m) => m.isLive).length;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    setCurrentMosque(null);
    setIsPlaying(false);
  };

  return (
    <>
      <SEO
        title='Discover Mosques'
        description='Find and listen to live broadcasts from mosques around the world. Join the community on Minaret Live.'
      />
      {/* <DonationBanner /> */}
      <div className='container mx-auto px-4 py-8 pt-16'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold font-heading'>
            Discover stations
          </h1>
          <p className='text-muted-foreground mt-2'>
            Find and listen to live broadcasts from stations around the world
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
          <div className='bg-card border border-border rounded-xl p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-emerald-500/10'>
                <Radio className='h-5 w-5 text-emerald-500' />
              </div>
              <div>
                <p className='text-2xl font-bold'>{liveCount}</p>
                <p className='text-sm text-muted-foreground'>Live Now</p>
              </div>
            </div>
          </div>
          <div className='bg-card border border-border rounded-xl p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-blue-500/10'>
                <MapPin className='h-5 w-5 text-blue-500' />
              </div>
              <div>
                <p className='text-2xl font-bold'>{stations.length}</p>
                <p className='text-sm text-muted-foreground'>stations</p>
              </div>
            </div>
          </div>
          <div className='bg-card border border-border rounded-xl p-4 col-span-2 md:col-span-1'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-purple-500/10'>
                <Users className='h-5 w-5 text-purple-500' />
              </div>
              <div>
                <p className='text-2xl font-bold'>
                  {stations
                    .reduce((acc, m) => acc + (m.listeners || 0), 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-muted-foreground'>Total Listeners</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='flex flex-col sm:flex-row gap-4 mb-8'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search stations by name or location...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all'
            />
          </div>
          <div className='flex gap-2'>
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-primary" : ""}>
              All ({stations.length})
            </Button>
            <Button
              variant={filter === "live" ? "default" : "outline"}
              onClick={() => setFilter("live")}
              className={
                filter === "live"
                  ? "bg-linear-to-r from-emerald-500 to-teal-600"
                  : ""
              }>
              <Radio className='h-4 w-4 mr-1' />
              Live ({liveCount})
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-emerald-500' />
          </div>
        )}

        {/* Error/Offline State */}
        {isError && (
          <div className='text-center py-4 text-sm text-muted-foreground'>
            <p>Using offline data. Connect backend for live updates.</p>
          </div>
        )}

        {/* Mosque Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredStations.map((station, index) => (
            <motion.div
              key={station.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}>
              <MosqueCard
                stationId={station.slug || station._id || ""}
                {...station}
                isPlaying={
                  isPlaying && currentMosque?.id === (station.id || station._id)
                }
                onPlay={() => {
                  const stationId = station.id || station._id || "";
                  if (currentMosque?.id === stationId) {
                    setIsPlaying(!isPlaying);
                  } else {
                    setCurrentMosque({
                      id: stationId,
                      name: station.name,
                      location: station.location,
                      mountPoint: station.slug || station.name,
                      description: station.description,
                      streamUrl: station.streamUrl,
                      currentTrack: station.currentTrack,
                    });
                    setIsPlaying(true);
                  }
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredStations.length === 0 && !isLoading && (
          <div className='text-center py-12'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4'>
              <Search className='h-8 w-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-medium'>No stations found</h3>
            <p className='text-muted-foreground mt-1'>
              Try adjusting your search or filter
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
          isLive={true}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onClose={handleClose}
        />
      )}
    </>
  );
}
