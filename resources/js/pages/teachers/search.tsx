import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import WelcomeLayout from '@/layouts/welcome-layout';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { search as searchTeachers } from '@/routes/teachers';
import { create as teacherRequestsCreate } from '@/routes/teacher-requests';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search as SearchIcon,
  X,
} from 'lucide-react';
import { type Matiere, type Niveau } from '@/types';
import {
  getAllRegions,
  getPrefecturesForRegion,
  getCommunesForRegion,
  getQuartiersForCommune,
} from '@/mocks';
import {
  FadeIn,
  StaggerContainer,
  Float,
} from '@/components/animations';
import { useOptimizedAnimations } from '@/hooks/use-optimized-animations';
import { PageTransition } from '@/components/animations';

interface Props {
  matieres: Matiere[];
  niveaux: Niveau[];
  filters: {
    q?: string;
    matiere?: string;
    niveau?: string;
    region?: string;
    prefecture?: string;
    commune?: string;
    quartier?: string;
  };
}

export default function Search({ matieres, niveaux, filters: initialFilters }: Props) {
  const { animationVariants, prefersReducedMotion, shouldAnimate, isInView } =
    useOptimizedAnimations();

  // Générer les tailles aléatoires des particules une seule fois
  const [particleSizes] = useState(() => {
    return Array.from({ length: 5 }, () => ({
      width: `${4 + Math.random() * 6}px`,
      height: `${4 + Math.random() * 6}px`,
    }));
  });

  const form = useForm({
    q: initialFilters.q || '',
    matiere: initialFilters.matiere || '',
    niveau: initialFilters.niveau || '',
    region: initialFilters.region || '',
    prefecture: initialFilters.prefecture || '',
    commune: initialFilters.commune || '',
    quartier: initialFilters.quartier || '',
  });

  // Get all regions
  const regions = useMemo(() => getAllRegions(), []);

  // Check if Conakry is selected (region ID = '1')
  const isConakry = form.data.region === '1';

  // Get prefectures based on selected region (only if not Conakry)
  const prefectures = useMemo(() => {
    if (!form.data.region || form.data.region === 'all' || isConakry) return [];
    return getPrefecturesForRegion(form.data.region);
  }, [form.data.region, isConakry]);

  // Get communes for Conakry
  const communes = useMemo(() => {
    if (!isConakry) return [];
    return getCommunesForRegion('1');
  }, [isConakry]);

  // Get quartiers based on selected commune
  const quartiers = useMemo(() => {
    if (!isConakry || !form.data.commune || form.data.commune === 'all') return [];
    return getQuartiersForCommune(form.data.commune);
  }, [isConakry, form.data.commune]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.data.q) params.set('q', form.data.q);
    if (form.data.matiere && form.data.matiere !== 'all') params.set('matiere', form.data.matiere);
    if (form.data.niveau && form.data.niveau !== 'all') params.set('niveau', form.data.niveau);
    if (form.data.region && form.data.region !== 'all') params.set('region', form.data.region);
    if (form.data.prefecture && form.data.prefecture !== 'all') params.set('prefecture', form.data.prefecture);
    if (form.data.commune && form.data.commune !== 'all') params.set('commune', form.data.commune);
    if (form.data.quartier && form.data.quartier !== 'all') params.set('quartier', form.data.quartier);

    // Redirect directly to teacher request page with search parameters
    router.visit(teacherRequestsCreate().url + `?${params.toString()}`);
  };

  const clearFilters = () => {
    form.reset();
    router.get(searchTeachers().url);
  };

  const hasActiveFilters = form.data.q || form.data.matiere || form.data.niveau || form.data.region || form.data.prefecture || form.data.commune || form.data.quartier;


  return (
    <PageTransition>
      <WelcomeLayout title="Rechercher un professeur">
        <Head title="Rechercher un professeur - Timmi" />

        <div className="relative min-h-screen overflow-hidden">
          {/* Hero Section avec recherche */}
          <div className="bg-gradient-to-br from-[color:var(--primary-600)] via-[color:var(--primary-500)] to-[color:var(--accent-500)] absolute h-full w-full opacity-90"></div>
          <section className="relative flex min-h-[60vh] items-center justify-center py-12 lg:py-20">
            {/* Fond décoratif */}
            <div className="absolute inset-0 border-b border-white/10 bg-gradient-to-br from-black/30 via-black/50 to-black/10 opacity-50 shadow-2xl" />

            {!prefersReducedMotion && (
              <div className="bg-noise absolute inset-0 opacity-20 mix-blend-soft-light" />
            )}

            {shouldAnimate && !prefersReducedMotion && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {particleSizes.map((size, i) => (
                  <Float
                    key={`particle-${i}`}
                    amplitude={15}
                    duration={4 + i * 0.5}
                  >
                    <div
                      className="absolute rounded-full bg-white/15 blur-sm"
                      style={{
                        top: `${20 + i * 12}%`,
                        left: `${10 + i * 15}%`,
                        width: size.width,
                        height: size.height,
                      }}
                    />
                  </Float>
                ))}
              </div>
            )}

            <StaggerContainer
              className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8"
              variants={animationVariants.containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              staggerDelay={0.1}
            >
              <FadeIn
                className="mx-auto max-w-4xl space-y-8"
                variants={animationVariants.itemVariants}
              >
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                    Trouvez le professeur{' '}
                    <span className="text-[color:var(--accent-300)]">idéal</span>
                  </h1>
                  <p className="mt-4 text-lg text-white/90">
                    Recherchez parmi nos professeurs qualifiés selon vos critères
                  </p>
                </div>

                {/* Formulaire de recherche */}
                <Card className="backdrop-blur-md bg-white/95 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SearchIcon className="h-5 w-5" />
                      Recherche avancée
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
                              form.setData('region', value === 'all' ? '' : value);
                              form.setData('prefecture', '');
                              form.setData('commune', '');
                              form.setData('quartier', '');
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
                                form.setData('prefecture', value === 'all' ? '' : value);
                                form.setData('commune', '');
                                form.setData('quartier', '');
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
                                  form.setData('commune', value === 'all' ? '' : value);
                                  form.setData('quartier', '');
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

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={form.processing}
                        >
                          <SearchIcon className="h-4 w-4 mr-2" />
                          {form.processing ? 'Recherche...' : 'Rechercher'}
                        </Button>
                        {hasActiveFilters && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={clearFilters}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Réinitialiser
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </FadeIn>
            </StaggerContainer>
          </section>

        </div>

        {/* Styles optimisés */}
        <style>{`
          .bg-noise {
            background-image:
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0);
            background-size: 24px 24px;
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </WelcomeLayout>
    </PageTransition>
  );
}

