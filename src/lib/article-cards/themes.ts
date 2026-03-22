import type { CardTheme } from './types';
import { makeCardCss } from './palette';

const L = 'rgba(0,0,0,0.08)';   // light border
const D = 'rgba(255,255,255,0.08)'; // dark border

const DEFAULT_BODY = `见字如面。写了很多，但很少觉得哪一篇"真的写好了"。每一篇，都让我比上一篇想得更清楚一点。

## 写作的本质

写作不是表达，是**整理思维的过程**。

你以为自己想清楚了，但一旦落笔，就会发现哪里是空洞，哪里是矛盾。

> 写作是给自己的照妖镜。

<!-- page -->

## 为什么要持续写

输出有复利。

- 第 1 篇：你在学怎么开头
- 第 10 篇：你在学怎么找节奏
- 第 100 篇：你在学怎么让人读完

**频率比质量更重要。** 等"写好了"再发，不如先发、再改、再发。

---

不要等完美，先完成。

<!-- page -->

## 怎么开始

### 第一步：把想法倒出来

不管顺序，不管语法，先把脑子里的东西全部写下来。

### 第二步：找一条主线

找出最重要的那个观点，其他的服务于它，或者删掉。

### 第三步：删到不能再删

好文章不是写出来的，是**删**出来的。

<!-- page -->

## 写给谁看

先写给自己看。

当你能说服自己，才有可能说服别人。

> 最好的写作，是作者完全清醒，读者毫不费力。

**你不需要等到"有东西写"再开始。写，就会有东西写。**`;

function md(title: string, watermark: string): string {
    return `---\ntitle: ${title}\nwatermark: ${watermark}\n---\n${DEFAULT_BODY}`;
}

const defs: Array<Omit<CardTheme, 'css'> & { palette: Parameters<typeof makeCardCss>[1] }> = [
    { id: 'lang-green', name: '浪绿',    description: '品牌默认，清新绿底',        palette: { bg: '#f9fcfa', text: '#2a2a2a', highlight: '#22a854', meta: '#999', border: L }, defaultMd: md('每一次输出，**都是一次练习**', '公众号 · 浪哥闲谭') },
    { id: 'apple',      name: 'Mac',     description: '纯白极简，Apple 设计语言',  palette: { bg: '#ffffff', text: '#111111', highlight: '#0066cc', meta: '#999', border: L }, defaultMd: md('Think Different，**认真对待每个字**', 'Apple Notes ·') },
    { id: 'claude',     name: 'Claude',  description: '燕麦暖底，Claude 品牌色',   palette: { bg: '#faf8f4', text: '#2b2b2b', highlight: '#b75c3d', meta: '#aaa', border: L }, defaultMd: md('智识生长，**每字皆有温度**', 'Claude Notes ·') },
    { id: 'wechat',     name: '微信',    description: '微信公众号风格，绿色点缀',  palette: { bg: '#f7f8f9', text: '#333333', highlight: '#07c160', meta: '#aaa', border: L }, defaultMd: md('公众号**创作**指南，从这里开始', '微信公众号 ·') },
    { id: 'media',      name: 'NYT',     description: '纽约时报风格，严肃克制',    palette: { bg: '#fdfaf6', text: '#1a1a1a', highlight: '#326891', meta: '#999', border: L }, defaultMd: md('All the Words **Fit to Print**', 'The Correspondent ·') },
    { id: 'medium',     name: 'Medium',  description: 'Medium 阅读风格，干净通透', palette: { bg: '#fcfcfc', text: '#242424', highlight: '#1a8917', meta: '#aaa', border: L }, defaultMd: md('Writing is **Thinking** in Disguise', 'Medium Notes ·') },
    { id: 'stripe',     name: 'Stripe',  description: 'Stripe 科技感，深蓝+紫调',  palette: { bg: '#f6f9fc', text: '#0a2540', highlight: '#635bff', meta: '#999', border: L }, defaultMd: md('Build Something **People Want**', 'Stripe Notes ·') },
    { id: 'workspace',  name: '飞书',    description: '飞书效率风格，蓝色系',      palette: { bg: '#f7f8fa', text: '#1f2329', highlight: '#3370ff', meta: '#aaa', border: L }, defaultMd: md('**高效**协作的底层逻辑', '飞书效率 ·') },
    { id: 'cobalt',     name: '湛蓝',    description: '冷白底，湛蓝高亮',          palette: { bg: '#f4f7fc', text: '#1f2a40', highlight: '#1565c0', meta: '#aaa', border: L }, defaultMd: md('思维的**深水区**，持续下潜', 'Deep Think ·') },
    { id: 'linear',     name: 'Linear',  description: 'Linear 暗色，紫灰科技感',   palette: { bg: '#101114', text: '#d0d0d8', highlight: '#8b90d8', meta: '#888', border: D }, defaultMd: md('**代码**背后的产品哲学', 'Linear Notes ·') },
    { id: 'retro',      name: 'Retro',   description: '复古牛皮纸，暖红点缀',      palette: { bg: '#f4ecd8', text: '#2b2621', highlight: '#8c2211', meta: '#aaa', border: L }, defaultMd: md('旧时光里的**新智慧**', '复古笔记 ·') },
    { id: 'bloomberg',  name: 'Bloomberg', description: '彭博黑底，霓虹绿点缀',   palette: { bg: '#000000', text: '#ffffff', highlight: '#15fa52', meta: '#999', border: D }, defaultMd: md('**Markets** Move Fast, Think Slow', 'Bloomberg ·') },
    { id: 'notion',     name: 'Notion',  description: 'Notion 米白，中性克制',     palette: { bg: '#ffffff', text: '#37352f', highlight: '#2eaadc', meta: '#aaa', border: L }, defaultMd: md('Your Second Brain，**从这里开始**', 'Notion Notes ·') },
    { id: 'github',     name: 'GitHub',  description: 'GitHub 白底，蓝色链接色',   palette: { bg: '#ffffff', text: '#1f2328', highlight: '#0969da', meta: '#aaa', border: L }, defaultMd: md('Open Source **Thinking**', 'GitHub Notes ·') },
    { id: 'sspai',      name: '少数派',  description: '少数派红，干净有张力',      palette: { bg: '#ffffff', text: '#111111', highlight: '#d71a1b', meta: '#aaa', border: L }, defaultMd: md('少数派的**高效**之道', '少数派 ·') },
    { id: 'dracula',    name: 'Dracula', description: '吸血鬼暗色，紫粉配橙',      palette: { bg: '#282a36', text: '#f8f8f2', highlight: '#bd93f9', meta: '#aaa', border: D }, defaultMd: md('**暗夜**中的代码哲学', 'Dracula Notes ·') },
    { id: 'nord',       name: 'Nord',    description: '北欧深色，冰蓝调',          palette: { bg: '#2e3440', text: '#eceff4', highlight: '#88c0d0', meta: '#aaa', border: D }, defaultMd: md('北欧极简的**设计哲学**', 'Nord Notes ·') },
    { id: 'sakura',     name: '樱粉',    description: '樱粉轻盈，人文情感类',      palette: { bg: '#fef7f9', text: '#3a1a28', highlight: '#c44569', meta: '#bbb', border: L }, defaultMd: md('**樱花**时节，写点什么', 'Cherry Blossom ·') },
    { id: 'ocean',      name: '深海',    description: '深海暗蓝，珊瑚红点缀',      palette: { bg: '#0c2233', text: '#e0f0ff', highlight: '#ff6b6b', meta: '#888', border: D }, defaultMd: md('**深海**之下，思维扎根', 'Ocean Notes ·') },
    { id: 'mint',       name: '薄荷',    description: '清凉薄荷绿，清爽健康感',    palette: { bg: '#f0faf5', text: '#0d3d2b', highlight: '#1a7a5a', meta: '#999', border: L }, defaultMd: md('清爽**薄荷**，清醒写作', 'Mint Fresh ·') },
    { id: 'sunset',     name: '日落',    description: '日落橙红，温暖有感染力',    palette: { bg: '#fdf6ee', text: '#2c1810', highlight: '#c0582a', meta: '#aaa', border: L }, defaultMd: md('**日落**时分的创作感想', 'Sunset Notes ·') },
    { id: 'monokai',    name: 'Monokai', description: '代码编辑器经典配色',        palette: { bg: '#272822', text: '#f8f8f2', highlight: '#a6e22e', meta: '#888', border: D }, defaultMd: md('**代码**即思想，写作即编程', 'Monokai ·') },
    { id: 'solarized',  name: 'Solarized', description: 'Solarized 护眼色，暖黄底', palette: { bg: '#fdf6e3', text: '#657b83', highlight: '#268bd2', meta: '#aaa', border: L }, defaultMd: md('**护眼**写作，深度阅读', 'Solarized ·') },
    { id: 'cyberpunk',  name: 'Cyberpunk', description: '赛博朋克，霓虹粉+青色',  palette: { bg: '#0d0221', text: '#f0e6ff', highlight: '#ff2a6d', meta: '#888', border: D }, defaultMd: md('**赛博**时代的创作革命', 'Cyberpunk ·') },
    { id: 'ink',        name: '水墨',    description: '黑白水墨，极度克制',        palette: { bg: '#ffffff', text: '#000000', highlight: '#555555', meta: '#aaa', border: L }, defaultMd: md('**水墨**极简，每字入魂', '水墨笔记 ·') },
    { id: 'lavender',   name: '薰衣草',  description: '薰衣草紫，柔和优雅',        palette: { bg: '#f5f0ff', text: '#1e0a3c', highlight: '#6b4c9a', meta: '#aaa', border: L }, defaultMd: md('**薰衣草**香，文字柔', 'Lavender ·') },
    { id: 'forest',     name: '密林',    description: '深绿密林，自然厚重',        palette: { bg: '#1a2e1a', text: '#d4f0d4', highlight: '#7dce82', meta: '#888', border: D }, defaultMd: md('**密林**深处，思维生长', 'Forest Notes ·') },
    { id: 'glacier',    name: '冰川',    description: '冰川浅蓝，清冽纯净',        palette: { bg: '#eef4fa', text: '#0a2540', highlight: '#1565c0', meta: '#aaa', border: L }, defaultMd: md('**冰川**之上，清冽思考', 'Glacier Notes ·') },
    { id: 'coffee',     name: '咖啡',    description: '深焙咖啡，沉稳醇厚',        palette: { bg: '#f5efe6', text: '#2c1810', highlight: '#8b4513', meta: '#aaa', border: L }, defaultMd: md('**咖啡**时光，醇厚创作', 'Coffee & Words ·') },
    { id: 'bauhaus',    name: 'Bauhaus', description: '包豪斯极简，红黑白三色',    palette: { bg: '#ffffff', text: '#000000', highlight: '#e30613', meta: '#aaa', border: L }, defaultMd: md('**包豪斯**极简设计哲学', 'Bauhaus ·') },
    { id: 'copper',     name: '赤铜',    description: '赤铜暗金，低调奢华感',      palette: { bg: '#1c1410', text: '#f0d0b0', highlight: '#e8a87c', meta: '#888', border: D }, defaultMd: md('**赤铜**质感，沉稳输出', 'Copper Notes ·') },
    { id: 'pastel',     name: '彩虹糖',  description: '马卡龙粉，活泼少女感',      palette: { bg: '#fefcf8', text: '#333333', highlight: '#e07a94', meta: '#aaa', border: L }, defaultMd: md('**彩虹糖**色的知识卡片', 'Pastel Notes ·') },
    { id: 'stone',      name: '石板',    description: '米白底，沉静克制',          palette: { bg: '#f8f6f2', text: '#2b2621', highlight: '#6b4c30', meta: '#aaa', border: L }, defaultMd: md('**石板**沉静，每字入心', 'Stone Notes ·') },
];

export const cardThemes: CardTheme[] = defs.map(({ palette, ...rest }) => ({
    ...rest,
    css: makeCardCss(rest.id, palette),
    palette,
}));
