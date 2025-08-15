import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CircleUserRound } from 'lucide-react';
import { easeOut, motion } from 'motion/react';

const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2, // 0.15s between each card
            duration: 0.5,
            ease: easeOut,
        },
    }),
    hover: { scale: 1.05 },
    tap: { scale: 0.9 },
};

function FeatureCard({
    href,
    title,
    description,
    index,
    inertia = false,
}: {
    href: string;
    title: string;
    description: string;
    index: number;
    inertia?: boolean;
}) {
    return (
        <>
            {inertia ? (
                <motion.div
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                    variants={variants}
                    className="bg-primary/10 h-35 w-100 max-w-md rounded-md border p-6 no-underline decoration-inherit shadow-md"
                >
                    <Link href={href} prefetch>
                        <h2 className="mb-2 text-xl">{title}</h2>
                        <p className="text-sm">{description}</p>
                    </Link>
                </motion.div>
            ) : (
                <motion.a
                    href={href}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                    variants={variants}
                    className="bg-primary/10 h-35 w-100 max-w-md rounded-md border p-6 no-underline decoration-inherit shadow-md"
                >
                    <h2 className="mb-2 text-xl">{title}</h2>
                    <p className="text-sm">{description}</p>
                </motion.a>
            )}
        </>
    );
}

export default function WelcomePage() {
    const { user } = usePage<SharedData>().props;
    const role = user?.p2q_system_role;
    const isAdmin = role === 'admin';
    const isManager = role === 'manager';
    const isSales = role === 'sales';
    const isGuest = role === 'guest';

    return (
        <>
            <Head title="Welcome" />
            <div className="flex items-center justify-between px-4 py-2">
                <a href="/" className="flex items-center gap-2 font-semibold">
                    <AppLogoIcon className="size-7" />
                    P2Q Portal
                </a>

                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-muted-foreground flex items-center gap-2">
                            <CircleUserRound className="h-5 w-5" />
                            <span>{user.name}</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="end">
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="mx-4 mt-2 rounded-md bg-linear-to-r from-sky-500 to-blue-500 pt-20 pr-8 pb-20 pl-8 text-center text-white md:mx-20">
                <h1 className="mb-2 text-4xl">Welcome to Project to Quote Portal</h1>
                <p className="mx-auto">
                    Your all-in-one platform for managing projects, approvals, and architectural collaboration with ease and efficiency.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 px-4 py-6">
                {isAdmin && (
                    <FeatureCard
                        index={0}
                        href="/index/admin"
                        title="Admin"
                        description="Gain full control over user roles, permissions, and platform settings through the Admin Portal."
                    />
                )}
                {isAdmin && (
                    <FeatureCard
                        inertia={true}
                        index={1}
                        href="/dashboard/opportunity"
                        title="Opportunities"
                        description="Create and edit the opportunities, which can be converted to projects later."
                    />
                )}
                {(isAdmin || isManager || isSales) && (
                    <FeatureCard
                        index={2}
                        href="/index/project"
                        title="Projects"
                        description="Streamline your project workflows, track progress, and stay organized with our intuitive tools."
                    />
                )}
                {(isAdmin || isManager) && (
                    <FeatureCard
                        index={3}
                        href="/index/approval"
                        title="Approval"
                        description="Easily manage approvals and ensure every step is properly authorized and documented."
                    />
                )}
                {(isAdmin || isManager || isSales) && (
                    <FeatureCard
                        index={4}
                        href="/index/architect"
                        title="Architects"
                        description="Connect and collaborate with architects seamlessly to ensure design accuracy and quality."
                    />
                )}
                <FeatureCard
                    index={isGuest ? 1 : 5}
                    inertia={true}
                    href="/dashboard/quoted-items"
                    title="Quoted Items"
                    description="Search through quotes, customers and items."
                />
                {(isAdmin || isManager || isSales) && (
                    <FeatureCard
                        index={6}
                        href="/project/new"
                        title="New Project"
                        description="Kickstart your next project with our easy-to-use project creation tools and templates."
                    />
                )}
            </div>
        </>
    );
}
