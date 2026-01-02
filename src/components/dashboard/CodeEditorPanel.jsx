/** @format */

import React from "react";
import Editor from "@monaco-editor/react";
import { Code, Copy, Check, Trash2 } from "lucide-react";
import { useState } from "react";

export function CodeEditorPanel({ code, language = "javascript", onClear }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='glass-card rounded-2xl h-full flex flex-col shadow-2xl shadow-black/20 ring-1 ring-white/5 relative overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-900/50'>
        <div className='flex items-center gap-2'>
          <div className='p-1.5 bg-indigo-500/10 rounded-lg'>
            <Code className='w-4 h-4 text-indigo-400' />
          </div>
          <span className='text-sm font-bold text-slate-200'>代码编辑器</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-slate-500 uppercase font-mono px-2 py-1 rounded bg-slate-800 border border-slate-700'>
            {language}
          </span>
          <button
            onClick={handleCopy}
            className='p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors'
            title='复制'
          >
            {copied ? (
              <Check className='w-4 h-4 text-green-400' />
            ) : (
              <Copy className='w-4 h-4' />
            )}
          </button>
          <button
            onClick={onClear}
            className='p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors'
            title='清空'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className='flex-1 relative'>
        <Editor
          height='100%'
          defaultLanguage={language}
          value={code}
          theme='vs-dark'
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: true,
            padding: { top: 16, bottom: 16 },
            backgroundColor: "transparent",
          }}
          // Monaco's default background needs override for transparency if desired,
          // but usually vs-dark is fine. To match glassmorphism, we might need CSS overrides.
        />
      </div>
    </div>
  );
}
