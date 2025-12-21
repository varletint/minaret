import { Navbar } from './components/Navbar'
import { AudioPlayer } from './components/AudioPlayer'
import { Home } from './pages/Home'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Home />
      </main>
      <AudioPlayer />
    </div>
  )
}

export default App
