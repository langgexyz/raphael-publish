import { useState, useRef, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import MarkdownIt from 'markdown-it';
import { posterThemes } from '../lib/poster/themes';
import type { PosterTheme } from '../lib/poster/types';
import EditorPanel from './EditorPanel';

const md = new MarkdownIt({ html: false, breaks: false });

const POSTER_W = 900;
const POSTER_H = 1200;

// 海报内容（不含水印）：预览和导出共用
function PosterBody({
    theme,
    contentHtml,
}: {
    theme: PosterTheme;
    contentHtml: string;
}) {
    return (
        <div
            data-poster={theme.id}
            style={{
                width: POSTER_W, height: POSTER_H,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                padding: '80px 90px', boxSizing: 'border-box',
                fontFamily: '"PingFang SC", "Noto Sans SC", sans-serif',
                backgroundColor: theme.bgColor,
            }}
        >
            <div style={{ marginBottom: 80, alignSelf: 'flex-start' }}>
                <img src="/clover.svg" alt="" style={{ width: 108, height: 108, borderRadius: '50%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
            <div className="poster-text" style={{ alignSelf: 'flex-start', width: '100%' }} dangerouslySetInnerHTML={{ __html: contentHtml }} />
            {/* 水印占位：让 flex 布局保留空间，但导出时用 Canvas API 手绘 */}
            <div style={{ marginTop: 80, alignSelf: 'flex-start', height: 36 }} />
        </div>
    );
}

// 浏览器预览用的水印（正常 CSS，不经过 html2canvas）
function WatermarkOverlay({ footerText, scale }: { footerText: string; scale: number }) {
    return (
        <div style={{
            position: 'absolute',
            left: 90 * scale,
            bottom: 80 * scale,
            display: 'flex',
            alignItems: 'center',
            gap: 10 * scale,
            pointerEvents: 'none',
        }}>
            <img
                src="/avatar.jpg" alt=""
                style={{ width: 36 * scale, height: 36 * scale, borderRadius: '50%', objectFit: 'cover' }}
            />
            <span
                style={{ fontSize: 24 * scale, letterSpacing: 1 * scale, color: 'rgba(0,0,0,0.35)' }}
                dangerouslySetInnerHTML={{ __html: '✦ ' + footerText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
            />
        </div>
    );
}

function PosterCard({
    theme,
    contentHtml,
    footerText,
}: {
    theme: PosterTheme;
    contentHtml: string;
    footerText: string;
}) {
    const scaleWrapperRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.3);
    const [saving, setSaving] = useState(false);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const update = () => {
            if (wrapperRef.current) {
                const w = wrapperRef.current.clientWidth - 2;
                setScale(w / POSTER_W);
            }
        };
        update();
        const ro = new ResizeObserver(update);
        if (wrapperRef.current) ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, []);

    const handleSave = useCallback(async () => {
        const sw = scaleWrapperRef.current;
        if (!sw) return;
        setSaving(true);
        try {
            // 1. clone 到屏幕外截图（不含水印）
            const clone = sw.cloneNode(true) as HTMLDivElement;
            const styleEl = document.createElement('style');
            styleEl.textContent = theme.css;
            clone.style.cssText = `
                position: fixed; left: 0; top: -${POSTER_H + 200}px;
                width: ${POSTER_W}px; height: ${POSTER_H}px;
                transform: none; border-radius: 0; box-shadow: none; overflow: hidden;
            `;
            document.body.appendChild(styleEl);
            document.body.appendChild(clone);

            const canvas = await html2canvas(clone, {
                scale: 1,
                useCORS: true,
                backgroundColor: theme.bgColor,
                width: POSTER_W, height: POSTER_H,
                scrollX: 0, scrollY: POSTER_H + 200,
                logging: false,
            });

            document.body.removeChild(clone);
            document.body.removeChild(styleEl);

            // 2. 用 Canvas API 手动画水印（绕开 html2canvas 布局）
            const ctx = canvas.getContext('2d')!;
            const wmX = 90; // 左 padding
            const wmY = POSTER_H - 80 - 36; // 底部 padding 区域上方

            // 画头像圆形
            const avatarImg = new Image();
            avatarImg.crossOrigin = 'anonymous';
            avatarImg.src = '/avatar.jpg';
            await new Promise<void>((resolve, reject) => {
                avatarImg.onload = () => resolve();
                avatarImg.onerror = () => reject();
            });

            ctx.save();
            ctx.beginPath();
            ctx.arc(wmX + 18, wmY + 18, 18, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(avatarImg, wmX, wmY, 36, 36);
            ctx.restore();

            // 画文字（支持 **bold**）
            const WM_FONT = '"PingFang SC", "Noto Sans SC", sans-serif';
            const boldParts = `✦ ${footerText}`.split(/\*\*(.+?)\*\*/g);
            let rx = wmX + 46;
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.textBaseline = 'middle';
            for (let bi = 0; bi < boldParts.length; bi++) {
                if (!boldParts[bi]) continue;
                ctx.font = bi % 2 === 1 ? `bold 24px ${WM_FONT}` : `24px ${WM_FONT}`;
                ctx.fillText(boldParts[bi], rx, wmY + 18);
                rx += ctx.measureText(boldParts[bi]).width;
            }

            // 3. 下载
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = `poster-${theme.id}-${Date.now()}.png`;
            a.click();
        } finally {
            setSaving(false);
        }
    }, [theme.id, theme.bgColor, theme.css, footerText]);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 px-0.5">
                <span className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{theme.name}</span>
                <span className="text-[11px] text-[#86868b] truncate">{theme.description}</span>
            </div>

            <div
                ref={wrapperRef}
                className="relative w-full"
                style={{ aspectRatio: `${POSTER_W}/${POSTER_H}` }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <style>{theme.css}</style>
                <div
                    ref={scaleWrapperRef}
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        width: POSTER_W, height: POSTER_H,
                        position: 'absolute', top: 0, left: 0,
                        borderRadius: 8 / scale,
                        overflow: 'hidden',
                        boxShadow: `0 ${2 / scale}px ${16 / scale}px rgba(0,0,0,0.12)`,
                    }}
                >
                    <PosterBody theme={theme} contentHtml={contentHtml} />
                </div>

                {/* 水印：用原生 CSS 渲染，不经过 html2canvas */}
                <WatermarkOverlay footerText={footerText} scale={scale} />

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

// 从 markdown frontmatter 解析 watermark 字段
function parseFrontmatter(raw: string): { watermark: string; body: string } {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!match) return { watermark: '公众号 · 浪哥闲谭', body: raw };
    const wm = match[1].match(/^watermark:\s*(.+)$/m);
    return { watermark: wm ? wm[1].trim() : '公众号 · 浪哥闲谭', body: match[2] };
}

export default function PosterEditor({ posterMd, onPosterMdChange }: {
    posterMd: string;
    onPosterMdChange: (v: string) => void;
}) {
    const { watermark, body } = parseFrontmatter(posterMd);
    const contentHtml = md.render(body);

    return (
        <div className="h-full overflow-y-auto p-4 bg-[#f5f5f7] dark:bg-[#1c1c1e]">
            <div className="grid grid-cols-3 gap-3 items-start">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 px-0.5">
                        <span className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">编辑</span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-[#111] shadow-sm" style={{ aspectRatio: `${POSTER_W}/${POSTER_H}` }}>
                        <EditorPanel
                            markdownInput={posterMd}
                            onInputChange={onPosterMdChange}
                            placeholder={"---\nwatermark: 公众号 · 浪哥闲谭\n---\n# 第一行\n# **高亮行**\n# 第三行"}
                            hideFooter
                        />
                    </div>
                </div>

                {posterThemes.map(theme => (
                    <PosterCard
                        key={theme.id}
                        theme={theme}
                        contentHtml={contentHtml}
                        footerText={watermark}
                    />
                ))}
            </div>
        </div>
    );
}
