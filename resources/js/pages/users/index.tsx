import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role, type SharedData, type User } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
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
import { Pencil, Trash2, Plus, Users } from 'lucide-react';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';

interface Props {
    users: User[];
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Utilisateurs',
        href: '/users',
    },
];

export default function UsersIndex({ users, roles }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as number[],
    });

    const openDeleteDialog = (user: User) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setUserToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const handleDelete = () => {
        if (userToDelete) {
            setIsDeleting(true);
            // Routes will be auto-generated, using direct URL for now
            router.delete(`/users/${userToDelete.id}`, {
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

    const openEditForm = (user: User) => {
        setEditingUser(user);
        form.setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            roles: user.roles?.map((role) => role.id) || [],
        });
        setIsFormDialogOpen(true);
    };

    const openCreateForm = () => {
        setEditingUser(null);
        form.reset();
        form.setData({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            roles: [],
        });
        setIsFormDialogOpen(true);
    };

    const closeForm = () => {
        setIsFormDialogOpen(false);
        setEditingUser(null);
        form.reset();
        form.clearErrors();
    };

    const handleRoleToggle = (roleId: number) => {
        const currentRoles = form.data.roles || [];
        const newRoles = currentRoles.includes(roleId)
            ? currentRoles.filter((id) => id !== roleId)
            : [...currentRoles, roleId];
        form.setData('roles', newRoles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            // Routes will be auto-generated, using direct URL for now
            form.put(`/users/${editingUser.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    closeForm();
                },
            });
        } else {
            // Routes will be auto-generated, using direct URL for now
            form.post('/users', {
                preserveScroll: true,
                onSuccess: () => {
                    closeForm();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des utilisateurs" />

            <FullscreenLoader
                isLoading={form.processing || isDeleting}
                spinnerType="loader2"
                message={
                    form.processing
                        ? editingUser
                            ? 'Modification de l\'utilisateur en cours...'
                            : 'Création de l\'utilisateur en cours...'
                        : isDeleting
                          ? 'Suppression de l\'utilisateur en cours...'
                          : undefined
                }
                subtitle="Veuillez patienter"
            />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Gestion des utilisateurs</h1>
                        <p className="text-muted-foreground text-sm">
                            Gérez les utilisateurs et leurs rôles
                        </p>
                    </div>
                    <Button onClick={openCreateForm}>
                        <Plus className="mr-2 size-4" />
                        Nouvel utilisateur
                    </Button>
                </div>

                {/* Tableau des utilisateurs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {users.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Users className="mx-auto mb-4 size-12 opacity-50" />
                                <p>Aucun utilisateur trouvé</p>
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
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{user.name}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm">{user.email}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles && user.roles.length > 0 ? (
                                                            user.roles.map((role) => (
                                                                <Badge
                                                                    key={role.id}
                                                                    variant="secondary"
                                                                >
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
                                                            user.email_verified_at
                                                                ? 'success'
                                                                : 'warning'
                                                        }
                                                    >
                                                        {user.email_verified_at
                                                            ? 'Vérifié'
                                                            : 'Non vérifié'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditForm(user)}
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(user)}
                                                            disabled={user.id === auth.user.id}
                                                            title={
                                                                user.id === auth.user.id
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

                {/* Modal de création/édition */}
                <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingUser
                                    ? 'Modifier l\'utilisateur'
                                    : 'Créer un nouvel utilisateur'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingUser
                                    ? 'Modifiez les informations de l\'utilisateur ci-dessous.'
                                    : 'Remplissez les informations pour créer un nouvel utilisateur.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom *</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Ex: Jean Dupont"
                                    required
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    placeholder="Ex: jean.dupont@example.com"
                                    required
                                />
                                <InputError message={form.errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {editingUser ? 'Nouveau mot de passe' : 'Mot de passe *'}
                                    {editingUser && (
                                        <span className="text-muted-foreground text-xs font-normal ml-2">
                                            (Laissez vide pour ne pas modifier)
                                        </span>
                                    )}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required={!editingUser}
                                />
                                <InputError message={form.errors.password} />
                            </div>

                            {(!editingUser || form.data.password) && (
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirmation du mot de passe *
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={form.data.password_confirmation}
                                        onChange={(e) =>
                                            form.setData('password_confirmation', e.target.value)
                                        }
                                        placeholder="••••••••"
                                        required={!editingUser || !!form.data.password}
                                    />
                                    <InputError message={form.errors.password_confirmation} />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label>Rôles</Label>
                                <div className="space-y-2 rounded-md border p-3">
                                    {roles.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">
                                            Aucun rôle disponible
                                        </p>
                                    ) : (
                                        roles.map((role) => (
                                            <div
                                                key={role.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`role-${role.id}`}
                                                    checked={form.data.roles?.includes(role.id)}
                                                    onCheckedChange={() => handleRoleToggle(role.id)}
                                                />
                                                <Label
                                                    htmlFor={`role-${role.id}`}
                                                    className="cursor-pointer flex-1"
                                                >
                                                    {role.name}
                                                </Label>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <InputError message={form.errors.roles} />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="danger"
                                    onClick={closeForm}
                                    disabled={form.processing}
                                >
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={form.processing}>
                                    {editingUser ? 'Modifier' : 'Créer'}
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
                                Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
                                <strong>{userToDelete?.name}</strong> ({userToDelete?.email}) ? Cette
                                action est irréversible et supprimera également toutes les associations
                                avec les rôles.
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

