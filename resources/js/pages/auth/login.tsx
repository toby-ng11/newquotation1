import AppLogoIcon from '@/components/app-logo-icon';
import { LoginForm } from '@/components/login-form';
import { Head } from '@inertiajs/react';

export default function LoginPage() {
    return (
        <>
            <Head title="Login" />
            <div className="bg-background grid min-h-svh lg:grid-cols-2">
                <div className="bg-muted relative hidden mask-r-from-80% lg:block">
                    <img src="/img/ragno_amuri_006.jpg" alt="Image" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <a href="#" className="flex items-center gap-2 font-semibold">
                            <AppLogoIcon className='size-7' />
                            P2Q Portal
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
