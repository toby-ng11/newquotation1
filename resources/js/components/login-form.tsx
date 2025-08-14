import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
    const { csrf } = usePage<SharedData>().props;
    const { data, setData, post, processing, reset, errors } = useForm({
        username: '',
        password: '',
        _token: csrf || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('password', data.password);
        formData.append('csrf', data._token);

        post('/login', {
            preserveScroll: true,
            onSuccess: () => {
                reset('password');
                toast.success('Logged in successfully!');
            },
            onError: (errors) => {
                if (errors.login_error) {
                    toast.error(errors.login_error);
                }
            },
            onFinish: () => {},
        });
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
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Your P21 username"
                            required
                        />
                        {errors.username && <span className="text-sm text-red-500">{errors.username}</span>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Windows/P21 password"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={processing} aria-busy={processing}>
                        {processing ? 'Logging in…' : 'Login'}
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
