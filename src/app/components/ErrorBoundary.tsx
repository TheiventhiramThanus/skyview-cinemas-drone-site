import React from 'react';

interface Props {
  children: React.ReactNode;
  /** When true the fallback renders inline instead of covering the viewport */
  inline?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Inline variant — used to silently swallow the DroneScene without covering content
      if (this.props.inline) {
        return null;
      }

      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[200] text-red-400 p-6 font-mono text-sm">
          <div className="bg-red-950/60 p-8 rounded-xl border border-red-500/40 max-w-2xl w-full shadow-[0_0_40px_rgba(255,0,0,0.15)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xl font-bold tracking-widest uppercase">System Failure Detected</h2>
            </div>
            <pre className="whitespace-pre-wrap overflow-auto max-h-[50vh] text-red-300 text-xs leading-relaxed">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold uppercase tracking-widest text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
