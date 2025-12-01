'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Check, Copy } from 'lucide-react';
import { Button } from './button';

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export function MarkdownMessage({ content, className = '' }: MarkdownMessageProps) {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Headings with proper hierarchy
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 mt-6 text-[#1F2937] border-b border-[#1A73E8]/30 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-3 mt-5 text-[#1F2937]">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mb-2 mt-4 text-[#1F2937]">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold mb-2 mt-3 text-[#1F2937]">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-semibold mb-2 mt-3 text-[#6B7280]">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-semibold mb-2 mt-3 text-[#6B7280]">{children}</h6>
          ),

          // Paragraphs with proper spacing
          p: ({ children }) => (
            <p className="mb-4 text-[#1F2937] leading-relaxed last:mb-0">{children}</p>
          ),

          // Strong (bold) text with gold accent
          strong: ({ children }) => (
            <strong className="font-semibold text-[#1F2937]">{children}</strong>
          ),

          // Emphasis (italic) text
          em: ({ children }) => <em className="italic text-[#6B7280]">{children}</em>,

          // Links with hover effects
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A73E8] hover:text-[#3B82F6] underline decoration-[#1A73E8]/30 hover:decoration-[#1A73E8] transition-colors duration-200 font-medium"
            >
              {children}
            </a>
          ),

          // Unordered lists with custom bullets
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 space-y-2 list-none">{children}</ul>
          ),
          li: ({ children, node }) => {
            const isOrdered = node?.position?.start.column !== undefined;
            return (
              <li className="relative pl-2">
                {!isOrdered && (
                  <span className="absolute -left-4 top-[0.6em] h-1.5 w-1.5 rounded-full bg-[#1A73E8]" />
                )}
                <span className="text-[#1F2937]">{children}</span>
              </li>
            );
          },

          // Ordered lists with gold numbering
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 space-y-2 list-decimal marker:text-[#1A73E8] marker:font-semibold">
              {children}
            </ol>
          ),

          // Blockquotes with luxury styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#1A73E8] pl-4 py-2 my-4 italic text-[#6B7280] bg-[#F9FAFB] rounded-r">
              {children}
            </blockquote>
          ),

          // Code blocks with syntax highlighting and copy button
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const codeId = `code-${Math.random().toString(36).substring(7)}`;

            if (!inline && match) {
              return (
                <div className="relative group my-4">
                  <div className="flex items-center justify-between bg-white border border-[#1A73E8]/20 shadow-md px-4 py-2 rounded-t-lg">
                    <span className="text-xs font-mono uppercase tracking-wide text-[#1A73E8] font-semibold">
                      {match[1]}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(codeString, codeId)}
                      className="h-7 px-2 text-[#6B7280] hover:text-[#1A73E8] hover:bg-[#1A73E8]/10"
                    >
                      {copiedCode === codeId ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          <span className="text-xs">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          <span className="text-xs">Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="bg-[#1A1A1A] text-[#F9FAFB] p-4 rounded-b-lg overflow-x-auto border border-t-0 border-[#1A73E8]/20">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }

            // Inline code
            return (
              <code
                className="bg-[#F9FAFB] text-[#1F2937] px-1.5 py-0.5 rounded text-sm font-mono border border-[#1A73E8]/20"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Horizontal rule
          hr: () => <hr className="my-6 border-t border-[#1A73E8]/30" />,

          // Tables with luxury styling
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-[#1A73E8]/30 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#1A73E8]/10">{children}</thead>
          ),
          tbody: ({ children }) => <tbody className="divide-y divide-[#1A73E8]/20">{children}</tbody>,
          tr: ({ children }) => (
            <tr className="hover:bg-[#F9FAFB] transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F2937] border border-[#1A73E8]/30">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-[#1F2937] border border-[#1A73E8]/20">
              {children}
            </td>
          ),

          // Images with rounded corners
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg my-4 border border-[#1A73E8]/20"
            />
          ),

          // Strikethrough text
          del: ({ children }) => (
            <del className="line-through text-[#6B7280]">{children}</del>
          ),

          // Task lists
          input: ({ type, checked, disabled }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  className="mr-2 accent-[#1A73E8]"
                  readOnly
                />
              );
            }
            return null;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
