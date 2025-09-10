import { Link } from '@inertiajs/react';

interface ExceptionInfo {
    type: string;
    file: string;
    line: number;
    message: string;
    trace: string;
    previous?: ExceptionInfo[];
}

interface ServerErrorProps {
    status?: number;
    message?: string;
    display_exceptions?: boolean;
    exception?: ExceptionInfo;
}

export default function ServerError({
    status = 500,
    message = 'Something went wrong on the server.',
    display_exceptions = false,
    exception,
}: ServerErrorProps) {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <div className="max-w-4xl min-w-sm rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-4 animate-pulse text-6xl text-red-500">💥</div>
                <h1 className="mb-2 text-3xl font-extrabold text-gray-800">{status} - An error occurred</h1>
                <p className="mb-4 text-gray-600">{message}</p>

                {display_exceptions && exception ? (
                    <div className="max-h-96 space-y-2 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4 text-left text-sm text-gray-800">
                        <h2 className="text-lg font-bold">Exception Details</h2>
                        <p>
                            <strong>Type:</strong> {exception.type}
                        </p>
                        <p>
                            <strong>File:</strong> {exception.file}:{exception.line}
                        </p>
                        <p>
                            <strong>Message:</strong> {exception.message}
                        </p>
                        <p>
                            <strong>Stack trace:</strong>
                        </p>
                        <pre className="whitespace-pre-wrap">{exception.trace}</pre>

                        {exception.previous && exception.previous.length > 0 && (
                            <>
                                <hr className="my-4" />
                                <h3 className="mb-2 font-semibold">Previous Exceptions</h3>
                                <ul className="list-disc space-y-2 pl-5">
                                    {exception.previous.map((ex, i) => (
                                        <li key={i}>
                                            <strong>{ex.type}</strong>
                                            <br />
                                            File: {ex.file}:{ex.line}
                                            <br />
                                            Message: {ex.message}
                                            <details className="mt-1">
                                                <summary className="cursor-pointer text-blue-600">Stack trace</summary>
                                                <pre className="whitespace-pre-wrap">{ex.trace}</pre>
                                            </details>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                ) : (
                    display_exceptions && <p className="mt-4 text-sm text-gray-500 italic">No exception available.</p>
                )}

                <Link
                    href="/"
                    className="mt-6 inline-block rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:from-red-700 hover:to-orange-700"
                >
                    🔁 Try Again / Go Home
                </Link>
            </div>
        </div>
    );
}
