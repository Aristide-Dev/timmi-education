import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Star, Users } from 'lucide-react';
import { useState } from 'react';

import { motion } from 'framer-motion';

// Import des animations personnalisées
import {
    AmniotiqueWaveAnimation,
    FadeIn,
    Float,
    HeartbeatAnimation,
    Pulse,
    Shimmer,
    StaggerContainer,
} from '@/components/animations';

// Import du hook d'optimisation des animations
import { useOptimizedAnimations } from '@/hooks/use-optimized-animations';

export default function Hero() {
    // Utilisation du hook d'optimisation des animations avec options par défaut
    const { animationVariants, prefersReducedMotion, shouldAnimate, isInView } =
        useOptimizedAnimations();

    // Générer les tailles aléatoires des particules une seule fois
    const [particleSizes] = useState(() => {
        return Array.from({ length: 8 }, () => ({
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
        }));
    });

    return (
        <div className="relative min-h-screen overflow-hidden rounded-lg bg-background">
            {/* Hero Section optimisée */}
            <div className="bg-gradient-to-br from-[color:var(--primary-600)] via-[color:var(--primary-500)] to-[color:var(--accent-500)] absolute h-full w-full opacity-90"></div>
            <section className="relative flex min-h-screen items-center justify-center py-12 lg:py-20">
                {/* Fond sophistiqué avec dégradé optimisé */}
                <div className="absolute inset-0 border-b border-white/10 bg-gradient-to-br from-black/30 via-black/50 to-black/10 opacity-50 shadow-2xl" />

                {/* Texture subtile conditionnelle */}
                {!prefersReducedMotion && (
                    <div className="bg-noise absolute inset-0 opacity-20 mix-blend-soft-light" />
                )}

                {/* Éléments décoratifs optimisés */}
                {shouldAnimate && !prefersReducedMotion && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {/* Particules réduites pour de meilleures performances */}
                        {particleSizes.map((size, i) => (
                            <Float
                                key={`particle-${i}`}
                                className="absolute rounded-full bg-white/15 blur-sm"
                                amplitude={15}
                                duration={4 + i * 0.5}
                                style={{
                                    top: `${20 + i * 8}%`,
                                    left: `${10 + i * 10}%`,
                                    width: size.width,
                                    height: size.height,
                                }}
                            >
                                <div className="h-full w-full" />
                            </Float>
                        ))}

                        {/* Cercles lumineux optimisés */}
                        {[...Array(3)].map((_, i) => (
                            <Pulse
                                key={`circle-${i}`}
                                className="absolute rounded-full bg-white/5 blur-xl"
                                intensity={1.1}
                                duration={12 + i * 2}
                                style={{
                                    width: `${150 + i * 50}px`,
                                    height: `${150 + i * 50}px`,
                                    top: `${30 + i * 20}%`,
                                    left: `${15 + i * 25}%`,
                                }}
                            >
                                <div className="h-full w-full" />
                            </Pulse>
                        ))}
                    </div>
                )}

                <StaggerContainer
                    className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8"
                    variants={animationVariants.containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    staggerDelay={0.15}
                >
                    <div className="grid min-h-[80vh] grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* Contenu principal */}
                        <FadeIn
                            className="space-y-8 lg:col-span-7"
                            variants={animationVariants.itemVariants}
                        >
                            {/* Badge amélioré avec animation de pulsation */}
                            <FadeIn
                                variants={animationVariants.itemVariants}
                                className="relative"
                                delay={0.1}
                            >
                                <Badge
                                    variant="secondary"
                                    className="inline-flex items-center gap-2 border-[color:var(--primary-500)] bg-[color:var(--primary-500)]/75 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-[color:var(--primary-600)]"
                                >
                                    <div className="flex">
                                        <HeartbeatAnimation
                                            intensity={1.2}
                                            duration={1.8}
                                        >
                                            <Star
                                                className="h-4 w-4 text-red-500"
                                                fill="currentColor"
                                            />
                                        </HeartbeatAnimation>
                                        <HeartbeatAnimation
                                            intensity={1.15}
                                            duration={2}
                                        >
                                            <Star
                                                className="h-4 w-4 text-yellow-400"
                                                fill="currentColor"
                                            />
                                        </HeartbeatAnimation>
                                        <HeartbeatAnimation
                                            intensity={1.25}
                                            duration={1.6}
                                        >
                                            <Star
                                                className="h-4 w-4 text-green-500"
                                                fill="currentColor"
                                            />
                                        </HeartbeatAnimation>
                                    </div>
                                    <div className="h-4 w-px bg-white/30" />
                                    <span className="text-xs font-bold text-gray-200">
                                        Éducation
                                    </span>{' '}
                                    •
                                    <span className="text-xs font-bold text-gray-200">
                                        Excellence
                                    </span>{' '}
                                    •
                                    <span className="text-xs font-bold text-gray-200">
                                        Accompagnement
                                    </span>
                                </Badge>
                            </FadeIn>

                            {/* Titre principal optimisé avec animation de brillance */}
                            <FadeIn
                                variants={animationVariants.itemVariants}
                                delay={0.3}
                            >
                                <h1 className="text-xl leading-[1.1] font-bold text-white sm:text-4xl lg:text-6xl">
                                    {'Trouvez le professeur '}
                                    <Shimmer className="relative inline-block bg-gradient-to-r from-[color:var(--accent-400)] via-[color:var(--accent-200)] to-[color:var(--accent-400)] bg-clip-text text-transparent">
                                        <motion.span
                                            animate={
                                                prefersReducedMotion
                                                    ? {}
                                                    : {
                                                          backgroundPosition: [
                                                              '0% 50%',
                                                              '100% 50%',
                                                              '0% 50%',
                                                          ],
                                                      }
                                            }
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: 'linear',
                                            }}
                                            style={{
                                                backgroundSize: '200% 200%',
                                            }}
                                        >
                                            idéal
                                        </motion.span>
                                        {/* Effet de brillance sous le texte avec animation de vague */}
                                        <AmniotiqueWaveAnimation
                                            height={3}
                                            color="var(--accent-300)"
                                            opacity={0.6}
                                            className="absolute right-0 -bottom-2 left-0"
                                        >
                                            <div className="h-full w-full" />
                                        </AmniotiqueWaveAnimation>
                                    </Shimmer>
                                    {' pour vos révisions'}
                                </h1>
                            </FadeIn>

                            {/* Boutons d'action améliorés avec animations */}
                            <FadeIn
                                className="flex flex-col gap-4 pt-4 sm:flex-row"
                                variants={animationVariants.itemVariants}
                                delay={0.5}
                            >
                                <Button
                                    size="lg"
                                    className="group relative overflow-hidden border-0 bg-white px-8 py-4 text-lg font-semibold text-[color:var(--primary-600)] shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/95 hover:shadow-2xl"
                                    asChild
                                >
                                    <a href="#search-teachers-card">
                                        <motion.div
                                            className="flex items-center gap-3"
                                            whileHover={{ x: 2 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Rocket className="h-5 w-5" />
                                            <span>Trouver un professeur</span>
                                            <Float amplitude={4} duration={2}>
                                                <ArrowRight className="h-5 w-5" />
                                            </Float>
                                        </motion.div>

                                        {/* Effet de brillance au hover */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-[color:var(--primary-400)]/20 to-transparent"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 0.6 }}
                                        />
                                    </a>
                                </Button>
                            </FadeIn>

                            {/* Indicateurs de confiance avec animations */}
                            <FadeIn
                                className="flex items-center gap-6 pt-8 text-white/70"
                                variants={animationVariants.itemVariants}
                                delay={0.7}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Pulse
                                                key={i}
                                                intensity={1.15}
                                                duration={2 + i * 0.2}
                                            >
                                                <Star className="h-4 w-4 fill-current text-[color:var(--accent-300)]" />
                                            </Pulse>
                                        ))}
                                    </div>
                                    <span className="text-sm">
                                        Gratuit et accessible
                                    </span>
                                </div>

                                <div className="h-4 w-px bg-white/30" />

                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span className="text-sm">
                                        Pour tous les élèves
                                    </span>
                                </div>
                            </FadeIn>
                        </FadeIn>


                        <FadeIn
                            className="space-y-8 lg:col-span-5 flex items-center justify-center"
                            variants={animationVariants.itemVariants}
                        >
                            {/* Image Container avec design amélioré */}
                            <motion.div
                                className="relative h-full min-h-[500px] lg:min-h-[600px] flex items-center justify-center"
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                {/* Gradient background decoratif */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-[color:var(--accent-500)]/30 via-[color:var(--primary-500)]/20 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Glow effect */}

                                {/* Image avec bordure et ombre */}
                                <div className="relative z-10 overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl">
                                    <img
                                        src="/img/prof-et-eleve.jpg"
                                        alt="Professeur et élève"
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    />

                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                {/* Decorative circles */}
                                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-[color:var(--accent-500)]/20 to-transparent blur-3xl" />
                                <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-gradient-to-tr from-[color:var(--primary-500)]/20 to-transparent blur-3xl" />
                            </motion.div>
                        </FadeIn>
                    </div>
                </StaggerContainer>

                {/* Indicateur de scroll */}
                {!prefersReducedMotion && (
                    <Float
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 transform text-white/60"
                        amplitude={8}
                        duration={2}
                    >
                        <FadeIn
                            delay={2}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-xs tracking-wider uppercase">
                                Découvrez plus
                            </span>
                            <div className="h-8 w-px bg-gradient-to-b from-white/60 to-transparent" />
                        </FadeIn>
                    </Float>
                )}
            </section>
        </div>
    );
}
