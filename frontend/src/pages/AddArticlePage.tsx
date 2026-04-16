import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { createArticle } from '../api/articles'
import { getAllPlays } from '../api/plays'
import { ArticleFormData, Play } from '../types'

function AddArticlePage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    subtitle: '',
    content: '',
    play_id: null,
    image: null,
  })
  const [plays, setPlays] = useState<Play[]>([])
  const [playSearchQuery, setPlaySearchQuery] = useState('')
  const [selectedPlayTitle, setSelectedPlayTitle] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [playsLoading, setPlaysLoading] = useState(true)

  useEffect(() => {
    const fetchPlays = async () => {
      try {
        const data = await getAllPlays()
        setPlays(data)
      } catch (error) {
        console.error('Failed to fetch plays:', error)
      } finally {
        setPlaysLoading(false)
      }
    }
    fetchPlays()
  }, [])

  const filteredPlays = useMemo(() => {
    if (!playSearchQuery.trim()) return plays.slice(0, 50)
    const query = playSearchQuery.toLowerCase()
    return plays.filter(
      (play) =>
        play.title.toLowerCase().includes(query) ||
        play.theater.toLowerCase().includes(query)
    ).slice(0, 50)
  }, [plays, playSearchQuery])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePlaySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPlaySearchQuery(value)
    setSelectedPlayTitle(value)

    const foundPlay = plays.find(
      (p) => p.title.toLowerCase() === value.toLowerCase()
    )
    if (foundPlay) {
      setFormData((prev) => ({ ...prev, play_id: foundPlay.id }))
    } else {
      setFormData((prev) => ({ ...prev, play_id: null }))
    }
  }

  const handlePlaySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTitle = e.target.value
    setSelectedPlayTitle(selectedTitle)
    setPlaySearchQuery(selectedTitle)

    const foundPlay = plays.find((p) => p.title === selectedTitle)
    if (foundPlay) {
      setFormData((prev) => ({ ...prev, play_id: foundPlay.id }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createArticle(formData)
      navigate('/', { state: { message: 'Материал опубликован!' } })
    } catch (error) {
      console.error('Failed to create article:', error)
      alert('Не удалось создать материал')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const clearPlaySelection = () => {
    setSelectedPlayTitle('')
    setPlaySearchQuery('')
    setFormData((prev) => ({ ...prev, play_id: null }))
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="btn btn-back" onClick={handleBack}>
          ← Назад
        </button>
        <h1 className="page-title">Новый материал</h1>
      </header>

      <form className="add-article-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Изображение</label>
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="image-upload-area">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <span className="upload-placeholder">
                  Нажмите для загрузки изображения
                </span>
              )}
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Заголовок</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Подзаголовок</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Текст материала</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="form-input form-textarea article-content-textarea"
            rows={10}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Связанный спектакль (опционально)</label>
          {playsLoading ? (
            <p className="form-hint">Загрузка спектаклей...</p>
          ) : plays.length === 0 ? (
            <p className="form-hint">Спектакли не найдены</p>
          ) : (
            <div className="play-search-container">
              <div className="play-search-input-wrapper">
                <input
                  list="plays-list"
                  type="text"
                  placeholder="Начните вводить название..."
                  value={selectedPlayTitle}
                  onChange={handlePlaySearchChange}
                  onSelect={handlePlaySelect}
                  className="form-input play-search-input"
                />
                {selectedPlayTitle && (
                  <button
                    type="button"
                    className="btn-clear-play"
                    onClick={clearPlaySelection}
                    title="Очистить"
                  >
                    ×
                  </button>
                )}
              </div>
              <datalist id="plays-list">
                {filteredPlays.map((play) => (
                  <option key={play.id} value={play.title}>
                    {play.theater}
                  </option>
                ))}
              </datalist>
              {formData.play_id && (
                <p className="form-hint selected-play-hint">
                  Выбран: {plays.find((p) => p.id === formData.play_id)?.theater}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? 'Публикация...' : 'Опубликовать'}
        </button>
      </form>
    </div>
  )
}

export default AddArticlePage
