/** @format */

import { useState, useRef, useEffect } from "react";
import { uploadImage, dataURLtoBlob } from "../services/api";
import { VideoPlayer } from "../components/dashboard/VideoPlayer";
import { ScreenshotGallery } from "../components/dashboard/ScreenshotGallery";
import { AssistantPanel } from "../components/dashboard/AssistantPanel";
import { ChatPanel } from "../components/dashboard/ChatPanel";

export function Dashboard() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [screenshots, setScreenshots] = useState([]);

  // State: Mode, Custom Prompt, History
  const [mode, setMode] = useState("general-explainer");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: Math.round(time),
        url: imageUrl,
      },
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
          ...prev,
          {
            id: Date.now() + Math.random(),
            time: video.currentTime,
            url: imageUrl,
          },
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
      <div className='container mx-auto px-4 py-8 max-w-[1800px]'>
        <div className='mb-8 flex items-end gap-4'>
          <h2 className='text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight'>
            视频理解助手
          </h2>
          <p className='text-slate-400 pb-1.5 font-medium'>
            让视频内容一目了然
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* 左侧主要区域：视频 + 截图画廊 */}
          <div className='lg:col-span-8 flex flex-col gap-6'>
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
            <ScreenshotGallery
              screenshots={screenshots}
              onUpload={handleUploadScreenshot}
            />
          </div>

          {/* 右侧边栏：功能选择 + 聊天面板 */}
          <div className='lg:col-span-4 flex flex-col gap-6 h-[calc(100vh-8rem)] sticky top-4'>
            <div className='flex-shrink-0 max-h-[40%] flex flex-col'>
              <AssistantPanel mode={mode} setMode={setMode} />
            </div>
            <div className='flex-grow min-h-0 flex flex-col'>
              <ChatPanel
                history={history}
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                onClearHistory={handleClearHistory}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
