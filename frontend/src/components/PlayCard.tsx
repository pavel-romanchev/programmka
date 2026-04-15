import { getImageUrl } from '../api/plays'
import { Play } from '../types'

interface PlayCardProps {
  play: Play
  onClick: () => void
}

function PlayCard({ play, onClick }: PlayCardProps) {
  return (
    <div className="play-card" onClick={onClick}>
      <div className="play-card-image">
        <img
          src={getImageUrl(play.image_path)}
          alt={play.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.png'
          }}
        />
      </div>
      <div className="play-card-content">
        <h3 className="play-card-title">{play.title}</h3>
        <p className="play-card-info">{play.director}</p>
        <p className="play-card-theater">{play.theater}</p>
      </div>
    </div>
  )
}

export default PlayCard
