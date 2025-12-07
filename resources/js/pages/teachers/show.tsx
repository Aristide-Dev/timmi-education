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
import {
  GraduationCap,
  Mail,
  User as UserIcon,
  BookOpen,
  Save,
  Edit,
  MapPin,
  Phone,
} from 'lucide-react';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';
import { index as teachersIndex, edit as teachersEdit } from '@/routes/teachers';
import { update as updateTeacherMatieres } from '@/routes/teachers/matieres';
import {
  getRegionById,
  getPrefectureById,
  getCommuneById,
  getQuartierById,
} from '@/mocks';

interface Props {
  teacher: User;
  matieres: Matiere[];
  niveaux: Niveau[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Professeurs',
    href: teachersIndex().url,
  },
];

export default function Show({ teacher, matieres, niveaux }: Props) {
  const [isSaving, setIsSaving] = useState(false);

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
      // Remove matiere
      form.setData('matieres', currentMatieres.filter((_, i) => i !== existingIndex));
    } else {
      // Add matiere with no niveau by default
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Détails - ${teacher.name}`} />
      <FullscreenLoader isLoading={isSaving} />

      {/* En-tête */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Détails du professeur
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les informations et les matières enseignées
          </p>
        </div>
        <Button
          onClick={() => router.visit(teachersEdit(teacher.id).url)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Modifier
        </Button>
      </div>

      {/* Informations du professeur */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Informations personnelles
          </CardTitle>
          <CardDescription>Détails du compte professeur</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <Label className="text-sm font-medium text-gray-500">Rôles</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {teacher.roles && teacher.roles.length > 0 ? (
                  teacher.roles.map((role) => (
                    <Badge key={role.id} variant="secondary">
                      {role.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">Aucun rôle</span>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Email vérifié
              </Label>
              <Badge
                variant={
                  teacher.email_verified_at ? 'default' : 'destructive'
                }
                className="mt-2"
              >
                {teacher.email_verified_at ? 'Vérifié' : 'Non vérifié'}
              </Badge>
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
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-500">Biographie</Label>
                <p className="text-base mt-1">{teacher.bio}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informations de localisation */}
      {(teacher.pays || region || prefecture || commune || quartier || teacher.adresse) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Localisation
            </CardTitle>
            <CardDescription>Informations de localisation du professeur</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Label className="text-sm font-medium text-gray-500">Préfecture</Label>
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
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-500">Adresse complète</Label>
                  <p className="text-base mt-1">{teacher.adresse}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matières enseignées */}
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Matières enseignées
            </CardTitle>
            <CardDescription>
              Sélectionnez les matières que ce professeur enseigne
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matieres.length === 0 ? (
              <p className="text-gray-500">Aucune matière disponible</p>
            ) : (
              <div className="space-y-4">
                {matieres.map((matiere) => {
                  const isSelected = isMatiereSelected(matiere.id);
                  const selectedNiveauId = getMatiereNiveau(matiere.id);
                  const wasAssigned = (teacher.matieres || []).some((m) => m.id === matiere.id);

                  return (
                    <div
                      key={matiere.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            id={`matiere-${matiere.id}`}
                            checked={isSelected}
                            onCheckedChange={() => handleMatiereToggle(matiere.id)}
                          />
                          <Label
                            htmlFor={`matiere-${matiere.id}`}
                            className="cursor-pointer flex-1"
                          >
                            <p className="font-medium">{matiere.name}</p>
                            <p className="text-sm text-gray-500">{matiere.code}</p>
                          </Label>
                        </div>
                        {wasAssigned && (
                          <Badge variant="outline" className="ml-2">
                            Assignée
                          </Badge>
                        )}
                      </div>
                      {isSelected && (
                        <div className="ml-8 space-y-2">
                          <Label htmlFor={`niveau-${matiere.id}`} className="text-sm font-medium">
                            Niveau d'enseignement
                          </Label>
                          <Select
                            value={selectedNiveauId ? String(selectedNiveauId) : 'all'}
                            onValueChange={(value) => handleNiveauChange(matiere.id, value)}
                          >
                            <SelectTrigger id={`niveau-${matiere.id}`} className="w-full">
                              <SelectValue placeholder="Sélectionner un niveau" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous les niveaux</SelectItem>
                              {niveaux.map((niveau) => (
                                <SelectItem key={niveau.id} value={String(niveau.id)}>
                                  {niveau.name} ({niveau.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end mb-6">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => router.visit(teachersIndex().url)}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </form>

      {/* Liste des matières assignées */}
      {teacher.matieres && teacher.matieres.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Matières actuellement assignées ({teacher.matieres.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {teacher.matieres.map((matiere) => {
                const niveauId = matiere.pivot?.niveau_id;
                const niveau = niveauId ? niveaux.find((n) => n.id === niveauId) : null;

                return (
                  <Badge key={matiere.id} variant="secondary" className="flex items-center gap-1">
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
    </AppLayout>
  );
}
