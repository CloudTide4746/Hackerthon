import React from 'react';

export function ScreenshotGallery({ screenshots, onUpload }) {
  return (
    <div className='glass-card rounded-2xl p-6 h-[400px] flex flex-col'>
      <h3 className='text-xl font-bold text-slate-100 mb-4 flex items-center gap-3'>
        <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        关键帧序列
        <span className='text-xs font-normal text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full border border-slate-700'>
          {screenshots.length} 张
        </span>
      </h3>

      <div className='flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar'>
        {screenshots.length === 0 ? (
          <div className='h-full flex flex-col items-center justify-center text-slate-500/50 border-2 border-dashed border-slate-800/50 rounded-xl'>
            <p>播放视频以生成截图</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {screenshots.map((shot) => (
              <div
                key={shot.id}
                className='bg-slate-900/40 p-2 rounded-xl border border-slate-800/50 hover:border-indigo-500/30 transition-all group relative'
              >
                <img
                  src={shot.url}
                  alt={`Frame at ${shot.time}s`}
                  className='w-full aspect-video object-cover rounded-lg mb-2'
                />
                <div className='flex justify-between items-center px-1'>
                  <span className='text-xs font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded'>
                    {Math.floor(shot.time / 60)}:{(shot.time % 60).toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => onUpload(shot)}
                    className='text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded shadow-lg shadow-indigo-900/20 transition-all active:scale-95'
                  >
                    分析
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
