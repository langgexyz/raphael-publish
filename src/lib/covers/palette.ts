// 封面调色板：提取自文章主题的核心颜色
// 新增主题只需定义 palette，CSS 自动生成
import type { CoverPalette } from './types';
export type { CoverPalette };

export function makeCoverCss(id: string, p: CoverPalette): string {
    const gradient = p.gradient ?? 'rgba(255,255,255,0.12)';
    const s = `[data-theme="${id}"]`;
    return `
        ${s} .cover-left {
            width: 940px; height: 400px; padding: 40px 56px; box-sizing: border-box;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
            background: radial-gradient(circle at top right, ${gradient}, transparent 45%), ${p.leftBg};
        }
        ${s} .cover-left h1 {
            font-size: 76px; line-height: 1.05; letter-spacing: -1px;
            color: ${p.text}; white-space: nowrap; margin: 0; text-align: center; font-weight: 400;
        }
        ${s} .cover-left h1 + h1, ${s} .cover-left h1 + h2,
        ${s} .cover-left h2 + h1, ${s} .cover-left h2 + h2 { margin-top: 14px; }
        ${s} .cover-left h2 {
            font-size: 60px; line-height: 1.1; letter-spacing: -1px;
            color: ${p.text}; white-space: nowrap; margin: 0; text-align: center; font-weight: 400;
        }
        ${s} .cover-left h3 {
            font-size: 44px; line-height: 1.2; letter-spacing: 2px;
            color: ${p.accent}; white-space: nowrap; margin: 8px 0 0; text-align: center; font-weight: 400;
        }
        ${s} .cover-left p {
            font-size: 44px; line-height: 1.2; letter-spacing: 2px;
            color: ${p.accent}; white-space: nowrap; margin: 8px 0 0; text-align: center;
        }
        ${s} .cover-left strong { color: ${p.highlight}; font-weight: 700; }
        ${s} .cover-left em { font-style: normal; color: ${p.accent}; }
        ${s} .cover-right {
            width: 400px; height: 400px; box-sizing: border-box;
            border-left: 1px solid rgba(128,128,128,0.12);
            display: flex; align-items: center; justify-content: center;
            background: ${p.rightBg};
            font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
        }
        ${s} .cover-right-inner { display: flex; flex-direction: column; align-items: center; }
        ${s} .cover-right h1, ${s} .cover-right h2, ${s} .cover-right p {
            font-size: 56px; line-height: 1.2; color: ${p.highlight};
            text-align: center; margin: 0; font-weight: 700;
        }
        ${s} .cover-right hr { border: none; margin: 2px 0; width: 100%; }
        ${s} .cover-right hr::after {
            content: '↓'; display: block; font-size: 36px; line-height: 1;
            color: ${p.arrow}; text-align: center;
        }
    `;
}
