/* Diff King — global behaviours (no dependencies) */
(function () {
  'use strict';

  /* ---- Mobile navigation drawer ------------------------------------- */
  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-nav-toggle]');
    if (toggle) {
      var nav = document.getElementById('MobileNav');
      if (!nav) return;
      var open = nav.hasAttribute('hidden');
      if (open) {
        nav.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
      } else {
        nav.setAttribute('hidden', '');
        document.body.style.overflow = '';
      }
      toggle.setAttribute('aria-expanded', String(open));
    }

    if (event.target.closest('[data-nav-close]')) {
      var mobileNav = document.getElementById('MobileNav');
      if (mobileNav) mobileNav.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var mobileNav = document.getElementById('MobileNav');
    if (mobileNav && !mobileNav.hasAttribute('hidden')) {
      mobileNav.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  });

  /* ---- Collapsible submenus in the mobile drawer ------------------- */
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-submenu-toggle]');
    if (!trigger) return;
    var expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!expanded));
    var panel = trigger.nextElementSibling;
    if (panel) panel.hidden = expanded;
  });

  /* ---- Sticky header shadow on scroll ----------------------------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('header--scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Parallax + left-to-right wipe on scroll -------------------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var parallaxSections = [].slice.call(document.querySelectorAll('[data-parallax-section]'));
  if (parallaxSections.length && !reduceMotion) {
    var ticking = false;
    var updateParallax = function () {
      var vh = window.innerHeight;
      parallaxSections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var progress = (vh - rect.top) / (vh + rect.height);
        progress = Math.min(1, Math.max(0, progress));

        var wipe = section.querySelector('[data-parallax-wipe]');
        if (wipe) {
          // reveal completes over the first ~60% of the section's pass through the viewport
          var w = Math.min(1, Math.max(0, (progress - 0.12) / 0.55));
          section.style.setProperty('--wipe', (w * 100).toFixed(1) + '%');
        }

        var img = section.querySelector('[data-parallax-img]');
        if (img && section.hasAttribute('data-parallax')) {
          var shift = (progress - 0.5) * 90;
          img.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
        }
      });
      ticking = false;
    };
    var requestParallax = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    };
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax, { passive: true });
    updateParallax();
  }

  /* ---- Quantity steppers ----------------------------------------- */
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-qty-change]');
    if (!button) return;
    var wrapper = button.closest('[data-qty]');
    if (!wrapper) return;
    var input = wrapper.querySelector('input');
    if (!input) return;
    var step = button.getAttribute('data-qty-change') === 'up' ? 1 : -1;
    var min = parseInt(input.min, 10) || 0;
    var next = (parseInt(input.value, 10) || 0) + step;
    if (next < min) next = min;
    input.value = next;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ---- Cart line item auto-submit on quantity change ------------- */
  document.addEventListener('change', function (event) {
    var input = event.target.closest('[data-cart-quantity]');
    if (input) {
      var form = input.closest('form');
      if (form) form.requestSubmit ? form.requestSubmit() : form.submit();
    }
  });

  /* ---- Newsletter / contact: shift focus to success message ----- */
  var status = document.querySelector('[data-form-status]');
  if (status && status.textContent.trim()) {
    status.setAttribute('tabindex', '-1');
    status.focus();
  }
})();
