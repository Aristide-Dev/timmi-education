// import { dashboard, login, register, about, contact, home, apiDocumentation, pricing } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, LogIn, UserPlus, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboard, home as welcomeHome, register } from '@/routes';
import { login } from '@/routes';
import AppearanceToggle from '@/components/appearance-toggle';

export default function WelcomeNavigation() {
    const { auth } = usePage<SharedData>().props;
    const { url } = usePage().props;

    const navigationLinks = [
        { href: welcomeHome().url, label: 'Accueil', icon: Home },
    ];

    // Fonction pour vérifier si un lien est actif
    const isActiveLink = (href: string) => {
        const currentPath = url || window.location.pathname;
        const linkPath = href.replace(/^https?:\/\/[^/]+/, '') || '/';

        // Pour la page d'accueil, vérifier si c'est exactement "/"
        if (linkPath === '/') {
            return currentPath === '/';
        }

        // Pour les autres pages, vérifier si le chemin commence par le lien
        return currentPath.toString().startsWith(linkPath);
    };

    return (
        <nav className="flex justify-between gap-4 w-full items-center">
            {/* Liens de navigation avec effet glassmorphism au hover */}
            <div className="flex items-center gap-2">
                <img
                    src="/favicon.svg"
                    className="size-10 lg:size-14 rounded-lg mx-0 md:mx-5"
                />
                {navigationLinks.map(({ href, label, icon: Icon }) => {
                    const isActive = isActiveLink(href.toString());

                    return (
                        <Link
                            key={href?.toString() || ''}
                            href={href?.toString() || ''}
                            title={label}
                            className={cn(
                                "group relative hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg overflow-hidden transition-all duration-300",
                                isActive
                                    ? "text-[color:var(--primary-500)] bg-[color:var(--primary-500)]/10 border border-[color:var(--accent-500)]/10 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {/* Effet de fond au hover ou état actif */}
                            <span className={cn(
                                "absolute inset-0 bg-gradient-to-r from-[color:var(--primary-500)]/0 via-[color:var(--primary-500)]/5 to-[color:var(--primary-500)]/0 transition-opacity duration-300 rounded-lg",
                                isActive
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                            )}></span>

                            {/* Bordure animée */}
                            <span className={cn(
                                "absolute inset-0 rounded-lg border transition-colors duration-300",
                                isActive
                                    ? "border-[color:var(--primary-500)]/30"
                                    : "border-transparent group-hover:border-[color:var(--primary-500)]/20"
                            )}></span>

                            {/* Icône avec animation */}
                            <Icon className={cn(
                                "h-4 w-4 relative z-10 transition-all duration-300",
                                isActive
                                    ? "text-[color:var(--primary-500)] scale-110"
                                    : "group-hover:scale-110 group-hover:rotate-3"
                            )} />

                            {/* Label */}
                            <span className={cn(
                                "relative z-10 hidden sm:inline",
                                isActive && "text-[color:var(--primary-500)] font-semibold"
                            )}>{label}</span>

                            {/* Indicateur de survol ou actif */}
                            <span className={cn(
                                "absolute bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[color:var(--accent-500)] to-transparent transition-all duration-300",
                                isActive
                                    ? "left-0 w-full"
                                    : "left-1/2 w-0 group-hover:w-full group-hover:left-0"
                            )}></span>

                            {/* Point d'indicateur pour l'état actif */}
                            {isActive && (
                                <span className="absolute -top-1 -right-1 h-2 w-2 bg-[color:var(--primary-500)] rounded-full animate-pulse"></span>
                            )}
                        </Link>
                    );
                })}
            </div>
            <AppearanceToggle  className='md:hidden'/>

            {/* Liens d'authentification avec glassmorphism */}
            <div className="hidden md:flex items-center gap-2">
            <AppearanceToggle />
                {auth?.user ? (
                    <Link
                        key="auth-dashboard"
                        href={dashboard()}
                        className={cn(
                            "group relative flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-sm text-sm font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95",
                            isActiveLink(dashboard().url)
                                ? "bg-[color:var(--primary-500)]/20 border border-[color:var(--primary-500)]/40 text-[color:var(--primary-500)] shadow-lg shadow-[color:var(--primary-500)]/20"
                                : "bg-background/60 border border-[color:var(--primary-500)]/20 text-foreground hover:shadow-[color:var(--primary-500)]/20"
                        )}
                    >
                        {/* Gradient animé au hover ou actif */}
                        <span className={cn(
                            "absolute inset-0 bg-gradient-to-r from-[color:var(--primary-500)]/10 via-[color:var(--primary-500)]/5 to-[color:var(--primary-500)]/10 transition-opacity duration-300",
                            isActiveLink(dashboard().url)
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                        )}></span>

                        <LayoutDashboard className={cn(
                            "h-4 w-4 relative z-10 transition-transform duration-300",
                            isActiveLink(dashboard().url)
                                ? "rotate-12"
                                : "group-hover:rotate-12"
                        )} />
                        <span className="relative z-10">Dashboard</span>

                        {/* Shine effect */}
                        <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700"></span>

                        {/* Indicateur actif */}
                        {isActiveLink(dashboard().url) && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-[color:var(--primary-500)] rounded-full animate-pulse"></span>
                        )}
                    </Link>
                ) : (
                    <>
                        <Link
                            key="auth-login"
                            href={login()}
                            className={cn(
                                "group relative flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-sm text-sm font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95",
                                isActiveLink(login().url)
                                    ? "bg-[color:var(--primary-500)]/10 border border-[color:var(--primary-500)]/30 text-[color:var(--primary-500)] shadow-md"
                                    : "bg-[color:var(--primary-500)]/10 border border-border/50 text-foreground hover:border-[color:var(--primary-500)]/30"
                            )}
                        >
                            {/* Gradient subtil au hover ou actif */}
                            <span className={cn(
                                "absolute inset-0 bg-gradient-to-r from-[color:var(--primary-500)]/5 to-[color:var(--primary-500)]/10 transition-opacity duration-300",
                                isActiveLink(login().url)
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                            )}></span>

                            <LogIn className={cn(
                                "h-4 w-4 relative z-10 transition-transform duration-300",
                                isActiveLink(login().url)
                                    ? "translate-x-1"
                                    : "group-hover:translate-x-1"
                            )} />
                            <span className="relative z-10">Se connecter</span>

                            {/* Indicateur actif */}
                            {isActiveLink(login().url) && (
                                <span className="absolute -top-1 -right-1 h-2 w-2 bg-[color:var(--primary-500)] rounded-full animate-pulse"></span>
                            )}
                        </Link>

                        <Link
                            key="auth-register"
                            href={register()}
                            className={cn(
                                "group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 text-white",
                                isActiveLink(register().url)
                                    ? "bg-gradient-to-r from-[color:var(--primary-500)] to-[color:var(--primary-700)] shadow-xl shadow-[color:var(--primary-500)]/30"
                                    : "bg-gradient-to-r from-[color:var(--primary-500)] to-[color:var(--primary-700)] hover:shadow-[color:var(--primary-500)]/30"
                            )}
                        >
                            {/* Overlay au hover ou actif */}
                            <span className={cn(
                                "absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-opacity duration-300",
                                isActiveLink(register().url)
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                            )}></span>

                            <UserPlus className={cn(
                                "h-4 w-4 relative z-10 transition-transform duration-300",
                                isActiveLink(register().url)
                                    ? "scale-110"
                                    : "group-hover:scale-110"
                            )} />
                            <span className="relative z-10">S'inscrire</span>

                            {/* Shine effect animé */}
                            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700"></span>

                            {/* Pulse ring */}
                            <span className={cn(
                                "absolute inset-0 rounded-xl bg-[color:var(--primary-500)]/30 transition-opacity duration-300",
                                isActiveLink(register().url)
                                    ? "opacity-100 animate-ping"
                                    : "opacity-0 group-hover:opacity-100 group-hover:animate-ping"
                            )}></span>

                            {/* Indicateur actif */}
                            {isActiveLink(register().url) && (
                                <span className="absolute -top-1 -right-1 h-2 w-2 bg-white rounded-full animate-pulse"></span>
                            )}
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
