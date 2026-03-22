// poster-3-4 调色板
// 新增主题只需声明 3 个颜色，CSS 由 makePosterCss 自动生成

export interface PosterPalette {
    bg: string;        // 背景色
    text: string;      // 正文色（h1 默认色）
    highlight: string; // 高亮色（strong 色）
    watermark?: string; // 水印色，默认黑底
}

export function makePosterCss(id: string, p: PosterPalette): string {
    const s = `[data-poster="${id}"]`;
    return `
        ${s} {
            background-color: ${p.bg};
        }
        ${s} .poster-text h1,
        ${s} .poster-text h2,
        ${s} .poster-text h3,
        ${s} .poster-text p {
            font-size: 108px;
            font-weight: 900;
            line-height: 1.15;
            color: ${p.text};
            letter-spacing: -2px;
            margin: 0;
            font-family: "PingFang SC", "Noto Sans SC", "Hiragino Sans GB", sans-serif;
            white-space: pre-wrap;
            word-break: break-all;
        }
        ${s} .poster-text h1 + h1, ${s} .poster-text h1 + h2, ${s} .poster-text h1 + p,
        ${s} .poster-text h2 + h1, ${s} .poster-text h2 + h2, ${s} .poster-text h2 + p,
        ${s} .poster-text p  + h1, ${s} .poster-text p  + h2, ${s} .poster-text p  + p {
            margin-top: 8px;
        }
        ${s} .poster-text strong { color: ${p.highlight}; font-weight: 900; }
        ${s} .poster-watermark { color: ${p.watermark ?? 'rgba(0,0,0,0.35)'}; }
    `;
}
