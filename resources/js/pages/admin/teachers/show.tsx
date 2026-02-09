import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Matiere, type Niveau, type User } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  GraduationCap,
  Mail,
  User as UserIcon,
  BookOpen,
  Save,
  Edit,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPinned,
  Sparkles,
  X,
  Check,
  Filter,
} from 'lucide-react';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';
import teachersRoutes from '@/routes/admin/teachers';
import { edit as teachersEdit } from '@/routes/admin/teachers';
import { update as updateTeacherMatieres } from '@/routes/admin/teachers/matieres';
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

export default function Show({ teacher, matieres, niveaux, availability = {} }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [filterText, setFilterText] = useState('');

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Professeurs', href: teachersRoutes.index.url() },
    { title: teacher.name, href: teachersRoutes.show.url(teacher.id) },
  ];

  // Get location data
  const region = teacher.region_id ? getRegionById(teacher.region_id) : null;
  const prefecture = teacher.prefecture_id ? getPrefectureById(teacher.prefecture_id) : null;
  const commune = teacher.commune_id ? getCommuneById(teacher.commune_id) : null;
  const quartier = teacher.quartier_id ? getQuartierById(teacher.quartier_id) : null;

  // Initialize form with matieres and their niveaux
  const initialMatieres = (teacher.matieres || []).map((m) => ({
    matiere_id: m.id,
    niveau_id: m.pivot?.niveau_id ?? null,
  }));

  const form = useForm({
    matieres: initialMatieres,
  });

  const handleMatiereToggle = (matiereId: number) => {
    const currentMatieres = form.data.matieres || [];
    const existingIndex = currentMatieres.findIndex((m) => m.matiere_id === matiereId);

    if (existingIndex >= 0) {
      form.setData('matieres', currentMatieres.filter((_, i) => i !== existingIndex));
    } else {
      form.setData('matieres', [...currentMatieres, { matiere_id: matiereId, niveau_id: null }]);
    }
  };

  const handleNiveauChange = (matiereId: number, niveauId: string | null) => {
    const currentMatieres = form.data.matieres || [];
    const updatedMatieres = currentMatieres.map((m) =>
      m.matiere_id === matiereId
        ? { ...m, niveau_id: niveauId === 'all' || niveauId === '' ? null : Number(niveauId) }
        : m
    );
    form.setData('matieres', updatedMatieres);
  };

  const getMatiereNiveau = (matiereId: number): number | null => {
    const matiere = form.data.matieres?.find((m) => m.matiere_id === matiereId);
    return matiere?.niveau_id ?? null;
  };

  const isMatiereSelected = (matiereId: number): boolean => {
    return form.data.matieres?.some((m) => m.matiere_id === matiereId) ?? false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    form.put(updateTeacherMatieres(teacher.id).url, {
      preserveScroll: true,
      onFinish: () => setIsSaving(false),
    });
  };

  const hasChanges =
    JSON.stringify(form.data.matieres) !==
    JSON.stringify(initialMatieres);

  const hasAvailability = Object.keys(availability).some(
    (day) => availability[day] && availability[day].length > 0
  );

  // Filtrer les matières
  const filteredMatieres = matieres.filter((m) =>
    filterText
      ? m.name.toLowerCase().includes(filterText.toLowerCase()) ||
        m.code.toLowerCase().includes(filterText.toLowerCase()) ||
        m.description?.toLowerCase().includes(filterText.toLowerCase())
      : true
  );

  // Stats pour l'affichage
  const selectedCount = form.data.matieres.length;
  const totalCount = matieres.length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${teacher.name} - Profil Professeur`} />
      <FullscreenLoader isLoading={isSaving} />

      {/* Header moderne avec photo et infos principales */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl p-8 shadow-sm border border-primary/10">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Photo de profil */}
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

            {/* Informations principales */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
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

              {/* Badges et statuts */}
              <div className="flex flex-wrap items-center gap-3">
                {teacher.roles && teacher.roles.map((role) => (
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

              {/* Bio si disponible */}
              {teacher.bio && (
                <p className="text-gray-700 leading-relaxed max-w-3xl">
                  {teacher.bio}
                </p>
              )}
            </div>

            {/* Bouton d'action */}
            <div className="flex-shrink-0">
              <Button
                onClick={() => router.visit(teachersEdit(teacher.uuid).url)}
                size="lg"
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Modifier le profil
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs pour organiser le contenu */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <UserIcon className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="availability" className="gap-2">
            <Calendar className="h-4 w-4" />
            Disponibilités
          </TabsTrigger>
          <TabsTrigger value="subjects" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Matières
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* Informations de contact */}
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
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Adresse email
                  </Label>
                  <p className="text-base font-medium">{teacher.email}</p>
                </div>
                {teacher.telephone && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                      Téléphone
                    </Label>
                    <p className="text-base font-medium">{teacher.telephone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Localisation */}
          {(teacher.pays || region || prefecture || commune || quartier || teacher.adresse) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5" />
                  Localisation
                </CardTitle>
                <CardDescription>
                  Informations géographiques du professeur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teacher.pays && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        Pays
                      </Label>
                      <p className="text-base font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {teacher.pays}
                      </p>
                    </div>
                  )}
                  {region && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        Région
                      </Label>
                      <p className="text-base font-medium">{region.nom}</p>
                    </div>
                  )}
                  {prefecture && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        Préfecture
                      </Label>
                      <p className="text-base font-medium">{prefecture.nom}</p>
                    </div>
                  )}
                  {commune && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        Commune
                      </Label>
                      <p className="text-base font-medium">{commune.nom}</p>
                    </div>
                  )}
                  {quartier && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        Quartier
                      </Label>
                      <p className="text-base font-medium">{quartier.nom}</p>
                    </div>
                  )}
                  {teacher.adresse && (
                    <div className="md:col-span-2 lg:col-span-3 space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        Adresse complète
                      </Label>
                      <p className="text-base font-medium">{teacher.adresse}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Matières assignées (lecture seule dans l'overview) */}
          {teacher.matieres && teacher.matieres.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Matières enseignées
                    </CardTitle>
                    <CardDescription>
                      {teacher.matieres.length} matière{teacher.matieres.length > 1 ? 's' : ''} assignée{teacher.matieres.length > 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const tabsTrigger = document.querySelector('[value="subjects"]') as HTMLElement;
                      tabsTrigger?.click();
                    }}
                  >
                    Gérer les matières
                  </Button>
                </div>
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
                          <p className="text-xs text-muted-foreground">
                            Niveau : {niveau.name}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Disponibilités */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Disponibilités hebdomadaires
                  </CardTitle>
                  <CardDescription>
                    Horaires où le professeur est disponible pour donner des cours
                  </CardDescription>
                </div>
                <Button
                  onClick={() => router.visit(teachersRoutes.availability.edit.url(teacher.id))}
                  variant="outline"
                  className="gap-2"
                >
                  <Clock className="h-4 w-4" />
                  {hasAvailability ? 'Modifier' : 'Configurer'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!hasAvailability ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aucune disponibilité configurée
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Configurez les jours et horaires où ce professeur est disponible
                    pour faciliter la planification des cours.
                  </p>
                  <Button
                    onClick={() => router.visit(teachersRoutes.availability.edit.url(teacher.id))}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Configurer les disponibilités
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

        {/* Onglet Matières */}
        <TabsContent value="subjects" className="space-y-6">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Sparkles className="h-6 w-6 text-primary" />
                      Gestion des matières
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Gérez les matières enseignées par ce professeur et spécifiez les niveaux pour chaque matière
                    </CardDescription>
                  </div>
                  {selectedCount > 0 && (
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{selectedCount}</div>
                      <div className="text-sm text-muted-foreground">
                        matière{selectedCount > 1 ? 's' : ''} sélectionnée{selectedCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>

                {/* Barre de recherche et filtres */}
                {matieres.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="relative flex-1">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Rechercher une matière (nom, code, description)..."
                        className="w-full pl-10 pr-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                      {filterText && (
                        <button
                          type="button"
                          onClick={() => setFilterText('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant={selectedCount > 0 ? 'default' : 'outline'}
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        if (selectedCount === filteredMatieres.length) {
                          // Désélectionner toutes les matières filtrées
                          const filteredIds = filteredMatieres.map(m => m.id);
                          form.setData('matieres', form.data.matieres.filter(m => !filteredIds.includes(m.matiere_id)));
                        } else {
                          // Sélectionner toutes les matières filtrées
                          const newMatieres = [...form.data.matieres];
                          filteredMatieres.forEach(matiere => {
                            if (!isMatiereSelected(matiere.id)) {
                              newMatieres.push({ matiere_id: matiere.id, niveau_id: null });
                            }
                          });
                          form.setData('matieres', newMatieres);
                        }
                      }}
                    >
                      {selectedCount === filteredMatieres.length ? (
                        <>
                          <X className="h-4 w-4" />
                          Tout désélectionner
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Tout sélectionner
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {matieres.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Aucune matière disponible</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Il n'y a actuellement aucune matière dans le système.
                    </p>
                  </div>
                ) : filteredMatieres.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Filter className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      Aucune matière ne correspond à votre recherche « {filterText} »
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setFilterText('')}>
                      Effacer le filtre
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Grille de cartes de matières */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredMatieres.map((matiere) => {
                        const isSelected = isMatiereSelected(matiere.id);
                        const selectedNiveauId = getMatiereNiveau(matiere.id);

                        return (
                          <div
                            key={matiere.id}
                            className={`group relative rounded-xl border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
                            }`}
                          >
                            {/* Badge de sélection animé */}
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 z-10">
                                <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg animate-in zoom-in-95 duration-200">
                                  <CheckCircle2 className="h-4 w-4" />
                                </div>
                              </div>
                            )}

                            <div className="p-5 space-y-4">
                              {/* En-tête de la carte */}
                              <div className="flex items-start gap-4">
                                <Checkbox
                                  id={`matiere-${matiere.id}`}
                                  checked={isSelected}
                                  onCheckedChange={() => handleMatiereToggle(matiere.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1 min-w-0">
                                  <Label
                                    htmlFor={`matiere-${matiere.id}`}
                                    className="cursor-pointer block"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-bold text-base leading-tight">{matiere.name}</h4>
                                      <Badge variant="secondary" className="text-xs font-mono">
                                        {matiere.code}
                                      </Badge>
                                    </div>
                                    {matiere.description && (
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {matiere.description}
                                      </p>
                                    )}
                                  </Label>
                                </div>
                              </div>

                              {/* Sélection du niveau avec animation */}
                              {isSelected && (
                                <div className="pt-4 border-t border-primary/20 space-y-3 animate-in slide-in-from-top-2 duration-300">
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-primary" />
                                    <Label htmlFor={`niveau-${matiere.id}`} className="text-sm font-semibold">
                                      Niveau d'enseignement
                                    </Label>
                                  </div>
                                  <Select
                                    value={selectedNiveauId ? String(selectedNiveauId) : 'all'}
                                    onValueChange={(value) => handleNiveauChange(matiere.id, value)}
                                  >
                                    <SelectTrigger
                                      id={`niveau-${matiere.id}`}
                                      className="w-full bg-background border-2 border-primary/20 focus:border-primary"
                                    >
                                      <SelectValue placeholder="Sélectionner un niveau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">
                                        <div className="flex items-center gap-2">
                                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                                          <span className="font-semibold">Tous les niveaux</span>
                                        </div>
                                      </SelectItem>
                                      <Separator className="my-2" />
                                      {niveaux.map((niveau) => (
                                        <SelectItem key={niveau.id} value={String(niveau.id)}>
                                          <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary/40" />
                                            <span>{niveau.name}</span>
                                            <span className="text-muted-foreground font-mono text-xs">
                                              ({niveau.code})
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Section de résumé et actions */}
                    <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                              <span className="text-lg font-semibold">
                                {selectedCount} / {totalCount} matières
                              </span>
                            </div>
                            {hasChanges && (
                              <Badge variant="outline" className="bg-background animate-in fade-in duration-500">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Modifications non enregistrées
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {hasChanges
                              ? 'Enregistrez vos modifications pour mettre à jour le profil'
                              : 'Toutes les modifications sont enregistrées'}
                          </p>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isSaving || !hasChanges}
                            onClick={() => form.reset()}
                            className="flex-1 sm:flex-none"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Annuler
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSaving || !hasChanges}
                            className="gap-2 flex-1 sm:flex-none relative overflow-hidden"
                          >
                            {isSaving ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Enregistrement...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4" />
                                Enregistrer
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
