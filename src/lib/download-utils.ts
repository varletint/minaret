import { toast } from "sonner";

interface DownloadOptions {
  url: string;
  filename: string;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
}

export const downloadFile = async ({
  url,
  filename,
  onStart,
  onSuccess,
  onError,
  onSettled,
}: DownloadOptions) => {
  if (!url) return;
  try {
    onStart?.();
    toast.info("Starting download...");

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    toast.success("Download complete");
    onSuccess?.();
  } catch (error) {
    console.error("Download error:", error);
    toast.error(
      "Opening in new tab (direct download blocked by browser security)"
    );

    const fallbackLink = document.createElement("a");
    fallbackLink.href = url;
    fallbackLink.download = filename;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);

    onError?.(error);
  } finally {
    onSettled?.();
  }
};
