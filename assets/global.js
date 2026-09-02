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

  /* ---- Scroll effects: parallax, zoom, fade, wipe ---------------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var effectTargets = [];

  // Shared section-media system
  [].forEach.call(document.querySelectorAll('[data-section-media]'), function (media) {
    effectTargets.push({
      host: media.parentElement,
      vars: media,
      img: media.querySelector('[data-section-media-img]') || media.querySelector('img'),
      effect: media.getAttribute('data-effect')
    });
  });

  if (effectTargets.length && !reduceMotion) {
    var fxTicking = false;
    var clamp01 = function (n) { return Math.min(1, Math.max(0, n)); };
    var updateEffects = function () {
      var vh = window.innerHeight;
      effectTargets.forEach(function (t) {
        var rect = t.host.getBoundingClientRect();
        if (rect.bottom < -400 || rect.top > vh + 400) return;
        var progress = clamp01((vh - rect.top) / (vh + rect.height));

        if ((t.effect === 'wipe-lr' || t.effect === 'wipe-rl')) {
          var w = clamp01((progress - 0.12) / 0.55);
          t.vars.style.setProperty('--wipe', (w * 100).toFixed(1) + '%');
        }
        if (t.effect === 'fade') {
          t.vars.style.setProperty('--fade', clamp01((progress - 0.05) / 0.4).toFixed(3));
        }
        if (t.img) {
          if (t.effect === 'parallax-up') {
            t.img.style.transform = 'translate3d(0,' + ((progress - 0.5) * 72).toFixed(1) + 'px,0)';
          } else if (t.effect === 'fixed') {
            t.img.style.transform = 'translate3d(0,' + Math.max(-90, Math.min(90, rect.top * -0.12)).toFixed(1) + 'px,0)';
          } else if (t.effect === 'parallax-zoom') {
            t.img.style.transform = 'scale(' + (1 + progress * 0.14).toFixed(3) + ')';
          }
        }
      });
      fxTicking = false;
    };
    var requestEffects = function () {
      if (fxTicking) return;
      fxTicking = true;
      window.requestAnimationFrame(updateEffects);
    };
    window.addEventListener('scroll', requestEffects, { passive: true });
    window.addEventListener('resize', requestEffects, { passive: true });
    updateEffects();
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
