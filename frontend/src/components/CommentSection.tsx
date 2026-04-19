import { useState, useEffect, useRef } from 'react'

interface CommentData {
  id: string
  author: string
  text: string
  createdAt: string
  likes: number
  dislikes: number
  userVote: 'like' | 'dislike' | null
  replies: CommentData[]
}

interface CommentSectionProps {
  entityType: 'article' | 'play'
  entityId: number
}

const STORAGE_PREFIX = 'programmka_comments_'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function getDemoComments(): CommentData[] {
  return [
    {
      id: 'demo1',
      author: 'Мария К.',
      text: 'Очень понравилось! Давно не видела такого сильного актёрского состава.',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      likes: 12,
      dislikes: 1,
      userVote: null,
      replies: [
        {
          id: 'demo1r1',
          author: 'Алексей В.',
          text: 'Полностью согласен, особенно второй акт — просто потрясающий!',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          likes: 5,
          dislikes: 0,
          userVote: null,
          replies: [],
        },
      ],
    },
    {
      id: 'demo2',
      author: 'Дарья С.',
      text: 'Была на прошлой неделе. Атмосфера замечательная, рекомендую всем.',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      likes: 8,
      dislikes: 0,
      userVote: null,
      replies: [],
    },
    {
      id: 'demo3',
      author: 'Иван П.',
      text: 'Хорошая постановка, но декорации можно было бы сделать выразительнее.',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      likes: 3,
      dislikes: 2,
      userVote: null,
      replies: [
        {
          id: 'demo3r1',
          author: 'Елена Р.',
          text: 'Мне как раз декорации понравились своей минималистичностью.',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          likes: 2,
          dislikes: 0,
          userVote: null,
          replies: [],
        },
      ],
    },
  ]
}

function loadComments(entityType: string, entityId: number): CommentData[] {
  const key = `${STORAGE_PREFIX}${entityType}_${entityId}`
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  const demo = getDemoComments()
  localStorage.setItem(key, JSON.stringify(demo))
  return demo
}

function saveComments(entityType: string, entityId: number, comments: CommentData[]) {
  const key = `${STORAGE_PREFIX}${entityType}_${entityId}`
  localStorage.setItem(key, JSON.stringify(comments))
}

function formatDateRelative(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'только что'
  if (diffMin < 60) return `${diffMin} мин. назад`
  if (diffH < 24) return `${diffH} ч. назад`
  if (diffD < 7) return `${diffD} дн. назад`

  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface CommentItemProps {
  comment: CommentData
  isReply?: boolean
  onVote: (id: string, vote: 'like' | 'dislike') => void
  onReply: (parentId: string, text: string) => void
}

function CommentItem({ comment, isReply, onVote, onReply }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [repliesExpanded, setRepliesExpanded] = useState(true)
  const replyInputRef = useRef<HTMLTextAreaElement>(null)

  const handleReplySubmit = () => {
    const trimmed = replyText.trim()
    if (!trimmed) return
    onReply(comment.id, trimmed)
    setReplyText('')
    setShowReplyInput(false)
  }

  const handleReplyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleReplySubmit()
    }
  }

  const handleReplyClick = () => {
    setShowReplyInput(true)
    setTimeout(() => replyInputRef.current?.focus(), 0)
  }

  const handleVoteClick = (vote: 'like' | 'dislike') => {
    onVote(comment.id, vote)
  }

  return (
    <div className={isReply ? 'comment comment-reply' : 'comment'}>
      <div className="comment-avatar">
        {comment.author.charAt(0).toUpperCase()}
      </div>
      <div className="comment-body">
        <div className="comment-header">
          <span className="comment-author">{comment.author}</span>
          <span className="comment-date">{formatDateRelative(comment.createdAt)}</span>
        </div>
        <div className="comment-text">{comment.text}</div>
        <div className="comment-actions">
          <button
            className={`comment-vote-btn ${comment.userVote === 'like' ? 'active' : ''}`}
            onClick={() => handleVoteClick('like')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span>{comment.likes}</span>
          </button>
          <button
            className={`comment-vote-btn comment-dislike ${comment.userVote === 'dislike' ? 'active' : ''}`}
            onClick={() => handleVoteClick('dislike')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
            </svg>
            <span>{comment.dislikes}</span>
          </button>
          {!isReply && (
            <button className="comment-reply-btn" onClick={handleReplyClick}>
              Ответить
            </button>
          )}
        </div>

        {!isReply && comment.replies.length > 0 && (
          <div className="comment-replies-section">
            <button
              className="comment-replies-toggle"
              onClick={() => setRepliesExpanded(!repliesExpanded)}
            >
              {repliesExpanded ? 'Скрыть ответы' : `Показать ответы (${comment.replies.length})`}
            </button>
            {repliesExpanded && (
              <div className="comment-replies">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    isReply
                    onVote={onVote}
                    onReply={onReply}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {showReplyInput && !isReply && (
          <div className="comment-reply-input">
            <textarea
              ref={replyInputRef}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleReplyKeyDown}
              placeholder="Введите ответ..."
              rows={2}
            />
            <div className="comment-reply-input-actions">
              <button
                className="btn btn-primary comment-submit-btn"
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
              >
                Ответить
              </button>
              <button
                className="btn btn-secondary comment-cancel-btn"
                onClick={() => {
                  setShowReplyInput(false)
                  setReplyText('')
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CommentSection({ entityType, entityId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([])
  const [newCommentText, setNewCommentText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setComments(loadComments(entityType, entityId))
  }, [entityType, entityId])

  const updateComments = (updated: CommentData[]) => {
    setComments(updated)
    saveComments(entityType, entityId, updated)
  }

  const handleAddComment = () => {
    const trimmed = newCommentText.trim()
    if (!trimmed) return

    const newComment: CommentData = {
      id: generateId(),
      author: 'Аноним',
      text: trimmed,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      userVote: null,
      replies: [],
    }

    updateComments([newComment, ...comments])
    setNewCommentText('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAddComment()
    }
  }

  const findAndUpdateComment = (
    comments: CommentData[],
    targetId: string,
    updater: (c: CommentData) => CommentData
  ): CommentData[] => {
    return comments.map((c) => {
      if (c.id === targetId) return updater(c)
      if (c.replies.length > 0) {
        return { ...c, replies: findAndUpdateComment(c.replies, targetId, updater) }
      }
      return c
    })
  }

  const handleVote = (commentId: string, vote: 'like' | 'dislike') => {
    const updated = findAndUpdateComment(comments, commentId, (c) => {
      const prev = c.userVote
      let likes = c.likes
      let dislikes = c.dislikes
      let userVote: 'like' | 'dislike' | null = vote

      if (prev === vote) {
        if (vote === 'like') likes--
        else dislikes--
        userVote = null
      } else {
        if (prev === 'like') likes--
        if (prev === 'dislike') dislikes--
        if (vote === 'like') likes++
        else dislikes++
      }

      return { ...c, likes, dislikes, userVote }
    })
    updateComments(updated)
  }

  const handleReply = (parentId: string, text: string) => {
    const updated = findAndUpdateComment(comments, parentId, (c) => {
      const reply: CommentData = {
        id: generateId(),
        author: 'Аноним',
        text,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        userVote: null,
        replies: [],
      }
      return { ...c, replies: [...c.replies, reply] }
    })
    updateComments(updated)
  }

  return (
    <div className="comment-section">
      <h2 className="comment-section-title">
        Комментарии {comments.length > 0 && `(${comments.length})`}
      </h2>

      <div className="comment-input-area">
        <div className="comment-input-avatar">А</div>
        <div className="comment-input-wrapper">
          <textarea
            ref={textareaRef}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите комментарий..."
            rows={3}
          />
          <button
            className="btn btn-primary comment-submit-btn"
            onClick={handleAddComment}
            disabled={!newCommentText.trim()}
          >
            Отправить
          </button>
        </div>
      </div>

      <div className="comment-list">
        {comments.length === 0 && (
          <div className="comment-empty">
            Пока нет комментариев. Будьте первым!
          </div>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onVote={handleVote}
            onReply={handleReply}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentSection
