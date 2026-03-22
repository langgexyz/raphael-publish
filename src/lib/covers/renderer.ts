// Canvas 2D 封面渲染器，替代 html2canvas
// 封面固定 1340×400：左 940×400（含渐变背景），右 400×400

import type { CoverPalette } from './types';

const SCALE = 2;
const TOTAL_W = 1340 * SCALE;  // 2680
const TOTAL_H = 400 * SCALE;   // 800
const LEFT_W = 940 * SCALE;    // 1880
const RIGHT_W = 400 * SCALE;   // 800
const FONT = '"PingFang SC", "Helvetica Neue", Arial, sans-serif';

export interface RenderCoverParams {
    canvas: HTMLCanvasElement;
    palette: CoverPalette;
    leftHtml: string;
    rightHtml: string;
}

// ─── 字体辅助 ─────────────────────────────────────────────────────────────────

function fnt(size: number, weight: number | string = 400): string {
    return `${weight} ${size}px ${FONT}`;
}

// ─── 内联解析 ────────────────────────────────────────────────────────────────

type TextRun = { text: string; bold: boolean };

function parseInlineNode(node: Node, bold: boolean, out: TextRun[]): void {
    if (node.nodeType === Node.TEXT_NODE) {
        const t = node.textContent ?? '';
        if (t) out.push({ text: t, bold });
        return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    const b = bold || tag === 'strong' || tag === 'b';
    for (const child of el.childNodes) parseInlineNode(child, b, out);
}

function parseInline(el: Element): TextRun[] {
    const out: TextRun[] = [];
    for (const child of el.childNodes) parseInlineNode(child, false, out);
    return out;
}

type Block =
    | { kind: 'h1' | 'h2' | 'h3' | 'p'; runs: TextRun[] }
    | { kind: 'hr' };

function parseBlocks(html: string): Block[] {
    const div = document.createElement('div');
    div.innerHTML = html;
    return Array.from(div.children).map(el => {
        const tag = el.tagName.toLowerCase();
        if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'p') {
            return { kind: tag as 'h1' | 'h2' | 'h3' | 'p', runs: parseInline(el as Element) };
        }
        if (tag === 'hr') return { kind: 'hr' as const };
        return null;
    }).filter((b): b is Block => b !== null);
}

// ─── 居中绘制一行混合文字 ─────────────────────────────────────────────────────

function drawCenteredRuns(
    ctx: CanvasRenderingContext2D,
    runs: TextRun[],
    centerX: number,
    y: number,
    fontSize: number,
    normalColor: string,
    boldColor: string,
    normalWeight: number,
): void {
    // 先测总宽
    let totalW = 0;
    for (const run of runs) {
        ctx.font = fnt(fontSize, run.bold ? 700 : normalWeight);
        totalW += ctx.measureText(run.text).width;
    }
    let x = centerX - totalW / 2;
    ctx.textBaseline = 'top';
    for (const run of runs) {
        ctx.font = fnt(fontSize, run.bold ? 700 : normalWeight);
        ctx.fillStyle = run.bold ? boldColor : normalColor;
        ctx.fillText(run.text, x, y);
        x += ctx.measureText(run.text).width;
    }
}

// ─── 左侧块高度计算（用于垂直居中）────────────────────────────────────────────

function calcLeftHeight(blocks: Block[]): number {
    let h = 0;
    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        const prev = i > 0 ? blocks[i - 1] : null;
        if (b.kind === 'h1') {
            const lineH = Math.ceil(76 * SCALE * 1.05);
            let mt = 0;
            if (prev) mt = (prev.kind === 'h1' || prev.kind === 'h2') ? 14 * SCALE : 8 * SCALE;
            h += (i > 0 ? mt : 0) + lineH;
        } else if (b.kind === 'h2') {
            const lineH = Math.ceil(60 * SCALE * 1.1);
            let mt = 0;
            if (prev) mt = (prev.kind === 'h1' || prev.kind === 'h2') ? 14 * SCALE : 8 * SCALE;
            h += (i > 0 ? mt : 0) + lineH;
        } else if (b.kind === 'h3' || b.kind === 'p') {
            const lineH = Math.ceil(44 * SCALE * 1.2);
            h += (i > 0 ? 8 * SCALE : 0) + lineH;
        }
    }
    return h;
}

// ─── 右侧块高度计算 ───────────────────────────────────────────────────────────

function calcRightHeight(blocks: Block[]): number {
    let h = 0;
    for (const b of blocks) {
        if (b.kind === 'h1' || b.kind === 'h2' || b.kind === 'p') {
            h += Math.ceil(56 * SCALE * 1.2);
        } else if (b.kind === 'hr') {
            h += 20 * SCALE; // 行间距
        }
    }
    return h;
}

// ─── 主渲染函数 ───────────────────────────────────────────────────────────────

export function renderCover(params: RenderCoverParams): void {
    const { canvas, palette, leftHtml, rightHtml } = params;
    canvas.width = TOTAL_W;
    canvas.height = TOTAL_H;
    const ctx = canvas.getContext('2d')!;

    // ── 左侧背景 ──
    ctx.fillStyle = palette.leftBg;
    ctx.fillRect(0, 0, LEFT_W, TOTAL_H);

    // 径向渐变叠加（右上角）
    const gradColor = palette.gradient ?? 'rgba(255,255,255,0.12)';
    const grd = ctx.createRadialGradient(LEFT_W, 0, 0, LEFT_W, 0, LEFT_W * 0.45);
    grd.addColorStop(0, gradColor);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, LEFT_W, TOTAL_H);

    // ── 左侧文字块 ──
    const leftBlocks = parseBlocks(leftHtml);
    const leftCenterX = LEFT_W / 2;
    const leftTotalH = calcLeftHeight(leftBlocks);
    let y = (TOTAL_H - leftTotalH) / 2;

    for (let i = 0; i < leftBlocks.length; i++) {
        const b = leftBlocks[i];
        const prev = i > 0 ? leftBlocks[i - 1] : null;

        if (b.kind === 'h1') {
            const fs = 76 * SCALE;
            const lineH = Math.ceil(fs * 1.05);
            const mt = i > 0 ? ((prev!.kind === 'h1' || prev!.kind === 'h2') ? 14 * SCALE : 8 * SCALE) : 0;
            y += mt;
            drawCenteredRuns(ctx, b.runs, leftCenterX, y, fs, palette.text, palette.highlight, 400);
            y += lineH;
        } else if (b.kind === 'h2') {
            const fs = 60 * SCALE;
            const lineH = Math.ceil(fs * 1.1);
            const mt = i > 0 ? ((prev!.kind === 'h1' || prev!.kind === 'h2') ? 14 * SCALE : 8 * SCALE) : 0;
            y += mt;
            drawCenteredRuns(ctx, b.runs, leftCenterX, y, fs, palette.text, palette.highlight, 400);
            y += lineH;
        } else if (b.kind === 'h3' || b.kind === 'p') {
            const fs = 44 * SCALE;
            const lineH = Math.ceil(fs * 1.2);
            if (i > 0) y += 8 * SCALE;
            drawCenteredRuns(ctx, b.runs, leftCenterX, y, fs, palette.accent, palette.highlight, 400);
            y += lineH;
        }
    }

    // ── 右侧背景 ──
    ctx.fillStyle = palette.rightBg;
    ctx.fillRect(LEFT_W, 0, RIGHT_W, TOTAL_H);

    // 分隔线
    ctx.strokeStyle = 'rgba(128,128,128,0.12)';
    ctx.lineWidth = 1 * SCALE;
    ctx.beginPath();
    ctx.moveTo(LEFT_W, 0);
    ctx.lineTo(LEFT_W, TOTAL_H);
    ctx.stroke();

    // ── 右侧文字块 ──
    const rightBlocks = parseBlocks(rightHtml);
    const rightCenterX = LEFT_W + RIGHT_W / 2;
    const rightTotalH = calcRightHeight(rightBlocks);
    y = (TOTAL_H - rightTotalH) / 2;

    for (const b of rightBlocks) {
        if (b.kind === 'h1' || b.kind === 'h2' || b.kind === 'p') {
            const fs = 56 * SCALE;
            const lineH = Math.ceil(fs * 1.2);
            drawCenteredRuns(ctx, b.runs, rightCenterX, y, fs, palette.highlight, palette.highlight, 700);
            y += lineH;
        } else if (b.kind === 'hr') {
            y += 20 * SCALE;
        }
    }
}
