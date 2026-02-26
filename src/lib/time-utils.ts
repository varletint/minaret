/**
 * Unified time formatting utility
 * Handles both ISO datetime strings and simple time strings (HH:MM)
 */

/**
 * Format a time string or ISO datetime to 12-hour format with AM/PM
 * @param timeInput - Either an ISO datetime string (e.g., "2026-02-08T14:30:00.000Z") or simple time (e.g., "14:30")
 * @returns Formatted time string in 12-hour format (e.g., "2:30 PM")
 */
export function formatTime(timeInput: string | undefined | null): string {
  if (!timeInput) return "";

  if (timeInput.includes("T") || timeInput.includes("Z")) {
    const date = new Date(timeInput);

    // Check if valid date
    if (isNaN(date.getTime())) {
      return timeInput; // Return original if invalid
    }

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (/AM|PM/i.test(timeInput)) {
    return timeInput;
  }

  const timeMatch = timeInput.match(/(\d{1,2}):(\d{2})/);
  if (!timeMatch) {
    return timeInput;
  }

  let hours = parseInt(timeMatch[1], 10);
  const minutes = timeMatch[2];

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

/**
 * Format a date to a readable string
 * @param dateInput - ISO datetime string or Date object
 * @returns Formatted date string (e.g., "Feb 8, 2026")
 */
export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return typeof dateInput === "string" ? dateInput : "";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a datetime to both date and time
 * @param dateTimeInput - ISO datetime string
 * @returns Formatted datetime string (e.g., "Feb 8, 2026 at 2:30 PM")
 */
export function formatDateTime(dateTimeInput: string): string {
  const date = new Date(dateTimeInput);

  if (isNaN(date.getTime())) {
    return dateTimeInput;
  }

  return `${formatDate(date)} at ${formatTime(dateTimeInput)}`;
}

/**
 * Format a datetime with long month name and time
 * @param dateInput - ISO datetime string
 * @returns Formatted datetime string (e.g., "February 8, 2026, 2:30 PM")
 */
export function formatFullDateTime(dateInput: string): string {
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

/**
 * Format a duration in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "1h 30m", "5m 10s", "45s", or "N/A")
 */
export function formatDuration(seconds?: number): string {
  if (!seconds || isNaN(seconds) || seconds <= 0) return "N/A";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
