/** @format */

import { Link, useLocation } from "react-router-dom";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Home, PlayCircle, LogIn, UserPlus, Zap } from "lucide-react";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-indigo-400 bg-indigo-500/10"
      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50";
  };

  return (
    <nav className='glass-card border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-slate-950/80'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <div className='flex items-center gap-8'>
          <Link
            to='/'
            className='text-2xl font-bold flex items-center gap-2 group'
          >
            <div className='p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/20'>
              <Zap className='w-5 h-5 text-white' fill='currentColor' />
            </div>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:to-indigo-400 transition-all duration-300'>
              Hackerthon
            </span>
          </Link>

          <div className='hidden md:flex items-center gap-2'>
            <Link
              to='/'
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${isActive(
                "/"
              )}`}
            >
              <Home className='w-4 h-4' />
              首页
            </Link>
            <Link
              to='/dashboard'
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${isActive(
                "/dashboard"
              )}`}
            >
              <PlayCircle className='w-4 h-4' />
              视频处理
            </Link>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          {isSignedIn ? (
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 border-2 border-indigo-500/30 ring-2 ring-indigo-500/10",
                },
              }}
            />
          ) : (
            <div className='flex gap-3'>
              <Link
                to='/login'
                className='flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all'
              >
                <LogIn className='w-4 h-4' />
                登录
              </Link>
              <Link
                to='/signup'
                className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95'
              >
                <UserPlus className='w-4 h-4' />
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
