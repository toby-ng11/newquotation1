export function runFadeInAnimation() {
    document.querySelectorAll('.hero.fade-in-up, .features.fade-in-up').forEach((el) => {
        el.classList.add('show');
    });

    const elements = document.querySelectorAll('.fade-in-up:not(.show)');

    if (!('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('show'));
        return;
    }

    let delay = 0;
    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = entry.target as HTMLElement;

                    // Optional: vary delay based on index/order
                    setTimeout(() => {
                        target.classList.add('show');
                    }, delay);

                    delay += 200; // Increase delay for next one
                    observer.unobserve(target); // Animate once
                }
            });
        },
        {
            threshold: 0.1,
        },
    );

    elements.forEach((el) => observer.observe(el));
}
