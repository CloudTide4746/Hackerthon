import React, { useEffect, useRef } from "react";
import { MessageSquare, Send, Trash2, Bot, User } from "lucide-react";

export function ChatPanel({ history, customPrompt, setCustomPrompt, onClearHistory }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className='glass-card rounded-2xl p-6 h-full min-h-[500px] flex flex-col shadow-2xl shadow-black/20 ring-1 ring-white/5 relative overflow-hidden'>
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className='flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50 relative z-10'>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <MessageSquare className='w-6 h-6 text-purple-400' />
          </div>
          <div>
            <h3 className='text-xl font-bold text-slate-100 tracking-tight'>对话记录</h3>
            <p className="text-xs text-slate-400">记录您的提问与分析结果</p>
          </div>
        </div>
        <button 
          onClick={onClearHistory}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="清空历史"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* 聊天列表 */}
      <div className='flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4 space-y-4 relative z-10'>
        {history.length === 0 ? (
          <div className='h-full flex flex-col items-center justify-center text-slate-500/50 gap-4'>
            <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center">
              <MessageSquare className="w-10 h-10 opacity-50" />
            </div>
            <div className="text-center">
              <p className='text-sm font-medium mb-1'>暂无对话记录</p>
              <p className="text-xs text-slate-600">您的提问和AI的分析结果将出现在这里</p>
            </div>
          </div>
        ) : (
          history.map((item, index) => (
            <div 
              key={index} 
              className={`flex gap-3 ${item.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg ${
                item.role === 'user' 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}>
                {item.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${
                item.role === 'user'
                  ? 'bg-indigo-600/20 text-indigo-100 rounded-tr-none border border-indigo-500/20'
                  : 'bg-slate-800/50 text-slate-200 rounded-tl-none border border-slate-700/50'
              }`}>
                {item.content}
                <div className="text-[10px] opacity-40 mt-2 text-right">
                  {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 输入区域 */}
      <div className='relative group z-10'>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 blur"></div>
        <div className="relative bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-lg">
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="在此输入您的补充问题..."
            className='w-full h-24 bg-transparent p-4 text-slate-200 focus:outline-none resize-none text-sm leading-relaxed placeholder:text-slate-600'
          />
          <div className="bg-slate-800/50 px-3 py-2 flex justify-between items-center border-t border-slate-700/50">
            <span className="text-xs text-slate-500 font-medium pl-1">
              {customPrompt.length} 字
            </span>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
                 随截图发送
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
