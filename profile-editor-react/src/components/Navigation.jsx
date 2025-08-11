import { useLocation, useNavigate } from 'react-router-dom'
import { isAdmin, isClient, getRoleDisplayName, normalizeRole } from '../utils/roleUtils'
import './Navigation.css'

const Navigation = ({ memberData }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Debug: Log when Navigation renders
  console.log('🧭 Navigation rendering with memberData:', memberData)

  const handleNavigation = (path) => {
    navigate(path)
  }

  // Check user roles using utility functions
  const userIsAdmin = isAdmin(memberData)
  const userIsClient = isClient(memberData)
  
  // Debug information
  const rawRole = memberData?.role
  const normalizedRole = normalizeRole(memberData?.role)
  
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
            Raw Role: "{rawRole}" | 
            Normalized: "{normalizedRole}" | 
            isAdmin: {userIsAdmin ? 'true' : 'false'} | 
            isClient: {userIsClient ? 'true' : 'false'}
            {(!memberData || Object.keys(memberData).length === 0) && 
              <span style={{ color: 'red' }}> | ⚠️ NO MEMBER DATA</span>
            }
          </div>
        </div>
        
        <div className="nav-links">
          {/* Always show these basic navigation links */}
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
          {userIsAdmin && (
            <button 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin')}
            >
              <span className="nav-icon">🔧</span>
              <span className="nav-text">Admin</span>
            </button>
          )}

          {/* Show Projects link only for Client users */}
          {userIsClient && (
            <button 
              className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
              onClick={() => handleNavigation('/projects')}
            >
              <span className="nav-icon">📁</span>
              <span className="nav-text">Projects</span>
            </button>
          )}

          {/* Debug button - ALWAYS visible for development */}
          <button 
            className={`nav-link ${location.pathname === '/debug' ? 'active' : ''}`}
            onClick={() => handleNavigation('/debug')}
            style={{ backgroundColor: '#ff6b6b', borderColor: '#ff6b6b' }}
          >
            <span className="nav-icon">🐛</span>
            <span className="nav-text">Debug</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
