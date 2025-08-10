import { useLocation, useNavigate } from 'react-router-dom'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-text">LVA Studio</span>
        </div>
        
        <div className="nav-links">
          <button 
            className={`nav-link ${location.pathname === '/myaccount' ? 'active' : ''}`}
            onClick={() => handleNavigation('/myaccount')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">My Account</span>
          </button>
          
          <button 
            className={`nav-link ${location.pathname === '/application' ? 'active' : ''}`}
            onClick={() => handleNavigation('/application')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Application</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
