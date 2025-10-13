import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children, ...props }) => (
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-black text-slate-900 mt-16 mb-8 leading-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
            {...props}
          >
            {children}
          </motion.h1>
        ),
        h2: ({ children, ...props }) => (
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mt-14 mb-6 flex items-center gap-3 group"
            {...props}
          >
            <span className="text-primary text-4xl opacity-30 group-hover:opacity-100 transition-opacity">#</span>
            {children}
          </motion.h2>
        ),
        h3: ({ children, ...props }) => (
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-slate-800 mt-10 mb-4 pl-4 border-l-4 border-primary"
            {...props}
          >
            {children}
          </motion.h3>
        ),
        p: ({ children, ...props }) => (
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-6" {...props}>
            {children}
          </p>
        ),
        strong: ({ children, ...props }) => (
          <strong className="font-bold text-slate-900 bg-yellow-100 px-1 rounded" {...props}>
            {children}
          </strong>
        ),
        em: ({ children, ...props }) => (
          <em className="italic text-primary font-medium" {...props}>
            {children}
          </em>
        ),
        ul: ({ children, ...props }) => (
          <ul className="my-8 space-y-3" {...props}>
            {children}
          </ul>
        ),
        li: ({ children, ...props }) => (
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 text-lg text-slate-700"
            {...props}
          >
            <span className="text-primary text-2xl mt-0.5 flex-shrink-0">→</span>
            <span className="leading-relaxed">{children}</span>
          </motion.li>
        ),
        blockquote: ({ children, ...props }) => (
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="my-10 p-6 bg-gradient-to-r from-primary/5 via-blue-50 to-purple-50 border-l-4 border-primary rounded-lg shadow-sm"
            {...props}
          >
            <div className="text-xl md:text-2xl text-slate-800 italic font-medium">
              {children}
            </div>
          </motion.blockquote>
        ),
        code: ({ inline, children, ...props }: any) => {
          if (inline) {
            return (
              <code className="text-primary bg-slate-100 px-2 py-1 rounded-md text-base font-mono" {...props}>
                {children}
              </code>
            );
          }
          return (
            <motion.code
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="block my-8 p-6 bg-slate-900 text-green-400 rounded-xl shadow-xl font-mono text-sm md:text-base overflow-x-auto"
              {...props}
            >
              {children}
            </motion.code>
          );
        },
        hr: () => (
          <div className="my-16 flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-full" />
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse delay-300" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-full" />
          </div>
        ),
        img: ({ src, alt, ...props }) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="my-10"
          >
            <img
              src={src}
              alt={alt}
              className="w-full rounded-xl shadow-2xl"
              {...props}
            />
            {alt && (
              <p className="text-center text-sm text-slate-500 mt-3 italic">{alt}</p>
            )}
          </motion.div>
        ),
        table: ({ children, ...props }) => (
          <div className="my-8 overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg" {...props}>
              {children}
            </table>
          </div>
        ),
        th: ({ children, ...props }) => (
          <th className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 text-left font-semibold" {...props}>
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td className="p-4 border-b border-slate-200 text-slate-700" {...props}>
            {children}
          </td>
        ),
        a: ({ href, children, ...props }) => (
          <a
            href={href}
            className="text-primary font-semibold underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
            {...props}
          >
            {children}
            <span className="text-xs">↗</span>
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}