import { useState, useRef } from 'react'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
}

function StarRating({ value, onChange }: StarRatingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const displayValue = hoverValue !== null ? hoverValue : value

  const calculateValue = (clientX: number): number => {
    if (!containerRef.current) return value
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const width = rect.width
    const rawValue = (x / width) * 10
    const rounded = Math.round(rawValue * 2) / 2
    return Math.max(0.5, Math.min(10, rounded))
  }

  const handleClick = (e: React.MouseEvent) => {
    const newValue = calculateValue(e.clientX)
    onChange(newValue)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const newValue = calculateValue(e.clientX)
    setHoverValue(newValue)
  }

  const handleMouseLeave = () => {
    setHoverValue(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const newValue = calculateValue(e.touches[0].clientX)
      setHoverValue(newValue)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length > 0) {
      const newValue = calculateValue(e.changedTouches[0].clientX)
      onChange(newValue)
      setHoverValue(null)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 10; i++) {
      const filled = displayValue >= i
      const halfFilled = !filled && displayValue >= i - 0.5

      if (filled) {
        stars.push(
          <span key={i} className="star star-filled">★</span>
        )
      } else if (halfFilled) {
        stars.push(
          <span key={i} className="star star-half">★</span>
        )
      } else {
        stars.push(
          <span key={i} className="star star-empty">★</span>
        )
      }
    }
    return stars
  }

  return (
    <div className="star-rating-container">
      <div
        ref={containerRef}
        className="star-rating"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {renderStars()}
      </div>
      <span className="star-rating-value">
        {displayValue.toFixed(1)}
      </span>
    </div>
  )
}

export default StarRating
