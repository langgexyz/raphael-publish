import type { ReactNode } from 'react';
import { Moon, Sun, Github, FileText, Image, Type, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

type AppMode = 'article' | 'cover' | 'poster' | 'article-cards';

interface HeaderProps {
    themeMode: 'light' | 'dark';
    onToggleTheme: () => void;
    appMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

export default function Header({ themeMode, onToggleTheme, appMode, onModeChange }: HeaderProps) {
    const modes: { key: AppMode; label: string; icon: ReactNode }[] = [
        { key: 'article', label: '文章', icon: <FileText size={14} /> },
        { key: 'cover', label: '封面', icon: <Image size={14} /> },
        { key: 'poster', label: '大字报', icon: <Type size={14} /> },
        { key: 'article-cards', label: '分页卡', icon: <BookOpen size={14} /> },
    ];

    return (
        <header className="glass flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-[100]">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-black dark:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5 7.5L5 19H10.5C13.5376 19 16 16.5376 16 13.5C16 10.4624 13.5376 8 10.5 8H8.5V11.5L16.5 7.5Z" fill="var(--color-fg)" className="fill-white dark:fill-black" />
                        <path d="M8.5 4H10.5C15.7467 4 20 8.25329 20 13.5C20 18.7467 15.7467 23 10.5 23H4V4H8.5Z" fill="none" strokeWidth="2.5" stroke="currentColor" className="text-white dark:text-black" />
                        <path d="M4 11.5H8.5" strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" className="text-white dark:text-black" />
                    </svg>
                </div>
                <span className="font-bold text-lg tracking-tight text-black dark:text-white">Raphael Publish<span className="hidden sm:inline"> - 公众号排版大师</span></span>
            </div>

            {/* 模式切换 */}
            <div className="flex bg-black/5 dark:bg-white/10 p-1 rounded-full">
                {modes.map(({ key, label, icon }) => (
                    <button
                        key={key}
                        onClick={() => onModeChange(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all ${appMode === key ? 'bg-white dark:bg-[#2c2c2e] shadow-sm text-black dark:text-white' : 'text-[#86868b] dark:text-[#a1a1a6]'}`}
                    >
                        {icon}
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://github.com/liuxiaopai-ai/raphael-publish"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <Github size={20} />
                </motion.a>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onToggleTheme}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    {themeMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.button>
            </div>
        </header>
    );
}
