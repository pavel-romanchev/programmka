import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PlaysPage from './pages/PlaysPage'
import PlayPage from './pages/PlayPage'
import AddPlayPage from './pages/AddPlayPage'
import EditPlayPage from './pages/EditPlayPage'
import Notification from './components/Notification'

function App() {
  return (
    <div className="app">
      <Notification />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plays" element={<PlaysPage />} />
        <Route path="/plays/:id" element={<PlayPage />} />
        <Route path="/plays/:id/edit" element={<EditPlayPage />} />
        <Route path="/add" element={<AddPlayPage />} />
      </Routes>
      <footer className="footer">
        Автор: Павел Романчев, 4 курс факультета журналистики МГУ
      </footer>
    </div>
  )
}

export default App
