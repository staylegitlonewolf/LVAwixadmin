import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { sendReadyMessage } from './utils/messageUtils'
import { useMessageHandler } from './hooks/useMessageHandler'
import './App.css'
import Home from './components/Home'
import MyAccount from './components/MyAccount'
import Application from './components/Application'
import Admin from './components/Admin'
import Projects from './components/Projects'
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [memberData, setMemberData] = useState({})
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('info')

  // Debug: Verify React app is loading
  console.log('🚀 React App is loading...')

  // Tell parent we're ready to receive data
  useEffect(() => {
    console.log('📡 Sending ready message to parent...')
    sendReadyMessage()
  }, [])

  // Use custom hook for message handling
  useMessageHandler({
    onInitialData: (data) => {
      console.log('🎯 App.jsx: Received initial data:', data)
      console.log('🎯 App.jsx: Role from data:', data.role)
      console.log('🎯 App.jsx: Full memberData:', data)
      setMemberData(data)
      setStatusMessage('')
    },
    onSaveSuccess: () => {
      setStatusMessage("✅ Profile saved successfully!")
      setStatusType("success")
    },
    onSaveError: (data) => {
      setStatusMessage("❌ Error saving profile: " + (data.error || "Unknown error"))
      setStatusType("error")
    },
    onSaving: () => {
      setStatusMessage("⏳ Saving profile...")
      setStatusType("loading")
    },
    onApplicationSuccess: () => {
      setStatusMessage("✅ Application submitted successfully!")
      setStatusType("success")
    },
    onApplicationError: (data) => {
      setStatusMessage("❌ Error submitting application: " + (data.error || "Unknown error"))
      setStatusType("error")
    },
    onSubmittingApplication: () => {
      setStatusMessage("⏳ Submitting application...")
      setStatusType("loading")
    }
  })

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navigation memberData={memberData} />
          <Routes>
            <Route path="/home" element={
              <Home 
                memberData={memberData}
                setMemberData={setMemberData}
              />
            } />
            <Route path="/myaccount" element={
              <MyAccount 
                memberData={memberData}
                setMemberData={setMemberData}
                statusMessage={statusMessage}
                statusType={statusType}
                setStatusMessage={setStatusMessage}
              />
            } />
            <Route path="/application" element={
              <Application 
                memberData={memberData}
                setMemberData={setMemberData}
                statusMessage={statusMessage}
                statusType={statusType}
                setStatusMessage={setStatusMessage}
              />
            } />
            <Route path="/admin" element={
              <Admin 
                memberData={memberData}
                setMemberData={setMemberData}
                statusMessage={statusMessage}
                statusType={statusType}
                setStatusMessage={setStatusMessage}
              />
            } />
            <Route path="/projects" element={
              <Projects 
                memberData={memberData}
                setMemberData={setMemberData}
                statusMessage={statusMessage}
                statusType={statusType}
                setStatusMessage={setStatusMessage}
              />
            } />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
