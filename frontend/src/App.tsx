import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PlaysPage from './pages/PlaysPage'
import PlayPage from './pages/PlayPage'
import AddPlayPage from './pages/AddPlayPage'
import EditPlayPage from './pages/EditPlayPage'
import ArticlePage from './pages/ArticlePage'
import AddArticlePage from './pages/AddArticlePage'
import EditArticlePage from './pages/EditArticlePage'
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
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route path="/articles/:id/edit" element={<EditArticlePage />} />
        <Route path="/articles/add" element={<AddArticlePage />} />
      </Routes>
      <footer className="footer">
        Автор: Павел Романчев, 4 курс факультета журналистики МГУ
      </footer>
    </div>
  )
}

export default App
