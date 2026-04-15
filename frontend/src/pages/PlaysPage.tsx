import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllPlays } from '../api/plays'
import { Play } from '../types'
import PlayCard from '../components/PlayCard'

function PlaysPage() {
  const navigate = useNavigate()
  const [plays, setPlays] = useState<Play[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlays = async () => {
      try {
        const data = await getAllPlays()
        setPlays(data)
      } catch (err) {
        setError('Не удалось загрузить спектакли')
      } finally {
        setLoading(false)
      }
    }
    fetchPlays()
  }, [])

  const handlePlayClick = (id: number) => {
    navigate(`/plays/${id}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Загрузка...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="error">{error}</div>
        <button className="btn btn-primary" onClick={handleBack}>
          На главную
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="btn btn-back" onClick={handleBack}>
          ← Назад
        </button>
        <h1 className="page-title">Все спектакли</h1>
      </header>

      <div className="plays-grid">
        {plays.map((play) => (
          <PlayCard
            key={play.id}
            play={play}
            onClick={() => handlePlayClick(play.id)}
          />
        ))}
      </div>

      {plays.length === 0 && (
        <div className="empty-state">
          <p>Спектаклей пока нет</p>
          <button className="btn btn-primary" onClick={() => navigate('/add')}>
            Добавить первый спектакль
          </button>
        </div>
      )}
    </div>
  )
}

export default PlaysPage
