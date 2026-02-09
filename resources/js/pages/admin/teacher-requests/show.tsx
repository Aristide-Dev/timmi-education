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
    UserPlus,
    CalendarClock,
    ExternalLink,
    User,
    Sparkles,
    Check,
    AlertCircle,
    Clock,
} from 'lucide-react';
import {
    index as adminTeacherRequestsIndex,
    updateStatus as adminUpdateRequestStatus,
    assign as adminTeacherRequestsAssign,
} from '@/routes/admin/teacher-requests';
import teachersRoutes from '@/routes/admin/teachers';
import { Checkbox } from '@/components/ui/checkbox';
import {
    getRegionById,
    getPrefectureById,
    getCommuneById,
    getQuartierById,
} from '@/mocks';

interface Props {
    request: TeacherRequest;
    teachers: Array<{ id: number; uuid: string; name: string; email: string }>;
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

const NONE_TEACHER_VALUE = '__none__';

export default function Show({ request, teachers }: Props) {
    const form = useForm({
        status: request.status,
    });

    const assignForm = useForm({
        teacher_id: request.assigned_teacher_id?.toString() ?? NONE_TEACHER_VALUE,
        scheduled_at: request.scheduled_at ? request.scheduled_at.slice(0, 16) : '',
        create_requester_account: false,
        requester_role: 'student' as 'student' | 'teacher',
    });

    const handleStatusUpdate = () => {
        form.patch(adminUpdateRequestStatus(request.uuid).url, {
            preserveScroll: true,
        });
    };

    const handleAssign = () => {
        const rawTeacherId = assignForm.data.teacher_id;
        const teacherId = rawTeacherId && rawTeacherId !== NONE_TEACHER_VALUE ? Number(rawTeacherId) : null;
        router.patch(adminTeacherRequestsAssign(request.uuid).url, {
            teacher_id: teacherId,
            scheduled_at: assignForm.data.scheduled_at || null,
            create_requester_account: assignForm.data.create_requester_account,
            requester_role: assignForm.data.create_requester_account ? assignForm.data.requester_role : null,
        }, { preserveScroll: true });
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
                {/* En-tête moderne avec statut en vedette */}
                <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">{request.name}</h1>
                                    <p className="text-muted-foreground">Demande de professeur</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <Badge variant={statusVariants[request.status]} className="px-3 py-1.5 text-sm">
                                    {statusLabels[request.status]}
                                </Badge>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Demandée le {new Date(request.created_at).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </div>
                                {request.assigned_teacher && (
                                    <Badge variant="outline" className="bg-background">
                                        <Check className="h-3 w-3 mr-1" />
                                        Professeur assigné
                                    </Badge>
                                )}
                                {request.requester_user && (
                                    <Badge variant="outline" className="bg-background">
                                        <Check className="h-3 w-3 mr-1" />
                                        Compte créé
                                    </Badge>
                                )}
                            </div>
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
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informations du demandeur avec design moderne */}
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Informations du demandeur
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 rounded-lg bg-muted/50">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Nom complet</Label>
                                <p className="text-base font-semibold mt-1">{request.name}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Email</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-medium">{request.email}</p>
                                </div>
                            </div>
                            {request.phone && (
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Téléphone</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="h-4 w-4 text-primary" />
                                        <p className="text-sm font-medium">{request.phone}</p>
                                    </div>
                                </div>
                            )}
                            <div className="p-3 rounded-lg bg-muted/50">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Date de demande</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-medium">
                                        {new Date(request.created_at).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Critères de recherche avec icônes colorées */}
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Critères de recherche
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {request.matiere && (
                                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Matière</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <p className="text-sm font-semibold">{request.matiere.name}</p>
                                        <Badge variant="secondary" className="text-xs">{request.matiere.code}</Badge>
                                    </div>
                                </div>
                            )}
                            {request.niveau && (
                                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Niveau</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        <p className="text-sm font-semibold">{request.niveau.name}</p>
                                    </div>
                                </div>
                            )}
                            {request.search_query && (
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Recherche</Label>
                                    <p className="text-sm mt-1">{request.search_query}</p>
                                </div>
                            )}
                            {(region || prefecture || commune || quartier) && (
                                <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border border-green-200 dark:border-green-800">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Localisation</Label>
                                    <div className="flex items-start gap-2 mt-1">
                                        <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                                        <div className="space-y-1">
                                            {region && <p className="text-sm font-semibold">{region.nom}</p>}
                                            {prefecture && <p className="text-xs text-muted-foreground">{prefecture.nom}</p>}
                                            {commune && <p className="text-xs text-muted-foreground">{commune.nom}</p>}
                                            {quartier && <p className="text-xs text-muted-foreground">{quartier.nom}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Message avec style amélioré */}
                    {request.message && (
                        <Card className="md:col-span-2 border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    Message du demandeur
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted border">
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{request.message}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Assignation à un professeur - Design moderne */}
                    <Card className="md:col-span-2 border-2 border-primary/20">
                        <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <CalendarClock className="h-6 w-6 text-primary" />
                                Assignation au professeur
                            </CardTitle>
                            <CardDescription>
                                Assignez un professeur à cette demande. Les disponibilités sont gérées dans le planning Zap du professeur.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {/* Professeur déjà assigné */}
                            {request.assigned_teacher && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-1.5 rounded-full bg-green-600 dark:bg-green-400">
                                                    <Check className="h-3 w-3 text-white dark:text-green-950" />
                                                </div>
                                                <Label className="text-green-900 dark:text-green-100 font-semibold">Professeur assigné</Label>
                                            </div>
                                            <p className="font-bold text-lg">{request.assigned_teacher.name}</p>
                                            <p className="text-sm text-muted-foreground">{request.assigned_teacher.email}</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => router.visit(teachersRoutes.availability.edit.url(request.assigned_teacher!.id))}
                                        >
                                            <Clock className="h-4 w-4" />
                                            Voir les disponibilités
                                            <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Sélection du professeur */}
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="assign-teacher" className="text-base font-semibold flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary" />
                                        Sélectionner un professeur
                                    </Label>
                                    <p className="text-xs text-muted-foreground mt-1">Choisissez le professeur qui prendra en charge cette demande</p>
                                </div>
                                <Select
                                    value={assignForm.data.teacher_id}
                                    onValueChange={(v) => assignForm.setData('teacher_id', v)}
                                >
                                    <SelectTrigger id="assign-teacher" className="h-12 border-2">
                                        <SelectValue placeholder="Choisir un professeur..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={NONE_TEACHER_VALUE}>
                                            <div className="flex items-center gap-2 py-1">
                                                <div className="w-2 h-2 rounded-full bg-muted" />
                                                <span>Aucun professeur</span>
                                            </div>
                                        </SelectItem>
                                        {teachers.map((t) => (
                                            <SelectItem key={t.id} value={String(t.id)}>
                                                <div className="flex items-center gap-2 py-1">
                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                    <div>
                                                        <p className="font-medium">{t.name}</p>
                                                        <p className="text-xs text-muted-foreground">{t.email}</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {assignForm.data.teacher_id && assignForm.data.teacher_id !== NONE_TEACHER_VALUE && (
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-sm"
                                        onClick={() =>
                                            router.visit(
                                                teachersRoutes.availability.edit.url(Number(assignForm.data.teacher_id)),
                                            )
                                        }
                                    >
                                        <Clock className="h-3 w-3 mr-1" />
                                        Consulter les disponibilités de ce professeur
                                        <ExternalLink className="ml-1 h-3 w-3" />
                                    </Button>
                                )}
                            </div>

                            {/* Créneau prévu */}
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="scheduled_at" className="text-base font-semibold flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        Créneau prévu (optionnel)
                                    </Label>
                                    <p className="text-xs text-muted-foreground mt-1">Définissez une date et heure pour le cours</p>
                                </div>
                                <input
                                    id="scheduled_at"
                                    type="datetime-local"
                                    className="flex h-12 w-full rounded-md border-2 border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={assignForm.data.scheduled_at}
                                    onChange={(e) => assignForm.setData('scheduled_at', e.target.value)}
                                />
                            </div>

                            {/* Création de compte demandeur */}
                            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="create-account"
                                        checked={assignForm.data.create_requester_account}
                                        onCheckedChange={(checked) =>
                                            assignForm.setData('create_requester_account', Boolean(checked))
                                        }
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor="create-account" className="cursor-pointer font-semibold flex items-center gap-2">
                                            <UserPlus className="h-4 w-4" />
                                            Créer un compte pour le demandeur
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Un compte sera créé et un email de réinitialisation de mot de passe sera envoyé
                                        </p>
                                    </div>
                                </div>

                                {assignForm.data.create_requester_account && (
                                    <div className="ml-9 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        <Label className="text-sm font-semibold">Type de compte</Label>
                                        <Select
                                            value={assignForm.data.requester_role}
                                            onValueChange={(v) =>
                                                assignForm.setData('requester_role', v as 'student' | 'teacher')
                                            }
                                        >
                                            <SelectTrigger className="h-11 bg-background border-2">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="student">
                                                    <div className="flex items-center gap-2 py-1">
                                                        <GraduationCap className="h-4 w-4 text-blue-600" />
                                                        <div>
                                                            <p className="font-medium">Élève</p>
                                                            <p className="text-xs text-muted-foreground">Compte élève avec accès aux cours</p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="teacher">
                                                    <div className="flex items-center gap-2 py-1">
                                                        <BookOpen className="h-4 w-4 text-purple-600" />
                                                        <div>
                                                            <p className="font-medium">Professeur</p>
                                                            <p className="text-xs text-muted-foreground">Compte professeur pour enseigner</p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            {/* Compte demandeur déjà créé */}
                            {request.requester_user && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded-full bg-green-600 dark:bg-green-400">
                                            <Check className="h-3 w-3 text-white dark:text-green-950" />
                                        </div>
                                        <div className="flex-1">
                                            <Label className="text-green-900 dark:text-green-100 font-semibold">Compte demandeur créé</Label>
                                            <p className="font-bold mt-1">{request.requester_user.name}</p>
                                            <p className="text-sm text-muted-foreground">{request.requester_user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bouton d'enregistrement */}
                            <div className="pt-4 border-t">
                                <Button
                                    onClick={handleAssign}
                                    size="lg"
                                    className="w-full gap-2 text-base"
                                >
                                    <Save className="h-5 w-5" />
                                    Enregistrer l'assignation
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gestion du statut - Design moderne */}
                    <Card className="md:col-span-2 border-2">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-transparent">
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-primary" />
                                Gestion du statut
                            </CardTitle>
                            <CardDescription>
                                Modifiez le statut pour suivre l'avancement du traitement de cette demande
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Statut actuel en vedette */}
                                <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-3 block">Statut actuel</Label>
                                    <Badge variant={statusVariants[request.status]} className="text-base px-4 py-2">
                                        {statusLabels[request.status]}
                                    </Badge>
                                </div>

                                {/* Nouveau statut */}
                                <div className="space-y-3">
                                    <Label htmlFor="status" className="text-base font-semibold">Nouveau statut</Label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={(value) => form.setData('status', value as TeacherRequest['status'])}
                                    >
                                        <SelectTrigger id="status" className="h-12 border-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                <div className="flex items-center gap-2 py-1">
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                    <div>
                                                        <p className="font-medium">En attente</p>
                                                        <p className="text-xs text-muted-foreground">La demande n'a pas encore été traitée</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="in_progress">
                                                <div className="flex items-center gap-2 py-1">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                                    <div>
                                                        <p className="font-medium">En cours</p>
                                                        <p className="text-xs text-muted-foreground">La demande est en cours de traitement</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="completed">
                                                <div className="flex items-center gap-2 py-1">
                                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                                    <div>
                                                        <p className="font-medium">Terminée</p>
                                                        <p className="text-xs text-muted-foreground">La demande a été traitée avec succès</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="cancelled">
                                                <div className="flex items-center gap-2 py-1">
                                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                                    <div>
                                                        <p className="font-medium">Annulée</p>
                                                        <p className="text-xs text-muted-foreground">La demande a été annulée</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Indicateur de changement */}
                            {form.data.status !== request.status && (
                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 animate-in fade-in duration-300">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm text-blue-900 dark:text-blue-100">Changement de statut détecté</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Le statut passera de <strong>{statusLabels[request.status]}</strong> à <strong>{statusLabels[form.data.status]}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bouton d'enregistrement */}
                            <Button
                                onClick={handleStatusUpdate}
                                disabled={form.processing || form.data.status === request.status}
                                size="lg"
                                className="w-full gap-2 text-base"
                            >
                                {form.processing ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Enregistrer le statut
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

