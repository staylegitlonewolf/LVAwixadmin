import { useState, useEffect } from 'react'
import './MyProfile.css'

const MyProfile = ({ memberData, setMemberData, statusMessage, statusType, setStatusMessage }) => {
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    website: '',
    location: '',
    interests: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  })
  const [isSaving, setIsSaving] = useState(false)

  // Update profile data when memberData changes
  useEffect(() => {
    if (memberData) {
      setProfileData({
        displayName: memberData.displayName || memberData.name || '',
        bio: memberData.bio || '',
        website: memberData.website || '',
        location: memberData.location || '',
        interests: memberData.interests || '',
        socialLinks: {
          twitter: memberData.socialLinks?.twitter || '',
          linkedin: memberData.socialLinks?.linkedin || '',
          instagram: memberData.socialLinks?.instagram || ''
        }
      })
    }
  }, [memberData])

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }))
    }
    
    // Clear warning messages when user starts typing
    if (statusMessage.includes("⚠️")) {
      setStatusMessage('')
    }
  }

  // Validate profile data
  const validateProfile = () => {
    if (!profileData.displayName.trim()) {
      setStatusMessage("❌ Display name is required")
      return false
    }

    // Website validation (optional but if provided, should be valid)
    if (profileData.website.trim() && !/^https?:\/\/.+/.test(profileData.website.trim())) {
      setStatusMessage("❌ Please enter a valid website URL (include http:// or https://)")
      return false
    }

    return true
  }

  // Handle save
  const handleSave = () => {
    if (!validateProfile()) return

    setIsSaving(true)
    setStatusMessage("⏳ Saving profile...")

    const updatedData = {
      displayName: profileData.displayName.trim(),
      bio: profileData.bio.trim(),
      website: profileData.website.trim(),
      location: profileData.location.trim(),
      interests: profileData.interests.trim(),
      socialLinks: profileData.socialLinks
    }

    window.parent.postMessage({ type: "saveProfileData", payload: updatedData }, "*")
  }

  // Clear field
  const clearField = (field) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: ''
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div className="my-profile">
      {/* Test Ribbon */}
      <div className="test-ribbon">
        🧪 My Profile - Test from GitHub and Cursor
      </div>

      <h3>My Profile</h3>
      <div className="profile-container">
        <div className="input-group">
          <label>Display Name</label>
          <div className="input-row">
            <input 
              type="text" 
              placeholder="Enter your display name" 
              value={profileData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('displayName')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Bio</label>
          <div className="input-row">
            <textarea 
              placeholder="Tell us about yourself..."
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows="3"
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('bio')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Website</label>
          <div className="input-row">
            <input 
              type="url" 
              placeholder="https://yourwebsite.com" 
              value={profileData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('website')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Location</label>
          <div className="input-row">
            <input 
              type="text" 
              placeholder="City, Country" 
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('location')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Interests</label>
          <div className="input-row">
            <input 
              type="text" 
              placeholder="e.g., Technology, Music, Travel" 
              value={profileData.interests}
              onChange={(e) => handleInputChange('interests', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('interests')}
            >
              ✕
            </button>
          </div>
        </div>

        <h4>Social Links</h4>
        
        <div className="input-group">
          <label>Twitter</label>
          <div className="input-row">
            <input 
              type="text" 
              placeholder="@username" 
              value={profileData.socialLinks.twitter}
              onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('socialLinks.twitter')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>LinkedIn</label>
          <div className="input-row">
            <input 
              type="text" 
              placeholder="linkedin.com/in/username" 
              value={profileData.socialLinks.linkedin}
              onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('socialLinks.linkedin')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Instagram</label>
          <div className="input-row">
            <input 
              type="text" 
              placeholder="@username" 
              value={profileData.socialLinks.instagram}
              onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
            />
            <button 
              className="clear-btn" 
              onClick={() => clearField('socialLinks.instagram')}
            >
              ✕
            </button>
          </div>
        </div>

        <button 
          id="saveProfileBtn" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "⏳ Saving..." : "💾 Save Profile"}
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

export default MyProfile
