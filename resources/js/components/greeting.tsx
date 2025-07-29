import { type User } from '@/types';
import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function Greeting() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/api/user')
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error('Failed to fetch user:', error);
            })
            .finally(() => setLoading(false));
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good morning';
        if (hour >= 12 && hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <h1 className={clsx('text-3xl font-semibold tracking-tight transition-opacity duration-700', loading ? 'opacity-0' : 'opacity-100')}>
            {getGreeting()}, {user?.first_name ?? 'Guest'}!
        </h1>
    );
}
