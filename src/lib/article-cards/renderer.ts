// Canvas 2D 手绘卡片渲染器，替代 html2canvas
// 支持：paragraph、h1-h4、ul/ol、blockquote、hr，内联 strong/em/br

import type { CardPalette } from './types';

const SCALE = 2;
const W = 900 * SCALE;
const H = 1200 * SCALE;
const PX = 72 * SCALE;        // padding x
const PY = 60 * SCALE;        // padding y
const CW = (900 - 72 * 2) * SCALE; // content width = 756 * 2 = 1512
const FS = 30 * SCALE;        // base font size
const LH = Math.round(FS * 1.85); // line height ≈ 111
const FONT = '"PingFang SC", "Noto Sans SC", "Hiragino Sans GB", sans-serif';

export interface RenderCardParams {
    canvas: HTMLCanvasElement;
    palette: CardPalette;
    title: string;
    blockHtmlArr: string[];   // 当前页的 block outerHTML 数组
    pageLabel: string;        // e.g. "1 / 3"，空字符串则不显示
    footerText: string;
    bottomTip: string;        // "· 全文完" | "← 滑动查看更多"
}

// ─── 字体辅助 ─────────────────────────────────────────────────────────────────

function fnt(size: number, weight: number | string = 400, italic = false): string {
    return `${italic ? 'italic ' : ''}${weight} ${size}px ${FONT}`;
}

// ─── 解析内联节点 → TextRun ───────────────────────────────────────────────────

type TextRun = { text: string; bold: boolean; italic: boolean };

function parseInlineNode(node: Node, bold: boolean, italic: boolean, out: TextRun[]): void {
    if (node.nodeType === Node.TEXT_NODE) {
        const t = node.textContent ?? '';
        if (t) out.push({ text: t, bold, italic });
        return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (tag === 'br') { out.push({ text: '\n', bold, italic }); return; }
    const b = bold || tag === 'strong' || tag === 'b';
    const i = italic || tag === 'em' || tag === 'i';
    for (const child of el.childNodes) parseInlineNode(child, b, i, out);
}

function parseInline(el: Element, bold = false, italic = false): TextRun[] {
    const out: TextRun[] = [];
    for (const child of el.childNodes) parseInlineNode(child, bold, italic, out);
    return out;
}

// ─── 块级解析 ────────────────────────────────────────────────────────────────

type Block =
    | { kind: 'p' | 'h1' | 'h2' | 'h3' | 'h4'; runs: TextRun[] }
    | { kind: 'ul' | 'ol'; items: TextRun[][] }
    | { kind: 'blockquote'; runs: TextRun[] }
    | { kind: 'hr' };

function parseBlock(el: Element): Block | null {
    const tag = el.tagName.toLowerCase();
    if (tag === 'p') return { kind: 'p', runs: parseInline(el) };
    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') {
        return { kind: tag, runs: parseInline(el, true) };
    }
    if (tag === 'ul' || tag === 'ol') {
        const items = Array.from(el.querySelectorAll(':scope > li'))
            .map(li => parseInline(li as Element));
        return { kind: tag, items };
    }
    if (tag === 'blockquote') {
        const runs: TextRun[] = [];
        for (const child of el.children) {
            runs.push(...parseInline(child as Element, false, true));
            runs.push({ text: '\n', bold: false, italic: true }); // 段落间换行
        }
        return { kind: 'blockquote', runs };
    }
    if (tag === 'hr') return { kind: 'hr' };
    return null;
}

function parseBlocks(htmlArr: string[]): Block[] {
    const div = document.createElement('div');
    div.innerHTML = htmlArr.join('');
    return Array.from(div.children)
        .map(el => parseBlock(el as Element))
        .filter((b): b is Block => b !== null);
}

// ─── 文字换行 ─────────────────────────────────────────────────────────────────

type LineChunk = { text: string; bold: boolean; italic: boolean };
type WrappedLine = LineChunk[];

// 将文本拆分为换行单元：CJK 字符逐个拆，英文单词整体保留
function splitWrapTokens(text: string): string[] {
    const tokens: string[] = [];
    let latin = '';
    for (const ch of text) {
        const cp = ch.codePointAt(0) ?? 0;
        const isCJK =
            (cp >= 0x4E00 && cp <= 0x9FFF) ||
            (cp >= 0x3000 && cp <= 0x303F) ||
            (cp >= 0xFF00 && cp <= 0xFFEF) ||
            (cp >= 0x2E80 && cp <= 0x2EFF) ||
            (cp >= 0xF900 && cp <= 0xFAFF) ||
            (cp >= 0x2000 && cp <= 0x206F);
        if (isCJK) {
            if (latin) { tokens.push(latin); latin = ''; }
            tokens.push(ch);
        } else if (ch === ' ') {
            if (latin) {
                tokens.push(latin + ' ');
                latin = '';
            } else if (tokens.length > 0) {
                tokens[tokens.length - 1] += ' ';
            }
        } else {
            latin += ch;
        }
    }
    if (latin) tokens.push(latin);
    return tokens;
}

function wrapRuns(
    ctx: CanvasRenderingContext2D,
    runs: TextRun[],
    maxWidth: number,
    fontSize: number,
): WrappedLine[] {
    const lines: WrappedLine[] = [];
    let line: LineChunk[] = [];
    let lineW = 0;

    function pushLine() {
        lines.push(line);
        line = [];
        lineW = 0;
    }

    function addChunk(text: string, bold: boolean, italic: boolean) {
        ctx.font = fnt(fontSize, bold ? 800 : 400, italic);
        const w = ctx.measureText(text).width;
        if (lineW + w > maxWidth && line.length > 0) pushLine();
        const last = line[line.length - 1];
        if (last && last.bold === bold && last.italic === italic) {
            last.text += text;
        } else {
            line.push({ text, bold, italic });
        }
        lineW += w;
    }

    for (const run of runs) {
        const parts = run.text.split('\n');
        for (let pi = 0; pi < parts.length; pi++) {
            if (pi > 0) pushLine();
            const part = parts[pi];
            if (!part) continue;
            for (const token of splitWrapTokens(part)) {
                addChunk(token, run.bold, run.italic);
            }
        }
    }
    if (line.length > 0) lines.push(line);
    return lines;
}

// ─── 绘制换行后的文字，返回占用总高度 ─────────────────────────────────────────

function drawLines(
    ctx: CanvasRenderingContext2D,
    lines: WrappedLine[],
    x: number,
    y: number,
    lineHeight: number,
    normalColor: string,
    boldColor: string,
    fontSize: number,
): number {
    ctx.textBaseline = 'top';
    for (const line of lines) {
        let cx = x;
        for (const chunk of line) {
            ctx.font = fnt(fontSize, chunk.bold ? 800 : 400, chunk.italic);
            ctx.fillStyle = chunk.bold ? boldColor : normalColor;
            ctx.fillText(chunk.text, cx, y);
            cx += ctx.measureText(chunk.text).width;
        }
        y += lineHeight;
    }
    return lines.length * lineHeight;
}

// ─── 图片加载缓存 ─────────────────────────────────────────────────────────────

const imgCache = new Map<string, HTMLImageElement>();

async function loadImg(src: string): Promise<HTMLImageElement> {
    if (imgCache.has(src)) return imgCache.get(src)!;
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => { imgCache.set(src, img); resolve(img); };
        img.onerror = reject;
        img.src = src;
    });
}

// ─── 主渲染函数 ───────────────────────────────────────────────────────────────

export async function renderCard(params: RenderCardParams): Promise<void> {
    const { canvas, palette, title, blockHtmlArr, pageLabel, footerText, bottomTip } = params;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // 背景
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, W, H);

    let y = PY;

    // ── Header ──
    const logoSz = 44 * SCALE;
    let logoW = 0;
    try {
        const logo = await loadImg('/clover.svg');
        ctx.drawImage(logo, PX, y, logoSz, logoSz);
        logoW = logoSz + 16 * SCALE;
    } catch { /* 图片不存在时跳过 */ }

    const titleFontSz = 26 * SCALE;
    ctx.font = fnt(titleFontSz, 700);
    ctx.fillStyle = palette.meta;
    ctx.textBaseline = 'middle';
    const headerMidY = y + logoSz / 2;

    // 页码（右侧）
    let pageLabelW = 0;
    if (pageLabel) {
        ctx.font = fnt(22 * SCALE, 400);
        pageLabelW = ctx.measureText(pageLabel).width + 16 * SCALE;
        ctx.globalAlpha = 0.6;
        ctx.fillText(pageLabel, PX + CW - ctx.measureText(pageLabel).width, headerMidY);
        ctx.globalAlpha = 1;
    }

    // 标题（截断处理）
    ctx.font = fnt(titleFontSz, 700);
    const maxTitleW = CW - logoW - pageLabelW;
    let displayTitle = title;
    while (ctx.measureText(displayTitle).width > maxTitleW && displayTitle.length > 1) {
        displayTitle = displayTitle.slice(0, -1);
    }
    if (displayTitle !== title) displayTitle = displayTitle.trimEnd() + '…';
    ctx.fillStyle = palette.meta;
    ctx.fillText(displayTitle, PX + logoW, headerMidY);

    y += logoSz + 32 * SCALE; // header bottom margin

    // ── 分隔线 ──
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 1 * SCALE;
    ctx.beginPath();
    ctx.moveTo(PX, y);
    ctx.lineTo(PX + CW, y);
    ctx.stroke();
    y += 1 * SCALE + 36 * SCALE;

    // ── 内容块 ──
    const pMargin = 20 * SCALE;
    const blocks = parseBlocks(blockHtmlArr);

    for (const block of blocks) {
        switch (block.kind) {
            case 'p': {
                if (block.runs.length === 0) { y += pMargin; break; }
                const lines = wrapRuns(ctx, block.runs, CW, FS);
                y += drawLines(ctx, lines, PX, y, LH, palette.text, palette.highlight, FS);
                y += pMargin;
                break;
            }
            case 'h1': {
                const sz = 36 * SCALE;
                const lh = Math.round(sz * 1.4);
                const lines = wrapRuns(ctx, block.runs, CW, sz);
                y += drawLines(ctx, lines, PX, y, lh, palette.text, palette.text, sz);
                y += 16 * SCALE;
                break;
            }
            case 'h2': {
                const sz = 34 * SCALE;
                const lh = Math.round(sz * 1.4);
                const bw = 5 * SCALE;
                const pl = 14 * SCALE;
                const lines = wrapRuns(ctx, block.runs, CW - bw - pl, sz);
                const bh = Math.max(lh, lines.length * lh);
                ctx.fillStyle = palette.highlight;
                ctx.fillRect(PX, y, bw, bh);
                y += 24 * SCALE; // h2 margin-top
                drawLines(ctx, lines, PX + bw + pl, y - 24 * SCALE, lh, palette.highlight, palette.highlight, sz);
                y += bh - 24 * SCALE + 16 * SCALE;
                break;
            }
            case 'h3': {
                const sz = 30 * SCALE;
                const lh = Math.round(sz * 1.4);
                y += 24 * SCALE;
                const lines = wrapRuns(ctx, block.runs, CW, sz);
                y += drawLines(ctx, lines, PX, y, lh, palette.highlight, palette.highlight, sz);
                y += 16 * SCALE;
                break;
            }
            case 'h4': {
                const sz = 28 * SCALE;
                const lh = Math.round(sz * 1.4);
                y += 16 * SCALE;
                const lines = wrapRuns(ctx, block.runs, CW, sz);
                y += drawLines(ctx, lines, PX, y, lh, palette.text, palette.text, sz);
                y += 12 * SCALE;
                break;
            }
            case 'ul':
            case 'ol': {
                for (let i = 0; i < block.items.length; i++) {
                    const bullet = block.kind === 'ul' ? '•' : `${i + 1}.`;
                    ctx.font = fnt(FS, block.kind === 'ul' ? 700 : 400);
                    ctx.fillStyle = palette.highlight;
                    ctx.textBaseline = 'top';
                    ctx.fillText(bullet, PX, y);
                    const indent = 36 * SCALE;
                    const lines = wrapRuns(ctx, block.items[i], CW - indent, FS);
                    y += drawLines(ctx, lines, PX + indent, y, LH, palette.text, palette.highlight, FS);
                    y += 8 * SCALE;
                }
                y += pMargin - 8 * SCALE;
                break;
            }
            case 'blockquote': {
                const bqPX = 18 * SCALE;
                const bqPY = 10 * SCALE;
                const bw = 4 * SCALE;
                const sz = 27 * SCALE;
                const innerW = CW - bw - bqPX;
                const lines = wrapRuns(ctx, block.runs, innerW, sz);
                const totalH = lines.length * LH + bqPY * 2;
                // 背景
                ctx.fillStyle = palette.highlight;
                ctx.globalAlpha = 0.07;
                ctx.fillRect(PX, y, CW, totalH);
                ctx.globalAlpha = 1;
                // 左边框
                ctx.fillStyle = palette.highlight;
                ctx.fillRect(PX, y, bw, totalH);
                drawLines(ctx, lines, PX + bw + bqPX, y + bqPY, LH, palette.text, palette.highlight, sz);
                y += totalH + pMargin;
                break;
            }
            case 'hr': {
                y += 10 * SCALE;
                ctx.strokeStyle = palette.border;
                ctx.lineWidth = 1 * SCALE;
                ctx.beginPath();
                ctx.moveTo(PX, y);
                ctx.lineTo(PX + CW, y);
                ctx.stroke();
                y += 10 * SCALE + pMargin;
                break;
            }
        }
    }

    // ── Footer ──
    const avatarSz = 28 * SCALE;
    const footerY = H - PY - avatarSz;
    const footerMidY = footerY + avatarSz / 2;

    let avatarRightEdge = PX;
    try {
        const avatar = await loadImg('/avatar.jpg');
        ctx.save();
        ctx.beginPath();
        ctx.arc(PX + avatarSz / 2, footerY + avatarSz / 2, avatarSz / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, PX, footerY, avatarSz, avatarSz);
        ctx.restore();
        avatarRightEdge = PX + avatarSz + 10 * SCALE;
    } catch { /* 跳过 */ }

    // 水印文字（支持 **bold**）
    const boldParts = `✦ ${footerText}`.split(/\*\*(.+?)\*\*/g);
    let rx = avatarRightEdge;
    ctx.fillStyle = palette.meta;
    ctx.globalAlpha = 0.7;
    ctx.textBaseline = 'middle';
    for (let bi = 0; bi < boldParts.length; bi++) {
        if (!boldParts[bi]) continue;
        ctx.font = fnt(20 * SCALE, bi % 2 === 1 ? 800 : 400);
        ctx.fillText(boldParts[bi], rx, footerMidY);
        rx += ctx.measureText(boldParts[bi]).width;
    }
    ctx.globalAlpha = 1;

    ctx.font = fnt(19 * SCALE, 400);
    ctx.fillStyle = palette.meta;
    ctx.globalAlpha = 0.6;
    const tipW = ctx.measureText(bottomTip).width;
    ctx.fillText(bottomTip, PX + CW - tipW, footerMidY);
    ctx.globalAlpha = 1;
}
