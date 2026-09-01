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
