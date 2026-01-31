import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FeatureCard, type FeatureCardProps } from "@/components/FeatureCard";
import { MosqueCard } from "@/components/MosqueCard";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Radio, MapPin, Clock, Heart } from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";
import { useStations } from "@/hooks/useStations";
import type { StationListItem } from "@/types/station";

const features: FeatureCardProps[] = [
  {
    title: "Live Broadcasts",
    description:
      "Listen to live lectures, prayers and sermons from mosques around the world",
    icon: Radio,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Find Mosques",
    description:
      "Discover mosques in your area with prayer times and directions",
    icon: MapPin,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Prayer Times",
    description: "Accurate prayer times based on your location",
    icon: Clock,
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "Community",
    description: "Connect with your local mosque community",
    icon: Heart,
    gradient: "from-orange-500 to-red-600",
  },
];

export function HomePage() {
  const { currentMosque, isPlaying, setCurrentMosque, setIsPlaying } =
    usePlayerStore();
  const { data: stationsData } = useStations();

  const stations = stationsData?.data?.stations || [];

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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    setCurrentMosque(null);
    setIsPlaying(false);
  };

  return (
    <>
      <main className='container mx-auto px-4 py-8 pb-24'>
        <h1 className='text-4xl font-bold font-heading'>
          Welcome to Minaret Live
        </h1>
        <p className='mt-4 text-muted-foreground'>Your mosque community hub</p>

        <div className='mt-8 px-0'>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className='w-full'>
            <CarouselContent className='-ml-2 md:-ml-4'>
              {features.map((feature, index) => (
                <CarouselItem
                  key={index}
                  className='pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3'>
                  <FeatureCard {...feature} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='left-2 bg-background/80 backdrop-blur-sm shadow-lg border-muted-foreground/30 hover:bg-background' />
            <CarouselNext className='right-2 bg-background/80 backdrop-blur-sm shadow-lg border-muted-foreground/30 hover:bg-background' />
          </Carousel>
        </div>

        <section className='mt-12'>
          <h2 className='text-2xl font-bold font-heading mb-6'>
            Popular Mosques
          </h2>
          <Carousel className='w-full md:hidden'>
            <CarouselContent>
              {stations.map((station) => (
                <CarouselItem key={station._id}>
                  <MosqueCard
                    name={station.name}
                    location={station.mosqueId.location}
                    listeners={station.stats.totalListeners}
                    isLive={station.isLive}
                    currentTrack={station.currentTrack}
                    isPlaying={currentMosque?.id === station._id && isPlaying}
                    onPlay={() => handlePlay(station)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='left-2 bg-background/80 backdrop-blur-sm shadow-lg border-muted-foreground/30 hover:bg-background' />
            <CarouselNext className='right-2 bg-background/80 backdrop-blur-sm shadow-lg border-muted-foreground/30 hover:bg-background' />
          </Carousel>
          <div className='md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 hidden'>
            {stations.map((station) => (
              <MosqueCard
                key={station._id}
                name={station.name}
                location={station.mosqueId.location}
                listeners={station.stats.totalListeners}
                isLive={station.isLive}
                currentTrack={station.currentTrack}
                isPlaying={currentMosque?.id === station._id && isPlaying}
                onPlay={() => handlePlay(station)}
              />
            ))}
          </div>
        </section>
      </main>

      {currentMosque && (
        <AudioPlayer
          mosqueName={currentMosque.name}
          location={currentMosque.location}
          isLive={currentMosque.isLive} // Pass isLive status
          isPlaying={isPlaying}
          streamUrl={currentMosque.streamUrl} // Pass streamUrl
          currentTrack={currentMosque.currentTrack} // Pass currentTrack
          onPlayPause={handlePlayPause}
          onClose={handleClose}
        />
      )}
    </>
  );
}
