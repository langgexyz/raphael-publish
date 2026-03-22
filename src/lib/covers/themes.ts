import type { CoverTheme } from './types';
import { makeCoverCss } from './palette';

const themes: Array<Omit<CoverTheme, 'css'> & { palette: Parameters<typeof makeCoverCss>[1] }> = [
    // ── 经典 ──────────────────────────────────────────────────────────
    {
        id: 'apple', name: 'Mac', description: '纯白极简，Apple 设计语言',
        palette: { leftBg: '#ffffff', rightBg: '#f5f5f7', text: '#111', highlight: '#0066cc', accent: '#0066cc', arrow: '#a0bcd8', gradient: 'rgba(0,102,204,0.08)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'claude', name: 'Claude', description: '燕麦暖底，Claude 品牌色',
        palette: { leftBg: '#f8f6f0', rightBg: '#ede8dc', text: '#2b2b2b', highlight: '#b75c3d', accent: '#b75c3d', arrow: '#d9c4b0', gradient: 'rgba(183,92,61,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'wechat', name: '微信', description: '微信公众号风格，绿色点缀',
        palette: { leftBg: '#f7f8f9', rightBg: '#e8f7ee', text: '#333', highlight: '#07c160', accent: '#07c160', arrow: '#7ecba0', gradient: 'rgba(7,193,96,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'media', name: 'NYT', description: '纽约时报风格，严肃克制',
        palette: { leftBg: '#fdfaf6', rightBg: '#f0ede8', text: '#000', highlight: '#326891', accent: '#326891', arrow: '#8aaab8', gradient: 'rgba(50,104,145,0.08)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'medium', name: 'Medium', description: 'Medium 阅读风格，干净通透',
        palette: { leftBg: '#fcfcfc', rightBg: '#f2f3f5', text: '#242424', highlight: '#1a8917', accent: '#1a8917', arrow: '#80c898', gradient: 'rgba(26,137,23,0.08)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'stripe', name: 'Stripe', description: 'Stripe 科技感，深蓝+紫调',
        palette: { leftBg: '#f6f9fc', rightBg: '#eef1f8', text: '#0a2540', highlight: '#635bff', accent: '#635bff', arrow: '#bbb8ff', gradient: 'rgba(99,91,255,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'workspace', name: '飞书', description: '飞书效率风格，蓝色系',
        palette: { leftBg: '#f7f8fa', rightBg: '#ebeffa', text: '#1f2329', highlight: '#3370ff', accent: '#3370ff', arrow: '#a0b8ff', gradient: 'rgba(51,112,255,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'linear', name: 'Linear', description: 'Linear 暗色，紫灰科技感',
        palette: { leftBg: '#101114', rightBg: '#16181c', text: '#ffffff', highlight: '#5e6ad2', accent: '#8b90d8', arrow: '#2e3058', gradient: 'rgba(94,106,210,0.12)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'retro', name: 'Retro', description: '复古牛皮纸，暖红点缀',
        palette: { leftBg: '#f4ecd8', rightBg: '#e8dcc4', text: '#2b2621', highlight: '#8c2211', accent: '#8c2211', arrow: '#c49a8a', gradient: 'rgba(140,34,17,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'bloomberg', name: 'Bloomberg', description: '彭博黑底，霓虹绿点缀',
        palette: { leftBg: '#000000', rightBg: '#111111', text: '#ffffff', highlight: '#15fa52', accent: '#15fa52', arrow: '#1a6630', gradient: 'rgba(21,250,82,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    // ── 潮流 ──────────────────────────────────────────────────────────
    {
        id: 'notion', name: 'Notion', description: 'Notion 米白，中性克制',
        palette: { leftBg: '#ffffff', rightBg: '#f7f6f3', text: '#37352f', highlight: '#2eaadc', accent: '#2eaadc', arrow: '#a0cce0', gradient: 'rgba(46,170,220,0.08)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'github', name: 'GitHub', description: 'GitHub 白底，蓝色链接色',
        palette: { leftBg: '#ffffff', rightBg: '#f6f8fa', text: '#1f2328', highlight: '#0969da', accent: '#0969da', arrow: '#a0c4e8', gradient: 'rgba(9,105,218,0.08)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'sspai', name: '少数派', description: '少数派红，干净有张力',
        palette: { leftBg: '#ffffff', rightBg: '#fff0f0', text: '#111', highlight: '#d71a1b', accent: '#d71a1b', arrow: '#f0a0a0', gradient: 'rgba(215,26,27,0.08)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'dracula', name: 'Dracula', description: '吸血鬼暗色，紫粉配橙',
        palette: { leftBg: '#282a36', rightBg: '#1e2029', text: '#f8f8f2', highlight: '#bd93f9', accent: '#ffb86c', arrow: '#44475a', gradient: 'rgba(189,147,249,0.12)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'nord', name: 'Nord', description: '北欧深色，冰蓝调',
        palette: { leftBg: '#2e3440', rightBg: '#252932', text: '#eceff4', highlight: '#88c0d0', accent: '#81a1c1', arrow: '#4c566a', gradient: 'rgba(136,192,208,0.12)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'sakura', name: '樱花', description: '樱粉轻盈，适合人文情感类',
        palette: { leftBg: '#fef7f9', rightBg: '#fce4ec', text: '#4a1528', highlight: '#c44569', accent: '#e91e8c', arrow: '#f8bbd9', gradient: 'rgba(196,69,105,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'ocean', name: '深海', description: '深海暗蓝，珊瑚红+金黄点缀',
        palette: { leftBg: '#0c2233', rightBg: '#091929', text: '#e0f0ff', highlight: '#ff6b6b', accent: '#feca57', arrow: '#2d5a7a', gradient: 'rgba(255,107,107,0.12)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'mint', name: '薄荷', description: '清凉薄荷绿，清爽健康感',
        palette: { leftBg: '#f0faf5', rightBg: '#d4f0e4', text: '#0d3d2b', highlight: '#1a7a5a', accent: '#1a7a5a', arrow: '#7ec8a0', gradient: 'rgba(26,122,90,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'sunset', name: '日落', description: '日落橙红，温暖有感染力',
        palette: { leftBg: '#fdf6ee', rightBg: '#fae8d4', text: '#2c1810', highlight: '#c0582a', accent: '#c0582a', arrow: '#e8a87c', gradient: 'rgba(192,88,42,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'monokai', name: 'Monokai', description: '代码编辑器经典配色',
        palette: { leftBg: '#272822', rightBg: '#1e1f1a', text: '#f8f8f2', highlight: '#a6e22e', accent: '#f92672', arrow: '#75715e', gradient: 'rgba(166,226,46,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    // ── 更多风格 ──────────────────────────────────────────────────────
    {
        id: 'solarized', name: 'Solarized', description: 'Solarized 护眼色，暖黄底',
        palette: { leftBg: '#fdf6e3', rightBg: '#eee8d5', text: '#657b83', highlight: '#268bd2', accent: '#cb4b16', arrow: '#93a1a1', gradient: 'rgba(38,139,210,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'cyberpunk', name: 'Cyberpunk', description: '赛博朋克，霓虹粉+青色',
        palette: { leftBg: '#0d0221', rightBg: '#050114', text: '#f0e6ff', highlight: '#ff2a6d', accent: '#05d9e8', arrow: '#2a0550', gradient: 'rgba(255,42,109,0.15)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'ink', name: '水墨', description: '黑白水墨，极度克制',
        palette: { leftBg: '#ffffff', rightBg: '#f5f5f5', text: '#000000', highlight: '#555555', accent: '#888888', arrow: '#cccccc', gradient: 'rgba(0,0,0,0.04)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'lavender', name: '薰衣草', description: '薰衣草紫，柔和优雅',
        palette: { leftBg: '#f5f0ff', rightBg: '#ede5ff', text: '#1e0a3c', highlight: '#6b4c9a', accent: '#9370d0', arrow: '#c4a8f5', gradient: 'rgba(107,76,154,0.12)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'forest', name: '密林', description: '深绿密林，自然厚重',
        palette: { leftBg: '#1a2e1a', rightBg: '#152415', text: '#d4f0d4', highlight: '#7dce82', accent: '#a8e6a8', arrow: '#3d6b3d', gradient: 'rgba(125,206,130,0.12)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'glacier', name: '冰川', description: '冰川浅蓝，清冽纯净',
        palette: { leftBg: '#eef4fa', rightBg: '#ddeaf8', text: '#0a2540', highlight: '#1565c0', accent: '#1565c0', arrow: '#80aad8', gradient: 'rgba(21,101,192,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'coffee', name: '咖啡', description: '深焙咖啡，沉稳醇厚',
        palette: { leftBg: '#f5efe6', rightBg: '#e8ddd0', text: '#2c1810', highlight: '#8b4513', accent: '#a0522d', arrow: '#c4956a', gradient: 'rgba(139,69,19,0.12)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'bauhaus', name: 'Bauhaus', description: '包豪斯极简，红黑白三色',
        palette: { leftBg: '#ffffff', rightBg: '#fff5f5', text: '#000000', highlight: '#e30613', accent: '#e30613', arrow: '#f0a0a5', gradient: 'rgba(227,6,19,0.08)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'copper', name: '赤铜', description: '赤铜暗金，低调奢华感',
        palette: { leftBg: '#1c1410', rightBg: '#150f0c', text: '#f0d0b0', highlight: '#e8a87c', accent: '#d4956a', arrow: '#6b4a30', gradient: 'rgba(232,168,124,0.12)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    {
        id: 'pastel', name: '彩虹糖', description: '马卡龙粉，活泼少女感',
        palette: { leftBg: '#fefcf8', rightBg: '#fde8ec', text: '#333333', highlight: '#e07a94', accent: '#b06080', arrow: '#f4b8c8', gradient: 'rgba(224,122,148,0.10)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
    // ── 绿意（原始主题，保留在最后方便参考）─────────────────────────
    {
        id: 'green-minimal', name: '绿意', description: '清新绿底，适合技术类文章封面',
        palette: { leftBg: '#e6f5ef', rightBg: '#d4eedd', text: '#111', highlight: '#22a854', accent: '#e05c3a', arrow: '#88c9a3', gradient: 'rgba(34,168,84,0.15)' },
        leftDefaultMd: `# Claude Code 不好用？\n# **协作方式**没建立好！\n### （目标 → 执行 → 验收）`,
        rightDefaultMd: `# ① 目标\n\n---\n\n# ② 执行\n\n---\n\n# ③ 验收`,
    },
];

export const coverThemes: CoverTheme[] = themes.map(({ palette, ...rest }) => ({
    ...rest,
    css: makeCoverCss(rest.id, palette),
    palette,
}));

export const defaultCoverThemeId = coverThemes[0].id;
