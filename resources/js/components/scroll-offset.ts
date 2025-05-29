export function scrollOffset() {
    document.querySelectorAll('a.widget-link[href^="#"]').forEach((link) => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                const offset = 100; // Adjust this to match navbar height
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });

                // Highlight after scroll completes
                setTimeout(() => {
                    target.classList.add('highlighted');
                    setTimeout(() => target.classList.remove('highlighted'), 1500); // Clean up
                }, 500);
            }
        });
    });
}
