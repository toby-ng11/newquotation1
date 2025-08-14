import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

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
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    auth: Auth;
    user: User;
    csrf: string;
    sidebarOpen: boolean;
    ziggy: Config & { location: string };
    [key: string]: any;
}

export interface User {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    p2q_system_role: string;
    default_company: string;
    default_location_id: string;
    avatar?: string;
}
