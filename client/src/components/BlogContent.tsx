import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MDXProvider } from '@mdx-js/react';
import * as BlogComponents from '@/components/blog';

interface BlogContentProps {
  content: string | React.ComponentType;
}

export default function BlogContent({ content }: BlogContentProps) {
  // If content is a React component (MDX), render it with MDX provider
  if (typeof content === 'function') {
    const ContentComponent = content as React.ComponentType;
    return (
      <MDXProvider components={BlogComponents}>
        <div className="prose prose-lg max-w-none">
          <ContentComponent />
        </div>
      </MDXProvider>
    );
  }

  // Otherwise, render as markdown string
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children, ...props }) => (
          <h1
            className="text-5xl md:text-6xl font-black text-slate-900 mt-16 mb-8 leading-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
            {...props}
          >
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => {
          const text = String(children);
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return (
            <h2
              id={id}
              className="text-3xl md:text-4xl font-bold text-slate-900 mt-14 mb-6 flex items-center gap-3 group scroll-mt-24"
              {...props}
            >
              <span className="text-primary text-4xl opacity-30 group-hover:opacity-100 transition-opacity">#</span>
              {children}
            </h2>
          );
        },
        h3: ({ children, ...props }) => {
          const text = String(children);
          const isBefore = text.includes('Before') || text.includes('Option A');
          const isAfter = text.includes('After') || text.includes('Option B');
          const isStep = text.includes('Step') || text.includes('Week');

          let className = "text-2xl md:text-3xl font-bold text-slate-800 mt-10 mb-4 pl-4 border-l-4 ";
          let borderColor = "border-primary";

          if (isBefore) {
            borderColor = "border-red-500";
            className = "text-2xl md:text-3xl font-bold text-red-700 mt-10 mb-4 pl-4 border-l-4 bg-red-50 py-2 rounded-r-lg";
          } else if (isAfter) {
            borderColor = "border-green-500";
            className = "text-2xl md:text-3xl font-bold text-green-700 mt-10 mb-4 pl-4 border-l-4 bg-green-50 py-2 rounded-r-lg";
          } else if (isStep) {
            borderColor = "border-blue-500";
            className = "text-2xl md:text-3xl font-bold text-blue-700 mt-10 mb-4 pl-4 border-l-4 bg-blue-50 py-2 rounded-r-lg";
          }

          return (
            <h3
              className={cn(className, borderColor)}
              {...props}
            >
              {children}
            </h3>
          );
        },
        p: ({ children, ...props }) => (
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-6" {...props}>
            {children}
          </p>
        ),
        strong: ({ children, ...props }) => (
          <strong className="font-bold text-slate-900" {...props}>
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
          <li
            className="flex items-start gap-3 text-lg text-slate-700"
            {...props}
          >
            <span className="text-primary text-xl mt-1 flex-shrink-0">•</span>
            <span className="leading-relaxed">{children}</span>
          </li>
        ),
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="my-10 p-6 bg-gradient-to-r from-primary/5 via-blue-50 to-purple-50 border-l-4 border-primary rounded-lg shadow-sm"
            {...props}
          >
            <div className="text-xl md:text-2xl text-slate-800 italic font-medium">
              {children}
            </div>
          </blockquote>
        ),
        code: ({ inline, children, ...props }: any) => {
          if (inline) {
            return (
              <code className="text-primary bg-slate-100 px-2 py-1 rounded-md text-base font-mono" {...props}>
                {children}
              </code>
            );
          }
          // Check if it's a pricing comparison block
          const content = String(children);
          const isPricing = content.includes('$') && (content.includes('Total:') || content.includes('Cost:'));

          if (isPricing) {
            return (
              <pre
                className="block my-8 p-8 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl shadow-lg"
                {...props}
              >
                <code className="text-slate-800 font-mono text-base md:text-lg whitespace-pre leading-loose">
                  {children}
                </code>
              </pre>
            );
          }

          return (
            <code
              className="block my-8 p-6 bg-slate-900 text-green-400 rounded-xl shadow-xl font-mono text-sm md:text-base overflow-x-auto"
              {...props}
            >
              {children}
            </code>
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
          <div className="my-8 max-w-3xl mx-auto">
            <img
              src={src}
              alt={alt}
              className="w-full rounded-lg shadow-lg max-h-[400px] object-cover"
              {...props}
            />
          </div>
        ),
        table: ({ children, ...props }) => (
          <div className="my-12 overflow-x-auto rounded-2xl shadow-2xl border border-slate-200">
            <table className="w-full border-collapse bg-white" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-gradient-to-r from-primary via-blue-600 to-blue-700" {...props}>
            {children}
          </thead>
        ),
        tbody: ({ children, ...props }) => (
          <tbody className="divide-y divide-slate-200 bg-white" {...props}>
            {children}
          </tbody>
        ),
        tr: ({ children, ...props }) => (
          <tr className="hover:bg-blue-50/50 transition-all duration-200" {...props}>
            {children}
          </tr>
        ),
        th: ({ children, ...props }) => (
          <th className="px-6 py-5 text-left font-bold text-white text-base md:text-lg tracking-wide" {...props}>
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td className="px-6 py-5 text-slate-800 text-base md:text-lg font-medium leading-relaxed" {...props}>
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