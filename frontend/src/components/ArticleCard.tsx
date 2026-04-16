import { getArticleImageUrl } from '../api/articles'
import { ArticleListItem } from '../types'

interface ArticleCardProps {
  article: ArticleListItem
  onClick: () => void
}

function ArticleCard({ article, onClick }: ArticleCardProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="article-card" onClick={onClick}>
      <div className="article-card-image">
        <img
          src={getArticleImageUrl(article.image_path)}
          alt={article.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.png'
          }}
        />
      </div>
      <div className="article-card-content">
        <h3 className="article-card-title">{article.title}</h3>
        {article.subtitle && (
          <p className="article-card-subtitle">{article.subtitle}</p>
        )}
        <p className="article-card-date">{formatDate(article.created_at)}</p>
      </div>
    </div>
  )
}

export default ArticleCard
