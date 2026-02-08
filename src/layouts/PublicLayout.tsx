import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DonationBanner } from "@/components/DonationBanner";

export function PublicLayout() {
  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col'>
      <Navbar />
      <DonationBanner />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
