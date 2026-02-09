import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Matiere } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AdminListFilters, type FilterConfig } from '@/components/admin-list-filters';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Pencil, Trash2, Plus, BookOpen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';
import { index as adminMatieresIndex } from '@/routes/admin/matieres';
interface Props {
    matieres: Matiere[];
    filters: {
        search?: string;
        active_only?: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Matières',
        href: adminMatieresIndex().url,
    },
];

const matieresFilterConfig: FilterConfig[] = [
    { type: 'search', name: 'search', placeholder: 'Rechercher par nom, code ou description…' },
    {
        type: 'select',
        name: 'active_only',
        label: 'Statut',
        placeholder: 'Tous',
        options: [
            { value: '1', label: 'Actifs uniquement' },
            { value: '0', label: 'Inactifs uniquement' },
        ],
    },
];

export default function MatieresIndex({ matieres, filters }: Props) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [matiereToDelete, setMatiereToDelete] = useState<Matiere | null>(null);
    const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm({
        name: '',
        code: '',
        description: '',
        is_active: true,
    });

    const openDeleteDialog = (matiere: Matiere) => {
        setMatiereToDelete(matiere);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setMatiereToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const handleDelete = () => {
        if (matiereToDelete) {
            setIsDeleting(true);
            router.delete(adminMatieresIndex().url.replace('/index', '') + `/${matiereToDelete.id}`, {
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

    const openEditForm = (matiere: Matiere) => {
        setEditingMatiere(matiere);
        form.setData({
            name: matiere.name,
            code: matiere.code,
            description: matiere.description || '',
            is_active: matiere.is_active,
        });
        setIsFormDialogOpen(true);
    };

    const openCreateForm = () => {
        setEditingMatiere(null);
        form.reset();
        form.setData({
            name: '',
            code: '',
            description: '',
            is_active: true,
        });
        setIsFormDialogOpen(true);
    };

    const closeForm = () => {
        setIsFormDialogOpen(false);
        setEditingMatiere(null);
        form.reset();
        form.clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMatiere) {
            form.put(adminMatieresIndex().url.replace('/index', '') + `/${editingMatiere.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    closeForm();
                },
            });
        } else {
            form.post(adminMatieresIndex().url, {
                preserveScroll: true,
                onSuccess: () => {
                    closeForm();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des matières" />

            <FullscreenLoader
                isLoading={form.processing || isDeleting}
                spinnerType="loader2"
                message={
                    form.processing
                        ? editingMatiere
                            ? 'Modification de la matière en cours...'
                            : 'Création de la matière en cours...'
                        : isDeleting
                          ? 'Suppression de la matière en cours...'
                          : undefined
                }
                subtitle="Veuillez patienter"
            />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Gestion des matières</h1>
                        <p className="text-muted-foreground text-sm">
                            Gérez les matières enseignées dans votre établissement
                        </p>
                    </div>
                    <Button onClick={openCreateForm}>
                        <Plus className="mr-2 size-4" />
                        Nouvelle matière
                    </Button>
                </div>

                <AdminListFilters
                    baseUrl={adminMatieresIndex().url}
                    filters={{
                        search: filters.search,
                        active_only: filters.active_only ?? undefined,
                    }}
                    config={matieresFilterConfig}
                />

                {/* Tableau des matières */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des matières ({matieres.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {matieres.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <BookOpen className="mx-auto mb-4 size-12 opacity-50" />
                                <p>Aucune matière trouvée</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left text-sm font-medium">Nom</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Code</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matieres.map((matiere) => (
                                            <tr key={matiere.id} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{matiere.name}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <code className="text-muted-foreground rounded bg-muted px-2 py-1 text-xs">
                                                        {matiere.code}
                                                    </code>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-muted-foreground text-sm max-w-md truncate">
                                                        {matiere.description || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={matiere.is_active ? 'success' : 'danger'}>
                                                        {matiere.is_active ? 'Actif' : 'Inactif'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditForm(matiere)}
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(matiere)}
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

                {/* Modal de création/édition */}
                <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingMatiere
                                    ? 'Modifier la matière'
                                    : 'Créer une nouvelle matière'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingMatiere
                                    ? 'Modifiez les informations de la matière ci-dessous.'
                                    : 'Remplissez les informations pour créer une nouvelle matière.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom *</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Ex: Mathématiques"
                                    required
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="code">Code *</Label>
                                <Input
                                    id="code"
                                    value={form.data.code}
                                    onChange={(e) => form.setData('code', e.target.value.toUpperCase())}
                                    placeholder="Ex: MATH"
                                    required
                                />
                                <InputError message={form.errors.code} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Description de la matière"
                                    rows={3}
                                />
                                <InputError message={form.errors.description} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={form.data.is_active}
                                    onCheckedChange={(checked) =>
                                        form.setData('is_active', checked === true)
                                    }
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Matière active
                                </Label>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={closeForm}
                                    disabled={form.processing}
                                >
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={form.processing}>
                                    {editingMatiere ? 'Modifier' : 'Créer'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal de confirmation de suppression */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer la matière{' '}
                                <strong>{matiereToDelete?.name}</strong> ({matiereToDelete?.code}) ? Cette
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

