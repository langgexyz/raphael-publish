import type { CardTheme } from './types';
import { makeCardCss } from './palette';

const defs: Array<Omit<CardTheme, 'css'> & { palette: Parameters<typeof makeCardCss>[1] }> = [
    {
        id: 'lang-green',
        name: '浪绿',
        description: '品牌默认，清新绿底',
        palette: { bg: '#f9fcfa', text: '#2a2a2a', highlight: '#22a854', meta: '#999', border: 'rgba(0,0,0,0.08)' },
    },
    {
        id: 'stone',
        name: '石板',
        description: '米白底，沉静克制',
        palette: { bg: '#f8f6f2', text: '#2b2621', highlight: '#6b4c30', meta: '#aaa', border: 'rgba(0,0,0,0.08)' },
    },
    {
        id: 'claude',
        name: 'Claude',
        description: '燕麦底，橙棕高亮',
        palette: { bg: '#faf8f4', text: '#2b2b2b', highlight: '#b75c3d', meta: '#aaa', border: 'rgba(0,0,0,0.08)' },
    },
    {
        id: 'cobalt',
        name: '湛蓝',
        description: '冷白底，湛蓝高亮',
        palette: { bg: '#f4f7fc', text: '#1f2a40', highlight: '#1565c0', meta: '#aaa', border: 'rgba(0,0,0,0.08)' },
    },
    {
        id: 'linear',
        name: 'Linear',
        description: '暗色底，紫灰高亮',
        palette: { bg: '#101114', text: '#d0d0d8', highlight: '#8b90d8', meta: '#666', border: 'rgba(255,255,255,0.08)' },
    },
    {
        id: 'sakura',
        name: '樱粉',
        description: '粉白底，玫红高亮',
        palette: { bg: '#fef7f9', text: '#3a1a28', highlight: '#c44569', meta: '#bbb', border: 'rgba(0,0,0,0.07)' },
    },
];

export const cardThemes: CardTheme[] = defs.map(({ palette, ...rest }) => ({
    ...rest,
    css: makeCardCss(rest.id, palette),
    palette,
}));
