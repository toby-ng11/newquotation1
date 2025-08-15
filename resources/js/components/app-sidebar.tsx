import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Home, LayoutGrid, List, ShieldCheck } from 'lucide-react';
import AppLogo from './app-logo';

function getMainNavItems(userRole: string | null): NavItem[] {
    const base: NavItem[] = [
        {
            title: 'Home',
            href: '/dashboard/home',
            icon: Home,
        },
        {
            title: 'Opportunities',
            href: '/dashboard/opportunity',
            icon: LayoutGrid,
        },
        {
            title: 'Projects',
            href: '/dashboard/project',
            icon: LayoutGrid,
        },
        {
            title: 'Quotes',
            href: '/dashboard/quote',
            icon: LayoutGrid,
        },
        {
            title: 'Architects',
            href: '/dashboard/architect',
            icon: LayoutGrid,
        },
        {
            title: 'Quoted Items',
            href: '/dashboard/quoted-items',
            icon: List,
        },
    ];

    if (userRole === 'guest') {
        return [
            {
                title: 'Quoted Items',
                href: '/dashboard/quoted-items',
                icon: List,
            },
        ];
    }

    if (userRole === 'admin') {
        base.unshift({ title: 'Admin', href: '/dashboard/admin', icon: ShieldCheck });
    }

    return [...base]; // ensure return is always a fresh array
}

const footerNavItems: NavItem[] = [
    // add footer item here
];

export function AppSidebar() {
    const { user } = usePage<SharedData>().props;

    const userRole = user.p2q_system_role;

    const mainNavItems = getMainNavItems(userRole);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
