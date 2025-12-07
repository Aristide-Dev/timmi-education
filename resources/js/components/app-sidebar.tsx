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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Shield, Users, GraduationCap, UserCheck, UserCircle, Mail, BookOpen } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Utilisateurs',
        href: '#',
        icon: Users,
        items: [
            {
                title: 'Tous',
                href: adminUsersIndex().url,
                icon: Users,
            },
            {
                title: 'Parents',
                href: adminParents().url,
                icon: UserCheck,
            },
            {
                title: 'Élèves',
                href: adminStudents().url,
                icon: UserCircle,
            },
        ],
    },
    {
        title: 'Professeurs',
        href: adminTeachersIndex().url,
        icon: GraduationCap,
    },
    {
        title: 'Rôles',
        href: adminRolesIndex().url,
        icon: Shield,
    },
    {
        title: 'Matières',
        href: '/admin/matieres',
        icon: BookOpen,
    },
    {
        title: 'Demandes de professeurs',
        href: adminTeacherRequestsIndex().url,
        icon: Mail,
    },
];

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
