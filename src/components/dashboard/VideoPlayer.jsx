import React from 'react';

export function VideoPlayer({ 
  videoUrl, 
  videoRef, 
  canvasRef, 
  onFileUpload, 
  onTimeUpdate, 
  onSeeked, 
  onClear 
}) {
  return (
    <div className='glass-card rounded-2xl p-6 relative overflow-hidden shadow-2xl shadow-black/20'>
      {!videoUrl ? (
        <div className='h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors group cursor-pointer relative'>
          <input
            type='file'
            accept='video/*'
            onChange={onFileUpload}
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
          />
          <div className='w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
            <svg
              className='w-10 h-10 text-indigo-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              />
            </svg>
          </div>
          <h3 className='text-2xl font-semibold text-slate-200 mb-2'>
            点击或拖拽上传视频
          </h3>
          <p className='text-slate-500'>支持 MP4, WebM 等常见格式</p>
        </div>
      ) : (
        <div className='relative w-full bg-black rounded-xl overflow-hidden group shadow-lg'>
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
            className='absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className='hidden' />
    </div>
  );
}
