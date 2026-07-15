import { Component } from 'react'

// Minimal error boundary: renders its `fallback` (default: nothing) if a child
// throws — e.g. the CDN-hosted HDRI failing to load. Keeps the app alive.
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    // eslint-disable-next-line no-console
    console.warn('[ErrorBoundary] caught:', err?.message || err)
  }
  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
