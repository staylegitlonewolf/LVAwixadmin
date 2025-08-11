import { useState, useEffect } from 'react'
import { isAdmin, isClient, normalizeRole } from '../utils/roleUtils'
import './Debug.css'

const Debug = ({ memberData, setMemberData, statusMessage, statusType, setStatusMessage }) => {
  const [debugInfo, setDebugInfo] = useState({
    memberData: {},
    roleInfo: {},
    communicationLog: [],
    timestamp: new Date().toISOString()
  })

  // Update debug info when memberData changes
  useEffect(() => {
    const roleInfo = {
      rawRole: memberData?.role,
      normalizedRole: normalizeRole(memberData?.role),
      isAdmin: isAdmin(memberData),
      isClient: isClient(memberData),
      roleType: typeof memberData?.role,
      roleLength: memberData?.role?.length || 0
    }

    setDebugInfo(prev => ({
      ...prev,
      memberData: memberData || {},
      roleInfo,
      timestamp: new Date().toISOString()
    }))
  }, [memberData])

  // Add communication log entry
  const addLogEntry = (message) => {
    setDebugInfo(prev => ({
      ...prev,
      communicationLog: [
        {
          timestamp: new Date().toISOString(),
          message
        },
        ...prev.communicationLog.slice(0, 19) // Keep last 20 entries
      ]
    }))
  }

  // Listen for debug events
  useEffect(() => {
    const handleDebugLog = (event) => {
      addLogEntry(event.detail.message)
    }

    window.addEventListener('debugLog', handleDebugLog)
    return () => window.removeEventListener('debugLog', handleDebugLog)
  }, [])

  // Test role functions
  const testRoleFunctions = () => {
    const testRoles = ['Admin', 'admin', 'ADMIN', 'Client', 'client', 'CLIENT', 'Member', 'member', 'MEMBER', '', null, undefined]
    
    const results = testRoles.map(role => ({
      role,
      normalized: normalizeRole(role),
      isAdmin: isAdmin({ role }),
      isClient: isClient({ role })
    }))

    addLogEntry(`Role function test results: ${JSON.stringify(results, null, 2)}`)
  }

  // Clear logs
  const clearLogs = () => {
    setDebugInfo(prev => ({
      ...prev,
      communicationLog: []
    }))
  }

  // Copy debug info to clipboard
  const copyDebugInfo = () => {
    const debugText = JSON.stringify(debugInfo, null, 2)
    navigator.clipboard.writeText(debugText).then(() => {
      addLogEntry('Debug info copied to clipboard')
    }).catch(err => {
      addLogEntry(`Failed to copy: ${err.message}`)
    })
  }

  return (
    <div className="debug">
      <div className="debug-header">
        <h2>🐛 Debug Panel</h2>
        <p>Debug information for troubleshooting</p>
        <div className="debug-controls">
          <button onClick={testRoleFunctions} className="debug-btn">
            🧪 Test Role Functions
          </button>
          <button onClick={clearLogs} className="debug-btn">
            🗑️ Clear Logs
          </button>
          <button onClick={copyDebugInfo} className="debug-btn">
            📋 Copy Debug Info
          </button>
        </div>
      </div>

      <div className="debug-content">
        <div className="debug-section">
          <h3>📊 Member Data</h3>
          <div className="debug-data">
            <pre>{JSON.stringify(memberData, null, 2)}</pre>
          </div>
        </div>

        <div className="debug-section">
          <h3>🎭 Role Information</h3>
          <div className="debug-data">
            <table className="debug-table">
              <tbody>
                <tr>
                  <td><strong>Raw Role:</strong></td>
                  <td>"{debugInfo.roleInfo.rawRole}"</td>
                </tr>
                <tr>
                  <td><strong>Normalized Role:</strong></td>
                  <td>"{debugInfo.roleInfo.normalizedRole}"</td>
                </tr>
                <tr>
                  <td><strong>Is Admin:</strong></td>
                  <td className={debugInfo.roleInfo.isAdmin ? 'success' : 'error'}>
                    {debugInfo.roleInfo.isAdmin ? '✅ true' : '❌ false'}
                  </td>
                </tr>
                <tr>
                  <td><strong>Is Client:</strong></td>
                  <td className={debugInfo.roleInfo.isClient ? 'success' : 'error'}>
                    {debugInfo.roleInfo.isClient ? '✅ true' : '❌ false'}
                  </td>
                </tr>
                <tr>
                  <td><strong>Role Type:</strong></td>
                  <td>{debugInfo.roleInfo.roleType}</td>
                </tr>
                <tr>
                  <td><strong>Role Length:</strong></td>
                  <td>{debugInfo.roleInfo.roleLength}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="debug-section">
          <h3>📡 Communication Log</h3>
          <div className="debug-data">
            {debugInfo.communicationLog.length === 0 ? (
              <p className="no-logs">No communication logs yet...</p>
            ) : (
              <div className="log-entries">
                {debugInfo.communicationLog.map((entry, index) => (
                  <div key={index} className="log-entry">
                    <span className="log-timestamp">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="log-message">{entry.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="debug-section">
          <h3>🔧 System Info</h3>
          <div className="debug-data">
            <table className="debug-table">
              <tbody>
                <tr>
                  <td><strong>User Agent:</strong></td>
                  <td>{navigator.userAgent}</td>
                </tr>
                <tr>
                  <td><strong>Window Size:</strong></td>
                  <td>{window.innerWidth} x {window.innerHeight}</td>
                </tr>
                <tr>
                  <td><strong>Last Updated:</strong></td>
                  <td>{new Date(debugInfo.timestamp).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Debug
