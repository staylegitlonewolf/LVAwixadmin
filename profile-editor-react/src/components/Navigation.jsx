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
    <>
      {/* Temporary floating debug button - always visible */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: '10000',
        backgroundColor: '#ff6b6b',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }} onClick={() => handleNavigation('/debug')}>
        🐛 Debug
      </div>

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

            {/* Debug button - FORCE VISIBLE with inline styles */}
            <button 
              className={`nav-link ${location.pathname === '/debug' ? 'active' : ''}`}
              onClick={() => handleNavigation('/debug')}
              style={{ 
                backgroundColor: '#ff6b6b', 
                borderColor: '#ff6b6b',
                display: 'inline-block !important',
                visibility: 'visible !important',
                opacity: '1 !important',
                position: 'relative !important',
                zIndex: '9999 !important'
              }}
            >
              <span className="nav-icon">🐛</span>
              <span className="nav-text">Debug</span>
            </button>

            {/* Test button - for debugging routing */}
            <button 
              className={`nav-link ${location.pathname === '/test' ? 'active' : ''}`}
              onClick={() => handleNavigation('/test')}
              style={{ 
                backgroundColor: '#4caf50', 
                borderColor: '#4caf50',
                display: 'inline-block !important',
                visibility: 'visible !important',
                opacity: '1 !important',
                position: 'relative !important',
                zIndex: '9999 !important'
              }}
            >
              <span className="nav-icon">🧪</span>
              <span className="nav-text">Test</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navigation
