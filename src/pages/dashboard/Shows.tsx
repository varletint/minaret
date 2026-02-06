import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  Clock,
  Trash2,
  Edit,
  Loader2,
  AlertCircle,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyStation } from "@/hooks/useStations";
import { useShowsByStation, useDeleteShow } from "@/hooks/useShows";
import type { Show } from "@/types/show";
import { toast } from "sonner";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ShowsPage() {
  const { data: stationData, isLoading: stationLoading } = useMyStation();
  const station = stationData?.data?.station;

  const {
    data: showsData,
    isLoading: showsLoading,
    isError,
    error,
  } = useShowsByStation(station?._id || "");

  const deleteShow = useDeleteShow(station?._id);

  const shows = showsData?.data?.shows || [];
  const isLoading = stationLoading || showsLoading;

  const handleDelete = async (showId: string, showTitle: string) => {
    if (!confirm(`Delete "${showTitle}"? This cannot be undone.`)) return;

    try {
      await deleteShow.mutateAsync(showId);
      toast.success("Show deleted");
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to delete show");
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!station) {
    return (
      <div className='max-w-2xl mx-auto text-center'>
        <div className='bg-card border border-border rounded-xl p-8'>
          <Radio className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h2 className='text-xl font-bold font-heading mb-2'>
            No Station Found
          </h2>
          <p className='text-muted-foreground mb-6'>
            Create a station first to manage shows.
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
    <div className='max-w-4xl mx-auto space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold font-heading flex items-center gap-3'>
            <Calendar className='h-7 w-7 text-primary' />
            Shows
          </h1>
          <p className='text-muted-foreground mt-1'>
            Manage your scheduled broadcasts
          </p>
        </div>
        <Link to='/dashboard/shows/new'>
          <Button className='bg-primary hover:bg-primary/90'>
            <Plus className='h-4 w-4 mr-2' />
            Add Show
          </Button>
        </Link>
      </motion.div>

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-destructive/10 border border-destructive/20 rounded-xl p-6'>
          <div className='flex items-center gap-3'>
            <AlertCircle className='h-5 w-5 text-destructive' />
            <p className='text-destructive'>
              {(error as Error)?.message || "Failed to load shows"}
            </p>
          </div>
        </motion.div>
      )}

      {!isError && shows.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-card border border-border rounded-xl p-8 text-center'>
          <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h2 className='text-xl font-bold font-heading mb-2'>No Shows Yet</h2>
          <p className='text-muted-foreground mb-6'>
            Create your first show to let listeners know your broadcast
            schedule.
          </p>
          <Link to='/dashboard/shows/new'>
            <Button className='bg-primary hover:bg-primary/90'>
              <Plus className='h-4 w-4 mr-2' />
              Create Show
            </Button>
          </Link>
        </motion.div>
      )}

      {shows.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='space-y-3'>
          {shows.map((show: Show, index: number) => (
            <motion.div
              key={show.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className='bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <div className='flex items-start gap-4'>
                <div className='p-3 rounded-lg bg-primary/10'>
                  <Calendar className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <h3 className='font-bold font-heading'>{show.title}</h3>
                  {show.description && (
                    <p className='text-sm text-muted-foreground line-clamp-1'>
                      {show.description}
                    </p>
                  )}
                  <div className='flex items-center gap-3 mt-2 text-sm text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Clock className='h-3.5 w-3.5' />
                      {formatTime(show.scheduledStart)} -{" "}
                      {formatTime(show.scheduledEnd)}
                    </span>
                    {show.isRecurring && show.recurrence?.daysOfWeek && (
                      <span className='px-2 py-0.5 rounded bg-muted text-xs'>
                        {show.recurrence.daysOfWeek
                          .map((d) => dayNames[d])
                          .join(", ")}
                      </span>
                    )}
                    {!show.isRecurring && (
                      <span className='px-2 py-0.5 rounded bg-accent/10 text-accent text-xs'>
                        One-time
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2 sm:shrink-0'>
                <Link to={`/dashboard/shows/${show.id}/edit`}>
                  <Button variant='outline' size='sm'>
                    <Edit className='h-4 w-4 mr-1' />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleDelete(show.id, show.title)}
                  disabled={deleteShow.isPending}
                  className='text-destructive hover:text-destructive hover:bg-destructive/10'>
                  {deleteShow.isPending ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Trash2 className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
