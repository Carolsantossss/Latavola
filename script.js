(function () {
  'use strict';

  /* ---------- Header: solid on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var offset = 90;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
      closeMobileNav();
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = ['inicio', 'sobre', 'cardapio', 'galeria', 'avaliacoes', 'contato']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = document.querySelectorAll('.nav-link');

  function setActiveNav() {
    var scrollPos = window.scrollY + 140;
    var currentId = sections[0] ? sections[0].id : null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + currentId;
      link.style.color = match ? 'var(--cream)' : '';
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Reserve modal ---------- */
  var overlay = document.getElementById('reserveOverlay');
  var closeBtn = document.getElementById('reserveClose');
  var reserveTriggers = document.querySelectorAll('.reserve-trigger');
  var form = document.getElementById('reserveForm');
  var formWrap = document.getElementById('reserveFormWrap');
  var successPanel = document.getElementById('reserveSuccess');
  var successName = document.getElementById('successName');
  var successDetails = document.getElementById('successDetails');
  var reserveAgainBtn = document.getElementById('reserveAgain');
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    var firstField = document.getElementById('rName');
    if (firstField) setTimeout(function () { firstField.focus(); }, 250);
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
    setTimeout(function () {
      formWrap.classList.remove('hide');
      successPanel.classList.remove('show');
      form.reset();
    }, 350);
  }

  reserveTriggers.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      closeMobileNav();
      openModal();
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  /* Prevent past dates */
  var dateInput = document.getElementById('rDate');
  if (dateInput) {
    var today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('rName').value.trim();
    var date = document.getElementById('rDate').value;
    var time = document.getElementById('rTime').value;
    var guests = document.getElementById('rGuests').value;

    var formattedDate = date;
    if (date) {
      var parts = date.split('-');
      formattedDate = parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    // Simulated submission (no backend attached in this demo build).
    successName.textContent = name || 'convidado(a)';
    successDetails.textContent = [formattedDate, time, guests].filter(Boolean).join(' \u00b7 ');

    formWrap.classList.add('hide');
    successPanel.classList.add('show');
  });

  reserveAgainBtn.addEventListener('click', closeModal);
})();
