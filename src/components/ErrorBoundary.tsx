import { Component, ErrorInfo, ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-2xl w-full bg-[#111] border-2 border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500">
                  <LucideIcons.AlertTriangle size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tighter">System_Crash</h1>
                  <p className="text-[10px] text-purple-500 uppercase tracking-[0.3em] font-bold">Error Recovery Mode</p>
                </div>
              </div>

              <div className="bg-black/50 border border-white/5 rounded-2xl p-6 mb-8 font-mono text-xs overflow-auto max-h-[300px]">
                <div className="flex items-center gap-2 text-purple-500 mb-4 border-b border-white/10 pb-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="uppercase tracking-widest font-bold">Stack_Trace</span>
                </div>
                <p className="text-white mb-4 font-bold">{this.state.error?.toString()}</p>
                <pre className="text-gray-400 leading-relaxed">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={this.handleReset}
                  className="px-8 py-4 bg-purple-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  <LucideIcons.RefreshCw size={18} />
                  Restart System
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-8 py-4 bg-transparent border-2 border-gray-800 text-gray-400 font-black uppercase tracking-widest text-xs rounded-xl hover:border-white hover:text-white transition-all"
                >
                  Return to Base
                </button>
              </div>
            </div>

            <div className="bg-purple-500/5 p-4 border-t border-white/5 flex items-center justify-between text-[8px] text-gray-500 uppercase tracking-[0.4em] font-bold">
              <span>Security_Protocol: Active</span>
              <span className="text-purple-500">Auto_Log_Generated</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
