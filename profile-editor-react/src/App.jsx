import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import MyAccount from './components/MyAccount'
import Application from './components/Application'

function App() {
  const [memberData, setMemberData] = useState({})
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('info')

  // Tell parent we're ready to receive data
  useEffect(() => {
    window.parent.postMessage("ready", "*")
  }, [])

  // Receive data and messages from parent
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data) return

      // Initial data from parent (no type)
      if (typeof event.data === "object" && !event.data.type) {
        setMemberData(event.data)
        setStatusMessage('')
      }

      // Save result feedback
      if (event.data.type === "saveSuccess") {
        setStatusMessage("✅ Profile saved successfully!")
        setStatusType("success")
      } else if (event.data.type === "saveError") {
        setStatusMessage("❌ Error saving profile: " + (event.data.error || "Unknown error"))
        setStatusType("error")
      } else if (event.data.type === "saving") {
        setStatusMessage("⏳ Saving profile...")
        setStatusType("loading")
      } else if (event.data.type === "applicationSuccess") {
        setStatusMessage("✅ Application submitted successfully!")
        setStatusType("success")
      } else if (event.data.type === "applicationError") {
        setStatusMessage("❌ Error submitting application: " + (event.data.error || "Unknown error"))
        setStatusType("error")
      } else if (event.data.type === "submittingApplication") {
        setStatusMessage("⏳ Submitting application...")
        setStatusType("loading")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <Router>
      <div className="App">
        <Routes>
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
          <Route path="/" element={<Navigate to="/myaccount" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
