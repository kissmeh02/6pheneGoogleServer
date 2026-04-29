/**
 * forms.js
 * Contact form, collaboration modal, newsletter, detail toggles
 * Submissions powered by Web3Forms → info@6phene.com
 */

(function () {
    'use strict';

    var W3F_KEY = '%%W3F_ACCESS_KEY%%';

    // ===== PRODUCT DETAIL TOGGLES =====
    window.toggleDetails = function (btn) {
        var panel = btn.parentElement.nextElementSibling;
        var isOpen = panel.style.maxHeight !== '0px' && panel.style.maxHeight !== '';

        // Close all panels
        document.querySelectorAll('.detail-panel').forEach(function (p) {
            p.style.maxHeight = '0px';
        });
        document.querySelectorAll('.detail-panel').forEach(function (p) {
            var b = p.previousElementSibling.querySelector('[aria-expanded]');
            if (b) {
                b.setAttribute('aria-expanded', 'false');
                b.textContent = 'View Technical Focus';
            }
        });

        if (!isOpen) {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            btn.setAttribute('aria-expanded', 'true');
            btn.textContent = 'Hide Technical Focus';
        }
    };

    // ===== WEB3FORMS SUBMIT HELPER =====
    function submitToWeb3Forms(data, onSuccess, onError) {
        data.access_key = W3F_KEY;
        data.from_name = '6PHENE Website';

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function (res) { return res.json(); })
        .then(function (result) {
            if (result.success) {
                onSuccess();
            } else {
                onError();
            }
        })
        .catch(function () {
            onError();
        });
    }

    // ===== COLLABORATION MODAL =====
    window.openCollabModal = function (interest) {
        var modal = document.getElementById('collabModal');
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (interest) document.getElementById('collab-interest').value = interest;
        setTimeout(function () {
            document.getElementById('collab-name').focus();
        }, 100);
    };

    window.closeCollabModal = function () {
        var modal = document.getElementById('collabModal');
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    document.getElementById('collabModal').addEventListener('click', function (e) {
        if (e.target === this) closeCollabModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeCollabModal();
    });

    // Collab form submission
    document.getElementById('collabForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = document.getElementById('collabSubmitBtn');
        var name = document.getElementById('collab-name').value.trim();
        var email = document.getElementById('collab-email').value.trim();
        var org = document.getElementById('collab-org').value.trim();
        var interest = document.getElementById('collab-interest').value;
        var message = document.getElementById('collab-message').value.trim();

        if (!name || !email || !interest || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

        btn.textContent = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.pointerEvents = 'none';

        submitToWeb3Forms({
            subject: 'Collaboration Request — ' + interest,
            name: name,
            email: email,
            organization: org || 'N/A',
            interest: interest,
            message: message || 'No additional message.'
        }, function () {
            document.getElementById('collabFormContainer').innerHTML =
                '<div class="form-success-msg">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
                '<h3>Thank You!</h3>' +
                '<p>Your collaboration request has been received. Our team will respond within 2-3 business days.</p>' +
                '</div>';
        }, function () {
            btn.textContent = 'Send Request';
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            alert('Something went wrong. Please email us directly at info@6phene.com');
        });
    });

    // ===== CONTACT FORM =====
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = document.getElementById('cf-first').value.trim();
        var l = document.getElementById('cf-last').value.trim();
        var em = document.getElementById('cf-email').value.trim();
        var company = document.getElementById('cf-company').value.trim();
        var msg = document.getElementById('cf-message').value.trim();
        if (!f || !l || !em || !msg || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return;

        var btn = document.getElementById('contactSubmitBtn');
        btn.textContent = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.pointerEvents = 'none';

        var form = this;
        submitToWeb3Forms({
            subject: 'Contact Form — ' + f + ' ' + l,
            name: f + ' ' + l,
            email: em,
            company: company || 'N/A',
            message: msg
        }, function () {
            form.style.display = 'none';
            document.getElementById('contactSuccess').style.display = 'block';
        }, function () {
            btn.textContent = 'Send Message';
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            alert('Something went wrong. Please email us directly at info@6phene.com');
        });
    });

    // ===== NEWSLETTER =====
    window.handleNewsletter = function () {
        var input = document.getElementById('nlEmail');
        if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            input.focus();
            return;
        }

        submitToWeb3Forms({
            subject: 'Newsletter Signup',
            name: 'Newsletter Subscriber',
            email: input.value,
            message: 'New newsletter subscription request.'
        }, function () {
            input.value = '';
            input.placeholder = 'Subscribed!';
            setTimeout(function () {
                input.placeholder = 'Enter your email';
            }, 3000);
        }, function () {
            input.value = '';
            input.placeholder = 'Error — try again';
            setTimeout(function () {
                input.placeholder = 'Enter your email';
            }, 3000);
        });
    };
})();
