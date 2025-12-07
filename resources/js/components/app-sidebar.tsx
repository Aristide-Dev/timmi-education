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
import { index as rolesIndex } from '@/routes/roles';
import { index as usersIndex, teachers, parents, students } from '@/routes/users';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Shield, Users, GraduationCap, UserCheck, UserCircle } from 'lucide-react';
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
                href: usersIndex().url,
                icon: Users,
            },
            {
                title: 'Professeurs',
                href: teachers().url,
                icon: GraduationCap,
            },
            {
                title: 'Parents',
                href: parents().url,
                icon: UserCheck,
            },
            {
                title: 'Élèves',
                href: students().url,
                icon: UserCircle,
            },
        ],
    },
    {
        title: 'Rôles',
        href: rolesIndex().url,
        icon: Shield,
    },
    {
        title: 'Matières',
        href: '/matieres',
        icon: GraduationCap,
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
