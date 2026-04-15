import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { searchPlays } from '../api/plays'
import PlayCard from '../components/PlayCard'
import { Play } from '../types'

function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Play[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchPlays(searchQuery.trim())
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    }
  }

  const handleShowAll = () => {
    navigate('/plays')
  }

  const handleAddPlay = () => {
    navigate('/add')
  }

  const handlePlayClick = (id: number) => {
    navigate(`/plays/${id}`)
  }

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="logo">
          <span className="logo-text">Театр</span>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Введите название спектакля..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="home-buttons">
          <button className="btn btn-primary" onClick={handleShowAll}>
            Показать все спектакли
          </button>
          <button className="btn btn-secondary" onClick={handleAddPlay}>
            Добавить спектакль
          </button>
        </div>

        {isSearching && searchResults !== null && (
          <div className="search-results">
            <h2 className="search-title">
              Результаты поиска: {searchResults.length}
            </h2>
            {searchResults.length > 0 ? (
              <div className="plays-grid">
                {searchResults.map((play) => (
                  <PlayCard
                    key={play.id}
                    play={play}
                    onClick={() => handlePlayClick(play.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="no-results">Спектакли не найдены</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
