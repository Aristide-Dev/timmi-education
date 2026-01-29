import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { Heart, Phone, Mail, Facebook } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import React from 'react';
import WelcomeNavigation from '@/components/welcome-navigation';
import { WelcomeMobileNavigation } from '@/components/welcome-mobile-navigation';
import { Float } from '@/components/animations';
import { home as welcomeHome } from '@/routes';

interface WelcomeLayoutProps {
    children: ReactNode;
    title?: string;
    className?: string;
}

export default function WelcomeLayout({
    children,
    title = 'Welcome',
    className = '',
}: WelcomeLayoutProps) {


    // Générer les positions et tailles aléatoires des particules une seule fois
    const [particleStyles] = useState(() => {
        return Array.from({ length: 10 }, () => ({
            top: `${(Math.random() * 100) + 5}%`,
            left: `${(Math.random() * 100) + 5}%`,
            width: `${(Math.random() * 15) + 5}px`,
            height: `${(Math.random() * 15) + 5}px`,
        }));
    });

    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className={cn(
                'relative flex min-h-screen flex-col items-center bg-gradient-to-r from-background via-[color:var(--primary-500)] to-background p-6 text-foreground lg:justify-center lg:p-8 overflow-hidden pb-0',
                className
            )}>
                {/* Fond décoratif avec courbes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1200 800" preserveAspectRatio="none">
                    <path d="M0,200 Q300,100 600,200 T1200,200 L1200,800 L0,800 Z" fill="currentColor" className="text-primary" />
                    <path d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z" fill="currentColor" className="text-accent" />
                </svg>

                {/* Particules flottantes */}
                {particleStyles.map((style, i) => (
                    <Float key={`particle-help-${i}`} amplitude={20} duration={5 + i * 0.3}>
                        <div
                            className="absolute rounded-full bg-gradient-to-br from-primary/10 to-accent/10"
                            style={style}
                        />
                    </Float>
                ))}
                </div>

                {/* Animated gradient blobs avec effets améliorés */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[color:var(--primary-500)]/20 via-[color:var(--primary-500)]/10 to-transparent blur-3xl animate-blob" />
                    <div className="absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-[color:var(--accent-500)]/10 via-[color:var(--primary-500)]/5 to-transparent blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-32 left-20 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-[color:var(--primary-500)]/15 via-[color:var(--accent-500)]/5 to-transparent blur-3xl animate-blob animation-delay-4000" />
                </div>

                {/* Header avec navigation - Design amélioré */}
                <header className="relative z-[100] mb-12 w-full max-w-5xl not-has-[nav]:hidden lg:max-w-5xl animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center justify-between gap-4 rounded-3xl bg-background/60 backdrop-blur-2xl border border-border/50 shadow-2xl shadow-[color:var(--primary-500)]/5 p-5 transition-all duration-300 hover:bg-background/70 hover:shadow-[color:var(--primary-500)]/10">
                        <WelcomeNavigation />
                    </div>
                </header>

                {/* Contenu principal avec effet de profondeur */}
                <div className="relative z-10 flex w-full items-center justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 lg:grow">
                    <div className="w-full max-w-5xl">
                        {children}
                    </div>
                </div>

                {/* Footer redessiné */}
                <footer className="relative z-10 mt-12 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <div className="flex flex-col items-center gap-8">
                        {/* Card d'information améliorée */}
                        <div className="relative w-full group/footer">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[color:var(--primary-500)]/20 via-[color:var(--accent-500)]/20 to-[color:var(--primary-500)]/20 rounded-3xl blur opacity-30 group-hover/footer:opacity-50 transition duration-500" />
                            <div className="relative rounded-3xl bg-background/70 backdrop-blur-2xl border border-border/50 p-8 shadow-xl transition-all duration-300 hover:bg-background/80 hover:shadow-2xl w-full">
                                {/* En-tête du footer */}
                                <div className="flex flex-col items-center gap-4 mb-6">
                                    <div className="flex items-center justify-center gap-2">
                                        <Heart className="h-6 w-6 text-[color:var(--primary-500)] animate-pulse" />
                                        <p className="text-xl font-bold bg-gradient-to-r from-[color:var(--primary-500)] via-[color:var(--accent-500)] to-[color:var(--primary-500)] bg-clip-text text-transparent animate-gradient">
                                            Timmi
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground text-center max-w-md">
                                        La plateforme qui connecte parents et professeurs particuliers pour l'excellence éducative
                                    </p>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

                                {/* Liens de navigation */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-sm font-semibold text-foreground mb-2">Navigation</h3>
                                        <Link
                                            href={welcomeHome()}
                                            className="text-sm text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors"
                                        >
                                            Accueil
                                        </Link>
                                        <Link
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors"
                                        >
                                            Blog
                                        </Link>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-sm font-semibold text-foreground mb-2">Ressources</h3>
                                        <Link
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors"
                                        >
                                            Contact
                                        </Link>
                                        <Link
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors"
                                        >
                                            À propos
                                        </Link>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-sm font-semibold text-foreground mb-2">Légal</h3>
                                        <Link
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors"
                                        >
                                            Mentions légales
                                        </Link>
                                        <Link
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors"
                                        >
                                            Politique de confidentialité
                                        </Link>
                                        <Link
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors"
                                        >
                                            CGU
                                        </Link>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-sm font-semibold text-foreground mb-2">Contact</h3>
                                        <a
                                            href={`mailto:contact@timmiguinee.com`}
                                            className="text-sm text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors flex items-center gap-2"
                                        >
                                            <Mail className="h-4 w-4" />
                                            contact@timmiguinee.com
                                        </a>
                                        <a
                                            href={`tel:+224623675418 `}
                                            className="text-sm text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors flex items-center gap-2"
                                        >
                                            <Phone className="h-4 w-4" />
                                            +224 623 675 418
                                        </a>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

                                {/* Réseaux sociaux et copyright */}
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <p className="text-xs text-muted-foreground/90 text-center md:text-left">
                                        © {new Date().getFullYear()} <span className="font-semibold text-foreground">Timmi</span> - Tous droits réservés
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <a
                                            href="https://www.facebook.com/profile.php?id=61583650817827"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors"
                                            aria-label="Facebook"
                                        >
                                            <Facebook className="h-5 w-5" />
                                        </a>
                                        <a
                                            href="https://www.tiktok.com/@timmi.education"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-[color:var(--primary-500)] transition-colors"
                                            aria-label="Tiktok"
                                        >
                                            <img src="/img/tiktok.svg" alt="Tiktok" className="h-5 w-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

                <div className="hidden h-14.5 lg:block" />
            </div>

            {/* Menu mobile fixe */}
            <div className="block md:hidden">
                <WelcomeMobileNavigation />
            </div>

            <style>{`
                @keyframes spin-in {
                    from {
                        transform: rotate(-180deg) scale(0.8);
                        opacity: 0.5;
                    }
                    to {
                        transform: rotate(0deg) scale(1);
                        opacity: 1;
                    }
                }

                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }

                @keyframes gradient {
                    0%, 100% {
                        background-size: 200% 200%;
                        background-position: left center;
                    }
                    50% {
                        background-size: 200% 200%;
                        background-position: right center;
                    }
                }

                .animate-spin-in {
                    animation: spin-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .animate-blob {
                    animation: blob 8s infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .animation-delay-500 {
                    animation-delay: 0.5s;
                }

                .animate-gradient {
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </>
    );
}
