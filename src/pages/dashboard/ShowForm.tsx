import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyStation } from "@/hooks/useStations";
import { useShow, useCreateShow, useUpdateShow } from "@/hooks/useShows";
import { toast } from "sonner";

const daysOfWeek = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export function ShowFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: stationData, isLoading: stationLoading } = useMyStation();
  const station = stationData?.data?.station;

  const { data: showData, isLoading: showLoading } = useShow(id || "");
  const createShow = useCreateShow();
  const updateShow = useUpdateShow();

  function formatTimeForInput(isoString: string): string {
    try {
      const date = new Date(isoString);
      return date.toTimeString().slice(0, 5);
    } catch {
      return "12:00";
    }
  }

  const initialFormData = useMemo(() => {
    if (isEditing && showData?.data?.show) {
      const show = showData.data.show;
      return {
        title: show.title || "",
        description: show.description || "",
        scheduledStart: formatTimeForInput(show.scheduledStart),
        scheduledEnd: formatTimeForInput(show.scheduledEnd),
        isRecurring: show.isRecurring || false,
        daysOfWeek: Array.isArray(show.recurrence?.daysOfWeek)
          ? show.recurrence.daysOfWeek
          : [],
      };
    }
    return {
      title: "",
      description: "",
      scheduledStart: "13:00",
      scheduledEnd: "14:00",
      isRecurring: false,
      daysOfWeek: [] as number[],
    };
  }, [isEditing, showData]);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  function timeToISO(timeStr: string): string {
    const today = new Date();
    const [hours, minutes] = timeStr.split(":").map(Number);
    today.setHours(hours, minutes, 0, 0);
    return today.toISOString();
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleDay = (dayValue: number) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayValue)
        ? prev.daysOfWeek.filter((d) => d !== dayValue)
        : [...prev.daysOfWeek, dayValue].sort(),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.scheduledStart) {
      newErrors.scheduledStart = "Start time is required";
    }

    if (!formData.scheduledEnd) {
      newErrors.scheduledEnd = "End time is required";
    }

    if (formData.isRecurring && formData.daysOfWeek.length === 0) {
      newErrors.daysOfWeek = "Select at least one day for recurring shows";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!station?._id) {
      toast.error("Station not found");
      return;
    }

    try {
      if (isEditing && id) {
        const recurrence = formData.isRecurring
          ? { pattern: "weekly" as const, daysOfWeek: formData.daysOfWeek }
          : undefined;
        await updateShow.mutateAsync({
          id,
          data: {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            scheduledStart: timeToISO(formData.scheduledStart),
            scheduledEnd: timeToISO(formData.scheduledEnd),
            isRecurring: formData.isRecurring,
            recurrence,
          },
        });
        toast.success("Show updated!");
      } else {
        const recurrence = formData.isRecurring
          ? { pattern: "weekly" as const, daysOfWeek: formData.daysOfWeek }
          : undefined;
        await createShow.mutateAsync({
          title: formData.title.trim(),
          description: formData.description.trim() || "",
          stationId: station._id,
          scheduledStart: timeToISO(formData.scheduledStart),
          scheduledEnd: timeToISO(formData.scheduledEnd),
          isRecurring: formData.isRecurring,
          recurrence,
        });
        toast.success("Show created!");
      }
      navigate("/dashboard/shows");
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to save show");
    }
  };

  const isLoading = stationLoading || (isEditing && showLoading);
  const isSaving = createShow.isPending || updateShow.isPending;

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
          <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h2 className='text-xl font-bold font-heading mb-2'>
            No Station Found
          </h2>
          <p className='text-muted-foreground mb-6'>
            Create a station first to add shows.
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
    <div className='max-w-2xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}>
        <Link
          to='/dashboard/shows'
          className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6'>
          <ArrowLeft className='h-4 w-4' />
          Back to Shows
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'>
        <h1 className='text-2xl md:text-3xl font-bold font-heading flex items-center gap-3'>
          <Calendar className='h-7 w-7 text-primary' />
          {isEditing ? "Edit Show" : "New Show"}
        </h1>
        <p className='text-muted-foreground mt-1'>
          {isEditing
            ? "Update your scheduled broadcast"
            : "Schedule a new broadcast for your listeners"}
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className='bg-card border border-border rounded-xl p-6 space-y-6'>
        <div>
          <label htmlFor='title' className='block text-sm font-medium mb-2'>
            Title <span className='text-destructive'>*</span>
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Jumu'ah Khutbah"
            className={`w-full h-11 px-4 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              errors.title ? "border-destructive" : "border-input"
            }`}
          />
          {errors.title && (
            <p className='text-sm text-destructive mt-1'>{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium mb-2'>
            Description
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Describe this broadcast...'
            rows={3}
            className='w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='scheduledStart'
              className='block text-sm font-medium mb-2'>
              Start Time <span className='text-destructive'>*</span>
            </label>
            <input
              type='time'
              id='scheduledStart'
              name='scheduledStart'
              value={formData.scheduledStart}
              onChange={handleChange}
              className={`w-full h-11 px-4 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                errors.scheduledStart ? "border-destructive" : "border-input"
              }`}
            />
            {errors.scheduledStart && (
              <p className='text-sm text-destructive mt-1'>
                {errors.scheduledStart}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='scheduledEnd'
              className='block text-sm font-medium mb-2'>
              End Time <span className='text-destructive'>*</span>
            </label>
            <input
              type='time'
              id='scheduledEnd'
              name='scheduledEnd'
              value={formData.scheduledEnd}
              onChange={handleChange}
              className={`w-full h-11 px-4 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                errors.scheduledEnd ? "border-destructive" : "border-input"
              }`}
            />
            {errors.scheduledEnd && (
              <p className='text-sm text-destructive mt-1'>
                {errors.scheduledEnd}
              </p>
            )}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <input
            type='checkbox'
            id='isRecurring'
            name='isRecurring'
            checked={formData.isRecurring}
            onChange={handleChange}
            className='h-4 w-4 rounded border-input text-primary focus:ring-primary'
          />
          <label htmlFor='isRecurring' className='text-sm font-medium'>
            Recurring show (repeats weekly)
          </label>
        </div>

        {formData.isRecurring && (
          <div>
            <label className='block text-sm font-medium mb-3'>
              Repeat on <span className='text-destructive'>*</span>
            </label>
            <div className='flex flex-wrap gap-2'>
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  type='button'
                  onClick={() => toggleDay(day.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.daysOfWeek.includes(day.value)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>
                  {day.label}
                </button>
              ))}
            </div>
            {errors.daysOfWeek && (
              <p className='text-sm text-destructive mt-2'>
                {errors.daysOfWeek}
              </p>
            )}
          </div>
        )}

        <div className='flex gap-3 pt-4'>
          <Button
            type='submit'
            disabled={isSaving}
            className='bg-primary hover:bg-primary/90'>
            {isSaving ? (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            ) : (
              <Save className='h-4 w-4 mr-2' />
            )}
            {isEditing ? "Save Changes" : "Create Show"}
          </Button>
          <Link to='/dashboard/shows'>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </Link>
        </div>
      </motion.form>
    </div>
  );
}
