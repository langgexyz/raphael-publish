import React from 'react';
import { Wand2 } from 'lucide-react';
import { handleSmartPaste } from '../lib/htmlToMarkdown';

const DATA_IMAGE_TOKEN_REGEX = /!\[[^\]]*?\]\(data:image\/[^\)]+\)/g;

interface TokenRange {
    start: number;
    end: number;
}

function findDataImageRange(text: string, position: number | null | undefined): TokenRange | null {
    if (position == null || position < 0 || position > text.length) return null;
    DATA_IMAGE_TOKEN_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = DATA_IMAGE_TOKEN_REGEX.exec(text)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        if (position >= start && position < end) {
            return { start, end };
        }
    }
    return null;
}

function normalizeBoundaryWhitespace(value: string, trimEnd: boolean): string {
    const regex = trimEnd ? /\s+$/ : /^\s+/;
    return value.replace(regex, (match) => {
        if (match.includes('\n\n')) return '\n\n';
        if (match.includes('\n')) return '\n';
        return '';
    });
}

interface EditorPanelProps {
    markdownInput: string;
    onInputChange: (value: string) => void;
    editorScrollRef: React.RefObject<HTMLTextAreaElement>;
    onEditorScroll: () => void;
    scrollSyncEnabled: boolean;
}

export default function EditorPanel({ markdownInput, onInputChange, editorScrollRef, onEditorScroll, scrollSyncEnabled }: EditorPanelProps) {
    const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        handleSmartPaste(e, markdownInput, onInputChange);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== 'Backspace' && e.key !== 'Delete') return;

        const textarea = e.currentTarget;
        const { selectionStart, selectionEnd } = textarea;
        const positions = new Set<number>([selectionStart, selectionEnd]);

        if (selectionStart !== selectionEnd) {
            positions.add(selectionStart + 1);
            positions.add(selectionEnd - 1);
        } else {
            if (e.key === 'Backspace' && selectionStart > 0) {
                positions.add(selectionStart - 1);
            }
            if (e.key === 'Delete') {
                positions.add(selectionStart);
            }
        }

        let targetRange: TokenRange | null = null;
        for (const pos of positions) {
            const range = findDataImageRange(markdownInput, pos);
            if (range) {
                targetRange = range;
                break;
            }
        }

        if (!targetRange) return;

        e.preventDefault();
        const before = normalizeBoundaryWhitespace(markdownInput.slice(0, targetRange.start), true);
        const after = normalizeBoundaryWhitespace(markdownInput.slice(targetRange.end), false);
        const nextValue = before + after;
        onInputChange(nextValue);

        const nextCursor = before.length;
        const setCursor = () => {
            textarea.selectionStart = textarea.selectionEnd = Math.min(nextCursor, nextValue.length);
        };
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(setCursor);
        } else {
            setTimeout(setCursor, 0);
        }
    };

    return (
        <div className="border-r border-[#00000015] dark:border-[#ffffff15] flex flex-col relative z-30 bg-transparent flex-1 min-h-0">
            <textarea
                ref={editorScrollRef}
                className="w-full flex-1 p-8 md:p-10 resize-none bg-transparent outline-none font-mono text-[15px] md:text-[16px] leading-[1.8] no-scrollbar text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#6e6e73]"
                value={markdownInput}
                onChange={(e) => onInputChange(e.target.value)}
                onPaste={onPaste}
                onKeyDown={handleKeyDown}
                onScroll={scrollSyncEnabled ? onEditorScroll : undefined}
                placeholder="在这里输入 Markdown 内容..."
                spellCheck={false}
            />

            {/* Bottom Action / Info Bar for Editor */}
            <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-t border-[#00000010] dark:border-[#ffffff10] bg-[#fbfbfd]/50 dark:bg-[#1c1c1e]/50 backdrop-blur-md">
                <div className="flex items-center gap-2 min-w-0">
                    <Wand2 size={14} className="text-[#0066cc] dark:text-[#0a84ff] shrink-0" />
                    <span className="text-[12.5px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                        <span className="hidden sm:inline">支持直接粘贴 <span className="text-[#86868b] dark:text-[#a1a1a6]">飞书、Notion或Word等</span> 富文本，自动净化为 Markdown</span>
                        <span className="sm:hidden">支持直接粘贴 <span className="text-[#86868b] dark:text-[#a1a1a6]">飞书、Notion或Word等</span> 富文本，自动转化</span>
                    </span>
                </div>
                <div className="text-[12px] font-mono text-[#86868b] dark:text-[#a1a1a6]">
                    {markdownInput.length} 字
                </div>
            </div>
        </div>
    );
}
