import { useState, useEffect } from 'react'
import './Home.css'

const Home = ({ memberData, setMemberData }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in by examining memberData
    if (memberData && memberData._id) {
      setIsLoggedIn(true)
      // Redirect to myaccount if logged in
      window.location.hash = '#/myaccount'
    } else {
      setIsLoggedIn(false)
    }
    setIsLoading(false)
  }, [memberData])

  if (isLoading) {
    return (
      <div className="home-container">
        <div className="home-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Checking login status...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="home-content">
        {!isLoggedIn ? (
          <div className="login-message">
            <h1>Welcome to LVA Studio</h1>
            <div className="message-box">
              <p>Please login first to access your account.</p>
              <button 
                className="login-button"
                onClick={() => {
                  // This would typically redirect to Wix login
                  // For now, we'll show a message
                  alert('Please login through the main Wix site first.')
                }}
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div className="welcome-message">
            <h1>Welcome back!</h1>
            <p>Redirecting to your account...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
