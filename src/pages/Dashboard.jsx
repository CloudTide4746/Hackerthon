/** @format */

import { useState, useRef, useEffect } from "react";
import { uploadImage, dataURLtoBlob } from "../services/api";

export function Dashboard() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [screenshots, setScreenshots] = useState([]);

  // 新增状态：模式、自定义Prompt、历史记录
  const [mode, setMode] = useState("recognition"); // "recognition" | "custom"
  const [customPrompt, setCustomPrompt] = useState("");
  const [history, setHistory] = useState([]);

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
    if (nextCaptureTimeRef.current - currentTime > 2.5) {
      nextCaptureTimeRef.current = Math.floor(currentTime / 2) * 2;
    }
    if (currentTime - nextCaptureTimeRef.current > 1.0) {
      nextCaptureTimeRef.current = Math.floor(currentTime / 2) * 2;
    }

    // 每2秒截图一次
    if (currentTime >= nextCaptureTimeRef.current) {
      captureFrame(currentTime);
      nextCaptureTimeRef.current += 2;
    }
  };

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;
    nextCaptureTimeRef.current = Math.floor(video.currentTime / 2) * 2;
  };

  const handleUploadScreenshot = async (screenshot) => {
    try {
      const blob = dataURLtoBlob(screenshot.url);

      // 构造 sent_Prompt
      let sent_Prompt = "";
      if (mode === "custom") {
        // 将历史记录和当前输入合并
        const historyText = history.join("\n");
        sent_Prompt = historyText
          ? `${historyText}\n${customPrompt}`
          : customPrompt;
      } else {
        // 智能助手模式下，可以使用默认提示词或留空
        sent_Prompt = "请分析这张图片的关键内容。";
      }

      console.log("Uploading with:", { mode, sent_Prompt });

      const result = await uploadImage(blob, mode, sent_Prompt);
      console.log("Upload success:", result);

      // 上传成功后，如果是自定义模式，将当前输入加入历史记录并清空输入框
      if (mode === "custom" && customPrompt.trim()) {
        setHistory((prev) => [...prev, customPrompt]);
        setCustomPrompt("");
      }

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
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
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
    <div className='container mx-auto px-4 py-8 max-w-[1600px]'>
      <div className='mb-8 text-center'>
        <h2 className='text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent'>
          视频理解助手
        </h2>
        <p className='text-slate-400'>让视频内容一目了然</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
        {/* 左侧区域 (3/5)：视频播放 + 截图列表 */}
        <div className='lg:col-span-3 flex flex-col gap-8'>
          {/* 视频播放器 */}
          <div className='glass-card rounded-2xl p-6 relative overflow-hidden shadow-2xl shadow-black/20'>
            {!videoUrl ? (
              <div className='h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors group cursor-pointer relative'>
                <input
                  type='file'
                  accept='video/*'
                  onChange={handleFileUpload}
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
            <canvas ref={canvasRef} className='hidden' />
          </div>

          {/* 截图列表 (固定高度，可滚动) */}
          <div className='glass-card rounded-2xl p-6 h-[400px] flex flex-col'>
            <h3 className='text-xl font-bold text-slate-100 mb-4 flex items-center gap-3'>
              <svg
                className='w-6 h-6 text-indigo-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
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
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
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
                          {Math.floor(shot.time / 60)}:
                          {(shot.time % 60).toString().padStart(2, "0")}
                        </span>
                        <button
                          onClick={() => handleUploadScreenshot(shot)}
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
        </div>

        {/* 右侧区域 (2/5)：助手控制台 */}
        <div className='lg:col-span-2'>
          <div className='glass-card rounded-2xl p-6 h-full min-h-[600px] flex flex-col sticky top-8'>
            <div className='flex items-center gap-2 mb-6 border-b border-slate-700/50 pb-4'>
              <svg
                className='w-6 h-6 text-purple-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
                />
              </svg>
              <h3 className='text-xl font-bold text-slate-100'>
                智能助手控制台
              </h3>
            </div>

            {/* 模式选择 */}
            <div className='bg-slate-900/50 p-1 rounded-xl flex mb-6 border border-slate-700/50'>
              <button
                onClick={() => setMode("recognition")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  mode === "recognition"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
                智能识别
              </button>
              <button
                onClick={() => setMode("custom")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  mode === "custom"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                  />
                </svg>
                自定义提问
              </button>
            </div>

            {/* 动态内容区域 */}
            <div className='flex-1 flex flex-col gap-4'>
              {mode === "recognition" ? (
                <div className='flex-1 bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 flex flex-col items-center justify-center text-center'>
                  <div className='w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4'>
                    <svg
                      className='w-8 h-8 text-indigo-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                      />
                    </svg>
                  </div>
                  <h4 className='text-lg font-medium text-slate-200 mb-2'>
                    智能分析模式已就绪
                  </h4>
                  <p className='text-slate-400 text-sm max-w-xs'>
                    点击左侧任意关键帧的“分析”按钮，AI
                    将自动识别画面内容并生成摘要。
                  </p>
                </div>
              ) : (
                <div className='flex-1 flex flex-col gap-4'>
                  {/* 历史记录展示 */}
                  <div className='flex-1 bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 overflow-y-auto max-h-[300px] custom-scrollbar'>
                    {history.length === 0 ? (
                      <p className='text-slate-500 text-sm text-center mt-10'>
                        暂无提问历史
                      </p>
                    ) : (
                      <div className='space-y-3'>
                        {history.map((item, index) => (
                          <div key={index} className='flex gap-3'>
                            <div className='w-8 h-8 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center text-purple-400 text-xs'>
                              Q{index + 1}
                            </div>
                            <div className='bg-slate-700/50 rounded-lg rounded-tl-none p-3 text-sm text-slate-300'>
                              {item}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 输入框 */}
                  <div className='relative'>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="输入您的问题，例如：'画面中的人物在做什么？'"
                      className='w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none'
                    />
                    <div className='absolute bottom-3 right-3 text-xs text-slate-500'>
                      {customPrompt.length} 字
                    </div>
                  </div>

                  <div className='bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 flex items-start gap-3'>
                    <svg
                      className='w-5 h-5 text-blue-400 mt-0.5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    <p className='text-xs text-blue-200/80 leading-relaxed'>
                      提示：您的提问将与历史记录合并，作为完整的上下文发送给
                      AI。点击左侧截图的“分析”按钮即可发送。
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
