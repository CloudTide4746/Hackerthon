/** @format */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlayCircle, Zap, Code, ScanEye } from "lucide-react";

export function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className='min-h-screen relative overflow-hidden bg-slate-950'>
      {/* Background decoration */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none'>
        <div className='absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse' style={{ animationDelay: "2s" }} />
      </div>

      <div className='container mx-auto px-4 py-24 relative z-10'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='text-center max-w-4xl mx-auto'
        >
          <motion.div variants={itemVariants} className='inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium'>
            <Zap className="w-4 h-4" />
            2026 Hackerthon Project
          </motion.div>
          
          <motion.h1 variants={itemVariants} className='text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'>
              Video OS
            </span>
            <br />
            <span className='text-slate-100 text-4xl md:text-6xl'>
              重塑视频交互体验
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className='text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto'>
            基于 AI 的智能视频操作系统。
            <br />
            代码一键提取、报错自动诊断、操作步骤拆解，让视频内容一目了然。
          </motion.p>
          
          <motion.div variants={itemVariants} className='flex gap-6 justify-center'>
            <Link
              to='/dashboard'
              className='px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center gap-2 group'
            >
              <PlayCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              开始体验
            </Link>
            <a
              href='https://github.com/your-repo'
              target="_blank"
              rel="noreferrer"
              className='px-8 py-4 bg-slate-800/50 text-slate-200 border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-indigo-500/50 transition-all hover:scale-105 backdrop-blur-sm flex items-center gap-2'
            >
              <Code className="w-5 h-5" />
              查看源码
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='mt-32 grid grid-cols-1 md:grid-cols-3 gap-8'
        >
          {[
            {
              title: "代码一键提取",
              desc: "识别屏幕上的代码，保持缩进和格式，直接可复制，编程学习效率倍增。",
              icon: <Code className="w-8 h-8 text-indigo-400" />,
              color: "indigo"
            },
            {
              title: "视觉内容理解",
              desc: "实时分析视频画面，识别报错信息、数学公式和关键操作步骤。",
              icon: <ScanEye className="w-8 h-8 text-purple-400" />,
              color: "purple"
            },
            {
              title: "智能问答交互",
              desc: "针对当前画面随时提问，AI 结合上下文给出精准解答，打破学习瓶颈。",
              icon: <Zap className="w-8 h-8 text-pink-400" />,
              color: "pink"
            }
          ].map((feature, idx) => (
            <div key={idx} className='glass-card p-8 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-2'>
              <div className={`w-16 h-16 bg-${feature.color}-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-${feature.color}-500/20 transition-colors`}>
                {feature.icon}
              </div>
              <h3 className='text-2xl font-bold text-slate-100 mb-3'>{feature.title}</h3>
              <p className='text-slate-400 leading-relaxed'>
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
