import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/**
 * Public layout with Navbar and Footer
 * Used for: Home, Mosques, Login, Register
 */
export function PublicLayout() {
  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
