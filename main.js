// Animation and Interactivity
document.addEventListener('DOMContentLoaded', () => {
    // --- Lenis Smooth Scroll Initialization ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- Scroll-Based Hero Animation ---
    const canvas = document.getElementById('hero-canvas');
    const context = canvas.getContext('2d');
    const heroSection = document.getElementById('hero');
    const featureTexts = document.querySelectorAll('.feature-text');

    const frameCount = 240;
    const currentFrame = index => (
        `public/images(1)/herosection/ezgif-frame-${index.toString().padStart(3, '0')}.png`
    );

    const images = [];
    const airship = {
        frame: 0
    };

    // Preload images
    let loadedImages = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            loadedImages++;
            if (loadedImages === frameCount) {
                render(); // Initial render once all images are loaded
            }
        };
        images.push(img);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    }

    function render() {
        const img = images[airship.frame];
        if (!img) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image with object-fit: cover type logic
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgAspect;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    // Use Lenis scroll event for hero animation
    lenis.on('scroll', ({ scroll }) => {
        const maxScroll = heroSection.offsetHeight - window.innerHeight;
        const scrollFraction = Math.max(0, Math.min(1, scroll / maxScroll));
        
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );

        if (airship.frame !== frameIndex) {
            airship.frame = frameIndex;
            render();
            updateFeatureText(frameIndex);
        }
    });

    function updateFeatureText(frame) {
        featureTexts.forEach(text => {
            const start = parseInt(text.getAttribute('data-frame-start'));
            const end = parseInt(text.getAttribute('data-frame-end'));
            
            if (frame >= start && frame <= end) {
                text.classList.add('active');
            } else {
                text.classList.remove('active');
            }
        });
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- Intersection Observer for Reveal-on-Scroll ---
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Smooth scrolling for navigation links via Lenis ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = 52;
                lenis.scrollTo(target, {
                    offset: -navHeight,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    console.log('M5 Landing Page: Premium Scrolling & Animations Initialized');
});
