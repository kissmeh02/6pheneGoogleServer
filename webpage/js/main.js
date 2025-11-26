document.addEventListener('DOMContentLoaded', () => {
    console.log('6phene Website Loaded - Premium UX Active');
    
    // Smooth Page Transition (Fade In)
    document.body.classList.add('loaded');

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Mouse Movement Effect for Cards (Glassmorphism Glow)
    const updateMouseEffect = () => {
        const cards = document.querySelectorAll('.feature-card, .product-card');
        document.addEventListener('mousemove', (e) => {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    };
    updateMouseEffect();

    // Smooth Scroll with Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.padding = '0.75rem 0';
                // Keep opacity slightly lower for glass effect
            } else {
                navbar.style.padding = '1.5rem 0';
            }
        });
    }

    // --- Product Carousel Logic ---
    const track = document.getElementById('carouselTrack');
    if (track) {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const items = track.children;
        const itemWidth = items[0].getBoundingClientRect().width + 32; // Width + Gap (2rem)
        let currentIndex = 0;
        const itemsPerPage = 3;

        // Calculate max index
        const maxIndex = Math.max(0, items.length - itemsPerPage);

        const updateCarousel = () => {
            const amountToMove = itemWidth * currentIndex;
            track.style.transform = `translateX(-${amountToMove}px)`;
            
            // Update button states
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'all';
            
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
            nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'all';
        };

        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Handle Resize
        window.addEventListener('resize', () => {
            // Reset to 0 on resize to prevent layout bugs
            currentIndex = 0;
            updateCarousel();
        });
        
        // Init state
        updateCarousel();
    }
});
