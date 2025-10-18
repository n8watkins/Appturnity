import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(scrollProgress, 100));
    };

    // Update on scroll
    window.addEventListener('scroll', updateProgress);

    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200/20 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-blue-600"
          style={{ width: `${progress}%` }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
        />
      </div>

      {/* Floating progress indicator */}
      <motion.div
        className="fixed bottom-8 right-8 bg-white shadow-lg rounded-full p-3 z-40 hidden md:flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 5 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <svg className="w-12 h-12 -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-slate-200"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
            className="text-primary transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xs font-semibold text-slate-700">
          {Math.round(progress)}%
        </span>
      </motion.div>
    </>
  );
}