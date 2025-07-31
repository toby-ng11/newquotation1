import { showFlashMessage } from '@/components/flashmessage';

type SubmitFormOptions = {
    form: HTMLFormElement;
    isEditing: boolean;
    endpoint: string;
    idField?: string;
    reloadTables?: (() => void)[];
    onSuccess?: () => void;
    onError?: () => void;
};

export async function submitFormHelper({
    form,
    isEditing,
    endpoint,
    idField = 'id',
    reloadTables = [],
    onSuccess,
    onError,
}: SubmitFormOptions): Promise<void> {
    const formData = new FormData(form);
    const entityId = form[idField as keyof typeof form]?.value;

    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
        payload[key] = value.toString();
    });

    const url = isEditing && entityId ? `${endpoint}/${entityId}` : endpoint;
    const method = isEditing ? 'PUT' : 'POST';
    const headers = isEditing ? { 'Content-Type': 'application/json' } : undefined;
    const body = isEditing ? JSON.stringify(payload) : formData;

    try {
        const response = await fetch(url, {
            method,
            headers,
            body,
        });

        const data = await response.json();

        showFlashMessage(data.message, data.success);

        if (data.success) {
            reloadTables.forEach((fn) => fn());
            form.reset();
            onSuccess?.();
        } else {
            onError?.();
        }
    } catch (err) {
        alert('Error submitting form.');
        console.error(err);
        onError?.();
    }
}
