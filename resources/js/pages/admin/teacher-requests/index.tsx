import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type TeacherRequest } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Eye, Mail, Phone, Calendar, BookOpen } from 'lucide-react';
import { index as adminTeacherRequestsIndex, show as adminTeacherRequestsShow } from '@/routes/admin/teacher-requests';

interface Props {
    requests: TeacherRequest[];
    filters: {
        status?: string;
    };
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

export default function Index({ requests, filters: initialFilters }: Props) {
    const [statusFilter, setStatusFilter] = useState(initialFilters.status || 'all');

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        const params = new URLSearchParams();
        if (value !== 'all') {
            params.set('status', value);
        }
        router.get(adminTeacherRequestsIndex().url + (params.toString() ? `?${params.toString()}` : ''));
    };

    const filteredRequests = statusFilter === 'all' 
        ? requests 
        : requests.filter((r) => r.status === statusFilter);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Demandes de professeurs" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Demandes de professeurs</h1>
                        <p className="text-muted-foreground text-sm">
                            Gérez les demandes de professeurs reçues
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="in_progress">En cours</SelectItem>
                                <SelectItem value="completed">Terminée</SelectItem>
                                <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Tableau des demandes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Demandes ({filteredRequests.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredRequests.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Mail className="mx-auto mb-4 size-12 opacity-50" />
                                <p>Aucune demande trouvée</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left text-sm font-medium">Nom</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Téléphone</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Matière</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRequests.map((request) => (
                                            <tr key={request.id} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{request.name}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Mail className="h-4 w-4" />
                                                        {request.email}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {request.phone ? (
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Phone className="h-4 w-4" />
                                                            {request.phone}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {request.matiere ? (
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">
                                                                {request.matiere.name} {request.niveau && `(${request.niveau.name})`}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={statusVariants[request.status]}>
                                                        {statusLabels[request.status]}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(request.created_at).toLocaleDateString('fr-FR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.visit(adminTeacherRequestsShow(request.uuid).url)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Voir
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

