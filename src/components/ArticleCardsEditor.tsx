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
                    <span style={{ fontSize: 20, letterSpacing: 1 }}>✦ {footerText}</span>
                </div>
                <span className="card-tip" style={{ fontSize: 19 }}>{bottomTip}</span>
            </div>
        </div>
    );
}

// ─── 主题组：展示一个主题的所有分页 ──────────────────────────────
function ThemeCardGroup({
    theme,
    title,
    pages,
    footerText,
}: {
    theme: CardTheme;
    title: string;
    pages: string[][];
    footerText: string;
}) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.28);
    const [saving, setSaving] = useState(false);
    const [hover, setHover] = useState(false);
    const [previewPageIdx, setPreviewPageIdx] = useState(0);

    useEffect(() => {
        const update = () => {
            if (wrapperRef.current) setScale((wrapperRef.current.clientWidth - 2) / CARD_W);
        };
        update();
        const ro = new ResizeObserver(update);
        if (wrapperRef.current) ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, []);

    const handleSaveAll = useCallback(async () => {
        setSaving(true);
        const total = pages.length;
        for (let i = 0; i < total; i++) {
            const canvas = document.createElement('canvas');
            await renderCard({
                canvas,
                palette: theme.palette,
                title,
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
    }, [theme.id, theme.palette, title, footerText, pages]);

    const total = pages.length;
    const clampedIdx = Math.min(previewPageIdx, total - 1);

    // pages 变化时重置预览页（防止越界）
    useEffect(() => {
        setPreviewPageIdx(0);
    }, [total]);

    return (
        <div className="flex flex-col gap-1">
            {/* 标签行 */}
            <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{theme.name}</span>
                    <span className="text-[11px] text-[#86868b] truncate">{theme.description}</span>
                </div>
                {/* 翻页控件 */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPreviewPageIdx(i => Math.max(0, i - 1))}
                        disabled={clampedIdx === 0}
                        className="w-5 h-5 flex items-center justify-center rounded text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] disabled:opacity-30 transition-colors"
                    >‹</button>
                    <span className="text-[11px] text-[#86868b] tabular-nums">{clampedIdx + 1} / {total}</span>
                    <button
                        onClick={() => setPreviewPageIdx(i => Math.min(total - 1, i + 1))}
                        disabled={clampedIdx === total - 1}
                        className="w-5 h-5 flex items-center justify-center rounded text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] disabled:opacity-30 transition-colors"
                    >›</button>
                </div>
            </div>

            {/* 缩放预览 */}
            <div
                ref={wrapperRef}
                className="relative w-full"
                style={{ aspectRatio: `${CARD_W}/${CARD_H}` }}
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
                        contentHtml={pages[clampedIdx]?.join('') ?? ''}
                        pageLabel={`${clampedIdx + 1} / ${total}`}
                        bottomTip={clampedIdx === total - 1 ? '· 全文完' : '← 滑动查看更多'}
                        footerText={footerText}
                        hidePageLabel
                    />
                </div>

                {hover && (
                    <button
                        onClick={handleSaveAll} disabled={saving}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-black/70 text-white backdrop-blur-sm hover:bg-black/85 transition-all z-10"
                    >
                        <Download size={12} />
                        {saving ? '导出中...' : `全部 ${total} 张`}
                    </button>
                )}
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
export default function ArticleCardsEditor() {
    const [cardMd, setCardMd] = useState(
        `---\ntitle: 每一次输出，都是一次练习\nwatermark: 公众号 · 浪哥闲谭\n---\n见字如面，我是浪哥。\n\n这是一篇关于写作的文章。写作不只是把想法变成文字，更是把模糊的感受打磨成清晰的观点。\n\n## 为什么要写\n\n很多人觉得自己没东西写。其实不是没有，是还没有养成把想法记下来的习惯。\n\n**写作是最便宜的思考工具。** 你只需要一个地方，开始打字。\n\n## 怎么写\n\n- 先把想说的都倒出来，不管顺序\n- 再整理，找主线\n- 然后删，删到不能再删为止\n\n> 好文章不是写出来的，是改出来的。\n\n## 写给谁看\n\n先写给自己看。当你能说服自己，才有可能说服别人。`
    );
    const [pages, setPages] = useState<string[][]>([['']]);

    const { title, watermark, body } = parseFrontmatter(cardMd);
    const measureRef = useRef<HTMLDivElement>(null);

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
                {/* 编辑器：占 1 列，与大字报布局一致 */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 px-0.5">
                        <span className="text-[12px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">编辑</span>
                        <span className="text-[11px] text-[#86868b]">共 {pages.length} 页</span>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-[#111] shadow-sm" style={{ aspectRatio: `${CARD_W}/${CARD_H}` }}>
                        <EditorPanel
                            markdownInput={cardMd}
                            onInputChange={setCardMd}
                            placeholder={"---\ntitle: 文章标题\nwatermark: 公众号 · 浪哥闲谭\n---\n正文内容..."}
                            hideFooter
                        />
                    </div>
                </div>

                {/* 主题卡片：从第 2 列开始，自然排列 */}
                {cardThemes.map(theme => (
                    <ThemeCardGroup
                        key={theme.id}
                        theme={theme}
                        title={title}
                        pages={pages}
                        footerText={watermark}
                    />
                ))}
            </div>
        </div>
    );
}
