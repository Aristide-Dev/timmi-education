import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home, dashboard } from '@/routes';
import { index as adminRolesIndex } from '@/routes/admin/roles';
import { index as adminUsersIndex, parents as adminParents, students as adminStudents } from '@/routes/admin/users';
import { index as adminTeachersIndex } from '@/routes/admin/teachers';
import { index as adminTeacherRequestsIndex } from '@/routes/admin/teacher-requests';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Shield, Users, GraduationCap, UserCheck, UserCircle, Mail, BookOpen } from 'lucide-react';
import AppLogo from './app-logo';

// Tous les items de navigation possibles
const allNavItems: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['admin', 'super-admin', 'teacher', 'parent', 'student'], // Accessible à tous les utilisateurs authentifiés
    },
    {
        title: 'Utilisateurs',
        href: '#',
        icon: Users,
        roles: ['admin', 'super-admin'],
        items: [
            {
                title: 'Tous',
                href: adminUsersIndex().url,
                icon: Users,
                roles: ['admin', 'super-admin'],
            },
            {
                title: 'Parents',
                href: adminParents().url,
                icon: UserCheck,
                roles: ['admin', 'super-admin'],
            },
            {
                title: 'Élèves',
                href: adminStudents().url,
                icon: UserCircle,
                roles: ['admin', 'super-admin'],
            },
        ],
    },
    {
        title: 'Professeurs',
        href: adminTeachersIndex().url,
        icon: GraduationCap,
        roles: ['admin', 'super-admin'],
    },
    {
        title: 'Rôles',
        href: adminRolesIndex().url,
        icon: Shield,
        roles: ['admin', 'super-admin'],
    },
    {
        title: 'Matières',
        href: '/admin/matieres',
        icon: BookOpen,
        roles: ['admin', 'super-admin'],
    },
    {
        title: 'Demandes de professeurs',
        href: adminTeacherRequestsIndex().url,
        icon: Mail,
        roles: ['admin', 'super-admin'],
    },
];

/**
 * Filtre les items de navigation selon les rôles de l'utilisateur
 */
function filterNavItemsByRole(items: NavItem[], userRoles: string[]): NavItem[] {
    return items
        .filter((item) => {
            // Si l'item a des rôles définis, vérifier que l'utilisateur a au moins un de ces rôles
            if (item.roles && item.roles.length > 0) {
                return item.roles.some((role) => userRoles.includes(role));
            }
            // Si pas de rôles définis, l'item est accessible à tous
            return true;
        })
        .map((item) => {
            // Si l'item a des sous-items, les filtrer aussi
            if (item.items && item.items.length > 0) {
                const filteredItems = filterNavItemsByRole(item.items, userRoles);
                // Si tous les sous-items sont filtrés, ne pas afficher l'item parent
                if (filteredItems.length === 0) {
                    return null;
                }
                return {
                    ...item,
                    items: filteredItems,
                };
            }
            return item;
        })
        .filter((item): item is NavItem => item !== null);
}

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    // Récupérer les slugs des rôles de l'utilisateur
    const userRoles = user?.roles?.map((role) => role.slug) || [];

    // Filtrer les items de navigation selon les rôles
    const mainNavItems = filterNavItemsByRole(allNavItems, userRoles);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={home()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
