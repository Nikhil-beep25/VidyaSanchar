import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
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
    console.error('Unhandled frontend application crash caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 font-sans">
          <div className="bg-card border rounded-2xl p-8 max-w-md w-full shadow-xl space-y-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 w-fit mx-auto border border-rose-500/20">
              <AlertTriangle className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An unexpected runtime crash occurred. This can happen if state or properties fail to load from server APIs.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-muted rounded-lg border text-left text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 inline-flex items-center justify-center h-11 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold transition-colors shadow-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center h-11 px-4 rounded-lg border hover:bg-accent text-sm font-medium transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
