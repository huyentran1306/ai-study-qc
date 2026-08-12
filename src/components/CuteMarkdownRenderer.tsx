import React from 'react';
import { Sparkles, Lightbulb, ShieldAlert, Terminal, CheckCircle2, ChevronRight, HelpCircle, Code, Star, Heart } from 'lucide-react';

interface CuteMarkdownRendererProps {
  content: string;
  isDarkMode?: boolean;
}

// Helper to pick cute icons based on title or text keywords
const getCuteIcon = (text: string, index: number) => {
  const lower = text.toLowerCase();
  if (lower.includes('token') || lower.includes('chia')) return '🧩';
  if (lower.includes('dự đoán') || lower.includes('predict') || lower.includes('xác suất')) return '🔮';
  if (lower.includes('context') || lower.includes('tool') || lower.includes('công cụ')) return '🛠️';
  if (lower.includes('biến đổi') || lower.includes('non-deterministic') || lower.includes('ngẫu nhiên')) return '🎲';
  if (lower.includes('hallucination') || lower.includes('ảo giác') || lower.includes('bịa')) return '👻';
  if (lower.includes('oracle') || lower.includes('sự thật') || lower.includes('sơ đồ')) return '🔮';
  if (lower.includes('pre-testing') || lower.includes('trước')) return '🌱';
  if (lower.includes('execution') || lower.includes('trong khi') || lower.includes('chạy')) return '⚡';
  if (lower.includes('post-testing') || lower.includes('sau')) return '🎉';
  if (lower.includes('planner')) return '🎯';
  if (lower.includes('implementer') || lower.includes('code')) return '💻';
  if (lower.includes('checker') || lower.includes('test')) return '🔍';
  if (lower.includes('judge') || lower.includes('nghiệm thu')) return '⚖️';
  if (lower.includes('fixer') || lower.includes('bug')) return '🚑';
  if (lower.includes('retro') || lower.includes('học')) return '📝';
  if (lower.includes('không') || lower.includes('🚫') || lower.includes('cấm')) return '🚫';

  const icons = ['✨', '💡', '📌', '🌟', '🚀', '🎯', '💫', '🎨', '🌸', '☘️'];
  return icons[index % icons.length];
};

// Cute inline formatter for bold **text** and code `code`
export const renderCuteFormattedText = (text: string, isDarkMode: boolean = false) => {
  // Regex to match **bold**, `code`, and *italic*
  const parts: (string | React.ReactNode)[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Check for **bold**
    const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
    if (boldMatch) {
      const boldText = boldMatch[2];
      parts.push(
        <span
          key={`bold-${keyIdx++}`}
          className={`font-bold px-1.5 py-0.5 rounded-md text-[11px] lg:text-xs inline-block transition-transform hover:scale-105 ${
            isDarkMode
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-2xs'
          }`}
        >
          {boldText}
        </span>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Check for `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      const codeText = codeMatch[1];
      parts.push(
        <code
          key={`code-${keyIdx++}`}
          className={`font-mono text-[11px] px-1.5 py-0.5 rounded border ${
            isDarkMode
              ? 'bg-slate-900 text-rose-300 border-slate-700'
              : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}
        >
          {codeText}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Next plain character
    const nextSpecial = remaining.search(/(\*\*|__|`)/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial > 0) {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
};

export const CuteMarkdownRenderer: React.FC<CuteMarkdownRendererProps> = ({ content, isDarkMode = false }) => {
  if (!content) return null;

  // Normalize markdown and split by lines to parse blocks cleanly
  const rawLines = content.trim().split('\n');
  const blocks: React.ReactNode[] = [];

  let currentBlockType: 'none' | 'code' | 'table' | 'list' = 'none';
  let codeBuffer: string[] = [];
  let tableBuffer: string[] = [];
  let listBuffer: { line: string; isProhibition: boolean }[] = [];

  const flushList = (keyPrefix: string) => {
    if (listBuffer.length === 0) return;

    const listItems = [...listBuffer];
    listBuffer = [];

    blocks.push(
      <div key={`list-${keyPrefix}-${blocks.length}`} className="grid grid-cols-1 gap-2.5 my-3">
        {listItems.map((item, idx) => {
          const lineText = item.line.replace(/^(\*|-|\+|\d+\.)\s+/, '').trim();
          const isProhibition = item.isProhibition || lineText.startsWith('🚫') || lineText.startsWith('❌');

          // Parse title vs description if pattern is **Title**: Description or **Title** - Description
          const colonMatch = lineText.match(/^(\*\*.*?\*\*|__.*?__|[^*:]+?):\s*(.*)/);
          let title = '';
          let desc = lineText;

          if (colonMatch) {
            title = colonMatch[1].replace(/[\*_]/g, '').trim();
            desc = colonMatch[2];
          }

          const icon = getCuteIcon(title || desc, idx);

          return (
            <div
              key={idx}
              className={`p-3 lg:p-3.5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 shadow-2xs flex items-start gap-3 ${
                isProhibition
                  ? isDarkMode
                    ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                    : 'bg-rose-50/70 border-rose-200/90 text-rose-950'
                  : isDarkMode
                  ? 'bg-slate-900/80 border-slate-800/90 text-slate-200'
                  : 'bg-white border-slate-200/80 text-slate-800 hover:border-indigo-200'
              }`}
            >
              {/* Icon badge */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-2xs border ${
                  isProhibition
                    ? isDarkMode
                      ? 'bg-rose-900/40 border-rose-700/50 text-rose-300'
                      : 'bg-rose-100 border-rose-200 text-rose-700'
                    : isDarkMode
                    ? 'bg-indigo-950/50 border-indigo-800/50 text-indigo-300'
                    : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                }`}
              >
                {icon}
              </div>

              {/* Content */}
              <div className="flex-1 text-xs lg:text-sm leading-relaxed">
                {title ? (
                  <div className="space-y-1">
                    <span
                      className={`inline-block font-bold text-xs px-2.5 py-0.5 rounded-lg border ${
                        isProhibition
                          ? isDarkMode
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-rose-100 text-rose-800 border-rose-200'
                          : isDarkMode
                          ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-200/80'
                      }`}
                    >
                      {title}
                    </span>
                    <p className={`mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {renderCuteFormattedText(desc, isDarkMode)}
                    </p>
                  </div>
                ) : (
                  <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                    {renderCuteFormattedText(lineText, isDarkMode)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const flushTable = (keyPrefix: string) => {
    if (tableBuffer.length === 0) return;

    const lines = [...tableBuffer];
    tableBuffer = [];

    // Filter out separator lines like |---|---|
    const rows = lines.filter((l) => !l.match(/^\|?\s*:?-+:?\s*(\||\+)/));
    if (rows.length === 0) return;

    const parseRow = (r: string) =>
      r
        .trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((cell) => cell.trim());

    const headerCells = parseRow(rows[0]);
    const bodyRows = rows.slice(1).map(parseRow);

    blocks.push(
      <div
        key={`table-${keyPrefix}-${blocks.length}`}
        className={`my-4 border rounded-2xl overflow-hidden shadow-2xs transition-colors ${
          isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200/90 bg-white'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={
                  isDarkMode
                    ? 'bg-indigo-950/60 text-indigo-200 border-b border-slate-800'
                    : 'bg-indigo-50/80 text-indigo-900 font-bold border-b border-indigo-100'
                }
              >
                {headerCells.map((cell, cIdx) => (
                  <th key={cIdx} className="p-3 font-bold tracking-tight">
                    {renderCuteFormattedText(cell, isDarkMode)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {bodyRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={`transition-colors ${
                    isDarkMode
                      ? rIdx % 2 === 0
                        ? 'bg-slate-900/40 hover:bg-slate-800/60'
                        : 'bg-slate-950/40 hover:bg-slate-800/60'
                      : rIdx % 2 === 0
                      ? 'bg-white hover:bg-indigo-50/30'
                      : 'bg-slate-50/50 hover:bg-indigo-50/30'
                  }`}
                >
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className={`p-3 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {renderCuteFormattedText(cell, isDarkMode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const flushCode = (keyPrefix: string) => {
    if (codeBuffer.length === 0) return;

    const codeText = codeBuffer.join('\n').trim();
    codeBuffer = [];

    blocks.push(
      <div key={`code-${keyPrefix}-${blocks.length}`} className="my-4 rounded-2xl overflow-hidden border border-slate-800 bg-[#0B0F19] shadow-md">
        {/* Cute terminal window bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#131B2E] border-b border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            <span className="ml-2 font-mono text-[10px] text-slate-400">flowchart / workflow.txt</span>
          </div>
          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/50">
            QA AI Pipeline
          </span>
        </div>
        <pre className="p-4 font-mono text-xs text-indigo-300 whitespace-pre overflow-x-auto leading-relaxed">
          {codeText}
        </pre>
      </div>
    );
  };

  // Process line by line
  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Code block check ```
    if (trimmed.startsWith('```')) {
      if (currentBlockType === 'code') {
        flushCode(`block-${i}`);
        currentBlockType = 'none';
      } else {
        flushList(`before-code-${i}`);
        flushTable(`before-code-${i}`);
        currentBlockType = 'code';
      }
      i++;
      continue;
    }

    if (currentBlockType === 'code') {
      codeBuffer.push(line);
      i++;
      continue;
    }

    // Table check |
    if (trimmed.startsWith('|')) {
      if (currentBlockType !== 'table') {
        flushList(`before-table-${i}`);
        currentBlockType = 'table';
      }
      tableBuffer.push(trimmed);
      i++;
      continue;
    } else if (currentBlockType === 'table') {
      flushTable(`after-table-${i}`);
      currentBlockType = 'none';
    }

    // List item check (*, -, +, 1.)
    if (trimmed.match(/^(\*|-|\+|\d+\.)\s+/)) {
      if (currentBlockType !== 'list') {
        currentBlockType = 'list';
      }
      listBuffer.push({ line: trimmed, isProhibition: trimmed.includes('🚫') });
      i++;
      continue;
    } else if (currentBlockType === 'list') {
      // If line is continuation of previous list item
      if (trimmed.length > 0 && !trimmed.startsWith('###') && !trimmed.startsWith('>') && !trimmed.startsWith('|')) {
        listBuffer[listBuffer.length - 1].line += ' ' + trimmed;
        i++;
        continue;
      } else {
        flushList(`after-list-${i}`);
        currentBlockType = 'none';
      }
    }

    // Empty lines reset buffers
    if (trimmed === '') {
      i++;
      continue;
    }

    // Heading ###
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#+\s*/, '');
      const icon = getCuteIcon(headingText, i);

      blocks.push(
        <div
          key={`heading-${i}`}
          className={`mt-5 mb-2.5 p-3 lg:p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
            isDarkMode
              ? 'bg-gradient-to-r from-indigo-950/60 to-slate-900 border-indigo-800/50 text-indigo-200'
              : 'bg-gradient-to-r from-indigo-50/90 to-purple-50/50 border-indigo-100 text-indigo-950 shadow-2xs'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-base shadow-2xs">
            {icon}
          </div>
          <h3 className="font-bold text-sm lg:text-base tracking-tight leading-snug">
            {headingText}
          </h3>
        </div>
      );
      i++;
      continue;
    }

    // Blockquote >
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      const isWarning = quoteText.includes('⚠️') || quoteText.includes('Tuyên ngôn') || quoteText.includes('Senior QA');

      blocks.push(
        <div
          key={`quote-${i}`}
          className={`my-3 p-4 rounded-2xl border flex items-start gap-3 shadow-2xs relative overflow-hidden ${
            isWarning
              ? isDarkMode
                ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                : 'bg-amber-50/90 border-amber-200 text-amber-950'
              : isDarkMode
              ? 'bg-indigo-950/30 border-indigo-800/50 text-indigo-200'
              : 'bg-indigo-50/80 border-indigo-100 text-indigo-950'
          }`}
        >
          <div className="text-xl shrink-0 mt-0.5">
            {isWarning ? '🐱' : '🤖'}
          </div>
          <div className="flex-1 text-xs lg:text-sm leading-relaxed space-y-1">
            <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {isWarning ? 'Góc Nhắc Nhở Mascot QA 🐱' : 'Góc Chia Sẻ Chuyên Gia 🤖'}
            </span>
            <div className="italic">
              {renderCuteFormattedText(quoteText, isDarkMode)}
            </div>
          </div>
        </div>
      );
      i++;
      continue;
    }

    // Regular Paragraph
    blocks.push(
      <p key={`p-${i}`} className={`my-2 leading-relaxed text-xs lg:text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {renderCuteFormattedText(trimmed, isDarkMode)}
      </p>
    );

    i++;
  }

  // Flush remaining buffers at end
  flushList('end');
  flushTable('end');
  flushCode('end');

  return <div className="space-y-2">{blocks}</div>;
};
