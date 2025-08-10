import { useState, useEffect } from 'react'
import { isClient } from '../utils/roleUtils'
import { sendGetMyApplicationsRequest } from '../utils/messageUtils'
import { useMessageHandler } from '../hooks/useMessageHandler'
import Loading from './Loading'
import './Projects.css'

const Projects = ({ memberData, setMemberData, statusMessage, statusType, setStatusMessage }) => {
  const [myApplications, setMyApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, new, pending, approved

  // Check if user has client role using utility function
  const userIsClient = isClient(memberData)

  useEffect(() => {
    if (!userIsClient) {
      setStatusMessage("❌ Access denied. Client privileges required.")
      return
    }

    // Load user's applications from CMS
    loadMyApplications()
  }, [userIsClient])

  const loadMyApplications = () => {
    setLoading(true)
    const memberId = memberData._id || memberData.id
    sendGetMyApplicationsRequest(memberId)
  }

  // Use custom hook for message handling
  useMessageHandler({
    onMyApplicationsData: (data) => {
      setMyApplications(data.applications || [])
      setLoading(false)
    },
    onMyApplicationsError: (data) => {
      setStatusMessage("❌ Error loading applications: " + (data.error || "Unknown error"))
      setLoading(false)
    }
  })

  const filteredApplications = myApplications.filter(app => {
    if (filter === 'all') return true
    return app.status?.toLowerCase() === filter.toLowerCase()
  })

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return '🆕'
      case 'pending':
        return '⏳'
      case 'approved':
        return '✅'
      default:
        return '📋'
    }
  }

  const getStatusDescription = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'Your application has been received and is under review.'
      case 'pending':
        return 'Your application is being processed. We will contact you soon.'
      case 'approved':
        return 'Congratulations! Your application has been approved. We will contact you to discuss next steps.'
      default:
        return 'Your application status is being updated.'
    }
  }

  if (!userIsClient) {
    return (
      <div className="projects">
        <div className="access-denied">
          <h2>🚫 Access Denied</h2>
          <p>You do not have permission to access the projects page.</p>
          <p>Only users with Client role can access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="projects">
      <div className="projects-header">
        <h2>📁 My Projects</h2>
        <p>Track the progress of your submitted applications</p>
      </div>

      <div className="projects-controls">
        <div className="filter-controls">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Applications</option>
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        
        <button 
          className="refresh-btn"
          onClick={loadMyApplications}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {statusMessage && (
        <div className={`status-message ${statusType}`}>
          {statusMessage}
        </div>
      )}

      <div className="applications-list">
        {loading ? (
          <Loading message="Loading your applications..." />
        ) : filteredApplications.length === 0 ? (
          <div className="no-applications">
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No Applications Found</h3>
              <p>You haven't submitted any applications yet.</p>
              <p>Go to the Application page to submit your first project request.</p>
            </div>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="application-header">
                <div className="application-title">
                  <h3>{app.siteName || 'Untitled Project'}</h3>
                  <p className="business-name">{app.businessName || 'Personal Project'}</p>
                </div>
                <div className="status-section">
                  <span className={`status-badge ${app.status?.toLowerCase()}`}>
                    {getStatusIcon(app.status)} {app.status || 'New'}
                  </span>
                </div>
              </div>
              
              <div className="application-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Full Name:</strong>
                    <span>{app.fullName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong>
                    <span>{app.emailAddress || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong>
                    <span>{app.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Submitted:</strong>
                    <span>{new Date(app.submissionDate || app.createdDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {app.businessOverview && (
                  <div className="detail-section">
                    <strong>Business Overview:</strong>
                    <p>{app.businessOverview}</p>
                  </div>
                )}

                {app.goals && app.goals.length > 0 && app.goals.some(goal => goal.trim()) && (
                  <div className="detail-section">
                    <strong>Goals:</strong>
                    <ul>
                      {app.goals.filter(goal => goal.trim()).map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="status-description">
                <div className="status-info">
                  <span className="status-icon">{getStatusIcon(app.status)}</span>
                  <div className="status-text">
                    <strong>Current Status:</strong>
                    <p>{getStatusDescription(app.status)}</p>
                  </div>
                </div>
              </div>

              {app.status === 'Approved' && (
                <div className="next-steps">
                  <h4>🎉 Next Steps</h4>
                  <p>Our team will contact you within 24-48 hours to discuss your project requirements and schedule a consultation.</p>
                  <div className="contact-info">
                    <p><strong>Contact Information:</strong></p>
                    <p>📧 Email: support@lvastudio.com</p>
                    <p>📞 Phone: (555) 123-4567</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Projects
