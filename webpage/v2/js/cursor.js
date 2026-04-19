/**
 * cursor.js
 * Custom cursor dot enhancement (non-replacement)
 */

(function () {
    'use strict';

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cursorDot = document.getElementById('cursorDot');
    if (!cursorDot) return;

    if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', function (e) {
            cursorDot.style.left = (e.clientX - 3) + 'px';
            cursorDot.style.top = (e.clientY - 3) + 'px';
        });
        document.addEventListener('mouseover', function (e) {
            if (e.target.closest('a, button, [onclick], input, textarea, select, .glass-card')) {
                cursorDot.style.transform = 'scale(1.8)';
            }
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest('a, button, [onclick], input, textarea, select, .glass-card')) {
                cursorDot.style.transform = 'scale(1)';
            }
        });
    } else {
        cursorDot.style.display = 'none';
    }
})();
