import { motion } from "framer-motion";
import {
  Disc,
  Trash2,
  Loader2,
  AlertCircle,
  Clock,
  User,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyRecordings, useDeleteRecording } from "@/hooks/useRecordings";
import type { Recording } from "@/types/recording";
import { toast } from "sonner";
import { formatTime } from "@/lib/time-utils";

export function RecordingsPage() {
  const { data, isLoading, isError, error } = useMyRecordings();
  const deleteRecording = useDeleteRecording();

  const recordings = data?.data?.recordings || [];

  const handleDelete = async (recordingId: string, recordingTitle: string) => {
    if (!confirm(`Delete "${recordingTitle}"? This cannot be undone.`)) return;

    try {
      await deleteRecording.mutateAsync(recordingId);
      toast.success("Recording deleted");
    } catch (err) {
      toast.error((err as Error)?.message || "Failed to delete recording");
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainMins = mins % 60;
      return `${hrs}h ${remainMins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
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
            <Disc className='h-7 w-7 text-primary' />
            Recordings
          </h1>
          <p className='text-muted-foreground mt-1'>
            Manage your broadcast recordings
          </p>
        </div>
        {recordings.length > 0 && (
          <span className='text-sm text-muted-foreground'>
            {recordings.length} recording{recordings.length !== 1 ? "s" : ""}
          </span>
        )}
      </motion.div>

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-destructive/10 border border-destructive/20 rounded-xl p-6'>
          <div className='flex items-center gap-3'>
            <AlertCircle className='h-5 w-5 text-destructive' />
            <p className='text-destructive'>
              {(error as Error)?.message || "Failed to load recordings"}
            </p>
          </div>
        </motion.div>
      )}

      {!isError && recordings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-card border border-border rounded-xl p-8 text-center'>
          <Disc className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h2 className='text-xl font-bold font-heading mb-2'>
            No Recordings Yet
          </h2>
          <p className='text-muted-foreground mb-6'>
            Recordings will appear here when your broadcasts are recorded.
          </p>
        </motion.div>
      )}

      {recordings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='space-y-3'>
          {recordings.map((recording: Recording, index: number) => (
            <motion.div
              key={recording._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className='bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <div className='flex items-start gap-4'>
                <div className='p-3 rounded-lg bg-primary/10'>
                  <Disc className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <h3 className='font-bold font-heading'>
                    {recording.showId?.title || "Untitled Recording"}
                  </h3>
                  {recording.showId?.hostName && (
                    <p className='text-sm text-muted-foreground flex items-center gap-1'>
                      <User className='h-3 w-3' />
                      {recording.showId.hostName}
                    </p>
                  )}
                  <div className='flex items-center gap-3 mt-2 text-sm text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Clock className='h-3.5 w-3.5' />
                      {formatTime(recording.startedAt)}
                    </span>
                    {recording.totalDurationSecs > 0 && (
                      <span className='px-2 py-0.5 rounded bg-muted text-xs'>
                        {formatDuration(recording.totalDurationSecs)}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        recording.status === "ready"
                          ? "bg-primary/10 text-primary"
                          : recording.status === "processing"
                          ? "bg-accent/10 text-accent"
                          : "bg-destructive/10 text-destructive"
                      }`}>
                      {recording.status}
                    </span>
                  </div>
                  {recording.stationId && (
                    <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
                      <Radio className='h-3 w-3' />
                      {recording.stationId.name}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex items-center gap-2 sm:shrink-0'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    handleDelete(
                      recording._id,
                      recording.showId?.title || "Untitled Recording"
                    )
                  }
                  disabled={deleteRecording.isPending}
                  className='text-destructive hover:text-destructive hover:bg-destructive/10'>
                  {deleteRecording.isPending ? (
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
