import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Radio,
  Users,
  Clock,
  Settings,
  Loader2,
  AlertCircle,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyStation } from "@/hooks/useStations";
import { AxiosError } from "axios";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: stationData, isLoading, isError, error } = useMyStation();

  const station = stationData?.data?.station;
  const hasStation = !!station;
  const is404 = (error as AxiosError)?.response?.status === 404;

  // Show generic error only if it's NOT a 404
  const showError = isError && !is404;
  // Show setup UI if we have no station (and not loading) OR if we got a 404
  const showSetup = !isLoading && (!hasStation || is404) && !showError;

  return (
    <div className='max-w-5xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'>
        <h1 className='text-2xl md:text-3xl font-bold font-heading'>
          Welcome back, {user?.name || "Mosque"}
        </h1>
        <p className='text-muted-foreground mt-1'>
          Manage your station and broadcasts
        </p>
      </motion.div>

      {isLoading && (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      )}

      {showError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-destructive/10 border border-destructive/20 rounded-xl p-6 mb-8'>
          <div className='flex items-center gap-3'>
            <AlertCircle className='h-5 w-5 text-destructive' />
            <p className='text-destructive'>
              {(error as Error)?.message || "Failed to load station data"}
            </p>
          </div>
        </motion.div>
      )}

      {showSetup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-card border border-border rounded-xl p-8 text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
            <Radio className='h-8 w-8 text-primary' />
          </div>
          <h2 className='text-xl font-bold font-heading mb-2'>
            Set Up Your Station
          </h2>
          <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
            Create your broadcasting station to start streaming live prayers and
            lectures to your community.
          </p>
          <Link to='/dashboard/station/setup'>
            <Button className='bg-primary hover:bg-primary/90'>
              Create Station
            </Button>
          </Link>
        </motion.div>
      )}

      {!isLoading && !isError && hasStation && (
        <>
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='bg-card border border-border rounded-xl p-6 mb-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    station.isLive ? "bg-red-500/10" : "bg-muted"
                  }`}>
                  <Radio
                    className={`h-6 w-6 ${
                      station.isLive ? "text-red-500" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <h2 className='text-lg font-bold font-heading'>
                    {station.name}
                  </h2>
                  <div className='flex items-center gap-2'>
                    {station.isLive ? (
                      <span className='inline-flex items-center gap-1.5 text-sm text-red-500'>
                        <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse' />
                        Live Now
                      </span>
                    ) : (
                      <span className='text-sm text-muted-foreground'>
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex gap-2'>
                <Link to='/dashboard/broadcast'>
                  <Button
                    className={
                      station.isLive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-primary hover:bg-primary/90"
                    }>
                    <Radio className='h-4 w-4 mr-2' />
                    {station.isLive ? "Manage Broadcast" : "Go Live"}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
            {/* Current Listeners */}
            <div className='bg-card border border-border rounded-xl p-5'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 rounded-lg bg-primary/10'>
                  <Users className='h-4 w-4 text-primary' />
                </div>
                <span className='text-sm text-muted-foreground'>Listeners</span>
              </div>
              <p className='text-2xl font-bold'>
                {station.stats?.totalListeners?.toLocaleString() || 0}
              </p>
            </div>

            {/* Peak Listeners */}
            <div className='bg-card border border-border rounded-xl p-5'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 rounded-lg bg-accent/10'>
                  <Users className='h-4 w-4 text-accent' />
                </div>
                <span className='text-sm text-muted-foreground'>
                  Peak Listeners
                </span>
              </div>
              <p className='text-2xl font-bold'>
                {station.stats?.peakListeners?.toLocaleString() || 0}
              </p>
            </div>

            {/* Broadcast Time */}
            <div className='bg-card border border-border rounded-xl p-5'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 rounded-lg bg-secondary'>
                  <Clock className='h-4 w-4 text-secondary-foreground' />
                </div>
                <span className='text-sm text-muted-foreground'>
                  Broadcast Time
                </span>
              </div>
              <p className='text-2xl font-bold'>
                {Math.round((station.stats?.totalBroadcastMinutes || 0) / 60)}h
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='bg-card border border-border rounded-xl p-6'>
            <h3 className='font-bold font-heading mb-4'>Quick Actions</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <Link to='/dashboard/settings'>
                <Button
                  variant='outline'
                  className='w-full justify-start gap-3'>
                  <Settings className='h-4 w-4' />
                  Station Settings
                </Button>
              </Link>
              <Link to='/dashboard/broadcast'>
                <Button
                  variant='outline'
                  className='w-full justify-start gap-3'>
                  <Radio className='h-4 w-4' />
                  Broadcast Control
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Now Playing (if live) */}
          {station.isLive && station.currentTrack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='mt-6 bg-card border border-border rounded-xl p-6'>
              <h3 className='font-bold font-heading mb-3'>Now Playing</h3>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <span className='text-xl'>
                    <Mic className='h-4 w-4' />
                  </span>
                </div>
                <div>
                  <p className='font-medium'>
                    {station.currentTrack.title || "Unknown"}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {station.currentTrack.artist || "Live Broadcast"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
