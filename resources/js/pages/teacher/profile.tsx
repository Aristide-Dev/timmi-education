import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Matiere, type Niveau, type User } from '@/types';
import { Head, router } from '@inertiajs/react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GraduationCap,
  Mail,
  User as UserIcon,
  BookOpen,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPinned,
} from 'lucide-react';
import { dashboard } from '@/routes';
import {
  getRegionById,
  getPrefectureById,
  getCommuneById,
  getQuartierById,
} from '@/mocks';

type AvailabilityState = Record<string, Array<{ start: string; end: string }>>;

interface Props {
  teacher: User;
  matieres: Matiere[];
  niveaux: Niveau[];
  availability?: AvailabilityState;
}

const DAY_LABELS: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const TEACHER_PROFILE_URL = '/teacher/profile';
const TEACHER_AVAILABILITY_EDIT_URL = '/teacher/availability/edit';

export default function TeacherProfile({ teacher, niveaux, availability = {} }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: dashboard().url },
    { title: 'Mon profil', href: TEACHER_PROFILE_URL },
  ];

  const region = teacher.region_id ? getRegionById(teacher.region_id) : null;
  const prefecture = teacher.prefecture_id ? getPrefectureById(teacher.prefecture_id) : null;
  const commune = teacher.commune_id ? getCommuneById(teacher.commune_id) : null;
  const quartier = teacher.quartier_id ? getQuartierById(teacher.quartier_id) : null;

  const hasAvailability = Object.keys(availability).some(
    (day) => availability[day] && availability[day].length > 0
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mon profil - Professeur" />

      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl p-8 shadow-sm border border-primary/10">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              {teacher.profile_photo_url ? (
                <div className="relative group">
                  <div className="h-32 w-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={teacher.profile_photo_url}
                      alt={teacher.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-md">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                </div>
              ) : (
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center border-4 border-white shadow-lg">
                  <UserIcon className="h-16 w-16 text-primary-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {teacher.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{teacher.email}</span>
                  </div>
                  {teacher.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{teacher.telephone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {teacher.roles?.map((role) => (
                  <Badge key={role.id} variant="secondary" className="px-3 py-1">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {role.name}
                  </Badge>
                ))}
                <Badge
                  variant={teacher.email_verified_at ? 'default' : 'destructive'}
                  className="px-3 py-1"
                >
                  {teacher.email_verified_at ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Email vérifié
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Email non vérifié
                    </>
                  )}
                </Badge>
                {teacher.matieres && teacher.matieres.length > 0 && (
                  <Badge variant="outline" className="px-3 py-1">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {teacher.matieres.length} matière{teacher.matieres.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>

              {teacher.bio && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                  {teacher.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <UserIcon className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="availability" className="gap-2">
            <Calendar className="h-4 w-4" />
            Mes créneaux
          </TabsTrigger>
          <TabsTrigger value="subjects" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Matières
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Email</Label>
                  <p className="text-base font-medium">{teacher.email}</p>
                </div>
                {teacher.telephone && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Téléphone</Label>
                    <p className="text-base font-medium">{teacher.telephone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {(teacher.pays || region || prefecture || commune || quartier || teacher.adresse) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teacher.pays && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Pays</Label>
                      <p className="text-base font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {teacher.pays}
                      </p>
                    </div>
                  )}
                  {region && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Région</Label>
                      <p className="text-base font-medium">{region.nom}</p>
                    </div>
                  )}
                  {prefecture && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Préfecture</Label>
                      <p className="text-base font-medium">{prefecture.nom}</p>
                    </div>
                  )}
                  {commune && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Commune</Label>
                      <p className="text-base font-medium">{commune.nom}</p>
                    </div>
                  )}
                  {quartier && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Quartier</Label>
                      <p className="text-base font-medium">{quartier.nom}</p>
                    </div>
                  )}
                  {teacher.adresse && (
                    <div className="md:col-span-2 lg:col-span-3 space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Adresse</Label>
                      <p className="text-base font-medium">{teacher.adresse}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {teacher.matieres && teacher.matieres.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Matières enseignées
                </CardTitle>
                <CardDescription>
                  {teacher.matieres.length} matière{teacher.matieres.length > 1 ? 's' : ''} assignée{teacher.matieres.length > 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {teacher.matieres.map((matiere) => {
                    const niveauId = matiere.pivot?.niveau_id;
                    const niveau = niveauId ? niveaux.find((n) => n.id === niveauId) : null;
                    return (
                      <div
                        key={matiere.id}
                        className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{matiere.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {matiere.code}
                          </Badge>
                        </div>
                        {niveau && (
                          <p className="text-xs text-muted-foreground">Niveau : {niveau.name}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Mes créneaux (disponibilités) */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Mes créneaux de disponibilité
                  </CardTitle>
                  <CardDescription>
                    Jours et horaires où vous êtes disponible pour donner des cours
                  </CardDescription>
                </div>
                <Button
                  onClick={() => router.visit(TEACHER_AVAILABILITY_EDIT_URL)}
                  variant="outline"
                  className="gap-2"
                >
                  <Clock className="h-4 w-4" />
                  {hasAvailability ? 'Modifier mes créneaux' : 'Configurer mes créneaux'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!hasAvailability ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun créneau configuré</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Définissez vos jours et horaires de disponibilité pour que les élèves puissent vous contacter.
                  </p>
                  <Button onClick={() => router.visit(TEACHER_AVAILABILITY_EDIT_URL)}>
                    <Clock className="h-4 w-4 mr-2" />
                    Configurer mes créneaux
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {DAY_ORDER.map((day) => {
                    const slots = availability[day];
                    if (!slots || slots.length === 0) return null;
                    return (
                      <div
                        key={day}
                        className="p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-transparent hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-base flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {DAY_LABELS[day]}
                          </h4>
                          <Badge variant="secondary">
                            {slots.length} créneau{slots.length > 1 ? 'x' : ''}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {slots.map((slot, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm bg-background px-3 py-2 rounded-md border"
                            >
                              <Clock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                              <span className="font-medium">
                                {slot.start} – {slot.end}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matières (lecture seule) */}
        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Mes matières
              </CardTitle>
              <CardDescription>
                Les matières que vous enseignez sont gérées par l'administration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!teacher.matieres || teacher.matieres.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune matière assignée pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {teacher.matieres.map((matiere) => {
                    const niveauId = matiere.pivot?.niveau_id;
                    const niveau = niveauId ? niveaux.find((n) => n.id === niveauId) : null;
                    return (
                      <div
                        key={matiere.id}
                        className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{matiere.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {matiere.code}
                          </Badge>
                        </div>
                        {niveau && (
                          <p className="text-xs text-muted-foreground">Niveau : {niveau.name}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
