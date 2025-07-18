type MenuItem = {
    label: string;
    icon?: string;          // Lucide icon name
    href?: string;          // Link URL (if not provided, it's a button)
    target?: "_blank" | "_self" | "_parent" | "_top";
    onClick?: (e: MouseEvent) => void;
};

type DropdownOptions = {
    triggerText?: string;
    menuItems: MenuItem[];
};

/**
 * Creates a dropdown menu.
 * @param containerId The ID of the container element to render into.
 * @param options Dropdown configuration (trigger text & menu items)
 */
export function createDropdownMenu(containerId: string, options: DropdownOptions): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { triggerText = "Options", menuItems } = options;

    // Build dropdown structure
    container.className = "dropdown-menu lg:hidden";
    container.innerHTML = `
        <button type="button"
            class="btn-ghost text-muted-foreground text-xs tracking-tight uppercase"
            aria-haspopup="menu"
            aria-expanded="false">
            <i data-lucide="ellipsis" class="w-4 h-4"></i>
            ${triggerText}
        </button>
        <div class="min-w-40 hidden" role="menu"></div>
    `;

    const button = container.querySelector<HTMLButtonElement>("button")!;
    const menu = container.querySelector<HTMLDivElement>("[role='menu']")!;

    // Populate menu items
    menuItems.forEach((item) => {
        const menuItem = document.createElement("div");
        menuItem.setAttribute("role", "menuitem");

        const element = document.createElement(item.href ? "a" : "button");
        element.className = "flex items-center gap-2 w-full text-left";

        if (item.href) {
            (element as HTMLAnchorElement).href = item.href;
            if (item.target) (element as HTMLAnchorElement).target = item.target;
        }

        if (item.icon) {
            element.innerHTML = `<i data-lucide="${item.icon}" class="text-muted-foreground h-4 w-4"></i> ${item.label}`;
        } else {
            element.textContent = item.label;
        }

        if (item.onClick) {
            element.addEventListener("click", (e) => {
                e.preventDefault();
                item.onClick?.(e as MouseEvent);
                menu.classList.add("hidden");
                button.setAttribute("aria-expanded", "false");
            });
        }

        menuItem.appendChild(element);
        menu.appendChild(menuItem);
    });

    // Toggle dropdown on button click
    button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        menu.classList.toggle("hidden", expanded);
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e: MouseEvent) => {
        if (!container.contains(e.target as Node)) {
            menu.classList.add("hidden");
            button.setAttribute("aria-expanded", "false");
        }
    });
}
