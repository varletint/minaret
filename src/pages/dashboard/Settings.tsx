import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Radio, Key, Loader2, Check, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyStation, useUpdateMyStation } from "@/hooks/useStations";
import { toast } from "sonner";
import { authService } from "@/services/authService";

export function SettingsPage() {
  const { user } = useAuth();
  const { data: stationData, isLoading: stationLoading } = useMyStation();
  const updateStation = useUpdateMyStation();

  const station = stationData?.data?.station;

  const [stationForm, setStationForm] = useState({
    name: "",
    description: "",
    bitrate: "128" as "64" | "96" | "128" | "192" | "256" | "320",
    format: "mp3" as "mp3" | "ogg" | "aac",
    isPublic: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    location: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [stationErrors, setStationErrors] = useState<Record<string, string>>(
    {}
  );
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (station) {
      setStationForm((prev) => ({
        ...prev,
        name: station.name || "",
        description: station.description || "",
        bitrate:
          (station.settings?.bitrate?.toString() as
            | "64"
            | "96"
            | "128"
            | "192"
            | "256"
            | "320") || "128",
        format: station.settings?.format || "mp3",
        isPublic: station.settings?.isPublic ?? true,
      }));
    }
  }, [station]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleStationChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setStationForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (stationErrors[name]) {
      setStationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStation = () => {
    const errors: Record<string, string> = {};

    if (!stationForm.name.trim()) {
      errors.name = "Station name is required";
    } else if (stationForm.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (stationForm.description && stationForm.description.length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    setStationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));

    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateProfile = () => {
    const errors: Record<string, string> = {};

    if (!profileForm.name.trim()) {
      errors.name = "Mosque name is required";
    } else if (profileForm.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setProfileLoading(true);
    try {
      await authService.updateProfile({
        name: profileForm.name.trim(),
        location: profileForm.location.trim() || undefined,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleStationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStation()) return;

    try {
      await updateStation.mutateAsync({
        name: stationForm.name.trim(),
        description: stationForm.description.trim() || undefined,
        settings: {
          bitrate: stationForm.bitrate,
          format: stationForm.format,
          isPublic: stationForm.isPublic,
        },
      });
      toast.success("Station updated successfully!");
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to update station");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setPasswordLoading(true);
    try {
      await authService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (stationLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto space-y-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}>
        <h1 className='text-2xl md:text-3xl font-bold font-heading flex items-center gap-3'>
          <Settings className='h-7 w-7 text-primary' />
          Settings
        </h1>
        <p className='text-muted-foreground mt-1'>
          Manage your station and account settings
        </p>
      </motion.div>

      {station && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleStationSubmit}
          className='bg-card border border-border rounded-xl p-6 space-y-6'>
          <div className='flex items-center gap-3 pb-4 border-b border-border'>
            <Radio className='h-5 w-5 text-primary' />
            <h2 className='text-lg font-bold font-heading'>Station Settings</h2>
          </div>

          <div>
            <label htmlFor='name' className='block text-sm font-medium mb-2'>
              Station Name <span className='text-destructive'>*</span>
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={stationForm.name}
              onChange={handleStationChange}
              className={`w-full h-11 px-4 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                stationErrors.name ? "border-destructive" : "border-input"
              }`}
            />
            {stationErrors.name && (
              <p className='text-sm text-destructive mt-1'>
                {stationErrors.name}
              </p>
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
              value={stationForm.description}
              onChange={handleStationChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none ${
                stationErrors.description
                  ? "border-destructive"
                  : "border-input"
              }`}
            />
            <p className='text-xs text-muted-foreground mt-1'>
              {stationForm.description.length}/500 characters
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='bitrate'
                className='block text-sm font-medium mb-2'>
                Audio Bitrate
              </label>
              <select
                id='bitrate'
                name='bitrate'
                value={stationForm.bitrate}
                onChange={handleStationChange}
                className='w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all'>
                <option value='64'>64 kbps</option>
                <option value='96'>96 kbps</option>
                <option value='128'>128 kbps</option>
                <option value='192'>192 kbps</option>
                <option value='256'>256 kbps</option>
                <option value='320'>320 kbps</option>
              </select>
            </div>

            <div>
              <label
                htmlFor='format'
                className='block text-sm font-medium mb-2'>
                Audio Format
              </label>
              <select
                id='format'
                name='format'
                value={stationForm.format}
                onChange={handleStationChange}
                className='w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all'>
                <option value='mp3'>MP3</option>
                <option value='aac'>AAC</option>
                <option value='ogg'>OGG</option>
              </select>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              id='isPublic'
              name='isPublic'
              checked={stationForm.isPublic}
              onChange={handleStationChange}
              className='h-4 w-4 rounded border-input text-primary focus:ring-primary'
            />
            <label htmlFor='isPublic' className='text-sm'>
              Make station publicly visible
            </label>
          </div>

          <Button
            type='submit'
            disabled={updateStation.isPending}
            className='bg-primary hover:bg-primary/90'>
            {updateStation.isPending ? (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            ) : (
              <Check className='h-4 w-4 mr-2' />
            )}
            Save Changes
          </Button>
        </motion.form>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onSubmit={handleProfileSubmit}
        className='bg-card border border-border rounded-xl p-6 space-y-6'>
        <div className='flex items-center gap-3 pb-4 border-b border-border'>
          <Building2 className='h-5 w-5 text-primary' />
          <h2 className='text-lg font-bold font-heading'>Mosque Profile</h2>
        </div>

        <div>
          <label
            htmlFor='profileName'
            className='block text-sm font-medium mb-2'>
            Mosque Name <span className='text-destructive'>*</span>
          </label>
          <input
            type='text'
            id='profileName'
            name='name'
            value={profileForm.name}
            onChange={handleProfileChange}
            className={`w-full h-11 px-4 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              profileErrors.name ? "border-destructive" : "border-input"
            }`}
          />
          {profileErrors.name && (
            <p className='text-sm text-destructive mt-1'>
              {profileErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='location' className='block text-sm font-medium mb-2'>
            Location
          </label>
          <input
            type='text'
            id='location'
            name='location'
            value={profileForm.location}
            onChange={handleProfileChange}
            placeholder='e.g., Lagos, Nigeria'
            className='w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all'
          />
        </div>

        <Button
          type='submit'
          disabled={profileLoading}
          className='bg-primary hover:bg-primary/90'>
          {profileLoading ? (
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
          ) : (
            <Check className='h-4 w-4 mr-2' />
          )}
          Update Profile
        </Button>
      </motion.form>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handlePasswordSubmit}
        className='bg-card border border-border rounded-xl p-6 space-y-6'>
        <div className='flex items-center gap-3 pb-4 border-b border-border'>
          <Key className='h-5 w-5 text-primary' />
          <h2 className='text-lg font-bold font-heading'>Change Password</h2>
        </div>

        <div>
          <label
            htmlFor='currentPassword'
            className='block text-sm font-medium mb-2'>
            Current Password
          </label>
          <input
            type='password'
            id='currentPassword'
            name='currentPassword'
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            className={`w-full h-11 px-4 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              passwordErrors.currentPassword
                ? "border-destructive"
                : "border-input"
            }`}
          />
          {passwordErrors.currentPassword && (
            <p className='text-sm text-destructive mt-1'>
              {passwordErrors.currentPassword}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='newPassword'
            className='block text-sm font-medium mb-2'>
            New Password
          </label>
          <input
            type='password'
            id='newPassword'
            name='newPassword'
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            className={`w-full h-11 px-4 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              passwordErrors.newPassword ? "border-destructive" : "border-input"
            }`}
          />
          {passwordErrors.newPassword && (
            <p className='text-sm text-destructive mt-1'>
              {passwordErrors.newPassword}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium mb-2'>
            Confirm New Password
          </label>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            className={`w-full h-11 px-4 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              passwordErrors.confirmPassword
                ? "border-destructive"
                : "border-input"
            }`}
          />
          {passwordErrors.confirmPassword && (
            <p className='text-sm text-destructive mt-1'>
              {passwordErrors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type='submit'
          disabled={passwordLoading}
          className='bg-primary hover:bg-primary/90'>
          {passwordLoading ? (
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
          ) : (
            <Key className='h-4 w-4 mr-2' />
          )}
          Change Password
        </Button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='bg-card border border-border rounded-xl p-6'>
        <h3 className='font-bold font-heading mb-4'>Account Information</h3>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Mosque Name</span>
            <span>{user?.name || "N/A"}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Email</span>
            <span>{user?.email || "N/A"}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
