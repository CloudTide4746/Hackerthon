/** @format */

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";

export function Home() {
  const setPosts = useStore((state) => state.setPosts);
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误处理
  // 页面加载时抓取数据
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts?_limit=5") // 限制只拿5条，省得刷屏
      .then((response) => {
        // 关键点：Axios 拿到的数据在 response.data 中
        setPosts(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((err) => {
        console.error("API 调用失败:", err);
        setError("无法连接到服务器");
        setLoading(false);
      });
  }, []);
  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none'>
        <div className='absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]' />
      </div>

      <div className='container mx-auto px-4 py-24 relative z-10'>
        <div className='text-center max-w-3xl mx-auto'>
          <div className='inline-block mb-4 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium'>
            🚀 2026 Hackerthon Ready
            {useStore((state) => state.posts).map((post) => (
              <div key={post.id}>
                <h2 className='text-2xl font-bold'>{post.title}</h2>
                <p className='text-slate-400'>{post.body}</p>
              </div>
            ))}
            <br />
            {}
          </div>
          <h1 className='text-6xl md:text-7xl font-bold tracking-tight mb-8'>
            <span className='text-gradient'>构建未来</span>
            <br />
            <span className='text-slate-100'>从这里开始</span>
          </h1>
          <p className='text-xl text-slate-400 mb-12 leading-relaxed'>
            基于 Vite + React + TailwindCSS + Clerk + Zustand 的现代化开发模板。
            <br />
            极简、高效、开箱即用。
          </p>
          <div className='flex gap-6 justify-center'>
            <Link
              to='/login'
              className='px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-all hover:scale-105 shadow-lg shadow-indigo-500/25'
            >
              立即登录
            </Link>
            <Link
              to='/signup'
              className='px-8 py-4 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg font-semibold hover:bg-slate-700 transition-all hover:scale-105'
            >
              注册账号
            </Link>
          </div>
        </div>

        <div className='mt-24 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='glass-card p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group'>
            <div className='w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors'>
              <svg
                className='w-7 h-7 text-indigo-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-slate-100 mb-3'>安全登录</h3>
            <p className='text-slate-400 leading-relaxed'>
              集成 Clerk 身份验证系统，提供企业级的安全保障和流畅的登录体验。
            </p>
          </div>

          <div className='glass-card p-8 rounded-2xl hover:border-purple-500/50 transition-colors group'>
            <div className='w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors'>
              <svg
                className='w-7 h-7 text-purple-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-slate-100 mb-3'>状态管理</h3>
            <p className='text-slate-400 leading-relaxed'>
              使用 Zustand 进行轻量级状态管理，代码简洁，性能卓越，易于维护。
            </p>
          </div>

          <div className='glass-card p-8 rounded-2xl hover:border-pink-500/50 transition-colors group'>
            <div className='w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors'>
              <svg
                className='w-7 h-7 text-pink-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-slate-100 mb-3'>极速构建</h3>
            <p className='text-slate-400 leading-relaxed'>
              Vite 驱动的极速开发体验，毫秒级热更新，让你的创意瞬间实现。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
