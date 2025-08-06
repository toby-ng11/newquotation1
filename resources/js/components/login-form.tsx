import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FormEvent } from 'react';
import { toast } from 'sonner';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const response = await fetch('login', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (response.redirected) {
            window.location.href = response.url;
            return;
        } else if (response.status === 401) {
            const data = await response.json();
            toast.error(data.error || 'Login failed');
        } else {
            toast.error('Unexpected error');
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={cn('mb-6 flex flex-col gap-6', className)} {...props}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">Enter your username below to login to your account</p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" type="username" placeholder="Your P21 username" required />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="Windows/P21 password" required />
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </div>
            </form>
            <div className="grid gap-6">
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">Not an employee?</span>
                </div>
                <Button variant="outline" className="w-full">
                    Login with email
                </Button>
            </div>
        </>
    );
}
