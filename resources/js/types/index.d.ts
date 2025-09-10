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
    id: string;
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

interface Opportunity {
    id: string;
    opp_id_ext?: string;
    opp_address?: string;
    lead_source?: string;
    lead_source_id?: string;
    leed_certified_number?: string;
    centura_location_id?: string;
    project_value?: string;
    project_description?: string;
    project_owner?: string;
    sample_submitted?: string;
    po_received?: string;
    order_received?: string;
    general_contractor_id?: string;
    awarded_contractor_id?: string;
    start_date?: {
        date: string;
    };
    completion_date?: {
        date: string;
    };
    status_id?: string;
    market_segment_id?: string;
    specifier_id?: string;
    architect_id?: string;
    architect_address_id?: string;
    created_at?: {
        date: string;
    };
    updated_at?: {
        date: string;
    };
    created_by?: string;
    updated_by?: string;
}

interface OpportunityShare {
    id: string;
    opportunity_id?: string;
    shared_user?: string;
    role: string;
}

interface Quote {
    id: string;
    project_id?: string;
    quote_id_ext?: string;
    quote_type_id?: string;
    contact_id?: string;
    expire_date?: {
        date: string;
    };
    ship_required_date?: {
        date: string;
    };
    approve_date?: {
        date: string;
    };
    note?: string;
    status_id?: string;
    po_no?: string;
    job_name?: string;
    price_approve_id?: string;
    created_at?: {
        date: string;
    };
    updated_at?: {
        date: string;
    };
    created_by?: string;
    updated_by?: string;
    approved_by?: string;
    submit_by?: string;
}
