import { useState, useEffect } from 'react'
import './Application.css'

const Application = ({ memberData, setMemberData, statusMessage, statusType, setStatusMessage }) => {
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    preferredContact: 'Email',
    businessName: '',
    hasWixAccount: 'No',
    wixEmail: '',
    siteName: '',
    businessOverview: '',
    goals: ['', '', ''],
    acceptPayments: 'No',
    socialMedia: {
      instagram: '',
      facebook: '',
      linkedin: '',
      other: ''
    },
    businessContact: {
      phone: '',
      email: '',
      address: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-fill with member data if available
  useEffect(() => {
    if (memberData) {
      setApplicationData(prev => ({
        ...prev,
        fullName: memberData.name || '',
        emailAddress: memberData.contactEmail || memberData.email || '',
        phoneNumber: memberData.phone || '',
        businessContact: {
          ...prev.businessContact,
          phone: memberData.phone || '',
          email: memberData.contactEmail || memberData.email || ''
        }
      }))
    }
  }, [memberData])

  // Handle input changes
  const handleInputChange = (field, value) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setApplicationData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  // Handle goals array changes
  const handleGoalChange = (index, value) => {
    setApplicationData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? value : goal)
    }))
  }

  // Validate form
  const validateForm = () => {
    if (!applicationData.fullName.trim()) {
      setStatusMessage("❌ Full name is required")
      return false
    }

    if (!applicationData.emailAddress.trim()) {
      setStatusMessage("❌ Email address is required")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(applicationData.emailAddress.trim())) {
      setStatusMessage("❌ Please enter a valid email address")
      return false
    }

    if (!applicationData.siteName.trim()) {
      setStatusMessage("❌ Site name is required")
      return false
    }

    if (!applicationData.businessOverview.trim()) {
      setStatusMessage("❌ Business overview is required")
      return false
    }

    return true
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setStatusMessage("⏳ Submitting application...")

    const submissionData = {
      ...applicationData,
      memberId: memberData._id || '',
      submissionDate: new Date().toISOString(),
      status: 'Pending'
    }

    window.parent.postMessage({ 
      type: "saveApplication", 
      payload: submissionData 
    }, "*")
  }



  return (
    <div className="application">
      {/* Test Ribbon */}
      <div className="test-ribbon">
        🧪 Application Form - Test from GitHub and Cursor
      </div>

      <h3>LVA Studio Application Form</h3>
      <div className="application-container">
        <div className="form-section">
          <h4>NEW Client</h4>
          <div className="input-group">
            <label>Full Name:</label>
            <input 
              type="text" 
              value={applicationData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="input-group">
            <label>Phone Number:</label>
            <input 
              type="tel" 
              value={applicationData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="input-group">
            <label>Email Address:</label>
            <input 
              type="email" 
              value={applicationData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          
          <div className="input-group">
            <label>Preferred Contact Method:</label>
            <select 
              value={applicationData.preferredContact}
              onChange={(e) => handleInputChange('preferredContact', e.target.value)}
            >
              <option value="Email">Email</option>
              <option value="Call">Call</option>
              <option value="Text">Text</option>
            </select>
          </div>
          
          <div className="input-group">
            <label>Business Name (if any):</label>
            <input 
              type="text" 
              value={applicationData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Enter your business name"
            />
          </div>
        </div>

        <div className="form-section">
          <h4>Wix Account Info</h4>
          <div className="input-group">
            <label>Do you already have a Wix account?</label>
            <select 
              value={applicationData.hasWixAccount}
              onChange={(e) => handleInputChange('hasWixAccount', e.target.value)}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          
          {applicationData.hasWixAccount === 'Yes' ? (
            <div className="input-group">
              <label>Wix Email:</label>
              <input 
                type="email" 
                value={applicationData.wixEmail}
                onChange={(e) => handleInputChange('wixEmail', e.target.value)}
                placeholder="Enter your Wix account email"
              />
            </div>
          ) : (
            <div className="note-box">
              <p>Please create a Wix account at wix.com using the email you'd like to manage your site.</p>
            </div>
          )}
        </div>

        <div className="form-section">
          <h4>Business Detail</h4>
          <div className="input-group">
            <label>New Site Name (Registering):</label>
            <input 
              type="text" 
              value={applicationData.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              placeholder="Enter your desired site name"
            />
            <div className="note-text">Note: A custom domain will be required</div>
          </div>
          
          <div className="input-group">
            <label>About Us / Business Overview:</label>
            <textarea 
              value={applicationData.businessOverview}
              onChange={(e) => handleInputChange('businessOverview', e.target.value)}
              placeholder="Briefly describe what your business does, who it serves, and what makes it unique"
              rows="4"
            />
          </div>
        </div>

        <div className="form-section">
          <h4>Top 3 Goals for Your Website</h4>
          {applicationData.goals.map((goal, index) => (
            <div key={index} className="input-group">
              <label>Goal {index + 1}:</label>
              <input 
                type="text" 
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                placeholder={`Enter goal ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <div className="form-section">
          <h4>Payment & Social Media</h4>
          <div className="input-group">
            <label>Do you want to accept payments on your site?</label>
            <select 
              value={applicationData.acceptPayments}
              onChange={(e) => handleInputChange('acceptPayments', e.target.value)}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
            <div className="note-text">Standard Package Required for payments</div>
          </div>
          
          <div className="input-group">
            <label>Social Media Links (if any):</label>
            <input 
              type="text" 
              value={applicationData.socialMedia.instagram}
              onChange={(e) => handleNestedChange('socialMedia', 'instagram', e.target.value)}
              placeholder="Instagram URL"
            />
            <input 
              type="text" 
              value={applicationData.socialMedia.facebook}
              onChange={(e) => handleNestedChange('socialMedia', 'facebook', e.target.value)}
              placeholder="Facebook URL"
            />
            <input 
              type="text" 
              value={applicationData.socialMedia.linkedin}
              onChange={(e) => handleNestedChange('socialMedia', 'linkedin', e.target.value)}
              placeholder="LinkedIn URL"
            />
            <input 
              type="text" 
              value={applicationData.socialMedia.other}
              onChange={(e) => handleNestedChange('socialMedia', 'other', e.target.value)}
              placeholder="Other social media URL"
            />
            <div className="note-text">You can add more later</div>
          </div>
        </div>

        <div className="form-section">
          <h4>Business Contact</h4>
          <div className="input-group">
            <label>Phone Number:</label>
            <input 
              type="tel" 
              value={applicationData.businessContact.phone}
              onChange={(e) => handleNestedChange('businessContact', 'phone', e.target.value)}
              placeholder="Business phone number"
            />
          </div>
          
          <div className="input-group">
            <label>Email Address:</label>
            <input 
              type="email" 
              value={applicationData.businessContact.email}
              onChange={(e) => handleNestedChange('businessContact', 'email', e.target.value)}
              placeholder="Business email address"
            />
          </div>
          
          <div className="input-group">
            <label>Location Address:</label>
            <input 
              type="text" 
              value={applicationData.businessContact.address}
              onChange={(e) => handleNestedChange('businessContact', 'address', e.target.value)}
              placeholder="Business address"
            />
            <div className="note-text">If none, leave blank for online store only</div>
          </div>
        </div>

        <div className="button-group">
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "⏳ Submitting..." : "📝 Submit Application"}
          </button>
        </div>

        <div 
          className={`status-message ${statusType}`}
        >
          {statusMessage}
        </div>
      </div>
    </div>
  )
}

export default Application
