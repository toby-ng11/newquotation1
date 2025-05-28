export function resetForm(form) {
    if (!form) return;

    // Clear common input types
    form.querySelectorAll("input[type='hidden'], input[type='text'], input[type='password'], input[type='file'], select, textarea").forEach((el) => {
        el.value = '';
        el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Uncheck checkboxes and radios
    form.querySelectorAll("input[type='checkbox'], input[type='radio']").forEach((el) => {
        el.checked = false;
        el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Reset selects with custom default options (if any)
    form.querySelectorAll('select').forEach((select) => {
        const defaultOptions = select.dataset.defaultOptions;
        if (defaultOptions) {
            select.innerHTML = defaultOptions;
        }
        select.selectedIndex = 0;
        select.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Re-enable all inputs
    form.querySelectorAll('input, select, textarea').forEach((el) => {
        el.disabled = false;
    });
}
