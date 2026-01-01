/** @format */

import React from "react";
import { Images, Clock, ScanEye } from "lucide-react";

export function ScreenshotGallery({ screenshots, onUpload }) {
  return (
    <div className='glass-card rounded-2xl p-6 h-[400px] flex flex-col shadow-2xl shadow-black/20 ring-1 ring-white/5'>
      <div className='flex items-center justify-between mb-4 pb-4 border-b border-slate-700/50'>
        <h3 className='text-xl font-bold text-slate-100 flex items-center gap-3'>
          <div className='p-2 bg-indigo-500/10 rounded-lg'>
            <Images className='w-6 h-6 text-indigo-500' />
          </div>
          关键帧序列
        </h3>
        <span className='text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20'>
          {screenshots.length} 张
        </span>
      </div>

      <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar'>
        {screenshots.length === 0 ? (
          <div className='h-full flex flex-col items-center justify-center text-slate-500/50 border-2 border-dashed border-slate-800/50 rounded-xl gap-3'>
            <Images className='w-12 h-12 opacity-50' />
            <p className='font-medium'>播放视频以生成截图</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {screenshots.map((shot) => (
              <div
                key={shot.id}
                className='bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50 hover:border-indigo-500/30 transition-all duration-300 group relative hover:bg-slate-800/60'
              >
                <div className='relative overflow-hidden rounded-lg mb-2.5'>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10' />
                  <img
                    src={shot.url}
                    alt={`Frame at ${shot.time}s`}
                    className='w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute bottom-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <span className='text-[10px] font-mono text-white bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      {Math.floor(shot.time / 60)}:
                      {(shot.time % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className='flex justify-between items-center px-0.5'>
                  <span className='text-xs font-mono text-slate-400 group-hover:text-slate-300 transition-colors'>
                    #{shot.id.toString().slice(-4)}
                  </span>
                  <button
                    onClick={() => onUpload(shot)}
                    className='text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 transition-all active:scale-95 flex items-center gap-1.5 font-medium'
                  >
                    <ScanEye className='w-3.5 h-3.5' />
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
