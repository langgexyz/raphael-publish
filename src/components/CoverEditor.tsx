import { useState, useRef, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import MarkdownIt from 'markdown-it';
import { coverThemes } from '../lib/covers/themes';
import type { CoverTheme } from '../lib/covers/types';
import { renderCover } from '../lib/covers/renderer';
import EditorPanel from './EditorPanel';

const md = new MarkdownIt({ html: false, breaks: false });

const COVER_W = 1340;
const COVER_H = 400;

// 单张封面预览卡（含悬停保存按钮）
function CoverCard({ theme, leftHtml, rightHtml }: {
    theme: CoverTheme;
    leftHtml: string;
    rightHtml: string;
}) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.45);
    const [saving, setSaving] = useState(false);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const update = () => {
            if (wrapperRef.current) {
                const w = wrapperRef.current.clientWidth - 2;
                setScale(w / COVER_W);
            }
        };
        update();
        const ro = new ResizeObserver(update);
        if (wrapperRef.current) ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, []);

    const handleSave = useCallback(() => {
        setSaving(true);
        try {
            const canvas = document.createElement('canvas');
            renderCover({ canvas, palette: theme.palette, leftHtml, rightHtml });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `cover-${theme.id}-${Date.now()}.png`;
            a.click();
        } finally {
            setSaving(false);
        }
    }, [theme.id, theme.palette, leftHtml, rightHtml]);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 px-0.5">
                <span className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{theme.name}</span>
                <span className="text-[11px] text-[#86868b] truncate">{theme.description}</span>
            </div>

            <div
                ref={wrapperRef}
                className="relative w-full"
                style={{ aspectRatio: `${COVER_W}/${COVER_H}` }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {/* 注入主题 CSS */}
                <style>{theme.css}</style>

                {/* 缩放容器 */}
                <div style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: COVER_W,
                    height: COVER_H,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: 8 / scale,
                    overflow: 'hidden',
                    boxShadow: `0 ${2 / scale}px ${16 / scale}px rgba(0,0,0,0.10)`,
                }}>
                    <div
                        data-theme={theme.id}
                        style={{ display: 'flex', width: COVER_W, height: COVER_H, overflow: 'hidden' }}
                    >
                        <div className="cover-left" dangerouslySetInnerHTML={{ __html: leftHtml }} />
                        <div className="cover-right">
                            <div className="cover-right-inner" dangerouslySetInnerHTML={{ __html: rightHtml }} />
                        </div>
                    </div>
                </div>

                {/* 悬停保存按钮 */}
                {hover && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-black/70 text-white backdrop-blur-sm hover:bg-black/85 transition-all z-10"
                    >
                        <Download size={12} />
                        {saving ? '导出中...' : '保存 PNG'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function CoverEditor({ leftMd, rightMd, onLeftChange, onRightChange }: {
    leftMd: string;
    rightMd: string;
    onLeftChange: (v: string) => void;
    onRightChange: (v: string) => void;
}) {
    const leftHtml = md.render(leftMd);
    const rightHtml = md.render(rightMd);

    return (
        <div className="h-full overflow-y-auto p-4 bg-[#f5f5f7] dark:bg-[#1c1c1e]">
            <div className="grid grid-cols-3 gap-3 items-start">
                {/* 编辑器：占 2列 × 2行 */}
                <div className="flex overflow-hidden rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-[#111] shadow-sm" style={{ minHeight: 0 }}>
                    {/* 2.35:1 编辑区 */}
                    <div className="flex flex-col overflow-hidden border-r border-black/5 dark:border-white/10" style={{ flex: 2.35 }}>
                        <EditorPanel
                            markdownInput={leftMd}
                            onInputChange={onLeftChange}
                            label="左 · 2.35:1"
                            placeholder={"# 标题\n# **高亮词**\n### 解决方案"}
                            hideFooter
                        />
                    </div>
                    {/* 1:1 编辑区 */}
                    <div className="flex flex-col overflow-hidden" style={{ flex: 1 }}>
                        <EditorPanel
                            markdownInput={rightMd}
                            onInputChange={onRightChange}
                            label="右 · 1:1"
                            placeholder={"# 词\n\n---\n\n# 词"}
                            hideFooter
                        />
                    </div>
                </div>

                {/* 预览卡片：从第 3 列开始，自然排列 */}
                {coverThemes.map(theme => (
                    <CoverCard
                        key={theme.id}
                        theme={theme}
                        leftHtml={leftHtml}
                        rightHtml={rightHtml}
                    />
                ))}
            </div>
        </div>
    );
}
