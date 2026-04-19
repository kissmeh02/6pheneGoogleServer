/**
 * animations.js
 * Scroll reveal observer, stat counter animation, typewriter effect
 */

(function () {
    'use strict';

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== REVEAL ON SCROLL =====
    function initReveals() {
        document.querySelectorAll('.reveal').forEach(function (el) {
            if (prefersReduced) {
                el.classList.add('visible');
                return;
            }
            el.classList.remove('visible');
        });
        checkReveals();
    }

    function checkReveals() {
        document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkReveals, { passive: true });
    window.addEventListener('resize', checkReveals);
    window.initReveals = initReveals;
    initReveals();

    // ===== STAT COUNTER ANIMATION =====
    (function () {
        var statEls = document.querySelectorAll('.stat-number[data-count]');
        if (!statEls.length || prefersReduced) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'), 10);
                if (isNaN(target) || el.dataset.animated) return;
                el.dataset.animated = '1';
                var duration = 1500;
                var startTime = performance.now();

                function step(now) {
                    var elapsed = now - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var current = Math.round(eased * target);
                    el.textContent = current + '+';
                    if (progress < 1) requestAnimationFrame(step);
                }

                requestAnimationFrame(step);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });

        statEls.forEach(function (el) { observer.observe(el); });
    })();

    // ===== TYPEWRITER =====
    var typewriterEl = document.getElementById('typewriter-text');
    var phrases = [
        'The Future of Material Science <span class="gradient-text">Is Here</span>',
        'Graphene at <span class="gradient-text">Industrial Scale</span>',
        'Engineering <span class="gradient-text">Tomorrow\'s Materials</span>'
    ];
    var phraseIdx = 0, charIdx = 0, isDeleting = false;

    function buildPartialHTML(html, visibleChars) {
        var result = '';
        var count = 0;
        var inTag = false;
        for (var i = 0; i < html.length; i++) {
            if (html[i] === '<') { inTag = true; result += '<'; continue; }
            if (html[i] === '>') { inTag = false; result += '>'; continue; }
            if (inTag) { result += html[i]; continue; }
            if (count < visibleChars) { result += html[i]; count++; }
        }
        return result;
    }

    function typewrite() {
        if (prefersReduced) {
            typewriterEl.innerHTML = phrases[0];
            return;
        }
        var current = phrases[phraseIdx];
        var stripped = current.replace(/<[^>]*>/g, '');

        if (!isDeleting) {
            typewriterEl.innerHTML = buildPartialHTML(current, charIdx);
            charIdx++;
            if (charIdx > stripped.length) {
                isDeleting = true;
                setTimeout(typewrite, 2000);
                return;
            }
            setTimeout(typewrite, 60);
        } else {
            charIdx--;
            typewriterEl.innerHTML = buildPartialHTML(current, charIdx);
            if (charIdx <= 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(typewrite, 500);
                return;
            }
            setTimeout(typewrite, 30);
        }
    }

    if (typewriterEl) {
        setTimeout(typewrite, 800);
    }

    // ===== EXPLAINER TOGGLE =====
    var explainerToggle = document.getElementById('explainerToggle');
    var explainerBody = document.getElementById('explainerBody');
    if (explainerToggle) {
        explainerToggle.addEventListener('click', function () {
            var open = explainerBody.classList.toggle('open');
            explainerToggle.classList.toggle('open', open);
            explainerToggle.setAttribute('aria-expanded', open);
        });
    }
})();
