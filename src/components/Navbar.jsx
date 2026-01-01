/** @format */

import { Link, useLocation } from "react-router-dom";
import { UserButton, useAuth } from "@clerk/clerk-react";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-indigo-400 font-bold"
      : "text-slate-400 hover:text-slate-200";
  };

  return (
    <nav className='glass-card border-b border-slate-800 sticky top-0 z-50'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <div className='flex items-center gap-8'>
          <Link
            to='/'
            className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400'
          >
            Hackerthon
          </Link>

          <div className='hidden md:flex items-center gap-6'>
            <Link to='/' className={`transition-colors ${isActive("/")}`}>
              首页
            </Link>
            <Link
              to='/dashboard'
              className={`transition-colors ${isActive("/dashboard")}`}
            >
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
                  avatarBox: "w-10 h-10 border-2 border-indigo-500/30",
                },
              }}
            />
          ) : (
            <div className='flex gap-4'>
              <Link
                to='/login'
                className='text-slate-400 hover:text-white transition-colors'
              >
                登录
              </Link>
              <Link
                to='/signup'
                className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors'
              >
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
