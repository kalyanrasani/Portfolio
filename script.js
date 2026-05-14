/* PKR Portfolio — Vanilla JS (no dependencies) */
(function () {
  var EMAIL = 'rasanikalyan@gmail.com';

  // Header scroll state
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  var menuBtn = document.getElementById('menuBtn');
  var mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var open = !mobileNav.hidden;
      mobileNav.hidden = open;
      menuBtn.setAttribute('aria-expanded', String(!open));
      menuBtn.textContent = open ? 'MENU' : 'CLOSE';
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'MENU';
      });
    });
  }

  // Smooth scroll for in-page nav links (with offset for fixed header)
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = 72;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
      if (history.pushState) history.pushState(null, '', href);
    });
  });

  // Contact form — build payloads and route to Gmail/Outlook/Mailto
  function collect() {
    var form = document.getElementById('contactForm');
    if (!form) return null;
    var fd = new FormData(form);
    var name = (fd.get('name') || '').toString().trim();
    var email = (fd.get('email') || '').toString().trim();
    var company = (fd.get('company') || '').toString().trim();
    var role = (fd.get('role') || '').toString().trim();
    var message = (fd.get('message') || '').toString().trim();
    if (!name || !email || !message) {
      alert('Name, email, and message are required.');
      return null;
    }
    var subject = '[Signal Match] ' + (role || 'Opportunity') + ' — ' + name;
    var body =
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      (company ? 'Company: ' + company + '\n' : '') +
      (role ? 'Role / JD: ' + role + '\n' : '') +
      '\nMessage:\n' + message + '\n';
    return { subject: subject, body: body };
  }

  function open(url) { window.open(url, '_blank', 'noopener'); }

  var gmail = document.getElementById('sendGmail');
  var outlook = document.getElementById('sendOutlook');
  var mailDefault = document.getElementById('sendMail');

  if (gmail) gmail.addEventListener('click', function () {
    var d = collect(); if (!d) return;
    open('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(EMAIL) +
         '&su=' + encodeURIComponent(d.subject) + '&body=' + encodeURIComponent(d.body));
  });
  if (outlook) outlook.addEventListener('click', function () {
    var d = collect(); if (!d) return;
    open('https://outlook.office.com/mail/deeplink/compose?to=' + encodeURIComponent(EMAIL) +
         '&subject=' + encodeURIComponent(d.subject) + '&body=' + encodeURIComponent(d.body));
  });
  if (mailDefault) mailDefault.addEventListener('click', function () {
    var d = collect(); if (!d) return;
    window.location.href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(d.subject) + '&body=' + encodeURIComponent(d.body);
  });

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Intersection-observer reveal (motion-safe)
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.section, .signal-card, .metric, .cell, .mission, .channel').forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }
})();
