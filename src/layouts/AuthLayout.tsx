import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

/**
 * Auth layout - minimal layout for login/register pages
 * No footer, centered content
 */
export function AuthLayout() {
  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col'>
      <Navbar />
      <main className='flex-1 flex items-center justify-center p-4'>
        <Outlet />
      </main>
    </div>
  );
}
