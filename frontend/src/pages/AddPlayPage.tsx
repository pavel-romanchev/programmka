import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPlay } from '../api/plays'
import { PlayFormData } from '../types'

function AddPlayPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<PlayFormData>({
    title: '',
    director: '',
    theater: '',
    duration: 60,
    annotation: '',
    average_rating: 5.0,
    actors: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'average_rating' 
        ? parseFloat(value) || 0 
        : value,
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
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="form-input"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Рейтинг (1-10)</label>
            <input
              type="number"
              name="average_rating"
              value={formData.average_rating}
              onChange={handleInputChange}
              className="form-input"
              min="1"
              max="10"
              step="0.1"
              required
            />
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
          {loading ? 'Отправка...' : 'Отправить на модерацию'}
        </button>
      </form>
    </div>
  )
}

export default AddPlayPage
