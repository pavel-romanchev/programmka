import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Notification() {
  const location = useLocation()
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
      navigate(location.pathname, { replace: true, state: {} })

      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [location.state, navigate, location.pathname])

  if (!message) return null

  return (
    <div className="notification">
      {message}
    </div>
  )
}

export default Notification
