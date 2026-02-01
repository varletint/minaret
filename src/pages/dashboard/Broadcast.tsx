import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Radio,
  Loader2,
  Music,
  Users,
  Clock,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useMyStation,
  useGoLive,
  useGoOffline,
  useUpdateNowPlaying,
} from "@/hooks/useStations";
import { toast } from "sonner";

export function BroadcastPage() {
  const { data: stationData, isLoading, isError, error } = useMyStation();
  const goLive = useGoLive();
  const goOffline = useGoOffline();
  const updateNowPlaying = useUpdateNowPlaying();

  const station = stationData?.data?.station;
  const isLive = station?.isLive ?? false;

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleCopy = async (value: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const [nowPlayingForm, setNowPlayingForm] = useState({
    title: "",
    artist: "",
    album: "",
  });

  const handleNowPlayingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNowPlayingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoLive = async () => {
    try {
      await goLive.mutateAsync();
      toast.success("You are now live!");
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to go live");
    }
  };

  const handleGoOffline = async () => {
    try {
      await goOffline.mutateAsync();
      toast.success("Broadcast ended");
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to go offline");
    }
  };

  const handleUpdateNowPlaying = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nowPlayingForm.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      await updateNowPlaying.mutateAsync({
        title: nowPlayingForm.title.trim(),
        artist: nowPlayingForm.artist.trim() || undefined,
        album: nowPlayingForm.album.trim() || undefined,
      });
      toast.success("Now playing updated!");
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to update now playing");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className='max-w-2xl mx-auto'>
        <div className='bg-destructive/10 border border-destructive/20 rounded-xl p-6'>
          <div className='flex items-center gap-3'>
            <AlertCircle className='h-5 w-5 text-destructive' />
            <p className='text-destructive'>
              {(error as Error)?.message || "Failed to load station"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No station state
  if (!station) {
    return (
      <div className='max-w-2xl mx-auto text-center'>
        <div className='bg-card border border-border rounded-xl p-8'>
          <Radio className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h2 className='text-xl font-bold font-heading mb-2'>
            No Station Found
          </h2>
          <p className='text-muted-foreground mb-6'>
            Create a station first to start broadcasting.
          </p>
          <Link to='/dashboard/station/setup'>
            <Button className='bg-primary hover:bg-primary/90'>
              Create Station
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}>
        <Link
          to='/dashboard'
          className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'>
          <ArrowLeft className='h-4 w-4' />
          Back to Dashboard
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}>
        <h1 className='text-2xl md:text-3xl font-bold font-heading flex items-center gap-3'>
          <Radio className='h-7 w-7 text-primary' />
          Broadcast Control
        </h1>
        <p className='text-muted-foreground mt-1'>
          Control your live broadcast and update what's playing
        </p>
      </motion.div>

      {/* Live Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`bg-card border rounded-xl p-6 ${
          isLive ? "border-red-500/30 bg-red-500/5" : "border-border"
        }`}>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                isLive ? "bg-red-500/10" : "bg-muted"
              }`}>
              <Radio
                className={`h-7 w-7 ${
                  isLive ? "text-red-500" : "text-muted-foreground"
                }`}
              />
            </div>
            <div>
              <h2 className='text-lg font-bold font-heading'>{station.name}</h2>
              <div className='flex items-center gap-3 mt-1'>
                {isLive ? (
                  <span className='inline-flex items-center gap-1.5 text-red-500 font-medium'>
                    <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse' />
                    Broadcasting Live
                  </span>
                ) : (
                  <span className='text-muted-foreground'>Offline</span>
                )}
              </div>
            </div>
          </div>

          <div>
            {isLive ? (
              <Button
                onClick={handleGoOffline}
                disabled={goOffline.isPending}
                variant='outline'
                className='border-red-500/30 text-red-500 hover:bg-red-500/10'>
                {goOffline.isPending ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Radio className='h-4 w-4 mr-2' />
                )}
                End Broadcast
              </Button>
            ) : (
              <Button
                onClick={handleGoLive}
                disabled={goLive.isPending}
                className='bg-primary hover:bg-primary/90'>
                {goLive.isPending ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Radio className='h-4 w-4 mr-2' />
                )}
                Go Live
              </Button>
            )}
          </div>
        </div>

        {isLive && (
          <div className='mt-6 pt-6 border-t border-border'>
            <h3 className='text-lg font-bold font-heading mb-2'>
              Broadcasting Credentials
            </h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Use these credentials to connect your broadcasting app (e.g.,
              BUTT, Mixxx, VLC)
            </p>

            <div className='space-y-3 bg-muted/30 rounded-lg p-4'>
              {/* Server */}
              <div className='flex items-center justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <span className='text-sm text-muted-foreground'>Server:</span>
                  <p className='font-mono text-sm truncate'>
                    https://stream.saaminaret.shop
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() =>
                    handleCopy("https://stream.saaminaret.shop", "Server")
                  }
                  className='p-2 rounded-md hover:bg-muted transition-colors'
                  title='Copy server'>
                  {copiedField === "Server" ? (
                    <Check className='h-4 w-4 text-green-500' />
                  ) : (
                    <Copy className='h-4 w-4 text-muted-foreground' />
                  )}
                </button>
              </div>

              {/* Port */}
              <div className='flex items-center justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <span className='text-sm text-muted-foreground'>Port:</span>
                  <p className='font-mono text-sm'>8000</p>
                </div>
                <button
                  type='button'
                  onClick={() => handleCopy("8000", "Port")}
                  className='p-2 rounded-md hover:bg-muted transition-colors'
                  title='Copy port'>
                  {copiedField === "Port" ? (
                    <Check className='h-4 w-4 text-green-500' />
                  ) : (
                    <Copy className='h-4 w-4 text-muted-foreground' />
                  )}
                </button>
              </div>

              {/* Mountpoint */}
              <div className='flex items-center justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <span className='text-sm text-muted-foreground'>
                    Mountpoint:
                  </span>
                  <p className='font-mono text-sm truncate'>
                    {station.mountPoint || "/live"}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() =>
                    handleCopy(station.mountPoint || "/live", "Mountpoint")
                  }
                  className='p-2 rounded-md hover:bg-muted transition-colors'
                  title='Copy mountpoint'>
                  {copiedField === "Mountpoint" ? (
                    <Check className='h-4 w-4 text-green-500' />
                  ) : (
                    <Copy className='h-4 w-4 text-muted-foreground' />
                  )}
                </button>
              </div>

              {/* Username */}
              <div className='flex items-center justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <span className='text-sm text-muted-foreground'>
                    Username:
                  </span>
                  <p className='font-mono text-sm truncate'>
                    {station.icecastCredentials.username}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() =>
                    handleCopy(station.icecastCredentials.username, "Username")
                  }
                  className='p-2 rounded-md hover:bg-muted transition-colors'
                  title='Copy username'>
                  {copiedField === "Username" ? (
                    <Check className='h-4 w-4 text-green-500' />
                  ) : (
                    <Copy className='h-4 w-4 text-muted-foreground' />
                  )}
                </button>
              </div>

              {/* Password */}
              <div className='flex items-center justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <span className='text-sm text-muted-foreground'>
                    Password:
                  </span>
                  <p className='font-mono text-sm truncate'>
                    {showPassword
                      ? station.icecastCredentials.password || "hackme"
                      : "••••••••"}
                  </p>
                </div>
                <div className='flex items-center gap-1'>
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='p-2 rounded-md hover:bg-muted transition-colors'
                    title={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? (
                      <EyeOff className='h-4 w-4 text-muted-foreground' />
                    ) : (
                      <Eye className='h-4 w-4 text-muted-foreground' />
                    )}
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      handleCopy(
                        station.icecastCredentials.password || "hackme",
                        "Password"
                      )
                    }
                    className='p-2 rounded-md hover:bg-muted transition-colors'
                    title='Copy password'>
                    {copiedField === "Password" ? (
                      <Check className='h-4 w-4 text-green-500' />
                    ) : (
                      <Copy className='h-4 w-4 text-muted-foreground' />
                    )}
                  </button>
                </div>
              </div>

              {/* Stream URL */}
              <div className='flex items-center justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <span className='text-sm text-muted-foreground'>
                    Stream URL:
                  </span>
                  <p className='font-mono text-sm truncate'>
                    {station.streamUrl}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() =>
                    handleCopy(station.streamUrl || "", "Stream URL")
                  }
                  className='p-2 rounded-md hover:bg-muted transition-colors'
                  title='Copy stream URL'>
                  {copiedField === "Stream URL" ? (
                    <Check className='h-4 w-4 text-green-500' />
                  ) : (
                    <Copy className='h-4 w-4 text-muted-foreground' />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Stats */}
        {isLive && (
          <div className='grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-primary/10'>
                <Users className='h-4 w-4 text-primary' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Listeners</p>
                <p className='font-bold'>
                  {station.stats?.totalListeners?.toLocaleString() || 0}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-accent/10'>
                <Clock className='h-4 w-4 text-accent' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Uptime</p>
                <p className='font-bold'>Live</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Now Playing (only when live) */}
      {isLive && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleUpdateNowPlaying}
          className='bg-card border border-border rounded-xl p-6 space-y-5'>
          <div className='flex items-center gap-3 pb-4 border-b border-border'>
            <Music className='h-5 w-5 text-primary' />
            <h2 className='text-lg font-bold font-heading'>Now Playing</h2>
          </div>

          {/* Current Track Display */}
          {station.currentTrack?.title && (
            <div className='bg-muted/50 rounded-lg p-4 mb-4'>
              <p className='text-sm text-muted-foreground mb-1'>
                Currently showing:
              </p>
              <p className='font-medium'>{station.currentTrack.title}</p>
              {station.currentTrack.artist && (
                <p className='text-sm text-muted-foreground'>
                  {station.currentTrack.artist}
                </p>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div>
            <label htmlFor='title' className='block text-sm font-medium mb-2'>
              Title <span className='text-destructive'>*</span>
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={nowPlayingForm.title}
              onChange={handleNowPlayingChange}
              placeholder="e.g., Jumu'ah Khutbah"
              className='w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='artist'
                className='block text-sm font-medium mb-2'>
                Speaker / Imam
              </label>
              <input
                type='text'
                id='artist'
                name='artist'
                value={nowPlayingForm.artist}
                onChange={handleNowPlayingChange}
                placeholder='e.g., Sheikh Ahmad'
                className='w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all'
              />
            </div>
            <div>
              <label htmlFor='album' className='block text-sm font-medium mb-2'>
                Category / Series
              </label>
              <input
                type='text'
                id='album'
                name='album'
                value={nowPlayingForm.album}
                onChange={handleNowPlayingChange}
                placeholder='e.g., Friday Sermon'
                className='w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all'
              />
            </div>
          </div>

          <Button
            type='submit'
            disabled={updateNowPlaying.isPending}
            className='bg-primary hover:bg-primary/90'>
            {updateNowPlaying.isPending ? (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            ) : (
              <Music className='h-4 w-4 mr-2' />
            )}
            Update Now Playing
          </Button>
        </motion.form>
      )}

      {/* Offline Message */}
      {!isLive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='bg-card border border-border rounded-xl p-8 text-center'>
          <Radio className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-bold font-heading mb-2'>
            Ready to Broadcast?
          </h3>
          <p className='text-muted-foreground mb-4'>
            Click "Go Live" to start streaming to your listeners.
          </p>
          <p className='text-sm text-muted-foreground'>
            Make sure your streaming software is connected before going live.
          </p>
        </motion.div>
      )}
    </div>
  );
}
