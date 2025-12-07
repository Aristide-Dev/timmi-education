import { Head, router } from '@inertiajs/react';
import WelcomeLayout from '@/layouts/welcome-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  GraduationCap,
  Mail,
  User as UserIcon,
  BookOpen,
  MapPin,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { type Niveau, type User } from '@/types';
import {
  getRegionById,
  getPrefectureById,
  getCommuneById,
  getQuartierById,
} from '@/mocks';
import { PageTransition } from '@/components/animations';

interface Props {
  teacher: User;
  niveaux: Niveau[];
}

export default function ShowPublic({ teacher, niveaux }: Props) {
  // Get location data
  const region = teacher.region_id ? getRegionById(teacher.region_id) : null;
  const prefecture = teacher.prefecture_id
    ? getPrefectureById(teacher.prefecture_id)
    : null;
  const commune = teacher.commune_id ? getCommuneById(teacher.commune_id) : null;
  const quartier = teacher.quartier_id ? getQuartierById(teacher.quartier_id) : null;

  return (
    <PageTransition>
      <WelcomeLayout title={`${teacher.name} - Professeur`}>
        <Head title={`${teacher.name} - Professeur - Timmi`} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.visit('/search/teachers')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la recherche
            </Button>
          </div>

          {/* En-tête */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">{teacher.name}</h1>
            <p className="text-lg text-muted-foreground">{teacher.email}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>Détails du professeur</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Nom</Label>
                  <p className="text-lg font-semibold">{teacher.name}</p>
                </div>
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <p className="text-lg font-semibold">{teacher.email}</p>
                </div>
                {teacher.telephone && (
                  <div>
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </Label>
                    <p className="text-lg font-semibold">{teacher.telephone}</p>
                  </div>
                )}
                {teacher.bio && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Biographie
                    </Label>
                    <p className="text-base mt-1">{teacher.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Localisation */}
            {(teacher.pays || region || prefecture || commune || quartier || teacher.adresse) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Localisation
                  </CardTitle>
                  <CardDescription>
                    Informations de localisation du professeur
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teacher.pays && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Pays</Label>
                      <p className="text-lg font-semibold">{teacher.pays}</p>
                    </div>
                  )}
                  {region && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Région</Label>
                      <p className="text-lg font-semibold">{region.nom}</p>
                    </div>
                  )}
                  {prefecture && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Préfecture
                      </Label>
                      <p className="text-lg font-semibold">{prefecture.nom}</p>
                    </div>
                  )}
                  {commune && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Commune</Label>
                      <p className="text-lg font-semibold">{commune.nom}</p>
                    </div>
                  )}
                  {quartier && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Quartier</Label>
                      <p className="text-lg font-semibold">{quartier.nom}</p>
                    </div>
                  )}
                  {teacher.adresse && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Adresse complète
                      </Label>
                      <p className="text-base mt-1">{teacher.adresse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Matières enseignées */}
            {teacher.matieres && teacher.matieres.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Matières enseignées
                  </CardTitle>
                  <CardDescription>
                    Liste des matières que ce professeur enseigne
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {teacher.matieres.map((matiere) => {
                      const niveauSlug = matiere.pivot?.niveau_slug;
                      const niveau = niveauSlug ? niveaux.find((n) => n.slug === niveauSlug) : null;

                      return (
                        <Badge key={matiere.id} variant="secondary" className="text-base py-2 px-4 flex items-center gap-1">
                          <span>{matiere.name} ({matiere.code})</span>
                          {niveau && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-xs opacity-75">{niveau.name}</span>
                            </>
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </WelcomeLayout>
    </PageTransition>
  );
}

