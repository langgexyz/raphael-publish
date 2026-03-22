export interface CoverPalette {
    leftBg: string;
    rightBg: string;
    text: string;
    highlight: string;
    accent: string;
    arrow: string;
    gradient?: string;
}

export interface CoverTheme {
    id: string;
    name: string;
    description: string;
    // 完整 CSS，用 .cover-left / .cover-right 做 scope
    // 封面固定 1340×400，左 940×400（2.35:1），右 400×400（1:1）
    css: string;
    palette: CoverPalette;
    // 默认 markdown 内容
    leftDefaultMd: string;
    rightDefaultMd: string;
}
