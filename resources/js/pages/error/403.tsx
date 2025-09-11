import { Link } from '@inertiajs/react';

interface ForbiddenProps {
    status?: number;
    message?: string;
}

export default function Forbidden({
    status = 403,
    message = "Oops! You don't have permission to view this page. Maybe try going back or contact an admin if you think this is a mistake.",
}: ForbiddenProps) {
    return (
        <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
            <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-4 animate-bounce text-6xl">🙅‍♂️</div>
                <h1 className="mb-2 text-3xl font-extrabold text-gray-800">{status} - Access Denied</h1>
                <p className="mb-6 text-gray-600">{message}</p>

                <Link
                    href="/"
                    className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:from-blue-700 hover:to-purple-700"
                >
                    🔙 Back to Safety
                </Link>
            </div>
        </div>
    );
}
