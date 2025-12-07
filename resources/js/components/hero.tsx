import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight, Star, Users, Rocket
} from 'lucide-react'
import { useState } from 'react'

import { motion } from 'framer-motion'

// Import des animations personnalisées
import {
    FadeIn,
    Shimmer,
    Float,
    Pulse,
    StaggerContainer,
    HeartbeatAnimation,
    AmniotiqueWaveAnimation,
  } from '@/components/animations'

// Import du hook d'optimisation des animations
import { useOptimizedAnimations } from '@/hooks/use-optimized-animations'
import { register } from '@/routes'


export default function Hero() {
    // Utilisation du hook d'optimisation des animations avec options par défaut
    const {
      animationVariants,
      prefersReducedMotion,
      shouldAnimate,
      isInView,
    } = useOptimizedAnimations()

    // Générer les tailles aléatoires des particules une seule fois
    const [particleSizes] = useState(() => {
        return Array.from({ length: 8 }, () => ({
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
        }));
    });

    return (
        <div className="relative min-h-screen bg-background rounded-lg overflow-hidden">
        {/* Hero Section optimisée */}
        <div className="bg-gradient-to-br from-[color:var(--primary-600)] via-[color:var(--primary-500)] to-[color:var(--accent-500)] absolute h-full w-full opacity-90"></div>
          <section className="relative min-h-screen flex items-center justify-center py-12 lg:py-20">
          {/* Fond sophistiqué avec dégradé optimisé */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/10 shadow-2xl border-b border-white/10 opacity-50" />

          {/* Texture subtile conditionnelle */}
          {!prefersReducedMotion && (
            <div className="absolute inset-0 opacity-20 bg-noise mix-blend-soft-light" />
          )}

          {/* Éléments décoratifs optimisés */}
          {shouldAnimate && !prefersReducedMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                  <div className="w-full h-full" />
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
                  <div className="w-full h-full" />
                </Pulse>
              ))}
          </div>
          )}

          <StaggerContainer
            className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            variants={animationVariants.containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            staggerDelay={0.15}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">
              {/* Contenu principal */}
              <FadeIn
                className="lg:col-span-7 space-y-8"
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
                    className="inline-flex items-center gap-2 bg-[color:var(--primary-500)]/75 text-white border-[color:var(--primary-500)] hover:bg-[color:var(--primary-600)] transition-all duration-300 backdrop-blur-md shadow-lg px-4 py-2 text-sm font-medium"
                  >
                    <div className='flex'>
                      <HeartbeatAnimation intensity={1.2} duration={1.8}>
                        <Star className="h-4 w-4 text-red-500" fill="currentColor" />
                      </HeartbeatAnimation>
                      <HeartbeatAnimation intensity={1.15} duration={2}>
                        <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                      </HeartbeatAnimation>
                      <HeartbeatAnimation intensity={1.25} duration={1.6}>
                        <Star className="h-4 w-4 text-green-500" fill="currentColor" />
                      </HeartbeatAnimation>
                    </div>
                    <div className="h-4 w-px bg-white/30" />
                    <span className="text-xs font-bold text-gray-200">Éducation</span> •
                    <span className="text-xs font-bold text-gray-200">Excellence</span> •
                    <span className="text-xs font-bold text-gray-200">Accompagnement</span>
                  </Badge>
                </FadeIn>

                {/* Titre principal optimisé avec animation de brillance */}
                <FadeIn
                  variants={animationVariants.itemVariants}
                  delay={0.3}
                >
                  <h1 className="text-xl sm:text-4xl lg:text-6xl font-bold leading-[1.1] text-white">
                    {'Trouvez le professeur '}
                  <Shimmer className="relative text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--accent-400)] via-[color:var(--accent-200)] to-[color:var(--accent-400)] inline-block">
                    <motion.span
                      animate={prefersReducedMotion ? {} : {
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{
                        backgroundSize: '200% 200%'
                      }}
                    >
                      idéal
                    </motion.span>
                    {/* Effet de brillance sous le texte avec animation de vague */}
                    <AmniotiqueWaveAnimation
                      height={3}
                      color="var(--accent-300)"
                      opacity={0.6}
                      className="absolute -bottom-2 left-0 right-0"
                    >
                      <div className="w-full h-full" />
                    </AmniotiqueWaveAnimation>
                  </Shimmer>
                  {' pour votre enfant'}
                  </h1>
                </FadeIn>

                {/* Boutons d'action améliorés avec animations */}
                <FadeIn
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                  variants={animationVariants.itemVariants}
                  delay={0.5}
                >
                  <Button
                    size="lg"
                    className="bg-white text-[color:var(--primary-600)] hover:bg-white/95 group relative overflow-hidden shadow-xl border-0 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                    asChild
                  >
                    <Link href={register().url}>
                      <motion.div
                        className="flex items-center gap-3"
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Rocket className="h-5 w-5" />
                        <span>Créer mon compte</span>
                        <Float
                          amplitude={4}
                          duration={2}
                        >
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
                    </Link>
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
                          <Star className="h-4 w-4 text-[color:var(--accent-300)] fill-current" />
                        </Pulse>
                      ))}
                    </div>
                    <span className="text-sm">Gratuit et accessible</span>
                  </div>

                  <div className="h-4 w-px bg-white/30" />

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Pour tous les élèves</span>
                  </div>
                </FadeIn>
              </FadeIn>
            </div>
          </StaggerContainer>

          {/* Indicateur de scroll */}
          {!prefersReducedMotion && (
            <Float
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
              amplitude={8}
              duration={2}
            >
              <FadeIn
                delay={2}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs uppercase tracking-wider">Découvrez plus</span>
                <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
              </FadeIn>
            </Float>
          )}
        </section>
      </div>
    )
}
