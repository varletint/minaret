import './Navbar.css'

export const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <span className="navbar-icon">🕌</span>
                    <span className="navbar-title">Mosque Radio</span>
                </div>

                <div className="navbar-status">
                    <span className="live-indicator">Live Now</span>
                </div>
            </div>
        </nav>
    )
}
