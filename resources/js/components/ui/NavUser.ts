export function initUserMenu() {
    const menu = document.querySelector('.top-navigation') as HTMLElement;
    const menuBtn = document.querySelector('.main-menu-toggle') as HTMLButtonElement;
    const menuBtnIcon = document.querySelector('.main-menu-toggle .icon') as HTMLSpanElement;
    const menuBtnText = document.querySelector('.main-menu-toggle .visually-hidden') as HTMLSpanElement;
    const mainNav = document.querySelector('.main-nav') as HTMLElement;
    const themeUserNav = document.querySelector('.top-navigation-main') as HTMLElement;

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMainMenu);
    }

    function toggleMainMenu() {
        const isMenuOpen = menu.classList.contains('show-nav');
        menu.classList.toggle('show-nav');
        if (isMenuOpen) {
            mainNav.classList.remove('block');
            mainNav.classList.add('hidden');
            themeUserNav.classList.remove('flex');
            themeUserNav.classList.add('hidden');
        } else {
            mainNav.classList.remove('hidden');
            mainNav.classList.add('block');
            themeUserNav.classList.remove('hidden');
            themeUserNav.classList.add('flex');
        }

        updateButtonAttributes(
            isMenuOpen ? 'Open main menu' : 'Close main menu',
            isMenuOpen ? 'false' : 'true',
            isMenuOpen ? 'icon-menu' : 'icon-cancel',
            isMenuOpen ? 'Close main menu' : 'Open main menu',
        );
    }

    if (mainNav) {
        mainNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    // Close menu only on small screens
                    menu.classList.remove('show-nav');
                    mainNav.classList.remove('block');
                    mainNav.classList.add('hidden');
                    themeUserNav.classList.remove('flex');
                    themeUserNav.classList.add('hidden');

                    updateButtonAttributes('Open main menu', 'false', 'icon-menu', 'Open main menu');
                }
            });
        });
    }

    function updateButtonAttributes(title: string, ariaExpanded: string, iconClass: string, buttonText: string) {
        menuBtn.setAttribute('title', title);
        menuBtn.setAttribute('aria-label', title);
        menuBtn.setAttribute('aria-expanded', ariaExpanded);
        menuBtnIcon.classList.remove('icon-menu', 'icon-cancel');
        menuBtnIcon.classList.add(iconClass);
        menuBtnText.textContent = buttonText;
    }

    const userBtn = document.getElementById('centura-account-button') as HTMLButtonElement;
    const userMenu = document.getElementById('centura-account') as HTMLElement;

    if (userBtn) {
        userBtn.addEventListener('click', () => {
            const isExpanded = userBtn.getAttribute('aria-expanded') === 'true';

            userBtn.setAttribute('aria-expanded', String(!isExpanded));
            userMenu.style.display = isExpanded ? 'none' : 'block';
        });
    }

    // Optional: Close menu when clicking outside
    if (userMenu) {
        document.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (!userMenu.contains(target) && !userBtn.contains(target)) {
                userMenu.style.display = 'none';
                userBtn.setAttribute('aria-expanded', 'false');
            }
            if (window.innerWidth < 1024) {
                const isMenuOpen = menu.classList.contains('show-nav');
                const menuBtnClicked = menuBtn.contains(target);
                const menuClicked = menu.contains(target);

                if (isMenuOpen && !menuClicked && !menuBtnClicked) {
                    menu.classList.remove('show-nav');

                    const mainNav = document.getElementById('leftSide');
                    if (mainNav) {
                        mainNav.classList.remove('block');
                        mainNav.classList.add('hidden');
                        themeUserNav.classList.remove('flex');
                        themeUserNav.classList.add('hidden');
                    }

                    updateButtonAttributes('Open main menu', 'false', 'icon-menu', 'Open main menu');
                }
            }
        });
    }
}
