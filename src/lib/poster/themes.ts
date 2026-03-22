import type { PosterTheme } from './types';
import { makePosterCss } from './palette';

const DEFAULT_MD = `# 每一次输出
# **都是一次练习**
# 认真对待每个字`;

const W = 'rgba(255,255,255,0.5)'; // dark bg watermark

const defs: Array<Omit<PosterTheme, 'css' | 'bgColor'> & { palette: Parameters<typeof makePosterCss>[1] }> = [
    { id: 'lang-green',    name: '浪绿',   description: '品牌默认，清新绿底',       palette: { bg: '#e6f5ef', text: '#1a1a1a', highlight: '#22a854' }, defaultMd: DEFAULT_MD },
    { id: 'apple',         name: 'Mac',    description: '纯白极简，Apple 设计语言', palette: { bg: '#ffffff', text: '#111111', highlight: '#0066cc' }, defaultMd: DEFAULT_MD },
    { id: 'claude',        name: 'Claude', description: '燕麦暖底，Claude 品牌色',  palette: { bg: '#f8f6f0', text: '#2b2b2b', highlight: '#b75c3d' }, defaultMd: DEFAULT_MD },
    { id: 'wechat',        name: '微信',   description: '微信公众号风格，绿色点缀', palette: { bg: '#f7f8f9', text: '#333333', highlight: '#07c160' }, defaultMd: DEFAULT_MD },
    { id: 'media',         name: 'NYT',    description: '纽约时报风格，严肃克制',   palette: { bg: '#fdfaf6', text: '#000000', highlight: '#326891' }, defaultMd: DEFAULT_MD },
    { id: 'medium',        name: 'Medium', description: 'Medium 阅读风格，干净通透', palette: { bg: '#fcfcfc', text: '#242424', highlight: '#1a8917' }, defaultMd: DEFAULT_MD },
    { id: 'stripe',        name: 'Stripe', description: 'Stripe 科技感，深蓝+紫调', palette: { bg: '#f6f9fc', text: '#0a2540', highlight: '#635bff' }, defaultMd: DEFAULT_MD },
    { id: 'workspace',     name: '飞书',   description: '飞书效率风格，蓝色系',     palette: { bg: '#f7f8fa', text: '#1f2329', highlight: '#3370ff' }, defaultMd: DEFAULT_MD },
    { id: 'linear',        name: 'Linear', description: 'Linear 暗色，紫灰科技感',  palette: { bg: '#101114', text: '#d0d0d8', highlight: '#8b90d8', watermark: W }, defaultMd: DEFAULT_MD },
    { id: 'retro',         name: 'Retro',  description: '复古牛皮纸，暖红点缀',     palette: { bg: '#f4ecd8', text: '#2b2621', highlight: '#8c2211' }, defaultMd: DEFAULT_MD },
    { id: 'bloomberg',     name: 'Bloomberg', description: '彭博黑底，霓虹绿点缀',  palette: { bg: '#000000', text: '#ffffff', highlight: '#15fa52', watermark: W }, defaultMd: DEFAULT_MD },
    { id: 'notion',        name: 'Notion', description: 'Notion 米白，中性克制',    palette: { bg: '#ffffff', text: '#37352f', highlight: '#2eaadc' }, defaultMd: DEFAULT_MD },
    { id: 'github',        name: 'GitHub', description: 'GitHub 白底，蓝色链接色',  palette: { bg: '#ffffff', text: '#1f2328', highlight: '#0969da' }, defaultMd: DEFAULT_MD },
    { id: 'sspai',         name: '少数派', description: '少数派红，干净有张力',     palette: { bg: '#ffffff', text: '#111111', highlight: '#d71a1b' }, defaultMd: DEFAULT_MD },
    { id: 'dracula',       name: 'Dracula', description: '吸血鬼暗色，紫粉配橙',   palette: { bg: '#282a36', text: '#f8f8f2', highlight: '#bd93f9', watermark: W }, defaultMd: DEFAULT_MD },
    { id: 'nord',          name: 'Nord',   description: '北欧深色，冰蓝调',        palette: { bg: '#2e3440', text: '#eceff4', highlight: '#88c0d0', watermark: W }, defaultMd: DEFAULT_MD },
    { id: 'sakura',        name: '樱花',   description: '樱粉轻盈，人文情感类',    palette: { bg: '#fef7f9', text: '#4a1528', highlight: '#c44569' }, defaultMd: DEFAULT_MD },
    { id: 'ocean',         name: '深海',   description: '深海暗蓝，珊瑚红点缀',    palette: { bg: '#0c2233', text: '#e0f0ff', highlight: '#ff6b6b', watermark: W }, defaultMd: DEFAULT_MD },
    { id: 'mint',          name: '薄荷',   description: '清凉薄荷绿，清爽健康感',  palette: { bg: '#f0faf5', text: '#0d3d2b', highlight: '#1a7a5a' }, defaultMd: DEFAULT_MD },
    { id: 'sunset',        name: '日落',   description: '日落橙红，温暖有感染力',  palette: { bg: '#fdf6ee', text: '#2c1810', highlight: '#c0582a' }, defaultMd: DEFAULT_MD },
    { id: 'monokai',       name: 'Monokai', description: '代码编辑器经典配色',     palette: { bg: '#272822', text: '#f8f8f2', highlight: '#a6e22e', watermark: W }, defaultMd: DEFAULT_MD },
    { id: 'solarized',     name: 'Solarized', description: 'Solarized 护眼色，暖黄底', palette: { bg: '#fdf6e3', text: '#657b83', highlight: '#268bd2' }, defaultMd: DEFAULT_MD },
    { id: 'cyberpunk',     name: 'Cyberpunk', description: '赛博朋克，霓虹粉+青色', palette: { bg: '#0d0221', text: '#f0e6ff', highlight: '#ff2a6d', watermark: W }, defaultMd: DEFAULT_MD },
    { id: 'ink',           name: '水墨',   description: '黑白水墨，极度克制',      palette: { bg: '#ffffff', text: '#000000', highlight: '#555555' }, defaultMd: DEFAULT_MD },
    { id: 'lavender',      name: '薰衣草', description: '薰衣草紫，柔和优雅',      palette: { bg: '#f5f0ff', text: '#1e0a3c', highlight: '#6b4c9a' }, defaultMd: DEFAULT_MD },
    { id: 'forest',        name: '密林',   description: '深绿密林，自然厚重',      palette: { bg: '#1a2e1a', text: '#d4f0d4', highlight: '#7dce82', watermark: W }, defaultMd: DEFAULT_MD },
    { id: 'glacier',       name: '冰川',   description: '冰川浅蓝，清冽纯净',      palette: { bg: '#eef4fa', text: '#0a2540', highlight: '#1565c0' }, defaultMd: DEFAULT_MD },
    { id: 'coffee',        name: '咖啡',   description: '深焙咖啡，沉稳醇厚',      palette: { bg: '#f5efe6', text: '#2c1810', highlight: '#8b4513' }, defaultMd: DEFAULT_MD },
    { id: 'bauhaus',       name: 'Bauhaus', description: '包豪斯极简，红黑白三色', palette: { bg: '#ffffff', text: '#000000', highlight: '#e30613' }, defaultMd: DEFAULT_MD },
    { id: 'copper',        name: '赤铜',   description: '赤铜暗金，低调奢华感',    palette: { bg: '#1c1410', text: '#f0d0b0', highlight: '#e8a87c', watermark: W }, defaultMd: DEFAULT_MD },
    { id: 'pastel',        name: '彩虹糖', description: '马卡龙粉，活泼少女感',    palette: { bg: '#fefcf8', text: '#333333', highlight: '#e07a94' }, defaultMd: DEFAULT_MD },
];

export const posterThemes: PosterTheme[] = defs.map(({ palette, ...rest }) => ({
    ...rest,
    bgColor: palette.bg,
    css: makePosterCss(rest.id, palette),
}));
