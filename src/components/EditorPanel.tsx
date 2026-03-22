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
    editorScrollRef?: React.RefObject<HTMLTextAreaElement>;
    onEditorScroll?: () => void;
    scrollSyncEnabled?: boolean;
    placeholder?: string;
    label?: string;
    hideFooter?: boolean;
}

export default function EditorPanel({ markdownInput, onInputChange, editorScrollRef, onEditorScroll, scrollSyncEnabled, placeholder, label, hideFooter }: EditorPanelProps) {
    const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        handleSmartPaste(e, markdownInput, onInputChange);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Cmd+B / Ctrl+B：切换加粗
        if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
            e.preventDefault();
            const textarea = e.currentTarget;
            const { selectionStart, selectionEnd, value } = textarea;
            const selected = value.slice(selectionStart, selectionEnd);
            const before2 = selectionStart >= 2 ? value.slice(selectionStart - 2, selectionStart) : '';
            const after2 = value.slice(selectionEnd, selectionEnd + 2);
            let newValue: string;
            let newStart: number;
            let newEnd: number;

            if (selected.startsWith('**') && selected.endsWith('**') && selected.length >= 4) {
                // 选区本身包含 **...** → 去掉首尾 **
                const inner = selected.slice(2, -2);
                newValue = value.slice(0, selectionStart) + inner + value.slice(selectionEnd);
                newStart = selectionStart;
                newEnd = selectionStart + inner.length;
            } else if (before2 === '**' && after2 === '**') {
                // ** 在选区两侧，选中的是完整 bold 内容 → 移除两侧 **
                newValue = value.slice(0, selectionStart - 2) + selected + value.slice(selectionEnd + 2);
                newStart = selectionStart - 2;
                newEnd = selectionEnd - 2;
            } else if (before2 === '**') {
                // 选区在 bold 开头，后面 bold 仍有剩余 → **[sel]rest** → [sel]**rest**
                const rest = value.slice(selectionEnd);
                if (rest.includes('**')) {
                    newValue = value.slice(0, selectionStart - 2) + selected + '**' + value.slice(selectionEnd);
                    newStart = selectionStart - 2;
                    newEnd = selectionEnd - 2;
                } else {
                    // 找不到闭合 ** → 普通加粗
                    newValue = value.slice(0, selectionStart) + '**' + selected + '**' + value.slice(selectionEnd);
                    newStart = selectionStart + 2;
                    newEnd = selectionEnd + 2;
                }
            } else if (after2 === '**') {
                // 选区在 bold 末尾，前面 bold 仍有内容 → **prefix[sel]** → **prefix**[sel]
                const prefix = value.slice(0, selectionStart);
                if (prefix.includes('**')) {
                    newValue = value.slice(0, selectionStart) + '**' + selected + value.slice(selectionEnd + 2);
                    newStart = selectionStart + 2;
                    newEnd = selectionEnd + 2;
                } else {
                    newValue = value.slice(0, selectionStart) + '**' + selected + '**' + value.slice(selectionEnd);
                    newStart = selectionStart + 2;
                    newEnd = selectionEnd + 2;
                }
            } else {
                // 不在 bold 内 → 加粗，首尾空白保持在 ** 外面
                const leadSpace = selected.match(/^\s*/)?.[0] ?? '';
                const trailSpace = selected.match(/\s*$/)?.[0] ?? '';
                const core = selected.slice(leadSpace.length, selected.length - trailSpace.length || undefined);
                if (!core) return; // 全是空白，不处理
                newValue = value.slice(0, selectionStart) + leadSpace + '**' + core + '**' + trailSpace + value.slice(selectionEnd);
                newStart = selectionStart + leadSpace.length + 2;
                newEnd = selectionEnd - trailSpace.length + 2;
            }

            onInputChange(newValue);
            requestAnimationFrame(() => {
                textarea.selectionStart = newStart;
                textarea.selectionEnd = newEnd;
            });
            return;
        }

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
            {label && (
                <div className="px-4 py-2 text-xs font-semibold text-[#86868b] bg-[#fafafa] dark:bg-[#111] border-b border-black/5 dark:border-white/10 shrink-0">
                    {label}
                </div>
            )}
            <textarea
                ref={editorScrollRef}
                className="w-full flex-1 p-8 md:p-10 resize-none bg-transparent outline-none font-mono text-[15px] md:text-[16px] leading-[1.8] no-scrollbar text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#6e6e73]"
                value={markdownInput}
                onChange={(e) => onInputChange(e.target.value)}
                onPaste={onPaste}
                onKeyDown={handleKeyDown}
                onScroll={scrollSyncEnabled && onEditorScroll ? onEditorScroll : undefined}
                placeholder={placeholder ?? "在这里输入 Markdown 内容..."}
                spellCheck={false}
            />

            {/* Bottom Action / Info Bar for Editor */}
            {!hideFooter &&
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
            </div>}
        </div>
    );
}
