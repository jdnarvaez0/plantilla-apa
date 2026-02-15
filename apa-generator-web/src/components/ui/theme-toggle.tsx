'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './button';

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="h-4 w-4" />
            </Button>
        );
    }

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    const getIcon = () => {
        if (theme === 'system') return <Monitor className="h-4 w-4" />;
        if (resolvedTheme === 'dark') return <Moon className="h-4 w-4" />;
        return <Sun className="h-4 w-4" />;
    };

    const getLabel = () => {
        if (theme === 'system') return 'Sistema';
        if (theme === 'dark') return 'Oscuro';
        return 'Claro';
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            className="h-8 w-8 p-0 transition-all duration-300 hover:rotate-12"
            title={`Tema: ${getLabel()}`}
        >
            <div className="transition-transform duration-300">
                {getIcon()}
            </div>
            <span className="sr-only">Cambiar tema: {getLabel()}</span>
        </Button>
    );
}
