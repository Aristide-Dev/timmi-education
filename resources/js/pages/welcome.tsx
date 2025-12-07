import { Head } from '@inertiajs/react'
import Hero from '@/components/hero'
import WelcomeLayout from '@/layouts/welcome-layout'

// Import des animations personnalisées
import {
  PageTransition,
} from '@/components/animations'


export default function Welcome() {


  return (
    <PageTransition>
    <WelcomeLayout title='Accueil'>
        {/* SEO géré côté serveur par SEOTools */}
        <Head>
            {/* Seulement les éléments spécifiques non gérés par SEOTools */}
            {/* <link rel="preload" as="image" href="/images/heros/pregnant-woman.png" /> */}
        </Head>

        <Hero />

      {/* Styles optimisés */}
      <style>{`
        /* Optimisation des performances avec will-change */
        .motion-safe .animate-element {
          will-change: transform, opacity;
        }

        /* Texture de grain optimisée */
        .bg-noise {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0);
          background-size: 24px 24px;
        }

        /* Amélioration du contraste pour l'accessibilité */
        @media (prefers-contrast: high) {
          .hero-text {
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
          }

          .glass-card {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.4);
          }
        }

        /* Responsive optimisé */
        @media (max-width: 640px) {
          .hero-title {
            font-size: 2.5rem;
            line-height: 1.2;
          }
        }

        /* Performance : Réduction des animations sur les appareils moins puissants */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Optimisation pour les écrans haute résolution */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .bg-noise {
            background-size: 12px 12px;
          }
        }
      `}</style>
      </WelcomeLayout>
    </PageTransition>
  )
}
