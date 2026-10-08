import { Component, type ReactNode } from 'react';

/** Shows a reload screen instead of a blank page when something fails to render or a page fails to download. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: unknown) { console.error(e); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="mx-auto max-w-shell px-4 py-24 text-center sm:px-6" role="alert">
        <h1 className="text-xl font-semibold">Something didn't load</h1>
        <p className="mt-2 text-sub">Check your connection, then reload. If the site was just updated, a reload fixes it.</p>
        <button type="button" className="btn-primary mt-6" onClick={() => location.reload()}>Reload</button>
      </div>
    );
  }
}
