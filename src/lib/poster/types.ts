export interface PosterTheme {
    id: string;
    name: string;
    description: string;
    css: string;          // scoped by [data-poster="id"]
    bgColor: string;      // 背景色，用于 html2canvas 和 inline style
    defaultMd: string;    // 默认 Markdown 内容
}
