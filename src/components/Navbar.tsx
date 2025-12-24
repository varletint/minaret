import { useState } from "react"
import { Menu } from "lucide-react"
import appIcon from "@/assets/appIcon.svg"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

// Custom Mosque/Minaret SVG Icon
function MosqueIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Dome */}
            <path d="M12 3C12 3 7 7 7 11H17C17 7 12 3 12 3Z" />
            {/* Main building */}
            <rect x="7" y="11" width="10" height="9" />
            {/* Door arch */}
            <path d="M10 20V17C10 15.9 10.9 15 12 15C13.1 15 14 15.9 14 17V20" />
            {/* Left minaret */}
            <rect x="3" y="9" width="2" height="11" />
            <path d="M4 9L4 7" />
            <circle cx="4" cy="6.5" r="0.5" fill="currentColor" />
            {/* Right minaret */}
            <rect x="19" y="9" width="2" height="11" />
            <path d="M20 9L20 7" />
            <circle cx="20" cy="6.5" r="0.5" fill="currentColor" />
            {/* Crescent on dome */}
            <path d="M12 5.5C11.2 5.5 10.5 5 10.5 4.3C10.5 3.6 11 3 11.8 3C11.3 3.3 11 3.8 11 4.3C11 4.9 11.4 5.5 12 5.5Z" fill="currentColor" stroke="none" />
        </svg>
    )
}

// Custom Handheld Radio/Walkie-Talkie SVG Icon
function HandRadioIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Antenna */}
            <path d="M12 2V5" />
            <circle cx="12" cy="2" r="0.5" fill="currentColor" />

            {/* Radio body */}
            <rect x="7" y="5" width="10" height="17" rx="1.5" />

            {/* Screen/Display */}
            <rect x="9" y="7" width="6" height="4" rx="0.5" fill="currentColor" fillOpacity="0.2" />

            {/* Speaker grille */}
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="14.5" x2="15" y2="14.5" />
            <line x1="9" y1="16" x2="15" y2="16" />

            {/* Control buttons */}
            <circle cx="10" cy="19" r="1" />
            <circle cx="14" cy="19" r="1" />

            {/* Side button (PTT) */}
            <rect x="5" y="8" width="2" height="4" rx="0.5" />
        </svg>
    )
}

const navLinks = [
    { name: "Home", href: "#" },
    { name: "Prayer Times", href: "#prayer-times" },
    { name: "Live Radio", href: "#live" },
    { name: "Donate", href: "#donate" },
]



export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <a href="/" className="flex place-items-baseline gap-1">
                    <img src={appIcon} alt="Minaret Live" className="h-9 w-9" />
                    <div className=" fex items-center gap-1">
                        <span className="text-2xl align-text-bottom font-bold font-heading text-foreground ">
                            Minaret Live
                        </span>
                        {/* <span className="absolute -top-2 -right-7 h-6 w-6 rounded-full
                         bg-primary flex items-center justify-center animate-pulse">

                            <HandRadioIcon className="h-5 w-5 text-primary-foreground" />
                        </span> */}

                    </div>
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Live Badge */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-semibold text-primary">LIVE</span>
                    </div>

                    {/* Theme Toggle */}
                    <ModeToggle />

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px] bg-background">
                            <div className="flex flex-col gap-6 mt-8 px-3">
                                {/* Mobile Live Badge */}
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 w-fit">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    <span className="text-sm font-semibold text-primary">LIVE NOW</span>
                                </div>

                                {/* Mobile Nav Links */}
                                <nav className="flex flex-col gap-1">
                                    {navLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-base font-medium py-1.5
                                             text-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary px-3  rounded-lg"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </nav>

                                {/* Mobile Donate Button */}
                                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                                    Want to sponsor a program?
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
