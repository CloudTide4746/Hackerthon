/** @format */

import { useState, useRef, useEffect } from "react";
import { uploadImage, dataURLtoBlob } from "../services/api";

export function Dashboard() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const nextCaptureTimeRef = useRef(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setScreenshots([]);
      nextCaptureTimeRef.current = 0;
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;

    // 智能同步：检测时间跳变（拖拽进度条或卡顿）

    // 1. 回退检测：如果当前时间远小于下一次截图时间（超过2.5秒，正常最大间隔是2秒）
    // 说明用户向回拖拽了进度条
    if (nextCaptureTimeRef.current - currentTime > 2.5) {
      nextCaptureTimeRef.current = Math.floor(currentTime / 2) * 2;
    }

    // 2. 前进检测：如果当前时间远大于下一次截图时间（超过1秒）
    // 说明用户向前拖拽了进度条，或者发生了严重卡顿
    if (currentTime - nextCaptureTimeRef.current > 1.0) {
      nextCaptureTimeRef.current = Math.floor(currentTime / 2) * 2;
    }

    // 每2秒截图一次 (0s, 2s, 4s...)
    // 允许0.5秒的误差，防止跳过
    if (currentTime >= nextCaptureTimeRef.current) {
      captureFrame(currentTime);
      nextCaptureTimeRef.current += 2;
    }
  };

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;
    // 拖拽结束时，立即重置下一次截图时间，确保UI响应及时
    nextCaptureTimeRef.current = Math.floor(video.currentTime / 2) * 2;
  };

  const handleUploadScreenshot = async (screenshot) => {
    try {
      const blob = dataURLtoBlob(screenshot.url);
      const result = await uploadImage(blob);
      console.log("Upload success:", result);
      alert("上传成功！");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("上传失败，请检查控制台或后端服务是否启动");
    }
  };

  const captureFrame = (time) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");

    // 设置画布尺寸与视频一致
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 绘制当前帧
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 转换为图片URL
    const imageUrl = canvas.toDataURL("image/jpeg");

    setScreenshots((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: Math.round(time),
        url: imageUrl,
      },
    ]);
  };

  // 清理 URL
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold mb-2 text-slate-100'>视频分析工具</h2>
        <p className='text-slate-400'>上传视频，自动提取关键帧（每2秒一张）</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* 左侧：视频播放区域 */}
        <div className='lg:col-span-2 flex flex-col gap-4'>
          <div className='glass-card rounded-2xl p-6 h-[600px] flex flex-col relative overflow-hidden'>
            {!videoUrl ? (
              <div className='flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors'>
                <input
                  type='file'
                  accept='video/*'
                  onChange={handleFileUpload}
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                />
                <div className='w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4'>
                  <svg
                    className='w-8 h-8 text-indigo-400'
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
                <h3 className='text-xl font-semibold text-slate-200 mb-2'>
                  点击或拖拽上传视频
                </h3>
                <p className='text-slate-500'>支持 MP4, WebM 等常见格式</p>
              </div>
            ) : (
              <div className='relative w-full h-full bg-black rounded-xl overflow-hidden flex items-center justify-center group'>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className='max-w-full max-h-full'
                  onTimeUpdate={handleTimeUpdate}
                  onSeeked={handleSeeked}
                  crossOrigin='anonymous'
                />
                <button
                  onClick={() => {
                    setVideoUrl(null);
                    setScreenshots([]);
                    nextCaptureTimeRef.current = 0;
                  }}
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
            {/* 隐藏的 Canvas 用于截图 */}
            <canvas ref={canvasRef} className='hidden' />
          </div>
        </div>

        {/* 右侧：截图展示区域 */}
        <div className='lg:col-span-1'>
          <div className='glass-card rounded-2xl p-6 h-[600px] flex flex-col'>
            <h3 className='text-xl font-bold text-slate-100 mb-4 flex items-center justify-between'>
              <span>关键帧序列</span>
              <span className='text-sm font-normal text-slate-500 bg-slate-900 px-2 py-1 rounded'>
                {screenshots.length} 张
              </span>
            </h3>

            <div className='flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar'>
              {screenshots.length === 0 ? (
                <div className='h-full flex flex-col items-center justify-center text-slate-500'>
                  <svg
                    className='w-12 h-12 mb-3 opacity-20'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                  <p>播放视频以生成截图</p>
                </div>
              ) : (
                screenshots.map((shot) => (
                  <div
                    key={shot.id}
                    className='bg-slate-900/50 p-2 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-all animate-in fade-in slide-in-from-right-4 duration-300'
                  >
                    <img
                      src={shot.url}
                      alt={`Frame at ${shot.time}s`}
                      className='w-full rounded-lg mb-2'
                    />
                    <div className='flex justify-between items-center px-1 mb-3'>
                      <span className='text-xs font-mono text-indigo-400'>
                        {Math.floor(shot.time / 60)}:
                        {(shot.time % 60).toString().padStart(2, "0")}
                      </span>
                      <a
                        href={shot.url}
                        download={`frame-${shot.time}s.jpg`}
                        className='text-slate-500 hover:text-white transition-colors'
                        title='下载图片'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                          />
                        </svg>
                      </a>
                    </div>

                    <button
                      onClick={() => handleUploadScreenshot(shot)}
                      className='w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 active:scale-95'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                        />
                      </svg>
                      上传到后端
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
