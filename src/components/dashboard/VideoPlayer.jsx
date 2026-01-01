/** @format */

import React from "react";
import { UploadCloud, X, ScanEye } from "lucide-react";

export function VideoPlayer({
  videoUrl,
  videoRef,
  canvasRef,
  onFileUpload,
  onTimeUpdate,
  onSeeked,
  onClear,
  onCaptureAndAnalyze,
}) {
  return (
    <div className='glass-card rounded-2xl p-6 relative overflow-hidden shadow-2xl shadow-black/20 group/card'>
      {!videoUrl ? (
        <div className='h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/30 hover:bg-slate-900/50 hover:border-indigo-500/50 transition-all duration-300 group cursor-pointer relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
          <input
            type='file'
            accept='video/*'
            onChange={onFileUpload}
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
          />
          <div className='w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300 shadow-xl shadow-black/20 ring-1 ring-white/10 group-hover:ring-indigo-500/30'>
            <UploadCloud className='w-10 h-10 text-slate-400 group-hover:text-indigo-400 transition-colors duration-300' />
          </div>
          <h3 className='text-2xl font-bold text-slate-200 mb-2 tracking-tight group-hover:text-white transition-colors'>
            点击或拖拽上传视频
          </h3>
          <p className='text-slate-500 group-hover:text-slate-400 transition-colors'>
            支持 MP4, WebM 等常见格式
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='relative w-full bg-black rounded-xl overflow-hidden group shadow-2xl ring-1 ring-white/10'>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className='w-full h-auto max-h-[500px] object-contain mx-auto'
              onTimeUpdate={onTimeUpdate}
              onSeeked={onSeeked}
              crossOrigin='anonymous'
            />
            <button
              onClick={onClear}
              className='absolute top-4 right-4 p-2.5 bg-black/60 hover:bg-red-500/90 text-white rounded-xl backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 shadow-lg'
              title='移除视频'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <button
            onClick={onCaptureAndAnalyze}
            className='w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden'
          >
            <div className='absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
            <ScanEye className='w-6 h-6 relative z-10' />
            <span className='relative z-10'>截屏并分析当前画面</span>
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className='hidden' />
    </div>
  );
}
