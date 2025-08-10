import { useState, useEffect } from 'react'
import { isAdmin } from '../utils/roleUtils'
import { 
  sendGetApplicationsRequest, 
  sendApplicationStatusUpdate, 
  sendApplicationDeleteRequest 
} from '../utils/messageUtils'
import { useMessageHandler } from '../hooks/useMessageHandler'
import Loading from './Loading'
import './Admin.css'

const Admin = ({ memberData, setMemberData, statusMessage, statusType, setStatusMessage }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, new, pending, approved

  // Check if user has admin role using utility function
  const userIsAdmin = isAdmin(memberData)

  useEffect(() => {
    if (!userIsAdmin) {
      setStatusMessage("❌ Access denied. Admin privileges required.")
      return
    }

    // Load applications from CMS
    loadApplications()
  }, [userIsAdmin])

  const loadApplications = () => {
    setLoading(true)
    sendGetApplicationsRequest()
  }

  // Use custom hook for message handling
  useMessageHandler({
    onApplicationsData: (data) => {
      setApplications(data.applications || [])
      setLoading(false)
    },
    onApplicationUpdateSuccess: () => {
      setStatusMessage("✅ Application updated successfully!")
      loadApplications() // Reload the list
    },
    onApplicationUpdateError: (data) => {
      setStatusMessage("❌ Error updating application: " + (data.error || "Unknown error"))
    },
    onApplicationDeleteSuccess: () => {
      setStatusMessage("✅ Application removed successfully!")
      loadApplications() // Reload the list
    },
    onApplicationDeleteError: (data) => {
      setStatusMessage("❌ Error removing application: " + (data.error || "Unknown error"))
    }
  })

  const handleStatusUpdate = (applicationId, newStatus) => {
    setStatusMessage("⏳ Updating application...")
    sendApplicationStatusUpdate(applicationId, newStatus)
  }

  const handleDeleteApplication = (applicationId) => {
    if (!window.confirm("Are you sure you want to remove this application? This action cannot be undone.")) {
      return
    }

    setStatusMessage("⏳ Removing application...")
    sendApplicationDeleteRequest(applicationId)
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    return app.status?.toLowerCase() === filter.toLowerCase()
  })

  if (!userIsAdmin) {
    return (
      <div className="admin">
        <div className="access-denied">
          <h2>🚫 Access Denied</h2>
          <p>You do not have permission to access the admin panel.</p>
          <p>Only users with Admin role can access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <h2>🔧 Admin Panel</h2>
        <p>Manage applications and user submissions</p>
      </div>

      <div className="admin-controls">
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
          onClick={loadApplications}
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
          <Loading message="Loading applications..." />
        ) : filteredApplications.length === 0 ? (
          <div className="no-applications">
            <p>No applications found.</p>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="application-header">
                <h3>{app.fullName || 'Unknown Name'}</h3>
                <span className={`status-badge ${app.status?.toLowerCase()}`}>
                  {app.status || 'New'}
                </span>
              </div>
              
              <div className="application-details">
                <div className="detail-row">
                  <strong>Email:</strong> {app.emailAddress || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong> {app.phoneNumber || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Business:</strong> {app.businessName || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Site Name:</strong> {app.siteName || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Submitted:</strong> {new Date(app.submissionDate || app.createdDate).toLocaleDateString()}
                </div>
              </div>

              <div className="application-actions">
                {app.status !== 'Approved' && (
                  <button 
                    className="action-btn approve-btn"
                    onClick={() => handleStatusUpdate(app._id, 'Approved')}
                  >
                    ✅ Approve
                  </button>
                )}
                
                {app.status !== 'Pending' && (
                  <button 
                    className="action-btn pending-btn"
                    onClick={() => handleStatusUpdate(app._id, 'Pending')}
                  >
                    ⏳ Set Pending
                  </button>
                )}
                
                <button 
                  className="action-btn remove-btn"
                  onClick={() => handleDeleteApplication(app._id)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Admin
