import { useState, useRef, useEffect } from 'react'

function UserIcon() {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPopoverOpen(false)
      }
    }
    if (popoverOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [popoverOpen])

  return (
    <div className="user-icon-container" ref={containerRef}>
      <span className="user-icon-demo-label">Программка работает в демо-версии</span>
      <button
        className="user-icon-btn"
        onClick={() => setPopoverOpen(!popoverOpen)}
        title="Личный кабинет"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
      {popoverOpen && (
        <div className="user-icon-popover">
          <div className="user-icon-popover-title">Личный кабинет</div>
          <div className="user-icon-popover-text">
            Раздел находится в разработке. Авторизация и персональные функции будут доступны в следующих версиях.
          </div>
          <button
            className="user-icon-popover-close"
            onClick={() => setPopoverOpen(false)}
          >
            Понятно
          </button>
        </div>
      )}
    </div>
  )
}

export default UserIcon
