import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, User, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// appIcon import removed - currently using text logo
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Mosques", href: "/mosques" },
  { name: "Prayer Times", href: "#prayer-times" },
  { name: "Live Radio", href: "#live" },
  { name: "Donate", href: "/donate" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link to='/' className='flex place-items-baseline gap-1'>
          {/* <img src={appIcon} alt='Minaret Live' className='h-9 w-9' /> */}
          <div className='flex items-center gap-1'>
            <span className='text-2xl sm:text-xl align-text-bottom font-bold font-heading text-foreground text-nowrap'>
              Minaret Live
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className='hidden md:flex items-center gap-6'>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary text-nowrap ${
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className='flex items-center gap-2'>
          {/* Live Badge */}
          {/* <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20'> */}
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-primary'></span>
          </span>
          {/* <span className='text-xs font-semibold text-primary'>LIVE</span> */}
          {/* </div> */}

          <ModeToggle />

          {/* Desktop Auth Buttons */}
          <div className='hidden md:flex items-center gap-2 ml-2'>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-8 w-8 rounded-full'>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {user.name}
                      </p>
                      <p className='text-xs leading-none text-muted-foreground'>
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to='/dashboard'>
                      <User className='mr-2 h-4 w-4' />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* <Button variant='ghost' asChild>
                  <Link to='/login'>Login</Link>
                </Button> */}
                <Button asChild>
                  <Link to='/register'>Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant='ghost'
            size='icon'
            className='h-9 w-9 md:hidden'
            onClick={() => setIsOpen(true)}>
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle menu</span>
          </Button>

          {/* Mobile Menu with Framer Motion */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                  className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden min-h-screen'
                />

                {/* Sidebar */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className='fixed right-0 top-0 z-50 min-h-screen w-[280px] bg-background border-l border-border shadow-2xl md:hidden'>
                  {/* Close Button */}
                  <div className='flex justify-end p-4'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-9 w-9'
                      onClick={() => setIsOpen(false)}>
                      <X className='h-5 w-5' />
                      <span className='sr-only'>Close menu</span>
                    </Button>
                  </div>

                  <motion.div
                    initial='closed'
                    animate='open'
                    variants={{
                      open: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.1,
                        },
                      },
                      closed: {
                        transition: {
                          staggerChildren: 0.02,
                          staggerDirection: -1,
                        },
                      },
                    }}
                    className='flex flex-col gap-6 px-4 bg-background'>
                    {/* Mobile Live Badge */}
                    <motion.div
                      variants={{
                        open: { x: 0, opacity: 1 },
                        closed: { x: 20, opacity: 0 },
                      }}
                      className='flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 w-fit'>
                      <span className='relative flex h-2 w-2'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-2 w-2 bg-primary'></span>
                      </span>
                      <span className='text-sm font-semibold text-primary'>
                        LIVE NOW
                      </span>
                    </motion.div>

                    <nav className='flex flex-col gap-1'>
                      {navLinks.map((link, index) => (
                        <motion.div
                          key={link.name}
                          variants={{
                            open: { x: 0, opacity: 1 },
                            closed: { x: 20, opacity: 0 },
                          }}
                          transition={{ delay: index * 0.05 }}>
                          <Link
                            to={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`block text-base font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
                              pathname === link.href
                                ? "bg-primary/5 text-primary"
                                : "text-foreground"
                            }`}>
                            {link.name}
                          </Link>
                        </motion.div>
                      ))}
                    </nav>

                    <motion.div
                      variants={{
                        open: { x: 0, opacity: 1 },
                        closed: { x: 20, opacity: 0 },
                      }}
                      className='flex flex-col gap-2 mt-4'>
                      {user ? (
                        <>
                          <div className='flex items-center gap-3 px-3 py-2 mb-2'>
                            <Avatar className='h-8 w-8'>
                              <AvatarFallback>
                                {user.name?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                              <span className='text-sm font-medium'>
                                {user.name}
                              </span>
                              <span className='text-xs text-muted-foreground'>
                                {user.email}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant='outline'
                            asChild
                            className='w-full justify-start'>
                            <Link
                              to='/dashboard'
                              onClick={() => setIsOpen(false)}>
                              <User className='mr-2 h-4 w-4' />
                              Dashboard
                            </Link>
                          </Button>
                          <Button
                            variant='ghost'
                            className='w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10'
                            onClick={() => {
                              handleLogout();
                              setIsOpen(false);
                            }}>
                            <LogOut className='mr-2 h-4 w-4' />
                            Log out
                          </Button>
                        </>
                      ) : (
                        <>
                          {/* <Button
                            variant='outline'
                            asChild
                            className='w-full'
                            onClick={() => setIsOpen(false)}>
                            <Link to='/login'>Login</Link>
                          </Button> */}
                          <Button
                            asChild
                            className='w-full'
                            onClick={() => setIsOpen(false)}>
                            <Link to='/register'>Get Started</Link>
                          </Button>
                        </>
                      )}
                    </motion.div>
                    <motion.div
                      variants={{
                        open: { x: 0, opacity: 1 },
                        closed: { x: 20, opacity: 0 },
                      }}>
                      <Button className='w-full bg-accent text-white hover:bg-accent/90 font-semibold'>
                        Want to sponsor a program?
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
