import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Matiere, type Niveau, type User } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  GraduationCap,
  Save,
  X,
} from 'lucide-react';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';
import { index as teachersIndex, show as teachersShow, update as teachersUpdate } from '@/routes/admin/teachers';
import {
  getAllRegions,
  getPrefecturesForRegion,
  getCommunesForPrefecture,
  getQuartiersForCommune,
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

export default function Edit({ teacher, matieres, niveaux }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    name: teacher.name || '',
    email: teacher.email || '',
    password: '',
    password_confirmation: '',
    pays: teacher.pays || 'GUINEE',
    region_id: teacher.region_id || '',
    prefecture_id: teacher.prefecture_id || '',
    commune_id: teacher.commune_id || '',
    quartier_id: teacher.quartier_id || '',
    adresse: teacher.adresse || '',
    telephone: teacher.telephone || '',
    bio: teacher.bio || '',
    matieres: (teacher.matieres || []).map((m) => ({
      matiere_id: m.id,
      niveau_id: m.pivot?.niveau_id ?? null,
    })),
  });

  // Get all regions
  const regions = useMemo(() => getAllRegions(), []);

  // Get prefectures based on selected region
  const prefectures = useMemo(() => {
    if (!form.data.region_id) return [];
    return getPrefecturesForRegion(form.data.region_id);
  }, [form.data.region_id]);

  // Get communes based on selected prefecture
  const communes = useMemo(() => {
    if (!form.data.prefecture_id) return [];
    return getCommunesForPrefecture(form.data.prefecture_id);
  }, [form.data.prefecture_id]);

  // Get quartiers based on selected commune
  const quartiers = useMemo(() => {
    if (!form.data.commune_id) return [];
    return getQuartiersForCommune(form.data.commune_id);
  }, [form.data.commune_id]);

  // Reset dependent fields when parent changes
  const handleRegionChange = (regionId: string) => {
    form.setData({
      ...form.data,
      region_id: regionId,
      prefecture_id: '',
      commune_id: '',
      quartier_id: '',
    });
  };

  const handlePrefectureChange = (prefectureId: string) => {
    form.setData({
      ...form.data,
      prefecture_id: prefectureId,
      commune_id: '',
      quartier_id: '',
    });
  };

  const handleCommuneChange = (communeId: string) => {
    form.setData({
      ...form.data,
      commune_id: communeId,
      quartier_id: '',
    });
  };

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

    form.put(teachersUpdate(teacher.id).url, {
      preserveScroll: true,
      onFinish: () => setIsSaving(false),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Modifier - ${teacher.name}`} />
      <FullscreenLoader isLoading={isSaving} />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Modifier le professeur
            </h1>
            <p className="text-muted-foreground text-sm">
              Modifiez les informations du professeur
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Informations personnelles */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Informations de base du professeur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    required
                    placeholder="Jean Dupont"
                  />
                  {form.errors.name && (
                    <p className="text-sm text-destructive">{form.errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    required
                    placeholder="jean.dupont@example.com"
                  />
                  {form.errors.email && (
                    <p className="text-sm text-destructive">{form.errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    minLength={8}
                    placeholder="Laisser vide pour ne pas changer"
                  />
                  {form.errors.password && (
                    <p className="text-sm text-destructive">{form.errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirmer le nouveau mot de passe</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={form.data.password_confirmation}
                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                    minLength={8}
                    placeholder="Laisser vide pour ne pas changer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={form.data.telephone || ''}
                    onChange={(e) => form.setData('telephone', e.target.value)}
                    placeholder="+224 612 345 678"
                  />
                  {form.errors.telephone && (
                    <p className="text-sm text-destructive">{form.errors.telephone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={form.data.bio || ''}
                  onChange={(e) => form.setData('bio', e.target.value)}
                  placeholder="Présentation du professeur..."
                  rows={4}
                />
                {form.errors.bio && (
                  <p className="text-sm text-destructive">{form.errors.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Localisation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Localisation</CardTitle>
              <CardDescription>
                Informations de localisation du professeur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pays">Pays *</Label>
                  <Input
                    id="pays"
                    value={form.data.pays}
                    onChange={(e) => form.setData('pays', e.target.value)}
                    required
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region_id">Région</Label>
                  <Select
                    value={form.data.region_id}
                    onValueChange={handleRegionChange}
                  >
                    <SelectTrigger id="region_id">
                      <SelectValue placeholder="Sélectionner une région" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.errors.region_id && (
                    <p className="text-sm text-destructive">{form.errors.region_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prefecture_id">Préfecture</Label>
                  <Select
                    value={form.data.prefecture_id}
                    onValueChange={handlePrefectureChange}
                    disabled={!form.data.region_id}
                  >
                    <SelectTrigger id="prefecture_id">
                      <SelectValue placeholder="Sélectionner une préfecture" />
                    </SelectTrigger>
                    <SelectContent>
                      {prefectures.map((prefecture) => (
                        <SelectItem key={prefecture.id} value={prefecture.id}>
                          {prefecture.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.errors.prefecture_id && (
                    <p className="text-sm text-destructive">{form.errors.prefecture_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commune_id">Commune</Label>
                  <Select
                    value={form.data.commune_id}
                    onValueChange={handleCommuneChange}
                    disabled={!form.data.prefecture_id}
                  >
                    <SelectTrigger id="commune_id">
                      <SelectValue placeholder="Sélectionner une commune" />
                    </SelectTrigger>
                    <SelectContent>
                      {communes.map((commune) => (
                        <SelectItem key={commune.id} value={commune.id}>
                          {commune.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.errors.commune_id && (
                    <p className="text-sm text-destructive">{form.errors.commune_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quartier_id">Quartier</Label>
                  <Select
                    value={form.data.quartier_id}
                    onValueChange={(value) => form.setData('quartier_id', value)}
                    disabled={!form.data.commune_id}
                  >
                    <SelectTrigger id="quartier_id">
                      <SelectValue placeholder="Sélectionner un quartier" />
                    </SelectTrigger>
                    <SelectContent>
                      {quartiers.map((quartier) => (
                        <SelectItem key={quartier.id} value={quartier.id}>
                          {quartier.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.errors.quartier_id && (
                    <p className="text-sm text-destructive">{form.errors.quartier_id}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse complète</Label>
                <Textarea
                  id="adresse"
                  value={form.data.adresse || ''}
                  onChange={(e) => form.setData('adresse', e.target.value)}
                  placeholder="Rue, numéro, etc."
                  rows={3}
                />
                {form.errors.adresse && (
                  <p className="text-sm text-destructive">{form.errors.adresse}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Matières enseignées */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Matières enseignées</CardTitle>
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

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => router.visit(teachersShow(teacher.uuid).url)}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSaving || form.processing}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

