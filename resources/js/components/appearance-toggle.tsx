import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes, useEffect, useState } from 'react';

export default function AppearanceToggle({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const [isDark, setIsDark] = useState(false);

    // Déterminer si on est actuellement en mode dark
    useEffect(() => {
        const checkDarkMode = () => {
            const isCurrentlyDark = 
                appearance === 'dark' || 
                (appearance === 'system' && 
                 typeof window !== 'undefined' && 
                 window.matchMedia('(prefers-color-scheme: dark)').matches);
            setIsDark(isCurrentlyDark);
        };

        checkDarkMode();

        // Écouter les changements du système
        if (appearance === 'system' && typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', checkDarkMode);
            return () => mediaQuery.removeEventListener('change', checkDarkMode);
        }
    }, [appearance]);

    // Écouter les changements de classe dark sur le document
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        // Si on est en dark, passer en light, sinon passer en dark
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <div className={className} {...props}>
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-md"
                onClick={toggleTheme}
                aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
                {isDark ? (
                    <Sun className="h-5 w-5" />
                ) : (
                    <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
    );
}

