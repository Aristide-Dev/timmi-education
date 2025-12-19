import { Head, router, useForm } from '@inertiajs/react'
import { useMemo } from 'react'
import Hero from '@/components/hero'
import WelcomeLayout from '@/layouts/welcome-layout'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search as SearchIcon, GraduationCap } from 'lucide-react'
import { type Matiere, type Niveau } from '@/types'
import { search as searchTeachers } from '@/routes/teachers'
import {
  getAllRegions,
  getPrefecturesForRegion,
  getCommunesForRegion,
  getQuartiersForCommune,
} from '@/mocks'
import {
  FadeIn,
  StaggerContainer,
} from '@/components/animations'
import { useOptimizedAnimations } from '@/hooks/use-optimized-animations'

interface Props {
  canRegister: boolean
  matieres: Matiere[]
  niveaux: Niveau[]
}

// Import des animations personnalisées
import {
  PageTransition,
} from '@/components/animations'


export default function Welcome({ matieres, niveaux }: Props) {
  const { animationVariants, isInView } = useOptimizedAnimations()

  const form = useForm({
    q: '',
    matiere: '',
    niveau: '',
    region: '',
    prefecture: '',
    commune: '',
    quartier: '',
  })

  // Get all regions
  const regions = useMemo(() => getAllRegions(), [])

  // Check if Conakry is selected (region ID = '1')
  const isConakry = form.data.region === '1'

  // Get prefectures based on selected region (only if not Conakry)
  const prefectures = useMemo(() => {
    if (!form.data.region || form.data.region === 'all' || isConakry) return []
    return getPrefecturesForRegion(form.data.region)
  }, [form.data.region, isConakry])

  // Get communes for Conakry
  const communes = useMemo(() => {
    if (!isConakry) return []
    return getCommunesForRegion('1')
  }, [isConakry])

  // Get quartiers based on selected commune
  const quartiers = useMemo(() => {
    if (!isConakry || !form.data.commune || form.data.commune === 'all') return []
    return getQuartiersForCommune(form.data.commune)
  }, [isConakry, form.data.commune])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (form.data.q) params.set('q', form.data.q)
    if (form.data.matiere && form.data.matiere !== 'all') params.set('matiere', form.data.matiere)
    if (form.data.niveau && form.data.niveau !== 'all') params.set('niveau', form.data.niveau)
    if (form.data.region && form.data.region !== 'all') params.set('region', form.data.region)
    if (form.data.prefecture && form.data.prefecture !== 'all') params.set('prefecture', form.data.prefecture)
    if (form.data.commune && form.data.commune !== 'all') params.set('commune', form.data.commune)
    if (form.data.quartier && form.data.quartier !== 'all') params.set('quartier', form.data.quartier)

    router.visit(searchTeachers().url + `?${params.toString()}`)
  }

  return (
    <PageTransition>
    <WelcomeLayout title='Accueil'>
        {/* SEO géré côté serveur par SEOTools */}
        <Head>
            {/* Seulement les éléments spécifiques non gérés par SEOTools */}
            {/* <link rel="preload" as="image" href="/images/heros/pregnant-woman.png" /> */}
        </Head>

        <Hero />

        {/* Section de recherche de professeurs */}
        <section className="relative bg-background py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerContainer
              className="mx-auto max-w-4xl"
              variants={animationVariants.containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              staggerDelay={0.1}
              id="search-teachers-card"
            >
              <FadeIn
                className="text-center mb-8"
                variants={animationVariants.itemVariants}
              >
                <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  Trouvez votre professeur idéal
                </h2>
                <p className="text-muted-foreground text-lg">
                  Recherchez parmi nos professeurs qualifiés selon vos critères
                </p>
              </FadeIn>

              <FadeIn variants={animationVariants.itemVariants}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SearchIcon className="h-5 w-5" />
                      Recherche de professeurs
                    </CardTitle>
                    <CardDescription>
                      Utilisez les filtres ci-dessous pour affiner votre recherche
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSearch} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* <div className="space-y-2 md:col-span-2">
                          <label htmlFor="q" className="text-sm font-medium">
                            Recherche par nom, email ou biographie
                          </label>
                          <Input
                            id="q"
                            value={form.data.q}
                            onChange={(e) => form.setData('q', e.target.value)}
                            placeholder="Nom du professeur, email..."
                            className="w-full"
                          />
                        </div> */}

                        <div className="space-y-2">
                          <label htmlFor="matiere" className="text-sm font-medium">
                            Matière enseignée
                          </label>
                          <Select
                            value={form.data.matiere || undefined}
                            onValueChange={(value) => form.setData('matiere', value === 'all' ? '' : value)}
                          >
                            <SelectTrigger id="matiere">
                              <SelectValue placeholder="Toutes les matières" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Toutes les matières</SelectItem>
                              {matieres.map((matiere) => (
                                <SelectItem key={matiere.id} value={String(matiere.id)}>
                                  {matiere.name} ({matiere.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="niveau" className="text-sm font-medium">
                            Niveau d'enseignement
                          </label>
                          <Select
                            value={form.data.niveau || undefined}
                            onValueChange={(value) => form.setData('niveau', value === 'all' ? '' : value)}
                          >
                            <SelectTrigger id="niveau">
                              <SelectValue placeholder="Tous les niveaux" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous les niveaux</SelectItem>
                              {niveaux.map((niveau) => (
                                <SelectItem key={niveau.id} value={String(niveau.id)}>
                                  {niveau.name} {niveau.code && `(${niveau.code})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="region" className="text-sm font-medium">
                            Région
                          </label>
                          <Select
                            value={form.data.region || undefined}
                            onValueChange={(value) => {
                              form.setData('region', value === 'all' ? '' : value)
                              form.setData('prefecture', '')
                              form.setData('commune', '')
                              form.setData('quartier', '')
                            }}
                          >
                            <SelectTrigger id="region">
                              <SelectValue placeholder="Toutes les régions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Toutes les régions</SelectItem>
                              {regions.map((region) => (
                                <SelectItem key={region.id} value={region.id}>
                                  {region.nom}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {!isConakry ? (
                          <div className="space-y-2">
                            <label htmlFor="prefecture" className="text-sm font-medium">
                              Préfecture
                            </label>
                            <Select
                              value={form.data.prefecture || undefined}
                              onValueChange={(value) => {
                                form.setData('prefecture', value === 'all' ? '' : value)
                                form.setData('commune', '')
                                form.setData('quartier', '')
                              }}
                              disabled={!form.data.region || form.data.region === 'all'}
                            >
                              <SelectTrigger id="prefecture">
                                <SelectValue placeholder="Toutes les préfectures" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Toutes les préfectures</SelectItem>
                                {prefectures.map((prefecture) => (
                                  <SelectItem key={prefecture.id} value={prefecture.id}>
                                    {prefecture.nom}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <label htmlFor="commune" className="text-sm font-medium">
                                Commune
                              </label>
                              <Select
                                value={form.data.commune || undefined}
                                onValueChange={(value) => {
                                  form.setData('commune', value === 'all' ? '' : value)
                                  form.setData('quartier', '')
                                }}
                              >
                                <SelectTrigger id="commune">
                                  <SelectValue placeholder="Toutes les communes" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Toutes les communes</SelectItem>
                                  {communes.map((commune) => (
                                    <SelectItem key={commune.id} value={commune.id}>
                                      {commune.nom}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="quartier" className="text-sm font-medium">
                                Quartier
                              </label>
                              <Select
                                value={form.data.quartier || undefined}
                                onValueChange={(value) => form.setData('quartier', value === 'all' ? '' : value)}
                                disabled={!form.data.commune || form.data.commune === 'all'}
                              >
                                <SelectTrigger id="quartier">
                                  <SelectValue placeholder="Tous les quartiers" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Tous les quartiers</SelectItem>
                                  {quartiers.map((quartier) => (
                                    <SelectItem key={quartier.id} value={quartier.id}>
                                      {quartier.nom}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={form.processing}
                        size="lg"
                      >
                        <SearchIcon className="h-4 w-4 mr-2" />
                        {form.processing ? 'Recherche...' : 'Rechercher un professeur'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </FadeIn>
            </StaggerContainer>
          </div>
        </section>

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
