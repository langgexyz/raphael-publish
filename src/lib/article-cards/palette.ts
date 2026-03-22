// article-3-4 调色板
// 新增主题只需声明 5 个颜色，CSS 由 makeCardCss 自动生成

import type { CardPalette } from './types';
export type { CardPalette };

export function makeCardCss(id: string, p: CardPalette): string {
    const s = `[data-card="${id}"]`;
    const codeBg = `color-mix(in srgb, ${p.highlight} 10%, ${p.bg})`;
    const bqBg   = `color-mix(in srgb, ${p.highlight} 7%, ${p.bg})`;
    return `
        ${s} { background-color: ${p.bg}; }
        ${s} .card-title { color: ${p.meta}; }
        ${s} .card-page  { color: ${p.meta}; opacity: 0.6; }
        ${s} .card-divider { background-color: ${p.border}; }
        ${s} .card-content { color: ${p.text}; }
        ${s} .card-content p  { margin-bottom: 20px; }
        ${s} .card-content p:last-child { margin-bottom: 0; }
        ${s} .card-content strong, ${s} .card-content b  { color: ${p.highlight}; font-weight: 800; }
        ${s} .card-content em, ${s} .card-content i { color: #666; font-style: italic; }
        ${s} .card-content h1 { font-size: 36px; font-weight: 800; line-height: 1.4; color: ${p.text}; margin: 0 0 16px; }
        ${s} .card-content h2 {
            font-size: 34px; font-weight: 800; line-height: 1.4;
            border-left: 5px solid ${p.highlight}; padding-left: 14px;
            color: ${p.highlight}; margin: 24px 0 16px;
        }
        ${s} .card-content h3 { font-size: 30px; font-weight: 800; line-height: 1.4; color: ${p.highlight}; margin: 24px 0 16px; }
        ${s} .card-content h4 { font-size: 28px; font-weight: 700; line-height: 1.4; color: ${p.text}; margin: 16px 0 12px; }
        ${s} .card-content ul, ${s} .card-content ol { margin: 0 0 20px 0; padding-left: 36px; }
        ${s} .card-content li { margin-bottom: 8px; line-height: 1.75; }
        ${s} .card-content ul li::marker, ${s} .card-content ol li::marker { color: ${p.highlight}; font-weight: 700; }
        ${s} .card-content blockquote {
            border-left: 4px solid ${p.highlight};
            background: ${bqBg};
            margin: 0 0 20px 0; padding: 10px 18px;
            border-radius: 0 6px 6px 0;
        }
        ${s} .card-content blockquote p { margin: 0; font-style: italic; font-size: 27px; }
        ${s} .card-content code {
            font-family: "SF Mono", "Fira Code", "Consolas", monospace;
            font-size: 24px; background: ${codeBg};
            color: ${p.highlight}; padding: 2px 8px; border-radius: 4px;
        }
        ${s} .card-content hr { border: none; border-top: 1px solid ${p.border}; margin: 20px 0; }
        ${s} .card-watermark { color: ${p.meta}; opacity: 0.7; }
        ${s} .card-tip { color: ${p.meta}; opacity: 0.6; }
    `;
}
