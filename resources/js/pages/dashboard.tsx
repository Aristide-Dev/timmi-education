import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Users, FileText, Shield, GraduationCap, UserCheck, UserX, Clock, CheckCircle, XCircle } from 'lucide-react';


interface UserByRole {
    name: string;
    slug: string;
    count: number;
}

interface TeacherRequestStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: string[];
}

interface RecentTeacherRequest {
    id: number;
    uuid: string;
    name: string;
    email: string;
    phone: string;
    matiere: string | null;
    niveau: string | null;
    status: string;
    created_at: string;
}

interface TeacherStats {
    total_matieres: number;
    total_niveaux: number;
}

interface StudentStats {
    // À compléter selon vos besoins
}

interface ParentStats {
    // À compléter selon vos besoins
}

interface Stats {
    total_users: number;
    total_teacher_requests: number;
    total_roles: number;
    users_by_role: UserByRole[];
    teacher_requests_stats: TeacherRequestStats;
    recent_users?: RecentUser[];
    recent_teacher_requests?: RecentTeacherRequest[];
    teacher_stats?: TeacherStats;
    student_stats?: StudentStats;
    parent_stats?: ParentStats;
}

interface Props {
    stats: Stats;
}

export default function Dashboard({ stats }: Props)  {

    console.log('stats', stats);
    
    // Vérification de sécurité et valeurs par défaut
    if (!stats) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Erreur de chargement</CardTitle>
                                <CardDescription>Les statistiques n'ont pas pu être chargées.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-red-600">Veuillez vérifier les logs du serveur pour plus d'informations.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const statCards = [

        {
            title: 'Utilisateurs',
            value: stats.total_users,
            icon: Users,
            description: 'Total des utilisateurs',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Demandes Professeurs',
            value: stats.total_teacher_requests,
            icon: FileText,
            description: 'Demandes reçues',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'En attente',
            value: stats.teacher_requests_stats.pending,
            icon: Clock,
            description: 'Demandes en attente',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
        {
            title: 'Rôles',
            value: stats.total_roles,
            icon: Shield,
            description: 'Rôles configurés',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
    ];

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Approuvée', className: 'bg-green-100 text-green-800' },
            rejected: { label: 'Rejetée', className: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
                {config.label}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Statistics Cards */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {statCards.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <Card key={stat.title}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                {stat.title}
                                            </CardTitle>
                                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                                <Icon className={`h-4 w-4 ${stat.color}`} />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{stat.value}</div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {stat.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Statistiques des demandes de professeurs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistiques des demandes de professeurs</CardTitle>
                                <CardDescription>Répartition des demandes par statut</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="flex items-center space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <Clock className="h-8 w-8 text-yellow-600" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">En attente</p>
                                            <p className="text-2xl font-bold">{stats.teacher_requests_stats.pending}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Approuvées</p>
                                            <p className="text-2xl font-bold">{stats.teacher_requests_stats.approved}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <XCircle className="h-8 w-8 text-red-600" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Rejetées</p>
                                            <p className="text-2xl font-bold">{stats.teacher_requests_stats.rejected}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Utilisateurs par rôle */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Utilisateurs par rôle</CardTitle>
                                <CardDescription>Répartition des utilisateurs selon leurs rôles</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {stats.users_by_role.map((role) => (
                                        <div key={role.slug} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Shield className="h-5 w-5 text-muted-foreground" />
                                                <span className="font-medium">{role.name}</span>
                                            </div>
                                            <span className="text-2xl font-bold text-primary">{role.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistiques spécifiques pour les professeurs */}
                        {stats.teacher_stats && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mes statistiques</CardTitle>
                                    <CardDescription>Vos matières et niveaux enseignés</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <GraduationCap className="h-8 w-8 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Matières enseignées</p>
                                                <p className="text-2xl font-bold">{stats.teacher_stats.total_matieres}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <Shield className="h-8 w-8 text-purple-600" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Niveaux enseignés</p>
                                                <p className="text-2xl font-bold">{stats.teacher_stats.total_niveaux}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Utilisateurs récents (admin uniquement) */}
                        {stats.recent_users && stats.recent_users.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Utilisateurs récents</CardTitle>
                                    <CardDescription>Les 5 derniers utilisateurs inscrits</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats.recent_users.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        {user.roles.map((role, idx) => (
                                                            <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                                {role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-muted-foreground">{user.created_at}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Demandes récentes de professeurs (admin uniquement) */}
                        {stats.recent_teacher_requests && stats.recent_teacher_requests.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Demandes récentes de professeurs</CardTitle>
                                    <CardDescription>Les 5 dernières demandes reçues</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats.recent_teacher_requests.map((request) => (
                                            <div key={request.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                                <div className="flex-1">
                                                    <p className="font-medium">{request.name}</p>
                                                    <p className="text-sm text-muted-foreground">{request.email} • {request.phone}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        {request.matiere && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                {request.matiere}
                                                            </span>
                                                        )}
                                                        {request.niveau && (
                                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                                {request.niveau}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {getStatusBadge(request.status)}
                                                    <span className="text-xs text-muted-foreground">{request.created_at}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
