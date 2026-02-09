import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  FileText,
  Shield,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  UserPlus,
  TrendingUp,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
];

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

// Réservé pour statistiques élèves / parents
type StudentStats = Record<string, unknown>;
type ParentStats = Record<string, unknown>;

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

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  admin: Shield,
  teacher: GraduationCap,
  student: Users,
  parent: UserPlus,
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function Dashboard({ stats }: Props) {
  if (!stats) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <div className="min-h-[60vh] flex items-center justify-center bg-muted/30">
          <Card className="max-w-md border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Erreur de chargement</CardTitle>
              <CardDescription>
                Les statistiques n'ont pas pu être chargées. Vérifiez les logs du serveur.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const requestTotal = stats.teacher_requests_stats.pending + stats.teacher_requests_stats.approved + stats.teacher_requests_stats.rejected;
  const pendingPct = requestTotal > 0 ? (stats.teacher_requests_stats.pending / requestTotal) * 100 : 0;
  const approvedPct = requestTotal > 0 ? (stats.teacher_requests_stats.approved / requestTotal) * 100 : 0;
  const rejectedPct = requestTotal > 0 ? (stats.teacher_requests_stats.rejected / requestTotal) * 100 : 0;

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.total_users,
      icon: Users,
      description: 'Total des comptes',
      gradient: 'from-primary to-primary/80',
      iconBg: 'bg-primary/10 text-primary',
      href: '/admin/users',
    },
    {
      title: 'Demandes',
      value: stats.total_teacher_requests,
      icon: FileText,
      description: 'Demandes reçues',
      gradient: 'from-secondary to-secondary-dark',
      iconBg: 'bg-secondary/15 text-secondary-dark dark:text-secondary',
      href: '/admin/teacher-requests',
    },
    {
      title: 'En attente',
      value: stats.teacher_requests_stats.pending,
      icon: Clock,
      description: 'À traiter',
      gradient: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      href: '/admin/teacher-requests',
    },
    {
      title: 'Rôles',
      value: stats.total_roles,
      icon: Shield,
      description: 'Rôles configurés',
      gradient: 'from-primary/90 to-primary',
      iconBg: 'bg-primary/10 text-primary',
      href: '/admin/roles',
    },
  ];

  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
    pending: { label: 'En attente', variant: 'warning' },
    approved: { label: 'Approuvée', variant: 'success' },
    rejected: { label: 'Rejetée', variant: 'destructive' },
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="min-h-screen bg-gradient-to-b from-muted/40 via-background to-muted/30">
        {/* Hero / En-tête */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary via-primary to-primary-dark px-6 py-8 text-primary-foreground shadow-lg sm:px-8 sm:py-10 md:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
          <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur sm:h-14 sm:w-14">
                <LayoutDashboard className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Tableau de bord</h1>
                <p className="text-sm text-primary-foreground/85 sm:text-base">
                  Vue d'ensemble de la plateforme Timmi Education
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/90 sm:mt-0">
              <TrendingUp className="h-4 w-4" />
              <span>{stats.total_users} utilisateurs • {stats.total_teacher_requests} demandes</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Cartes statistiques principales */}
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Indicateurs clés
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                const content = (
                  <>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight">{stat.value}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                  </>
                );
                return stat.href ? (
                  <Link key={stat.title} href={stat.href} className="group block">
                    <Card className="h-full border-border/80 transition-all hover:border-primary/30 hover:shadow-md">
                      <CardContent className="flex flex-row items-start gap-4 p-5">
                        {content}
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <Card key={stat.title} className="border-border/80">
                    <CardContent className="flex flex-row items-start gap-4 p-5">{content}</CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Demandes par statut (barre de répartition) */}
          <section>
            <Card className="border-border/80 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Demandes de professeurs
                </CardTitle>
                <CardDescription>Répartition par statut</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                  {pendingPct > 0 && (
                    <div
                      className="bg-amber-500 transition-all"
                      style={{ width: `${pendingPct}%` }}
                      title="En attente"
                    />
                  )}
                  {approvedPct > 0 && (
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{ width: `${approvedPct}%` }}
                      title="Approuvées"
                    />
                  )}
                  {rejectedPct > 0 && (
                    <div
                      className="bg-destructive/80 transition-all"
                      style={{ width: `${rejectedPct}%` }}
                      title="Rejetées"
                    />
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-amber-500/5 px-4 py-3 dark:bg-amber-500/10">
                    <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">En attente</p>
                      <p className="text-2xl font-bold tabular-nums">{stats.teacher_requests_stats.pending}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-emerald-500/5 px-4 py-3 dark:bg-emerald-500/10">
                    <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Approuvées</p>
                      <p className="text-2xl font-bold tabular-nums">{stats.teacher_requests_stats.approved}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-destructive/5 px-4 py-3 dark:bg-destructive/10">
                    <XCircle className="h-8 w-8 text-destructive" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rejetées</p>
                      <p className="text-2xl font-bold tabular-nums">{stats.teacher_requests_stats.rejected}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Utilisateurs par rôle */}
            <section>
              <Card className="h-full border-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Utilisateurs par rôle
                  </CardTitle>
                  <CardDescription>Répartition des comptes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.users_by_role.map((role) => {
                      const Icon = ROLE_ICONS[role.slug] ?? Shield;
                      return (
                        <div
                          key={role.slug}
                          className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="font-medium">{role.name}</span>
                          </div>
                          <span className="text-xl font-bold tabular-nums text-primary">{role.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Stats professeur (si présent) */}
            {stats.teacher_stats && (
              <section>
                <Card className="h-full border-border/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Mon activité
                    </CardTitle>
                    <CardDescription>Matières et niveaux enseignés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-primary/5 px-4 py-4 dark:bg-primary/10">
                        <BookOpen className="h-10 w-10 text-primary" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Matières</p>
                          <p className="text-2xl font-bold tabular-nums">{stats.teacher_stats.total_matieres}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-secondary/10 px-4 py-4 dark:bg-secondary/10">
                        <Shield className="h-10 w-10 text-secondary-dark dark:text-secondary" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Niveaux</p>
                          <p className="text-2xl font-bold tabular-nums">{stats.teacher_stats.total_niveaux}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* Utilisateurs récents */}
          {stats.recent_users && stats.recent_users.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Utilisateurs récents
                </h2>
                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Voir tout
                </Link>
              </div>
              <Card className="border-border/80">
                <CardContent className="p-0">
                  <ul className="divide-y divide-border/60">
                    {stats.recent_users.map((user) => (
                      <li key={user.id}>
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {user.roles.map((role, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <span className="shrink-0 text-xs text-muted-foreground">{formatDate(user.created_at)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Demandes récentes */}
          {stats.recent_teacher_requests && stats.recent_teacher_requests.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Demandes récentes
                </h2>
                <Link
                  href="/admin/teacher-requests"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Voir tout
                </Link>
              </div>
              <Card className="border-border/80">
                <CardContent className="p-0">
                  <ul className="divide-y divide-border/60">
                    {stats.recent_teacher_requests.map((request) => {
                      const status = statusConfig[request.status] ?? { label: request.status, variant: 'outline' as const };
                      return (
                        <li key={request.id}>
                          <Link
                            href={`/admin/teacher-requests/${request.id}`}
                            className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50 sm:flex-nowrap"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-sm font-semibold text-secondary-dark dark:text-secondary">
                              {getInitials(request.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium">{request.name}</p>
                              <p className="truncate text-sm text-muted-foreground">
                                {request.email}
                                {request.phone ? ` • ${request.phone}` : ''}
                              </p>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {request.matiere && (
                                  <Badge variant="outline" className="text-xs">
                                    {request.matiere}
                                  </Badge>
                                )}
                                {request.niveau && (
                                  <Badge variant="outline" className="text-xs">
                                    {request.niveau}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                              <Badge variant={status.variant}>{status.label}</Badge>
                              <span className="text-xs text-muted-foreground">{formatDate(request.created_at)}</span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
