import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateStation } from "@/hooks/useStations";
import { toast } from "sonner";

export function StationSetupPage() {
  const navigate = useNavigate();
  const createStation = useCreateStation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    bitrate: "128" as "64" | "96" | "128" | "192" | "256" | "320",
    format: "mp3" as "mp3" | "ogg" | "aac",
    isPublic: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Station name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createStation.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        settings: {
          bitrate: formData.bitrate,
          format: formData.format,
          isPublic: formData.isPublic,
        },
      });

      toast.success("Station created successfully!");
      navigate("/dashboard");
    } catch (error) {
      const message = (error as Error)?.message || "Failed to create station";
      toast.error(message);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}>
        <Link
          to='/dashboard'
          className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6'>
          <ArrowLeft className='h-4 w-4' />
          Back to Dashboard
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-8'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
          <Radio className='h-8 w-8 text-primary' />
        </div>
        <h1 className='text-2xl md:text-3xl font-bold font-heading'>
          Create Your Station
        </h1>
        <p className='text-muted-foreground mt-2'>
          Set up your broadcasting station to start streaming
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className='bg-card border border-border rounded-xl p-6 space-y-6'>
        {/* Station Name */}
        <div>
          <label htmlFor='name' className='block text-sm font-medium mb-2'>
            Station Name <span className='text-destructive'>*</span>
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='e.g., Masjid Al-Noor Radio'
            className={`w-full h-11 px-4 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all ${
              errors.name ? "border-destructive" : "border-input"
            }`}
          />
          {errors.name && (
            <p className='text-sm text-destructive mt-1'>{errors.name}</p>
          )}
        </div>

        {/* Description */}
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
            placeholder='Describe your station (optional)'
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none ${
              errors.description ? "border-destructive" : "border-input"
            }`}
          />
          <p className='text-xs text-muted-foreground mt-1'>
            {formData.description.length}/500 characters
          </p>
          {errors.description && (
            <p className='text-sm text-destructive mt-1'>
              {errors.description}
            </p>
          )}
        </div>

        {/* Audio Settings */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Bitrate */}
          <div>
            <label htmlFor='bitrate' className='block text-sm font-medium mb-2'>
              Audio Bitrate
            </label>
            <select
              id='bitrate'
              name='bitrate'
              value={formData.bitrate}
              onChange={handleChange}
              className='w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all'>
              <option value='64'>64 kbps (Low)</option>
              <option value='96'>96 kbps</option>
              <option value='128'>128 kbps (Recommended)</option>
              <option value='192'>192 kbps</option>
              <option value='256'>256 kbps (High)</option>
              <option value='320'>320 kbps (Very High)</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label htmlFor='format' className='block text-sm font-medium mb-2'>
              Audio Format
            </label>
            <select
              id='format'
              name='format'
              value={formData.format}
              onChange={handleChange}
              className='w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all'>
              <option value='mp3'>MP3 (Most Compatible)</option>
              <option value='aac'>AAC (Better Quality)</option>
              <option value='ogg'>OGG (Open Format)</option>
            </select>
          </div>
        </div>

        {/* Public Toggle */}
        <div className='flex items-center gap-3'>
          <input
            type='checkbox'
            id='isPublic'
            name='isPublic'
            checked={formData.isPublic}
            onChange={handleChange}
            className='h-4 w-4 rounded border-input text-primary focus:ring-primary'
          />
          <label htmlFor='isPublic' className='text-sm'>
            Make station publicly visible
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={createStation.isPending}
          className='w-full h-11 bg-primary hover:bg-primary/90'>
          {createStation.isPending ? (
            <>
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              Creating...
            </>
          ) : (
            <>
              <Radio className='h-4 w-4 mr-2' />
              Create Station
            </>
          )}
        </Button>
      </motion.form>
    </div>
  );
}
