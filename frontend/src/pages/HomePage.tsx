import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { searchPlays } from '../api/plays'
import { getArticles } from '../api/articles'
import PlayCard from '../components/PlayCard'
import ArticleCard from '../components/ArticleCard'
import { Play, ArticleListItem, PaginatedArticles } from '../types'

function HomePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState<Play[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const [articlesData, setArticlesData] = useState<PaginatedArticles | null>(null)
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [articlesPage, setArticlesPage] = useState(1)

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [])

  useEffect(() => {
    const fetchArticles = async () => {
      setArticlesLoading(true)
      try {
        const data = await getArticles(articlesPage)
        setArticlesData(data)
      } catch (error) {
        console.error('Failed to fetch articles:', error)
        setArticlesData(null)
      } finally {
        setArticlesLoading(false)
      }
    }
    fetchArticles()
  }, [articlesPage])

  const performSearch = async (query: string) => {
    setIsSearching(true)
    try {
      const results = await searchPlays(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearchParams({ q: searchQuery.trim() })
    performSearch(searchQuery.trim())
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

  const handleArticleClick = (id: number) => {
    navigate(`/articles/${id}`)
  }

  const handleAddArticle = () => {
    navigate('/articles/add')
  }

  const handlePageChange = (page: number) => {
    setArticlesPage(page)
  }

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="logo">
          <span className="logo-text">Программка</span>
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

        <div className="editorial-section">
          <div className="logo editorial-logo">
            <span className="logo-text">Редакция</span>
          </div>
          <div className="editorial-add-button">
            <button
              className="btn btn-add-article"
              onClick={handleAddArticle}
              title="Добавить материал"
            >
              +
            </button>
            <span className="add-article-label" onClick={handleAddArticle}>
              Добавить материал
            </span>
          </div>

          {articlesLoading ? (
            <div className="articles-loading">Загрузка материалов...</div>
          ) : articlesData && articlesData.items.length > 0 ? (
            <>
              <div className="articles-feed">
                {articlesData.items.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => handleArticleClick(article.id)}
                  />
                ))}
              </div>

              {articlesData.pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: articlesData.pages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`btn btn-pagination ${
                          page === articlesData.page ? 'active' : ''
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="articles-empty">
              <p>Материалов пока нет</p>
              <button className="btn btn-secondary" onClick={handleAddArticle}>
                Добавить первый материал
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
