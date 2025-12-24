import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/Navbar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { FeatureCard, type FeatureCardProps } from "@/components/FeatureCard"
import { MosqueCard, type MosqueCardProps } from "@/components/MosqueCard"
import { AudioPlayer } from "@/components/AudioPlayer"
import { Footer } from "@/components/Footer"
import { Radio, MapPin, Clock, Heart } from "lucide-react"

const features: FeatureCardProps[] = [
  {
    title: "Live Broadcasts",
    description: "Listen to live prayers and sermons from mosques around the world",
    icon: Radio,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Find Mosques",
    description: "Discover mosques in your area with prayer times and directions",
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
]

const mosques: Omit<MosqueCardProps, 'onPlay'>[] = [
  {
    name: "Massalacin Zawiyya",
    location: "Kontagora, Niger State",
    listeners: 500,
    isLive: true,
  },
  {
    name: "Massalacin Nasarawa",
    location: "Kontagora, Niger State",
    listeners: 500,
    isLive: true,
  },
  {
    name: "Central Mosque",
    location: "Kontagora, Niger State",
    listeners: 3200,
    isLive: false,
  },
]

interface NowPlaying {
  name: string
  location: string
  isLive: boolean
}

function App() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = (mosque: Omit<MosqueCardProps, 'onPlay'>) => {
    if (nowPlaying?.name === mosque.name) {
      // Toggle play/pause for same mosque
      setIsPlaying(!isPlaying)
    } else {
      // Switch to new mosque
      setNowPlaying({
        name: mosque.name,
        location: mosque.location,
        isLive: mosque.isLive ?? false,
      })
      setIsPlaying(true)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleClose = () => {
    setNowPlaying(null)
    setIsPlaying(false)
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="minaret-theme">
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pb-24">
          <h1 className="text-4xl font-bold font-heading">Welcome to Minaret</h1>
          <p className="mt-4 text-muted-foreground">Your mosque community hub</p>

          {/* Hero Carousel */}
          <div className="mt-8 px-0">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <FeatureCard {...feature} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm shadow-lg border-muted-foreground/30 hover:bg-background" />
              <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm shadow-lg border-muted-foreground/30 hover:bg-background" />
            </Carousel>
          </div>

          {/* Popular Mosques Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold font-heading mb-6">Popular Mosques</h2>
            <Carousel className="w-full md:hidden">
              <CarouselContent>
                {mosques.map((mosque, index) => (
                  <CarouselItem key={index}>
                    <MosqueCard
                      {...mosque}
                      isPlaying={nowPlaying?.name === mosque.name && isPlaying}
                      onPlay={() => handlePlay(mosque)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm shadow-lg border-muted-foreground/30 hover:bg-background" />
              <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm shadow-lg border-muted-foreground/30 hover:bg-background" />
            </Carousel>
            <div className="md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 hidden">
              {mosques.map((mosque, index) => (
                <MosqueCard
                  key={index}
                  {...mosque}
                  isPlaying={nowPlaying?.name === mosque.name && isPlaying}
                  onPlay={() => handlePlay(mosque)}
                />
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />

        {/* Fixed Audio Player */}
        {nowPlaying && (
          <AudioPlayer
            mosqueName={nowPlaying.name}
            location={nowPlaying.location}
            isLive={nowPlaying.isLive}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onClose={handleClose}
          />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
