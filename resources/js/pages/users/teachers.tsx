import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, GraduationCap, Eye } from 'lucide-react';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';
import { teachers, destroy } from '@/routes/users';

interface Props {
    teachers: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Professeurs',
        href: teachers().url,
    },
];

export default function TeachersIndex({ teachers }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteDialog = (teacher: User) => {
        setTeacherToDelete(teacher);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setTeacherToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const handleDelete = () => {
        if (teacherToDelete) {
            setIsDeleting(true);
            router.delete(destroy(teacherToDelete.id).url, {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteDialog();
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Liste des professeurs" />

            <FullscreenLoader
                isLoading={isDeleting}
                spinnerType="loader2"
                message="Suppression du professeur en cours..."
                subtitle="Veuillez patienter"
            />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Liste des professeurs</h1>
                        <p className="text-muted-foreground text-sm">
                            Gérez les professeurs de votre établissement
                        </p>
                    </div>
                </div>

                {/* Tableau des professeurs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Professeurs ({teachers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {teachers.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <GraduationCap className="mx-auto mb-4 size-12 opacity-50" />
                                <p>Aucun professeur trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left text-sm font-medium">Nom</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Rôles</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Email vérifié</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teachers.map((teacher) => (
                                            <tr key={teacher.id} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{teacher.name}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm">{teacher.email}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {teacher.roles && teacher.roles.length > 0 ? (
                                                            teacher.roles.map((role) => (
                                                                <Badge key={role.id} variant="secondary">
                                                                    {role.name}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted-foreground text-xs">
                                                                Aucun rôle
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant={
                                                            teacher.email_verified_at ? 'success' : 'warning'
                                                        }
                                                    >
                                                        {teacher.email_verified_at ? 'Vérifié' : 'Non vérifié'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.visit(`/users/teachers/${teacher.id}`)
                                                            }
                                                            title="Voir les détails"
                                                        >
                                                            <Eye className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(teacher)}
                                                            disabled={teacher.id === auth.user.id}
                                                            title={
                                                                teacher.id === auth.user.id
                                                                    ? 'Vous ne pouvez pas supprimer votre propre compte'
                                                                    : 'Supprimer'
                                                            }
                                                        >
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Modal de confirmation de suppression */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer le professeur{' '}
                                <strong>{teacherToDelete?.name}</strong> ({teacherToDelete?.email}) ? Cette
                                action est irréversible.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="secondary" onClick={closeDeleteDialog}>
                                Annuler
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Supprimer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

