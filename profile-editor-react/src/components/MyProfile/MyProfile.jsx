import { useState, useEffect } from 'react'
import './MyProfile.css'

const MyProfile = ({ memberData, setMemberData, statusMessage, statusType, setStatusMessage }) => {
  const [profileData, setProfileData] = useState({
    _id: '',
    email: '',
    name: '',
    role: '',
    title_fld: '',
    address: '',
    contactEmail: '',
    phone: '',
    profilePhoto: ''
  })

  // Update profile data when memberData changes
  useEffect(() => {
    if (memberData) {
      setProfileData({
        _id: memberData._id || '',
        email: memberData.email || '',
        name: memberData.name || 'Your Name',
        role: memberData.role || 'Member',
        title_fld: memberData.title_fld || 'LVA',
        address: memberData.address || '',
        contactEmail: memberData.contactEmail || '',
        phone: memberData.phone || '',
        profilePhoto: memberData.profilePhoto || ''
      })
    }
  }, [memberData])

  return (
    <div className="my-profile">
      {/* Test Ribbon */}
      <div className="test-ribbon">
        🧪 My Profile - Display Only - Test from GitHub and Cursor
      </div>

      <h3>My Profile</h3>
      <div className="profile-container">
        {/* Profile Photo */}
        {profileData.profilePhoto && (
          <div className="profile-photo-container">
            <img 
              src={profileData.profilePhoto} 
              alt="Profile Photo" 
              className="profile-photo"
            />
          </div>
        )}

        {/* Profile Information Display */}
        <div className="profile-info">
          <div className="info-item">
            <label>ID:</label>
            <span>{profileData._id || 'No ID provided'}</span>
          </div>
          
          <div className="info-item">
            <label>Email:</label>
            <span>{profileData.email || 'No email provided'}</span>
          </div>
          
          <div className="info-item">
            <label>Name:</label>
            <span>{profileData.name || 'Your Name'}</span>
          </div>
          
          <div className="info-item">
            <label>Role:</label>
            <span>{profileData.role || 'Member'}</span>
          </div>
          
          <div className="info-item">
            <label>Title:</label>
            <span>{profileData.title_fld || 'LVA'}</span>
          </div>
          
          <div className="info-item">
            <label>Address:</label>
            <span>{profileData.address || 'No address provided'}</span>
          </div>
          
          <div className="info-item">
            <label>Contact Email:</label>
            <span>{profileData.contactEmail || 'No contact email provided'}</span>
          </div>
          
          <div className="info-item">
            <label>Phone:</label>
            <span>{profileData.phone || 'No phone provided'}</span>
          </div>
        </div>

        <div className="status-message">
          <p><em>Profile data loaded from Wix Velo.</em></p>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
