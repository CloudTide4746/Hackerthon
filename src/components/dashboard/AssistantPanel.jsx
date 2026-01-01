/** @format */

import React from "react";
import {
  Bot,
  Sparkles,
  BrainCircuit,
  Languages,
  Scan,
  User,
  BookOpen,
  FileText,
  Calculator,
  BarChart,
  ShoppingBag,
} from "lucide-react";

export function AssistantPanel({ mode, setMode }) {
  const assistants = [
    {
      category: "看视频常用",
      items: [
        {
          id: "general-explainer",
          name: "视频内容解说",
          desc: "看不懂在演什么？AI帮你解释场景和剧情",
          icon: BrainCircuit,
        },
        {
          id: "language-translator",
          name: "外语翻译助手",
          desc: "识别外语字幕或对话，实时翻译成中文",
          icon: Languages,
        },
        {
          id: "object-identifier",
          name: "物品识别助手",
          desc: "画面里是什么东西？AI告诉你名称和用途",
          icon: Scan,
        },
        {
          id: "character-analyzer",
          name: "人物识别助手",
          desc: "这是哪位演员/人物？AI帮你识别和介绍",
          icon: User,
        },
      ],
    },
    {
      category: "学习好帮手",
      items: [
        {
          id: "lecture-notes",
          name: "课程笔记助手",
          desc: "把教学视频截图变笔记，提取重点知识点",
          icon: BookOpen,
        },
        {
          id: "text-extractor",
          name: "文字提取助手",
          desc: "提取PPT、文档中的文字，方便复习和记录",
          icon: FileText,
        },
        {
          id: "math-helper",
          name: "数学解题助手",
          desc: "看不懂数学公式？AI逐步讲解解题方法",
          icon: Calculator,
        },
        {
          id: "diagram-explainer",
          name: "图表解释助手",
          desc: "看不懂图表数据？AI分析趋势和结论",
          icon: BarChart,
        },
      ],
    },
    {
      category: "生活小助手",
      items: [
        {
          id: "product-identifier",
          name: "商品识别助手",
          desc: "种草了？AI帮你识别商品并找同款",
          icon: ShoppingBag,
        },
      ],
    },
  ];

  return (
    <div className='glass-card rounded-2xl p-6 h-full flex flex-col shadow-2xl shadow-black/20 ring-1 ring-white/5 relative overflow-hidden'>
      {/* 背景装饰 */}
      <div className='absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none'></div>

      <div className='flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50 relative z-10'>
        <div className='p-2 bg-indigo-500/10 rounded-lg'>
          <Sparkles className='w-6 h-6 text-indigo-400' />
        </div>
        <div>
          <h3 className='text-xl font-bold text-slate-100 tracking-tight'>
            功能模式
          </h3>
          <p className='text-xs text-slate-400'>选择适合当前场景的AI助手</p>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 relative z-10'>
        <div className='space-y-6'>
          {assistants.map((category, idx) => (
            <div key={idx} className='space-y-3'>
              <h4 className='text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 pl-1'>
                <span className='w-1.5 h-1.5 rounded-full bg-indigo-500'></span>
                {category.category}
              </h4>
              <div className='grid grid-cols-1 gap-3'>
                {category.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMode(item.id)}
                    className={`text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                      mode === item.id
                        ? "bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-900/10"
                        : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50 hover:translate-x-1"
                    }`}
                  >
                    {mode === item.id && (
                      <div className='absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse'></div>
                    )}
                    <div className='flex items-start gap-3'>
                      <div
                        className={`mt-1 p-2.5 rounded-xl transition-colors duration-300 ${
                          mode === item.id
                            ? "bg-indigo-500/20 text-indigo-300"
                            : "bg-slate-700/30 text-slate-400 group-hover:text-slate-300"
                        }`}
                      >
                        <item.icon className='w-5 h-5' />
                      </div>
                      <div>
                        <div
                          className={`font-bold mb-1 transition-colors duration-300 ${
                            mode === item.id
                              ? "text-indigo-200"
                              : "text-slate-200 group-hover:text-white"
                          }`}
                        >
                          {item.name}
                        </div>
                        <div className='text-xs text-slate-400 leading-relaxed line-clamp-2'>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
