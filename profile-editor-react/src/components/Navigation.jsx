import { useLocation, useNavigate } from 'react-router-dom'
import './Navigation.css'

const Navigation = ({ memberData }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path)
  }

  // Check user roles
  const isAdmin = memberData?.role === 'Admin'
  const isClient = memberData?.role === 'Client'
  
  // Debug logging
  console.log('Navigation - memberData:', memberData)
  console.log('Navigation - role:', memberData?.role)
  console.log('Navigation - isAdmin:', isAdmin)
  console.log('Navigation - isClient:', isClient)
  
  // More visible debug - this will show on the page
  if (!memberData || Object.keys(memberData).length === 0) {
    console.warn('⚠️ Navigation: memberData is empty or undefined')
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-text">LVA Studio</span>
          {/* Debug info - remove after testing */}
          <div style={{ fontSize: '10px', color: 'white', marginTop: '2px' }}>
            Role: {memberData?.role || 'undefined'} | 
            isAdmin: {isAdmin ? 'true' : 'false'} | 
            isClient: {isClient ? 'true' : 'false'}
            {(!memberData || Object.keys(memberData).length === 0) && 
              <span style={{ color: 'red' }}> | ⚠️ NO MEMBER DATA</span>
            }
          </div>
        </div>
        
        <div className="nav-links">
          <button 
            className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
            onClick={() => handleNavigation('/home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </button>
          
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

          {/* Show Admin link only for Admin users */}
          {isAdmin && (
            <button 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin')}
            >
              <span className="nav-icon">🔧</span>
              <span className="nav-text">Admin</span>
            </button>
          )}

          {/* Show Projects link only for Client users */}
          {isClient && (
            <button 
              className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
              onClick={() => handleNavigation('/projects')}
            >
              <span className="nav-icon">📁</span>
              <span className="nav-text">Projects</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
