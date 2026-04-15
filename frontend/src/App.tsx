import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PlaysPage from './pages/PlaysPage'
import PlayPage from './pages/PlayPage'
import AddPlayPage from './pages/AddPlayPage'
import Notification from './components/Notification'

function App() {
  return (
    <div className="app">
      <Notification />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plays" element={<PlaysPage />} />
        <Route path="/plays/:id" element={<PlayPage />} />
        <Route path="/add" element={<AddPlayPage />} />
      </Routes>
    </div>
  )
}

export default App
