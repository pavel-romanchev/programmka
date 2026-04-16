import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getPlayById, getImageUrl, deletePlay } from '../api/plays'
import { Play } from '../types'

function PlayPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [play, setPlay] = useState<Play | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlay = async () => {
      if (!id) return
      try {
        const data = await getPlayById(Number(id))
        setPlay(data)
      } catch {
        setError('Не удалось загрузить спектакль')
      } finally {
        setLoading(false)
      }
    }
    fetchPlay()
  }, [id])

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0 && mins > 0) {
      return `${hours}ч ${mins}мин`
    } else if (hours > 0) {
      return `${hours}ч`
    }
    return `${mins} мин`
  }

  const handleEdit = () => {
    navigate(`/plays/${id}/edit`)
  }

  const handleDelete = async () => {
    if (!id || !play) return
    
    const confirmed = window.confirm('Вы уверены, что хотите удалить этот спектакль?')
    if (!confirmed) return

    try {
      await deletePlay(Number(id))
      navigate('/', { state: { message: 'Спектакль удалён' } })
    } catch (error) {
      console.error('Failed to delete play:', error)
      alert('Не удалось удалить спектакль')
    }
  }

  const handleBack = () => {
    if (location.state?.fromEdit) {
      navigate(-2)
    } else {
      navigate(-1)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Загрузка...</div>
      </div>
    )
  }

  if (error || !play) {
    return (
      <div className="page">
        <div className="error">{error || 'Спектакль не найден'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
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
      </header>

      <div className="play-detail">
        <div className="play-detail-image-container">
          <div className="play-detail-actions">
            <button className="btn btn-action btn-edit" onClick={handleEdit} title="Редактировать">
              ✎
            </button>
            <button className="btn btn-action btn-delete" onClick={handleDelete} title="Удалить">
              ✕
            </button>
          </div>
          <div className="play-detail-image">
            <img
              src={getImageUrl(play.image_path)}
              alt={play.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png'
              }}
            />
          </div>
        </div>

        <h1 className="play-detail-title">{play.title}</h1>

        <div className="play-detail-meta">
          <div className="meta-item">
            <span className="meta-label">Режиссёр:</span>
            <span className="meta-value">{play.director}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Театр:</span>
            <span className="meta-value">{play.theater}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Длительность:</span>
            <span className="meta-value">{formatDuration(play.duration)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Рейтинг:</span>
            <span className="meta-value rating">
              {play.average_rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="play-detail-annotation">
          <h2>Аннотация</h2>
          <div className="annotation-text">
            {play.annotation.split(/\r?\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div className="play-detail-actors">
          <h2>Актёры</h2>
          <div className="actors-by-role">
            {(() => {
              const NO_ROLE_LABEL = 'Роль не указана'
              const rolesMap = play.actors.reduce((acc, entry) => {
                const role = entry.role || NO_ROLE_LABEL
                if (!acc[role]) acc[role] = []
                acc[role].push(entry.actor)
                return acc
              }, {} as Record<string, string[]>)

              const sortedRoles = Object.entries(rolesMap).sort(([a], [b]) => {
                if (a === NO_ROLE_LABEL) return 1
                if (b === NO_ROLE_LABEL) return -1
                return a.localeCompare(b, 'ru')
              })

              return sortedRoles.map(([role, actors]) => (
                <div key={role} className="role-group">
                  <span className="role-name">{role}:</span>
                  <span className="role-actors">{actors.join(', ')}</span>
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayPage
