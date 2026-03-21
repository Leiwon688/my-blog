import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = '用 Markdown 写点什么...',
  minHeight = 400,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 快捷键工具栏
  const insertMarkdown = (before: string, after = '', placeholder = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const newVal = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newVal);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const toolbarItems = [
    { label: 'B', title: '粗体', action: () => insertMarkdown('**', '**', '粗体文字') },
    { label: 'I', title: '斜体', action: () => insertMarkdown('*', '*', '斜体文字') },
    { label: 'H1', title: '一级标题', action: () => insertMarkdown('\n# ', '', '标题') },
    { label: 'H2', title: '二级标题', action: () => insertMarkdown('\n## ', '', '标题') },
    { label: '`', title: '行内代码', action: () => insertMarkdown('`', '`', 'code') },
    { label: '```', title: '代码块', action: () => insertMarkdown('\n```\n', '\n```', '代码') },
    { label: '—', title: '分割线', action: () => insertMarkdown('\n\n---\n\n') },
    { label: '•', title: '无序列表', action: () => insertMarkdown('\n- ', '', '列表项') },
    { label: '1.', title: '有序列表', action: () => insertMarkdown('\n1. ', '', '列表项') },
    { label: '❝', title: '引用', action: () => insertMarkdown('\n> ', '', '引用内容') },
    { label: '🔗', title: '链接', action: () => insertMarkdown('[', '](url)', '链接文字') },
  ];

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 border-b border-zinc-200">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarItems.map(item => (
            <button
              key={item.label}
              type="button"
              title={item.title}
              onClick={item.action}
              className="px-2 py-1 text-xs font-mono text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
              tab === 'write' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium ${
              tab === 'preview' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            预览
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {tab === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full px-4 py-3 text-sm text-zinc-800 font-mono leading-relaxed resize-y outline-none bg-white placeholder:text-zinc-300"
        />
      ) : (
        <div
          style={{ minHeight }}
          className="px-4 py-3 overflow-auto bg-white"
        >
          {value ? (
            <div className="prose prose-zinc prose-sm max-w-none
              prose-headings:font-bold prose-headings:text-zinc-900
              prose-p:text-zinc-700 prose-p:leading-relaxed
              prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-xl prose-pre:p-4
              prose-pre:code:bg-transparent prose-pre:code:text-zinc-100 prose-pre:code:p-0
              prose-blockquote:border-l-blue-400 prose-blockquote:text-zinc-500
              prose-strong:text-zinc-900
              prose-table:text-sm prose-th:bg-zinc-50
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-zinc-300 text-sm italic pt-4">暂无内容预览</p>
          )}
        </div>
      )}
    </div>
  );
}
