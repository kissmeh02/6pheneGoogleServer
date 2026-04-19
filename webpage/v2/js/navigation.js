/**
 * navigation.js
 * SPA routing, scroll progress, nav scroll effect, mobile menu toggle
 */

(function () {
    'use strict';

    // SPA Navigation
    function navigate(page) {
        document.querySelectorAll('.page-section').forEach(function (p) {
            p.classList.remove('active');
        });
        var target = document.getElementById('page-' + page);
        if (target) target.classList.add('active');

        // Update nav active states
        document.querySelectorAll('.nav-links a').forEach(function (a) {
            a.classList.remove('active');
        });
        var navLink = document.querySelector('[data-nav="' + page + '"]');
        if (navLink) navLink.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'instant' });

        // Re-check reveals after page switch
        if (typeof initReveals === 'function') initReveals();
    }
    window.navigate = navigate;

    // Scroll Progress Bar
    var scrollProg = document.getElementById('scroll-progress');
    window.addEventListener('scroll', function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        scrollProg.style.width = pct + '%';
    }, { passive: true });

    // Nav Scroll Shadow Effect
    var mainNav = document.getElementById('mainNav');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) mainNav.classList.add('scrolled');
        else mainNav.classList.remove('scrolled');
    }, { passive: true });

    // Mobile Menu
    var navToggle = document.getElementById('navToggle');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileClose = document.getElementById('mobileClose');

    navToggle.addEventListener('click', function () {
        mobileMenu.classList.add('open');
    });
    mobileClose.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
    });
    mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) mobileMenu.classList.remove('open');
    });

    window.closeMobile = function () {
        mobileMenu.classList.remove('open');
    };
})();
