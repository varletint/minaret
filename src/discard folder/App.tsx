import { ThemeProvider } from './components/theme-provider'
import { Navbar } from './components/Navbar'
import { AudioPlayer } from './components/AudioPlayer'
import { Home } from './pages/Home'
import './App.css'

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="app min-h-screen bg-background text-foreground font-sans antialiased">
        <Navbar />
        <main className="container mx-auto py-6 px-4">
          <Home />
        </main>
        <AudioPlayer />
      </div>
    </ThemeProvider>
  )
}

export default App
