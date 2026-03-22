import { useState, useRef, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import MarkdownIt from 'markdown-it';
import { renderCard } from '../lib/article-cards/renderer';
import { cardThemes } from '../lib/article-cards/themes';
import type { CardTheme } from '../lib/article-cards/types';
import EditorPanel from './EditorPanel';

const md = new MarkdownIt({ html: false, breaks: true, linkify: false });

const CARD_W = 900;
const CARD_H = 1200;
// 内容区可用高度（扣除 header + divider + footer + padding）
const CONTENT_H = 870;
// 内容区宽度（900 - 2*72 = 756）
const CONTENT_W = 756;

// ─── 页面分割 ─────────────────────────────────────────────────────
// 将渲染后的 HTML 按照内容高度分页
function splitHtmlIntoPages(html: string, measureRoot: HTMLElement): string[][] {
    const probe = document.createElement('div');
    probe.style.cssText = [
        `width:${CONTENT_W}px`,
        'font-size:30px',
        'line-height:1.85',
        `font-family:"PingFang SC","Noto Sans SC","Hiragino Sans GB",sans-serif`,
        'position:absolute',
        'left:-99999px',
        'top:0',
        'visibility:hidden',
        'padding:0',
        'margin:0',
        'box-sizing:border-box',
    ].join(';');
    probe.innerHTML = html;
    measureRoot.appendChild(probe);

    const nodes = Array.from(probe.children) as HTMLElement[];
    const pages: string[][] = [];
    let curBlocks: string[] = [];
    let curH = 0;

    for (const el of nodes) {
        const h = el.getBoundingClientRect().height || el.offsetHeight || 0;
        if (curH + h > CONTENT_H && curBlocks.length > 0) {
            pages.push(curBlocks);
            curBlocks = [el.outerHTML];
            curH = h;
        } else {
            curBlocks.push(el.outerHTML);
            curH += h;
        }
    }
    if (curBlocks.length > 0) pages.push(curBlocks);

    measureRoot.removeChild(probe);
    return pages.length > 0 ? pages : [['']];
}

// ─── 单张卡片 ─────────────────────────────────────────────────────
function ArticleCardPage({
    theme, title, contentHtml, pageLabel, bottomTip, footerText, hidePageLabel = false,
}: {
    theme: CardTheme;
    title: string;
    contentHtml: string;
    pageLabel: string;
    bottomTip: string;
    footerText: string;
    hidePageLabel?: boolean;
}) {
    return (
        <div
            data-card={theme.id}
            style={{
                width: CARD_W, height: CARD_H,
                display: 'flex', flexDirection: 'column',
                padding: '60px 72px', boxSizing: 'border-box',
                fontFamily: '"PingFang SC", "Noto Sans SC", "Hiragino Sans GB", sans-serif',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, flexShrink: 0 }}>
                <img src="/clover.svg" alt="" style={{ width: 44, height: 44, flexShrink: 0 }} crossOrigin="anonymous" />
                <span
                    className="card-title"
                    style={{ flex: 1, fontSize: 26, fontWeight: 700, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                    {title}
                </span>
                {!hidePageLabel && (
                    <span
                        className="card-page"
                        style={{ fontSize: 22, letterSpacing: 1, flexShrink: 0 }}
                    >
                        {pageLabel}
                    </span>
                )}
            </div>

            {/* Divider */}
            <div
                className="card-divider"
                style={{ width: '100%', height: 1, marginBottom: 36, flexShrink: 0 }}
            />

            {/* Content */}
            <div
                className="card-content"
                style={{ flex: 1, overflow: 'hidden', fontSize: 30, lineHeight: 1.85, letterSpacing: 0.3 }}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Footer */}
            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div className="card-watermark" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="/avatar.jpg" alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} crossOrigin="anonymous" />
                    <span
                        style={{ fontSize: 20, letterSpacing: 1 }}
                        dangerouslySetInnerHTML={{ __html: '✦ ' + footerText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
                    />
                </div>
                <span className="card-tip" style={{ fontSize: 19 }}>{bottomTip}</span>
            </div>
        </div>
    );
}

// ─── 单张卡片缩放预览（不含翻页，用于横排展示）────────────────────
function CardPreview({ theme, title, pageBlocks, pageLabel, bottomTip, footerText }: {
    theme: CardTheme;
    title: string;
    pageBlocks: string[];
    pageLabel: string;
    bottomTip: string;
    footerText: string;
}) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.28);
    const [hover, setHover] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const update = () => {
            if (wrapperRef.current) setScale((wrapperRef.current.clientWidth - 2) / CARD_W);
        };
        update();
        const ro = new ResizeObserver(update);
        if (wrapperRef.current) ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, []);

    const handleSave = useCallback(async () => {
        setSaving(true);
        const canvas = document.createElement('canvas');
        await renderCard({ canvas, palette: theme.palette, title, blockHtmlArr: pageBlocks, pageLabel, footerText, bottomTip });
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `card-${theme.id}-${pageLabel.replace(' ', '')}.png`;
        a.click();
        setSaving(false);
    }, [theme, title, pageBlocks, pageLabel, footerText, bottomTip]);

    return (
        <div
            ref={wrapperRef}
            className="relative flex-shrink-0"
            style={{ width: '100%', aspectRatio: `${CARD_W}/${CARD_H}` }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <style>{theme.css}</style>
            <div style={{
                transform: `scale(${scale})`, transformOrigin: 'top left',
                width: CARD_W, height: CARD_H,
                position: 'absolute', top: 0, left: 0,
                borderRadius: 8 / scale, overflow: 'hidden',
                boxShadow: `0 ${2 / scale}px ${16 / scale}px rgba(0,0,0,0.12)`,
            }}>
                <ArticleCardPage
                    theme={theme} title={title}
                    contentHtml={pageBlocks.join('')}
                    pageLabel={pageLabel}
                    bottomTip={bottomTip}
                    footerText={footerText}
                />
            </div>
            {hover && (
                <button
                    onClick={handleSave} disabled={saving}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-black/70 text-white backdrop-blur-sm hover:bg-black/85 transition-all z-10"
                >
                    <Download size={12} />
                    {saving ? '导出中...' : '保存'}
                </button>
            )}
        </div>
    );
}

// ─── 主题组：单行控制栏 + 横排展示当前主题所有分页 ────────────────
function ThemeCardGroup({
    theme,
    title,
    pages,
    footerText,
    activeThemeIdx,
    onThemeChange,
}: {
    theme: CardTheme;
    title: string;
    pages: string[][];
    footerText: string;
    activeThemeIdx: number;
    onThemeChange: (i: number) => void;
}) {
    const [saving, setSaving] = useState(false);
    const total = pages.length;

    const handleSaveAll = useCallback(async () => {
        setSaving(true);
        for (let i = 0; i < total; i++) {
            const canvas = document.createElement('canvas');
            await renderCard({
                canvas, palette: theme.palette, title,
                blockHtmlArr: pages[i] ?? [],
                pageLabel: `${i + 1} / ${total}`,
                footerText,
                bottomTip: i === total - 1 ? '· 全文完' : '← 滑动查看更多',
            });
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = `card-${theme.id}-p${i + 1}-of-${total}.png`;
            a.click();
            if (i < total - 1) await new Promise(r => setTimeout(r, 300));
        }
        setSaving(false);
    }, [theme.id, theme.palette, title, footerText, pages, total]);

    return (
        <div className="flex flex-col gap-2">
            {/* 单行：主题 tabs + 共 N 张 + 下载按钮 */}
            <div className="flex items-center gap-1.5 px-0.5">
                {cardThemes.map((t, i) => (
                    <button
                        key={t.id}
                        onClick={() => onThemeChange(i)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors flex-shrink-0 ${
                            i === activeThemeIdx
                                ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f]'
                                : 'bg-white dark:bg-[#2c2c2e] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white border border-black/[0.08] dark:border-white/10'
                        }`}
                    >
                        {t.name}
                    </button>
                ))}
                <span className="text-[11px] text-[#86868b] ml-2 flex-shrink-0">共 {total} 张</span>
                <div className="flex-1" />
                <button
                    onClick={handleSaveAll} disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] hover:opacity-80 transition-opacity disabled:opacity-50 flex-shrink-0"
                >
                    <Download size={11} />
                    {saving ? '导出中...' : `全部下载 ${total} 张`}
                </button>
            </div>

            {/* 所有分页横排（自动换行） */}
            <div className="grid grid-cols-2 gap-3">
                {pages.map((pageBlocks, i) => (
                    <CardPreview
                        key={i}
                        theme={theme}
                        title={title}
                        pageBlocks={pageBlocks}
                        pageLabel={`${i + 1} / ${total}`}
                        bottomTip={i === total - 1 ? '· 全文完' : '← 滑动查看更多'}
                        footerText={footerText}
                    />
                ))}
            </div>
        </div>
    );
}

// 从 markdown frontmatter 解析 title / watermark 字段
function parseFrontmatter(raw: string): { title: string; watermark: string; body: string } {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!match) return { title: '每一次输出，都是一次练习', watermark: '公众号 · 浪哥闲谭', body: raw };
    const titleMatch = match[1].match(/^title:\s*(.+)$/m);
    const wmMatch = match[1].match(/^watermark:\s*(.+)$/m);
    return {
        title: titleMatch ? titleMatch[1].trim() : '每一次输出，都是一次练习',
        watermark: wmMatch ? wmMatch[1].trim() : '公众号 · 浪哥闲谭',
        body: match[2],
    };
}

// ─── 编辑器主体 ────────────────────────────────────────────────────
export default function ArticleCardsEditor({ cardMd, onCardMdChange }: {
    cardMd: string;
    onCardMdChange: (v: string) => void;
}) {
    const [pages, setPages] = useState<string[][]>([['']]);
    const [activeThemeIdx, setActiveThemeIdx] = useState(0);

    const { title, watermark, body } = parseFrontmatter(cardMd);
    const measureRef = useRef<HTMLDivElement>(null);
    const activeTheme = cardThemes[activeThemeIdx];

    // 每次内容变化重新分页
    useEffect(() => {
        if (!measureRef.current) return;
        const html = md.render(body);
        setPages(splitHtmlIntoPages(html, measureRef.current));
    }, [body]);

    return (
        <div className="h-full overflow-y-auto p-4 bg-[#f5f5f7] dark:bg-[#1c1c1e]">
            {/* 隐藏测量容器 */}
            <div ref={measureRef} style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none', visibility: 'hidden' }} />

            <div className="grid grid-cols-3 gap-3 items-start">
                {/* 编辑器列 */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 px-0.5">
                        <span className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">编辑</span>
                        <span className="text-[11px] text-[#86868b]">共 {pages.length} 页</span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-[#111] shadow-sm" style={{ aspectRatio: `${CARD_W}/${CARD_H}` }}>
                        <EditorPanel
                            markdownInput={cardMd}
                            onInputChange={onCardMdChange}
                            placeholder={"---\ntitle: 文章标题\nwatermark: 公众号 · 浪哥闲谭\n---\n正文内容..."}
                            hideFooter
                        />
                    </div>
                </div>

                {/* 预览区：占 2 列，主题切换 + 当前主题所有分页横排 */}
                <div className="col-span-2 flex flex-col gap-2">
                    {/* 单行：主题 tabs + 共 N 张 + 下载按钮 */}
                    <ThemeCardGroup
                        key={activeTheme.id}
                        activeThemeIdx={activeThemeIdx}
                        onThemeChange={setActiveThemeIdx}
                        theme={activeTheme}
                        title={title}
                        pages={pages}
                        footerText={watermark}
                    />
                </div>
            </div>
        </div>
    );
}
