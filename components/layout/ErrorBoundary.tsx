'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log non-NotFoundError DOM errors from Google Translate interference
    if (error.name !== 'NotFoundError') {
      console.error('ErrorBoundary caught:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="font-display text-2xl text-vert mb-4">
              Une erreur est survenue
            </h1>
            <p className="text-gris mb-6">
              Veuillez rafraîchir la page ou sélectionner une autre langue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-vert text-white rounded-xl font-medium hover:bg-vert-mid transition-colors"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
