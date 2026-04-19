import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getArticleById, getArticleImageUrl, deleteArticle } from '../api/articles'
import { getPlayById } from '../api/plays'
import { Article, Play } from '../types'
import CommentSection from '../components/CommentSection'
import UserIcon from '../components/UserIcon'

function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [linkedPlay, setLinkedPlay] = useState<Play | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return
      try {
        const data = await getArticleById(Number(id))
        setArticle(data)
        if (data.play_id) {
          try {
            const play = await getPlayById(data.play_id)
            setLinkedPlay(play)
          } catch {
            // Linked play not found, ignore
          }
        }
      } catch {
        setError('Не удалось загрузить материал')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleDelete = async () => {
    if (!id || !article) return

    const confirmed = window.confirm('Вы уверены, что хотите удалить этот материал?')
    if (!confirmed) return

    try {
      await deleteArticle(Number(id))
      navigate('/', { state: { message: 'Материал удалён' } })
    } catch (error) {
      console.error('Failed to delete article:', error)
      alert('Не удалось удалить материал')
    }
  }

  const handleEdit = () => {
    navigate(`/articles/${id}/edit`)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handlePlayClick = () => {
    if (linkedPlay) {
      navigate(`/plays/${linkedPlay.id}`)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Загрузка...</div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="page">
        <div className="error">{error || 'Материал не найден'}</div>
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
        <UserIcon />
      </header>

      <div className="article-detail">
        <div className="article-detail-image-container">
          <div className="article-detail-actions">
            <button
              className="btn btn-action btn-edit"
              onClick={handleEdit}
              title="Редактировать"
            >
              ✎
            </button>
            <button
              className="btn btn-action btn-delete"
              onClick={handleDelete}
              title="Удалить"
            >
              ✕
            </button>
          </div>
          <div className="article-detail-image">
            <img
              src={getArticleImageUrl(article.image_path)}
              alt={article.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png'
              }}
            />
          </div>
        </div>

        <h1 className="article-detail-title">{article.title}</h1>

        {article.subtitle && (
          <p className="article-detail-subtitle">{article.subtitle}</p>
        )}

        <div className="article-detail-meta">
          <span className="article-detail-date">
            {formatDate(article.created_at)}
          </span>
        </div>

        <div className="article-detail-content">
          {article.content.split(/\r?\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {linkedPlay && (
          <div className="article-linked-play">
            <h2>Материал о спектакле</h2>
            <div
              className="linked-play-card"
              onClick={handlePlayClick}
            >
              <span className="linked-play-title">{linkedPlay.title}</span>
              <span className="linked-play-info">
                {linkedPlay.theater} • {linkedPlay.director}
              </span>
            </div>
          </div>
        )}
      </div>

      <CommentSection entityType="article" entityId={article.id} />
    </div>
  )
}

export default ArticlePage
