import { Link } from 'react-router-dom'

// Custom Mosque Icon Component
const MosqueIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 3C12 3 8 6 8 9V12H16V9C16 6 12 3 12 3Z" />
        <path d="M4 12H20V21H4V12Z" />
        <path d="M8 21V17C8 15.9 8.9 15 10 15H14C15.1 15 16 15.9 16 17V21" />
        <path d="M12 3V1" />
        <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
        <path d="M2 12L4 10" />
        <path d="M22 12L20 10" />
    </svg>
)

export const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            <div className="relative container flex h-16 items-center justify-center px-4">
                {/* Logo / Brand */}
                <Link
                    to="/"
                    className="group flex items-center gap-3 transition-all duration-300"
                >
                    <div className="relative">
                        <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-amber-500/20 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
                        <MosqueIcon className="relative h-8 w-8 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
                        Minaret
                    </span>
                </Link>
            </div>
        </header>
    )
}
