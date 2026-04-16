import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPlay } from '../api/plays'
import { PlayFormData, ActorEntry } from '../types'
import StarRating from '../components/StarRating'
import ActorsEditor from '../components/ActorsEditor'

function AddPlayPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<PlayFormData>({
    title: '',
    director: '',
    theater: '',
    duration: 0,
    annotation: '',
    average_rating: 5.0,
    actors: [],
    image: null,
  })
  const [durationInput, setDurationInput] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  const handleActorsChange = (actors: ActorEntry[]) => {
    setFormData((prev) => ({
      ...prev,
      actors,
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
    setLoading(true)

    try {
      await createPlay(formData)
      navigate('/', { state: { message: 'Заявка отправлена!' } })
    } catch (error) {
      console.error('Failed to create play:', error)
      alert('Не удалось создать спектакль')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="btn btn-back" onClick={handleBack}>
          ← Назад
        </button>
        <h1 className="page-title">Добавить спектакль</h1>
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
          <label className="form-label">Актёры</label>
          <ActorsEditor value={formData.actors} onChange={handleActorsChange} />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? 'Отправка...' : 'Отправить на модерацию'}
        </button>
      </form>
    </div>
  )
}

export default AddPlayPage
