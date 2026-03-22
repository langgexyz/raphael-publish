import type { PosterTheme } from './types';
import { makePosterCss } from './palette';

const DEFAULT_MD = `# 每一次输出
# **都是一次练习**
# 认真对待每个字`;

const defs: Array<Omit<PosterTheme, 'css' | 'bgColor'> & { palette: Parameters<typeof makePosterCss>[1] }> = [
    {
        id: 'lang-green',
        name: '浪绿',
        description: '品牌默认，清新绿底',
        palette: { bg: '#e6f5ef', text: '#1a1a1a', highlight: '#22a854' },
        defaultMd: DEFAULT_MD,
    },
    {
        id: 'midnight',
        name: '深夜',
        description: '黑底白字，霓虹绿高亮',
        palette: { bg: '#0d0d0d', text: '#f0f0f0', highlight: '#22a854' },
        defaultMd: DEFAULT_MD,
    },
    {
        id: 'cream',
        name: '燕麦',
        description: '暖白底，橙棕高亮',
        palette: { bg: '#faf7f2', text: '#2b2b2b', highlight: '#c0582a' },
        defaultMd: DEFAULT_MD,
    },
    {
        id: 'coral',
        name: '珊瑚',
        description: '珊瑚粉底，深红高亮',
        palette: { bg: '#fff0ee', text: '#2a1a1a', highlight: '#e03a2a' },
        defaultMd: DEFAULT_MD,
    },
    {
        id: 'ink',
        name: '水墨',
        description: '纯白底，极度克制',
        palette: { bg: '#ffffff', text: '#111111', highlight: '#555555' },
        defaultMd: DEFAULT_MD,
    },
    {
        id: 'ocean',
        name: '深海',
        description: '深蓝底，亮橙高亮',
        palette: { bg: '#0a1929', text: '#e0f0ff', highlight: '#ff6b35' },
        defaultMd: DEFAULT_MD,
    },
    {
        id: 'lavender',
        name: '薰衣草',
        description: '紫白底，深紫高亮',
        palette: { bg: '#f5f0ff', text: '#1e0a3c', highlight: '#6b4c9a' },
        defaultMd: DEFAULT_MD,
    },
    {
        id: 'retro',
        name: '复古',
        description: '牛皮纸底，暗红高亮',
        palette: { bg: '#f4ecd8', text: '#2b2621', highlight: '#8c2211' },
        defaultMd: DEFAULT_MD,
    },
];

export const posterThemes: PosterTheme[] = defs.map(({ palette, ...rest }) => ({
    ...rest,
    bgColor: palette.bg,
    css: makePosterCss(rest.id, palette),
}));
