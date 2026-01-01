import React from 'react';

export function AssistantPanel({ 
  mode, 
  setMode, 
  history, 
  customPrompt, 
  setCustomPrompt 
}) {
  return (
    <div className='glass-card rounded-2xl p-6 h-full min-h-[600px] flex flex-col sticky top-8'>
      <div className="flex items-center gap-2 mb-6 border-b border-slate-700/50 pb-4">
         <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
         </svg>
         <h3 className="text-xl font-bold text-slate-100">智能助手控制台</h3>
      </div>

      {/* 模式选择 */}
      <div className="bg-slate-900/50 p-1 rounded-xl flex mb-6 border border-slate-700/50">
        <button
          onClick={() => setMode("recognition")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            mode === "recognition"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          自定义提问
        </button>
      </div>

      {/* 动态内容区域 */}
      <div className="flex-1 flex flex-col gap-4">
        {mode === "recognition" ? (
          <div className="flex-1 bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-slate-200 mb-2">智能分析模式已就绪</h4>
            <p className="text-slate-400 text-sm max-w-xs">
              点击左侧任意关键帧的“分析”按钮，AI 将自动识别画面内容并生成摘要。
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4">
            {/* 历史记录展示 */}
            <div className="flex-1 bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 overflow-y-auto max-h-[300px] custom-scrollbar">
              {history.length === 0 ? (
                <p className="text-slate-500 text-sm text-center mt-10">暂无提问历史</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center text-purple-400 text-xs">
                        Q{index + 1}
                      </div>
                      <div className="bg-slate-700/50 rounded-lg rounded-tl-none p-3 text-sm text-slate-300">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 输入框 */}
            <div className="relative">
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="输入您的问题，例如：'画面中的人物在做什么？'"
                className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                {customPrompt.length} 字
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                提示：您的提问将与历史记录合并，作为完整的上下文发送给 AI。点击左侧截图的“分析”按钮即可发送。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
