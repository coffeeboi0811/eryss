import confetti from "canvas-confetti";

export const celebrateLogin = () => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
    };

    function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });

    setTimeout(() => {
        confetti({
            particleCount: 20,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#ff6b9d", "#c44569", "#f8b500", "#feca57"],
            shapes: ["circle"],
            scalar: 1.4,
        });
    }, 300);

    setTimeout(() => {
        const end = Date.now() + 500;
        const colors = ["#bb0000", "#ffffff", "#00bb00", "#0000bb"];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }, 600);
};
