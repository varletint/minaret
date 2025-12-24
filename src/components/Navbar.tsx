import { useState } from "react"
import { Menu } from "lucide-react"
import appIcon from "@/assets/appIcon.svg"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

// Custom Mosque/Minaret SVG Icon


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
