const ogImage = "https://saamee.vercel.app/og-image.jpg";

export const defaultSEOConfig = {
  title: "Minaret - Community Broadcasts",
  titleTemplate: "%s | Minaret",
  description:
    "Listen to live community broadcasts, sermons, and events from your local mosque. Stay connected with your community anywhere.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saamee.vercel.app",
    siteName: "Minaret",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Minaret Live Broadcasts",
      },
    ],
  },
  twitter: {
    handle: "@minaretapp",
    site: "@minaretapp",
    cardType: "summary_large_image",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Minaret Live Broadcasts",
      },
    ],
  },
};
