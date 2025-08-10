import { useState, useEffect } from 'react'
import './MyAccount.css'

const MyAccount = ({ memberData, setMemberData, statusMessage, statusType, setStatusMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    phone: '',
    address: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  // Update form data when memberData changes
  useEffect(() => {
    if (memberData) {
      setFormData({
        name: memberData.name || '',
        contactEmail: memberData.contactEmail || '',
        phone: memberData.phone || '',
        address: memberData.address || ''
      })
    }
  }, [memberData])

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear warning messages when user starts typing
    if (statusMessage.includes("⚠️")) {
      setStatusMessage('')
    }
  }

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      setStatusMessage("❌ Name is required")
      return false
    }

    if (!formData.contactEmail.trim()) {
      setStatusMessage("❌ Contact email is required")
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.contactEmail.trim())) {
      setStatusMessage("❌ Please enter a valid email address")
      return false
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      setStatusMessage("❌ Please enter a valid phone number")
      return false
    }

    return true
  }

  // Handle save
  const handleSave = () => {
    if (!validateForm()) return

    setIsSaving(true)
    setStatusMessage("⏳ Saving profile...")

    const updatedData = {
      name: formData.name.trim(),
      contactEmail: formData.contactEmail.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      email: memberData.email || '', // included for reference (readonly)
    }

    window.parent.postMessage({ type: "saveData", payload: updatedData }, "*")
  }

  // Handle logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      setStatusMessage("⏳ Logging out...")
      window.parent.postMessage({ type: "logoutRequest" }, "*")
    }
  }

  // Clear field
  const clearField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: ''
    }))
  }

  return (
    <div className="my-account">
      {/* Test Ribbon */}
      <div className="test-ribbon">
        🧪 This is a test from GitHub and Cursor
      </div>

      <h3>Application</h3>
      <div className="editor-container">
        <div className="input-group">
          <input 
            type="text" 
            className="readonly" 
            placeholder="Role" 
            readOnly 
            value={memberData.role || "—"}
          />
          <div className="note-text">Your Role cannot be changed</div>
        </div>
        
        <div className="input-group">
          <input 
            type="text" 
            placeholder="ID" 
            readOnly 
            value={memberData._id || ""}
          />
          <div className="note-text">Your Build ID</div>
        </div>

        <div className="input-group">
          <input 
            type="email" 
            placeholder="Email" 
            readOnly 
            value={memberData.email || ""}
          />
          <div className="note-text">Owner Login cannot be changed</div>
        </div>

        <h3>Contact</h3>

        <div className="input-group">
          <div className="input-row">
            <input 
              type="text" 
              placeholder="Name" 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('name')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="input-group">
          <div className="input-row">
            <input 
              type="text" 
              placeholder="Email" 
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('contactEmail')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="input-group">
          <div className="input-row">
            <input 
              type="text" 
              placeholder="Phone" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('phone')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="input-group">
          <div className="input-row">
            <input 
              type="text" 
              placeholder="Address" 
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('address')}
            >
              ✕
            </button>
          </div>
          <div className="note-text">Your ownership domain mail would be sent to this address</div>
        </div>

        <button 
          id="saveBtn" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "⏳ Saving..." : "💾 Save Changes"}
        </button>
        
        <button 
          id="logoutBtn" 
          onClick={handleLogout}
        >
          Logout
        </button>

        <div 
          id="statusMessage" 
          className={`status-message ${statusType}`}
        >
          {statusMessage}
        </div>
      </div>
    </div>
  )
}

export default MyAccount
