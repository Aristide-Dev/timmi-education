import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Matiere, type User } from '@/types';
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
  GraduationCap,
  Mail,
  User as UserIcon,
  BookOpen,
  Save,
} from 'lucide-react';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';
import { teachers } from '@/routes/users';
import { update as updateTeacherMatieres } from '@/routes/users/teacher/matieres';

interface Props {
  teacher: User;
  matieres: Matiere[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Professeurs',
    href: teachers().url,
  },
];

export default function TeacherDetails({ teacher, matieres }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    matieres: (teacher.matieres || []).map((m) => m.id),
  });

  const handleMatiereToggle = (matiereId: number) => {
    const currentMatieres = form.data.matieres || [];
    const newMatieres = currentMatieres.includes(matiereId)
      ? currentMatieres.filter((id) => id !== matiereId)
      : [...currentMatieres, matiereId];
    form.setData('matieres', newMatieres);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    form.put(updateTeacherMatieres(teacher.id).url, {
      preserveScroll: true,
      onFinish: () => setIsSaving(false),
    });
  };

  const assignedMatieresIds = (teacher.matieres || []).map((m) => m.id);
  const hasChanges =
    JSON.stringify(form.data.matieres) !==
    JSON.stringify(assignedMatieresIds);

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
          </div>
        </CardContent>
      </Card>

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
                {matieres.map((matiere) => (
                  <div
                    key={matiere.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`matiere-${matiere.id}`}
                        checked={form.data.matieres?.includes(matiere.id) || false}
                        onCheckedChange={() =>
                          handleMatiereToggle(matiere.id)
                        }
                      />
                      <Label
                        htmlFor={`matiere-${matiere.id}`}
                        className="cursor-pointer flex-1"
                      >
                        <p className="font-medium">{matiere.name}</p>
                        <p className="text-sm text-gray-500">{matiere.code}</p>
                      </Label>
                    </div>
                    {assignedMatieresIds.includes(matiere.id) && (
                      <Badge variant="outline" className="ml-2">
                        Assignée
                      </Badge>
                    )}
                  </div>
                ))}
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
            onClick={() => router.visit(teachers().url)}
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
              {teacher.matieres.map((matiere) => (
                <Badge key={matiere.id} variant="secondary">
                  {matiere.name} ({matiere.code})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
}
