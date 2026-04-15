import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPlayById, updatePlay, getImageUrl } from '../api/plays'
import { PlayFormData } from '../types'
import StarRating from '../components/StarRating'

function EditPlayPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<PlayFormData>({
    title: '',
    director: '',
    theater: '',
    duration: 0,
    annotation: '',
    average_rating: 5.0,
    actors: '',
    image: null,
  })
  const [durationInput, setDurationInput] = useState('')
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const fetchPlay = async () => {
      if (!id) return
      try {
        const play = await getPlayById(Number(id))
        setFormData({
          title: play.title,
          director: play.director,
          theater: play.theater,
          duration: play.duration,
          annotation: play.annotation,
          average_rating: play.average_rating,
          actors: play.actors.join(', '),
          image: null,
        })
        setDurationInput(play.duration.toString())
        setCurrentImagePath(play.image_path)
        if (play.image_path) {
          setImagePreview(getImageUrl(play.image_path))
        }
      } catch (error) {
        console.error('Failed to fetch play:', error)
        navigate('/')
      } finally {
        setPageLoading(false)
      }
    }
    fetchPlay()
  }, [id, navigate])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDurationInput(value)
    const numValue = parseInt(value, 10)
    setFormData((prev) => ({
      ...prev,
      duration: isNaN(numValue) ? 0 : numValue,
    }))
  }

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      average_rating: rating,
    }))
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
    if (!id) return
    setLoading(true)

    try {
      await updatePlay(Number(id), formData)
      navigate(`/plays/${id}`, { replace: true, state: { message: 'Спектакль обновлён!', fromEdit: true } })
    } catch (error) {
      console.error('Failed to update play:', error)
      alert('Не удалось обновить спектакль')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (pageLoading) {
    return (
      <div className="page">
        <div className="loading">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="btn btn-back" onClick={handleBack}>
          ← Назад
        </button>
        <h1 className="page-title">Редактировать спектакль</h1>
      </header>

      <form className="add-play-form" onSubmit={handleSubmit}>
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
          {currentImagePath && !formData.image && (
            <p className="form-hint">Текущее изображение будет заменено при загрузке нового</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Название спектакля</label>
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
          <label className="form-label">Режиссёр</label>
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Театр</label>
          <input
            type="text"
            name="theater"
            value={formData.theater}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Длительность (мин)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="duration"
              value={durationInput}
              onChange={handleDurationChange}
              className="form-input"
              placeholder="120"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Рейтинг (1-10)</label>
            <StarRating value={formData.average_rating} onChange={handleRatingChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Аннотация</label>
          <textarea
            name="annotation"
            value={formData.annotation}
            onChange={handleInputChange}
            className="form-input form-textarea"
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Актёры (через запятую)</label>
          <input
            type="text"
            name="actors"
            value={formData.actors}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Иванов И., Петров П., Сидоров С."
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}

export default EditPlayPage
