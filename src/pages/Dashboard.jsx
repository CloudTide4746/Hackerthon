/** @format */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage, dataURLtoBlob } from "../services/api";
import { VideoPlayer } from "../components/dashboard/VideoPlayer";
import { ScreenshotGallery } from "../components/dashboard/ScreenshotGallery";
import { AssistantPanel } from "../components/dashboard/AssistantPanel";
import { ChatPanel } from "../components/dashboard/ChatPanel";
import { CodeEditorPanel } from "../components/dashboard/CodeEditorPanel";

export function Dashboard() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [screenshots, setScreenshots] = useState([]);

  // State: Mode, Custom Prompt, History
  const [mode, setMode] = useState("general-explainer");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedCode, setExtractedCode] = useState("// 暂无提取的代码");
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  // Update showCodeEditor when mode changes
  useEffect(() => {
    if (mode === "code_extractor") {
      setShowCodeEditor(true);
    } else {
      setShowCodeEditor(false);
    }
  }, [mode]);

  // Load history from localStorage
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("chat_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(history));
  }, [history]);

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

    // Smart sync: detect time jumps
    if (nextCaptureTimeRef.current - currentTime > 2.5) {
      nextCaptureTimeRef.current = Math.floor(currentTime / 2) * 2;
    }
    if (currentTime - nextCaptureTimeRef.current > 1.0) {
      nextCaptureTimeRef.current = Math.floor(currentTime / 2) * 2;
    }

    // Capture every 2 seconds
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

  const handleClear = () => {
    setVideoUrl(null);
    setScreenshots([]);
    nextCaptureTimeRef.current = 0;
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
      {
        id: Date.now() + Math.random(),
        time: Math.round(time),
        url: imageUrl,
      },
      ...prev,
    ]);
  };

  // Logic to upload/analyze an existing screenshot
  const handleUploadScreenshot = async (screenshot) => {
    try {
      let blob;
      if (screenshot.url.startsWith("blob:")) {
        const response = await fetch(screenshot.url);
        blob = await response.blob();
      } else {
        blob = dataURLtoBlob(screenshot.url);
      }
      await processUpload(blob);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Logic to capture current frame and analyze immediately
  const handleCaptureAndAnalyze = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Draw current frame
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        // Also add to screenshots list for UI consistency
        const imageUrl = URL.createObjectURL(blob);
        setScreenshots((prev) => [
          {
            id: Date.now() + Math.random(),
            time: video.currentTime,
            url: imageUrl,
          },
          ...prev,
        ]);

        processUpload(blob);
      }
    }, "image/jpeg");
  };

  // Centralized upload logic
  const processUpload = async (blob) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Construct prompt: history + current custom prompt
      const historyText = history
        .map((h) => `${h.role === "user" ? "User" : "AI"}: ${h.content}`)
        .join("\n");

      // sent_Prompt should include history and the new question if any
      const sent_Prompt = customPrompt
        ? `${historyText}\nUser: ${customPrompt}`
        : historyText || "请总结当前图片内容";

      console.log("Uploading with:", {
        mode,
        sent_Prompt,
        if_ask: customPrompt ? 1 : 0,
      });

      // Call API
      const result = await uploadImage(blob, mode, sent_Prompt, customPrompt);
      console.log("Upload success:", result);

      // Update history with user's message if there was one
      const newMessages = [];
      if (customPrompt.trim()) {
        newMessages.push({
          role: "user",
          content: customPrompt,
          timestamp: Date.now(),
        });
      }

      // Add AI's response from result.message
      if (result && result.message) {
        newMessages.push({
          role: "ai",
          content: result.message,
          timestamp: Date.now(),
        });

        // Try to extract code from the response if in code extractor mode
        if (mode === "code_extractor") {
          const codeMatch = result.message.match(/```[\w]*\n([\s\S]*?)```/);
          if (codeMatch && codeMatch[1]) {
            setExtractedCode(codeMatch[1]);
          } else {
            // Fallback: assume the whole message might be code if it looks like it,
            // or just set the message as comments if no code block found
            setExtractedCode(
              `// 未检测到明确的代码块\n// AI回复内容:\n/*\n${result.message}\n*/`
            );
          }
        }
      }

      setHistory((prev) => [...prev, ...newMessages]);
      setCustomPrompt(""); // Clear input
    } catch (error) {
      console.error("Upload failed:", error);
      alert("上传失败，请检查控制台");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("确定要清空所有对话记录吗？")) {
      setHistory([]);
      localStorage.removeItem("chat_history");
    }
  };

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className='min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950'>
      <div className='w-full px-6 py-8'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className='mb-8 flex items-end gap-4'
        >
          <h2 className='text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight'>
            视频理解助手
          </h2>
          <p className='text-slate-400 pb-1.5 font-medium'>
            让视频内容一目了然
          </p>
        </motion.div>

        <div className='grid grid-cols-[180px_1fr_400px] gap-6 h-[calc(100vh-12rem)]'>
          {/* 左侧边栏：截图画廊 + 补充提问 (固定 180px) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className='h-full flex flex-col gap-4 overflow-hidden'
          >
            {/* 补充问题输入框 */}
            <div className='h-[200px] flex-shrink-0 relative group z-10'>
              <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 blur'></div>
              <div className='relative bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-lg h-full'>
                {isLoading && (
                  <div className='absolute top-0 left-0 right-0 h-1 z-20'>
                    <div className='h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 bg-[length:200%_100%] animate-gradient-x'></div>
                  </div>
                )}
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  disabled={isLoading}
                  placeholder={
                    isLoading ? "正在处理中..." : "在此输入补充问题..."
                  }
                  className='w-full h-full bg-transparent p-4 text-slate-200 focus:outline-none resize-none text-sm leading-relaxed placeholder:text-slate-600 disabled:opacity-50'
                />
                <div className='absolute bottom-0 left-0 right-0 bg-slate-800/50 px-3 py-2 flex justify-between items-center border-t border-slate-700/50 backdrop-blur-sm'>
                  <span className='text-xs text-slate-500 font-medium pl-1'>
                    {customPrompt.length} 字
                  </span>
                  <div className='flex items-center gap-2'>
                    <span className='text-[10px] text-slate-500 bg-slate-700/50 px-2 py-1 rounded'>
                      随截图发送
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 截图画廊 */}
            <div className='flex-1 min-h-0'>
              <ScreenshotGallery
                screenshots={screenshots}
                onUpload={handleUploadScreenshot}
              />
            </div>
          </motion.div>

          {/* 中间主要区域：视频 + 聊天 (自适应) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className='h-full flex flex-col gap-4 min-w-0'
          >
            {/* 视频区域：自适应剩余高度 */}
            <div className='flex-1 min-h-0'>
              <VideoPlayer
                videoUrl={videoUrl}
                videoRef={videoRef}
                canvasRef={canvasRef}
                onFileUpload={handleFileUpload}
                onTimeUpdate={handleTimeUpdate}
                onSeeked={handleSeeked}
                onClear={handleClear}
                onCaptureAndAnalyze={handleCaptureAndAnalyze}
              />
            </div>

            {/* 聊天区域：固定高度，根据模式切换显示内容 */}
            <div className='h-[450px] flex-shrink-0'>
              {showCodeEditor ? (
                <div className='h-full flex gap-4'>
                  {/* 代码编辑器 (占大部分宽度) */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='flex-1 min-w-0'
                  >
                    <CodeEditorPanel code={extractedCode} />
                  </motion.div>

                  {/* 聊天面板 (缩小版，占小部分宽度) */}
                  <motion.div
                    className='w-[300px] flex-shrink-0'
                    initial={{ width: "100%" }}
                    animate={{ width: "300px" }}
                  >
                    <ChatPanel
                      history={history}
                      onClearHistory={handleClearHistory}
                      isLoading={isLoading}
                    />
                  </motion.div>
                </div>
              ) : (
                <ChatPanel
                  history={history}
                  onClearHistory={handleClearHistory}
                  isLoading={isLoading}
                />
              )}
            </div>
          </motion.div>

          {/* 右侧边栏：功能选择 (固定 400px) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className='h-full'
          >
            <AssistantPanel mode={mode} setMode={setMode} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
