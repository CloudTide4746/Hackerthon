import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export function Login() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center mb-8 text-slate-400 hover:text-indigo-400 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-slate-900/50 border border-slate-800 flex items-center justify-center mr-3 group-hover:border-indigo-500/50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="font-medium">返回首页</span>
        </Link>
        
        <div className="glass-card rounded-2xl p-8 border border-slate-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">欢迎回来</h1>
            <p className="text-slate-400">登录您的账户以继续</p>
          </div>
          
          <SignIn
            appearance={{
              elements: {
                rootBox: 'mx-auto w-full',
                card: 'shadow-none bg-transparent w-full p-0',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white !shadow-none !border-none',
                formFieldInput: 'bg-slate-900/50 border-slate-700 text-slate-100 focus:border-indigo-500',
                formFieldLabel: 'text-slate-400',
                footerActionLink: 'text-indigo-400 hover:text-indigo-300',
                identityPreviewText: 'text-slate-200',
                formFieldInputShowPasswordButton: 'text-slate-400',
                socialButtonsBlockButton: 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800',
                socialButtonsBlockButtonText: 'text-slate-200',
                dividerLine: 'bg-slate-800',
                dividerText: 'text-slate-500',
              },
              layout: {
                socialButtonsPlacement: 'bottom',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
