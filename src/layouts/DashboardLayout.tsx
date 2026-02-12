import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Radio,
  Calendar,
  Disc,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Broadcast",
    path: "/dashboard/broadcast",
    icon: Radio,
  },
  {
    label: "Shows",
    path: "/dashboard/shows",
    icon: Calendar,
  },
  {
    label: "Recordings",
    path: "/dashboard/recordings",
    icon: Disc,
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Mobile Header */}
      <header className='lg:hidden flex items-center justify-between p-4 border-b border-border bg-card'>
        <div className='flex items-center gap-3'>
          <span className='text-2xl'></span>
          <span className='font-heading font-bold'>Minaret</span>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setSidebarOpen(true)}
          aria-label='Open menu'>
          <Menu className='h-5 w-5' />
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className='fixed inset-0 bg-black/50 z-40 lg:hidden'
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className='fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 lg:hidden'>
              <SidebarContent
                user={user}
                onLogout={handleLogout}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col bg-card border-r border-border'>
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* Main Content */}
      <main className='lg:pl-64'>
        <div className='p-4 lg:p-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarContent({
  user,
  onLogout,
  onClose,
}: {
  user: { name?: string; email?: string } | null | undefined;
  onLogout: () => void;
  onClose?: () => void;
}) {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-between p-4 border-b border-border'>
        <div className='flex items-center gap-3'>
          <span className='text-2xl'></span>
          <span className='font-heading font-bold text-lg'>Minaret</span>
        </div>
        {onClose && (
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='lg:hidden'
            aria-label='Close menu'>
            <X className='h-5 w-5' />
          </Button>
        )}
      </div>

      <div className='p-4 border-b border-border'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
            <span className='text-primary font-medium'>
              {user?.name?.charAt(0).toUpperCase() || "M"}
            </span>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-medium truncate'>{user?.name || "Mosque"}</p>
            <p className='text-sm text-muted-foreground truncate'>
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      <nav className='flex-1 p-4 space-y-1'>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }>
            <item.icon className='h-5 w-5' />
            <span className='font-medium'>{item.label}</span>
            <ChevronRight className='h-4 w-4 ml-auto opacity-50' />
          </NavLink>
        ))}
      </nav>

      <div className='p-4 border-t border-border'>
        <Button
          variant='ghost'
          onClick={onLogout}
          className='w-full justify-start gap-3 text-muted-foreground hover:text-destructive'>
          <LogOut className='h-5 w-5' />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
