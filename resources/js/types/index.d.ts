import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    users?: User[];
}

export interface Niveau {
    id: number;
    name: string;
    slug: string;
    code: string;
    ordre: number;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Matiere {
    id: number;
    name: string;
    code: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    pivot?: {
        niveau_id?: number | null;
        niveau_slug?: string | null;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    matieres?: Matiere[];
    pays?: string;
    region_id?: string | null;
    prefecture_id?: string | null;
    commune_id?: string | null;
    quartier_id?: string | null;
    adresse?: string | null;
    telephone?: string | null;
    bio?: string | null;
    [key: string]: unknown; // This allows for additional properties...
}

export interface TeacherRequest {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string | null;
    matiere_id: number | null;
    niveau_id: number | null;
    region_id: string | null;
    prefecture_id: string | null;
    commune_id: string | null;
    quartier_id: string | null;
    search_query: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
    matiere?: Matiere | null;
    niveau?: Niveau | null;
}

// Re-export geographic types
export type {
    Region,
    Prefecture,
    Commune,
    Quartier,
    LocalisationData,
} from './geographie';
