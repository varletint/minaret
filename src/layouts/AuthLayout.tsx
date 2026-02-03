import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

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
