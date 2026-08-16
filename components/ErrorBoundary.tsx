'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      // Default to full page reload if no reset logic provided
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] h-full w-full bg-slate-950 text-slate-200 p-6 rounded-xl border border-red-900/30">
          <div className="bg-red-500/10 p-4 rounded-full mb-4 border border-red-500/20">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-100">レンダリングエラーが発生しました</h2>
          <p className="text-sm text-slate-400 max-w-md text-center mb-6">
            アプリケーションの一部で予期せぬエラーが発生しました。エディタの状態を保護するため、処理を中断しました。
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 w-full max-w-lg overflow-auto mb-6 text-xs font-mono text-red-300">
            {this.state.error?.message || 'Unknown error'}
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition shadow-lg shadow-indigo-500/20"
          >
            <RefreshCcw className="w-4 h-4" />
            画面を再読み込みする
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
