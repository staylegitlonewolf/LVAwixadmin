import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          color: '#d63031'
        }}>
          <h2>🚨 Something went wrong</h2>
          <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '10px' }}>
              <summary>Error Details (Development)</summary>
              <pre style={{ 
                fontSize: '12px', 
                overflow: 'auto', 
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
