import { Head, router, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import WelcomeLayout from '@/layouts/welcome-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  GraduationCap,
  Send,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { type Matiere, type Niveau } from '@/types';
import { search as searchTeachers } from '@/routes/teachers';
import {
  getAllRegions,
  getPrefecturesForRegion,
  getCommunesForRegion,
  getQuartiersForCommune,
} from '@/mocks';
import {
  FadeIn,
  StaggerContainer,
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
  teachersCount: number;
}

export default function Request({ matieres, niveaux, filters, teachersCount }: Props) {
  const { animationVariants, isInView } = useOptimizedAnimations();

  const form = useForm({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Get all regions
  const regions = useMemo(() => getAllRegions(), []);

  // Check if Conakry is selected (region ID = '1')
  const isConakry = filters.region === '1';

  // Get prefectures based on selected region (only if not Conakry)
  const prefectures = useMemo(() => {
    if (!filters.region || filters.region === 'all' || isConakry) return [];
    return getPrefecturesForRegion(filters.region);
  }, [filters.region, isConakry]);

  // Get communes for Conakry
  const communes = useMemo(() => {
    if (!isConakry) return [];
    return getCommunesForRegion('1');
  }, [isConakry]);

  // Get quartiers based on selected commune
  const quartiers = useMemo(() => {
    if (!isConakry || !filters.commune || filters.commune === 'all') return [];
    return getQuartiersForCommune(filters.commune);
  }, [isConakry, filters.commune]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requestData = {
      ...form.data,
      matiere_id: filters.matiere && filters.matiere !== 'all' ? Number(filters.matiere) : null,
      niveau_id: filters.niveau && filters.niveau !== 'all' ? Number(filters.niveau) : null,
      region_id: filters.region && filters.region !== 'all' ? filters.region : null,
      prefecture_id: filters.prefecture && filters.prefecture !== 'all' ? filters.prefecture : null,
      commune_id: filters.commune && filters.commune !== 'all' ? filters.commune : null,
      quartier_id: filters.quartier && filters.quartier !== 'all' ? filters.quartier : null,
      search_query: filters.q || null,
    };
    
    form.setData(requestData);
    form.post('/teacher-requests', {
      preserveScroll: true,
      onSuccess: () => {
        router.visit('/teacher-requests/thank-you');
      },
    });
  };

  // Obtenir les labels des critères de recherche
  const selectedMatiere = filters.matiere && filters.matiere !== 'all'
    ? matieres.find((m) => String(m.id) === filters.matiere)
    : null;
  const selectedNiveau = filters.niveau && filters.niveau !== 'all'
    ? niveaux.find((n) => String(n.id) === filters.niveau)
    : null;
  const selectedRegion = filters.region && filters.region !== 'all'
    ? regions.find((r) => r.id === filters.region)
    : null;
  const selectedPrefecture = filters.prefecture && filters.prefecture !== 'all'
    ? prefectures.find((p) => p.id === filters.prefecture)
    : null;
  const selectedCommune = filters.commune && filters.commune !== 'all'
    ? communes.find((c) => c.id === filters.commune)
    : null;
  const selectedQuartier = filters.quartier && filters.quartier !== 'all'
    ? quartiers.find((q) => q.id === filters.quartier)
    : null;

  const hasActiveFilters = filters.q || filters.matiere || filters.niveau || filters.region || filters.prefecture || filters.commune || filters.quartier;

  return (
    <PageTransition>
      <WelcomeLayout title="Demande de professeur">
        <Head title="Demande de professeur - Timmi" />

        <div className="relative min-h-screen overflow-hidden bg-background">
          <section className="relative py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <StaggerContainer
                className="mx-auto max-w-3xl"
                variants={animationVariants.containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                staggerDelay={0.1}
              >
                <FadeIn variants={animationVariants.itemVariants}>
                  <div className="mb-6">
                    <Button
                      variant="ghost"
                      onClick={() => router.visit(searchTeachers().url)}
                      className="mb-4"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour à la recherche
                    </Button>
                  </div>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          {teachersCount > 0 ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <GraduationCap className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-2xl">
                            {teachersCount > 0
                              ? `${teachersCount} professeur${teachersCount > 1 ? 's' : ''} trouvé${teachersCount > 1 ? 's' : ''} dans votre zone`
                              : 'Aucun professeur trouvé dans votre zone'}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {teachersCount > 0
                              ? 'Soumettez une demande pour être contacté par nos professeurs'
                              : 'Laissez-nous vos coordonnées et nous vous contacterons dès qu\'un professeur correspondant à vos critères sera disponible'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Résumé des critères de recherche */}
                      {hasActiveFilters && (
                        <div className="mb-6 rounded-lg border bg-muted/50 p-4">
                          <h3 className="mb-3 text-sm font-semibold">Critères de recherche :</h3>
                          <div className="flex flex-wrap gap-2">
                            {filters.q && (
                              <Badge variant="secondary">
                                Recherche: {filters.q}
                              </Badge>
                            )}
                            {selectedMatiere && (
                              <Badge variant="secondary">
                                Matière: {selectedMatiere.name}
                              </Badge>
                            )}
                            {selectedNiveau && (
                              <Badge variant="secondary">
                                Niveau: {selectedNiveau.name}
                              </Badge>
                            )}
                            {selectedRegion && (
                              <Badge variant="secondary">
                                Région: {selectedRegion.nom}
                              </Badge>
                            )}
                            {selectedPrefecture && (
                              <Badge variant="secondary">
                                Préfecture: {selectedPrefecture.nom}
                              </Badge>
                            )}
                            {selectedCommune && (
                              <Badge variant="secondary">
                                Commune: {selectedCommune.nom}
                              </Badge>
                            )}
                            {selectedQuartier && (
                              <Badge variant="secondary">
                                Quartier: {selectedQuartier.nom}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Formulaire de contact */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">
                              Nom complet <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="name"
                              value={form.data.name}
                              onChange={(e) => form.setData('name', e.target.value)}
                              placeholder="Votre nom"
                              required
                              disabled={form.processing}
                            />
                            {form.errors.name && (
                              <p className="text-sm text-destructive">{form.errors.name}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">
                              Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={form.data.email}
                              onChange={(e) => form.setData('email', e.target.value)}
                              placeholder="votre@email.com"
                              required
                              disabled={form.processing}
                            />
                            {form.errors.email && (
                              <p className="text-sm text-destructive">{form.errors.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            placeholder="+224 XXX XXX XXX"
                            disabled={form.processing}
                          />
                          {form.errors.phone && (
                            <p className="text-sm text-destructive">{form.errors.phone}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message (optionnel)</Label>
                          <Textarea
                            id="message"
                            value={form.data.message}
                            onChange={(e) => form.setData('message', e.target.value)}
                            placeholder="Décrivez vos besoins ou vos attentes..."
                            rows={4}
                            disabled={form.processing}
                          />
                          {form.errors.message && (
                            <p className="text-sm text-destructive">{form.errors.message}</p>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button
                            type="submit"
                            className="flex-1"
                            disabled={form.processing}
                            size="lg"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            {form.processing ? 'Envoi en cours...' : 'Envoyer la demande'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </FadeIn>
              </StaggerContainer>
            </div>
          </section>
        </div>
      </WelcomeLayout>
    </PageTransition>
  );
}

