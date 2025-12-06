import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import InputError from '@/components/input-error';
import { Pencil, Trash2, Plus, Shield } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';
import { index, store, update, destroy } from '@/routes/roles';

interface Props {
    roles: Role[];
    activeOnly?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rôles',
        href: index().url,
    },
];

export default function RolesIndex({ roles }: Props) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm({
        name: '',
        slug: '',
        description: '',
        is_active: true,
    });

    const openDeleteDialog = (role: Role) => {
        setRoleToDelete(role);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setRoleToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const handleDelete = () => {
        if (roleToDelete) {
            setIsDeleting(true);
            router.delete(destroy(roleToDelete.id).url, {
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

    const openEditForm = (role: Role) => {
        setEditingRole(role);
        form.setData({
            name: role.name,
            slug: role.slug,
            description: role.description || '',
            is_active: role.is_active,
        });
        setIsFormDialogOpen(true);
    };

    const openCreateForm = () => {
        setEditingRole(null);
        form.reset();
        form.setData({
            name: '',
            slug: '',
            description: '',
            is_active: true,
        });
        setIsFormDialogOpen(true);
    };

    const closeForm = () => {
        setIsFormDialogOpen(false);
        setEditingRole(null);
        form.reset();
        form.clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRole) {
            form.put(update(editingRole.id).url, {
                preserveScroll: true,
                onSuccess: () => {
                    closeForm();
                },
            });
        } else {
            form.post(store().url, {
                preserveScroll: true,
                onSuccess: () => {
                    closeForm();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des rôles" />

            <FullscreenLoader
                isLoading={form.processing || isDeleting}
                spinnerType="loader2"
                message={
                    form.processing
                        ? editingRole
                            ? 'Modification du rôle en cours...'
                            : 'Création du rôle en cours...'
                        : isDeleting
                          ? 'Suppression du rôle en cours...'
                          : undefined
                }
                subtitle="Veuillez patienter"
            />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Gestion des rôles</h1>
                        <p className="text-muted-foreground text-sm">
                            Gérez les rôles et permissions de votre application
                        </p>
                    </div>
                    <Button onClick={openCreateForm}>
                        <Plus className="mr-2 size-4" />
                        Nouveau rôle
                    </Button>
                </div>


                {/* Tableau des rôles */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des rôles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {roles.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Shield className="mx-auto mb-4 size-12 opacity-50" />
                                <p>Aucun rôle trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left text-sm font-medium">Nom</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.map((role) => (
                                            <tr key={role.id} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{role.name}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <code className="text-muted-foreground rounded bg-muted px-2 py-1 text-xs">
                                                        {role.slug}
                                                    </code>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-muted-foreground text-sm max-w-md truncate">
                                                        {role.description || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={role.is_active ? 'success' : 'danger'}>
                                                        {role.is_active ? 'Actif' : 'Inactif'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditForm(role)}
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(role)}
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
                                {editingRole ? 'Modifier le rôle' : 'Créer un nouveau rôle'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingRole
                                    ? 'Modifiez les informations du rôle ci-dessous.'
                                    : 'Remplissez les informations pour créer un nouveau rôle.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom *</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Ex: Administrateur"
                                    required
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={form.data.slug}
                                    onChange={(e) => form.setData('slug', e.target.value)}
                                    placeholder="Ex: admin (généré automatiquement si vide)"
                                />
                                <InputError message={form.errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Description du rôle"
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
                                    Rôle actif
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
                                    {editingRole ? 'Modifier' : 'Créer'}
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
                                Êtes-vous sûr de vouloir supprimer le rôle{' '}
                                <strong>{roleToDelete?.name}</strong> ? Cette action est irréversible et
                                supprimera également toutes les associations avec les utilisateurs.
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

