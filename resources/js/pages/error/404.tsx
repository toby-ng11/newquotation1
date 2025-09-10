import { Link } from '@inertiajs/react';

interface NotFoundProps {
    status?: number;
    message?: string;
    reason?: string;
}

export default function NotFound({ status = 404, message = "The page you're looking for can't be found.", reason }: NotFoundProps) {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-4 animate-bounce text-6xl">🔍</div>
                <h1 className="mb-2 text-3xl font-extrabold text-gray-800">{status} - Page Not Found</h1>

                <p className="mb-4 text-gray-600">🤔 {message}</p>

                {reason && <p className="mb-4 text-sm text-gray-500 italic">{reason}</p>}

                <Link
                    href="/"
                    className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:from-blue-700 hover:to-purple-700"
                >
                    🏠 Back to Home
                </Link>
            </div>
        </div>
    );
}
