import { useState, useEffect } from 'react'
import './App.css'
import ProfileEditor from './components/ProfileEditor'

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
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <div className="App">
      <ProfileEditor 
        memberData={memberData}
        setMemberData={setMemberData}
        statusMessage={statusMessage}
        statusType={statusType}
        setStatusMessage={setStatusMessage}
      />
    </div>
  )
}

export default App
