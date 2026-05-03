import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
    this.setState({ info })
  }

  render() {
    const { error, info } = this.state
    if (!error) return this.props.children

    return (
      <div className="min-h-screen bg-page p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto bg-surface rounded-card border border-line shadow-sm p-6">
          <h1 className="text-base font-semibold text-primary mb-2">Something broke.</h1>
          <p className="text-xxs text-muted mb-4">
            React caught an error before it could blank the page. Send the message + stack to Claude.
          </p>
          <div className="bg-page border border-line rounded-btn p-3 mb-3">
            <p className="text-xxs font-mono text-primary whitespace-pre-wrap break-words">
              {error.name}: {error.message}
            </p>
          </div>
          <details className="bg-page border border-line rounded-btn p-3">
            <summary className="text-xxs font-medium text-sub cursor-pointer">Stack trace</summary>
            <pre className="text-xxs font-mono text-muted whitespace-pre-wrap break-words mt-2 overflow-x-auto">
              {error.stack}
              {info?.componentStack && '\n\nComponent stack:' + info.componentStack}
            </pre>
          </details>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                this.setState({ error: null, info: null })
              }}
              className="px-3 py-1.5 rounded-btn text-xxs font-semibold bg-brand text-white hover:bg-brand-hover transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => {
                Object.keys(localStorage)
                  .filter((k) => k.startsWith('classhub'))
                  .forEach((k) => localStorage.removeItem(k))
                window.location.href = '/dashboard'
              }}
              className="px-3 py-1.5 rounded-btn text-xxs font-semibold bg-surface border border-line text-sub hover:text-primary transition-colors"
            >
              Reset local data + reload
            </button>
          </div>
        </div>
      </div>
    )
  }
}
