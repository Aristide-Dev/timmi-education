import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type TeacherRequest } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    MapPin,
    BookOpen,
    GraduationCap,
    MessageSquare,
    Save,
} from 'lucide-react';
import { index as adminTeacherRequestsIndex, updateStatus as adminUpdateRequestStatus } from '@/routes/admin/teacher-requests';
import {
    getRegionById,
    getPrefectureById,
    getCommuneById,
    getQuartierById,
} from '@/mocks';

interface Props {
    request: TeacherRequest;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Demandes de professeurs',
        href: adminTeacherRequestsIndex().url,
    },
];

const statusLabels: Record<string, string> = {
    pending: 'En attente',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
};

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'danger' | 'warning'> = {
    pending: 'warning',
    in_progress: 'default',
    completed: 'success',
    cancelled: 'danger',
};

export default function Show({ request }: Props) {
    const form = useForm({
        status: request.status,
    });

    const handleStatusUpdate = () => {
        form.patch(adminUpdateRequestStatus(request.id).url, {
            preserveScroll: true,
        });
    };

    // Get location data
    const region = request.region_id ? getRegionById(request.region_id) : null;
    const prefecture = request.prefecture_id ? getPrefectureById(request.prefecture_id) : null;
    const commune = request.commune_id ? getCommuneById(request.commune_id) : null;
    const quartier = request.quartier_id ? getQuartierById(request.quartier_id) : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Demande de ${request.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Détails de la demande</h1>
                        <p className="text-muted-foreground text-sm">
                            Informations complètes sur la demande de professeur
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit(adminTeacherRequestsIndex().url)}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informations du demandeur */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du demandeur</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Nom complet</Label>
                                <p className="text-sm font-medium">{request.name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {request.email}
                                </div>
                            </div>
                            {request.phone && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        {request.phone}
                                    </div>
                                </div>
                            )}
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Date de demande</Label>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {new Date(request.created_at).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Critères de recherche */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Critères de recherche</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {request.matiere && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Matière</Label>
                                    <div className="flex items-center gap-2 text-sm">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        {request.matiere.name} ({request.matiere.code})
                                    </div>
                                </div>
                            )}
                            {request.niveau && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Niveau</Label>
                                    <div className="flex items-center gap-2 text-sm">
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                        {request.niveau.name}
                                    </div>
                                </div>
                            )}
                            {request.search_query && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Recherche</Label>
                                    <p className="text-sm">{request.search_query}</p>
                                </div>
                            )}
                            {(region || prefecture || commune || quartier) && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Localisation</Label>
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div className="space-y-1">
                                            {region && <p>{region.nom}</p>}
                                            {prefecture && <p className="text-muted-foreground">{prefecture.nom}</p>}
                                            {commune && <p className="text-muted-foreground">{commune.nom}</p>}
                                            {quartier && <p className="text-muted-foreground">{quartier.nom}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Message */}
                    {request.message && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Message</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                                    <p className="text-sm whitespace-pre-wrap">{request.message}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Gestion du statut */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Gestion du statut</CardTitle>
                            <CardDescription>
                                Modifiez le statut de cette demande pour suivre son traitement
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Label htmlFor="status">Statut actuel</Label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={(value) => form.setData('status', value as TeacherRequest['status'])}
                                    >
                                        <SelectTrigger id="status" className="mt-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">En attente</SelectItem>
                                            <SelectItem value="in_progress">En cours</SelectItem>
                                            <SelectItem value="completed">Terminée</SelectItem>
                                            <SelectItem value="cancelled">Annulée</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="pt-8">
                                    <Badge variant={statusVariants[request.status]}>
                                        {statusLabels[request.status]}
                                    </Badge>
                                </div>
                            </div>
                            <Button
                                onClick={handleStatusUpdate}
                                disabled={form.processing || form.data.status === request.status}
                                className="flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {form.processing ? 'Enregistrement...' : 'Enregistrer le statut'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

