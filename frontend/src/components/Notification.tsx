import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function Notification() {
  const location = useLocation()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
      window.history.replaceState({}, '', location.pathname)
    }
  }, [location.state, location.pathname])

  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      setMessage(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [message])

  if (!message) return null

  return (
    <div className="notification">
      {message}
    </div>
  )
}

export default Notification
