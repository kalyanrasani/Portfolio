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
    var subject = '[Portfolio] ' + (role || 'Opportunity') + ' — ' + name;
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

  // ============ LIDAR 3D POINT CLOUD ENGINE ============
  (function initLidar() {
    var canvas = document.getElementById('lidarCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var mode = 'elevation';
    var densityCount = 8192;
    var sweepActive = true;
    var sweepX = -1.2;

    var rotX = 0.55;
    var rotY = 0.45;
    var isDragging = false;
    var lastMouseX = 0;
    var lastMouseY = 0;

    var points = [];

    function generatePoints(count) {
      points = [];
      // 1. Ground & Hills (50% of points)
      var nGround = Math.floor(count * 0.5);
      for (var i = 0; i < nGround; i++) {
        var gx = (Math.random() - 0.5) * 2.4;
        var gz = (Math.random() - 0.5) * 2.4;
        var gy = Math.sin(gx * 2.2) * 0.18 + Math.cos(gz * 2.0) * 0.15 - 0.35;
        points.push({
          x: gx, y: gy, z: gz,
          elevation: (gy + 0.6) / 1.2,
          intensity: 0.2 + Math.random() * 0.3,
          cls: 'ground'
        });
      }

      // 2. Transmission Powerlines & Pylons (20% of points)
      var towerHeight = 0.7;
      var nTower = Math.floor(count * 0.08);
      for (var t = 0; t < nTower; t++) {
        var h = Math.random() * towerHeight - 0.35;
        var w = (0.35 - (h + 0.35)) * 0.25;
        var tx = (Math.random() - 0.5) * w;
        var tz = (Math.random() - 0.5) * w;
        points.push({
          x: tx, y: h, z: tz,
          elevation: (h + 0.6) / 1.2,
          intensity: 0.9 + Math.random() * 0.1,
          cls: 'powerline'
        });
      }
      var nWire = Math.floor(count * 0.12);
      for (var wIdx = 0; wIdx < nWire; wIdx++) {
        var wx = (Math.random() - 0.5) * 2.4;
        var wireOffset = (wIdx % 2 === 0 ? 0.22 : -0.22);
        var wy = 0.25 - Math.cos(wx * 1.5) * 0.12 + (Math.random() - 0.5) * 0.02;
        var wz = wireOffset + (Math.random() - 0.5) * 0.02;
        points.push({
          x: wx, y: wy, z: wz,
          elevation: (wy + 0.6) / 1.2,
          intensity: 0.95,
          cls: 'powerline'
        });
      }

      // 3. Buildings / Structures (15% of points)
      var bX = 0.6, bZ = -0.5;
      var nBld = Math.floor(count * 0.15);
      for (var b = 0; b < nBld; b++) {
        var bx = bX + (Math.random() - 0.5) * 0.5;
        var bz = bZ + (Math.random() - 0.5) * 0.5;
        var by = -0.35 + Math.random() * 0.5;

        points.push({
          x: bx, y: by, z: bz,
          elevation: (by + 0.6) / 1.2,
          intensity: 0.75 + Math.random() * 0.2,
          cls: 'building'
        });
      }

      // 4. Vegetation / Trees (15% of points)
      var treeCenters = [
        { x: -0.6, z: 0.5 },
        { x: -0.8, z: -0.4 },
        { x: 0.7, z: 0.6 }
      ];
      var nVeg = Math.floor(count * 0.15);
      for (var v = 0; v < nVeg; v++) {
        var tc = treeCenters[v % treeCenters.length];
        var r = Math.random() * 0.25;
        var theta = Math.random() * Math.PI * 2;
        var vx = tc.x + Math.cos(theta) * r;
        var vz = tc.z + Math.sin(theta) * r;
        var vy = -0.2 + Math.random() * 0.35;
        points.push({
          x: vx, y: vy, z: vz,
          elevation: (vy + 0.6) / 1.2,
          intensity: 0.15 + Math.random() * 0.25,
          cls: 'vegetation'
        });
      }
    }

    generatePoints(densityCount);

    function getPointColor(p, isSwept) {
      if (mode === 'intensity') {
        var val = Math.floor(p.intensity * 255);
        if (isSwept) return 'rgb(0, 255, 200)';
        return 'rgb(' + val + ',' + val + ',' + val + ')';
      }
      if (mode === 'classification') {
        if (isSwept) return '#00FF94';
        if (p.cls === 'ground') return '#8B5A2B';
        if (p.cls === 'vegetation') return '#00E676';
        if (p.cls === 'building') return '#FF6D00';
        if (p.cls === 'powerline') return '#E040FB';
        return '#8A8F98';
      }
      // Elevation Ramp (HSV Rainbow)
      if (isSwept) return '#FFFFFF';
      var e = Math.max(0, Math.min(1, p.elevation));
      var hue = (1 - e) * 240;
      return 'hsl(' + hue + ', 90%, 55%)';
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      canvas.width = Math.floor(rect.width * (window.devicePixelRatio || 1));
      canvas.height = Math.floor(rect.height * (window.devicePixelRatio || 1));
    }
    window.addEventListener('resize', resize);
    resize();

    // Mouse Controls
    var viewport = canvas.parentElement;
    if (viewport) {
      viewport.addEventListener('mousedown', function (e) {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      });
      window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        var dx = e.clientX - lastMouseX;
        var dy = e.clientY - lastMouseY;
        rotY += dx * 0.005;
        rotX += dy * 0.005;
        rotX = Math.max(-0.2, Math.min(1.2, rotX));
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      });
      window.addEventListener('mouseup', function () { isDragging = false; });

      // Touch Support
      viewport.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
          isDragging = true;
          lastMouseX = e.touches[0].clientX;
          lastMouseY = e.touches[0].clientY;
        }
      }, { passive: true });
      window.addEventListener('touchmove', function (e) {
        if (!isDragging || e.touches.length !== 1) return;
        var dx = e.touches[0].clientX - lastMouseX;
        var dy = e.touches[0].clientY - lastMouseY;
        rotY += dx * 0.005;
        rotX += dy * 0.005;
        rotX = Math.max(-0.2, Math.min(1.2, rotX));
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }, { passive: true });
      window.addEventListener('touchend', function () { isDragging = false; });
    }

    // Control Buttons
    document.querySelectorAll('[data-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-mode]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        mode = btn.getAttribute('data-mode');
        var lbl = document.getElementById('lidarActiveMode');
        if (lbl) lbl.textContent = mode.toUpperCase();
      });
    });

    document.querySelectorAll('[data-density]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-density]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var d = btn.getAttribute('data-density');
        if (d === 'low') densityCount = 4096;
        else if (d === 'high') densityCount = 12288;
        else densityCount = 8192;
        generatePoints(densityCount);
        var cntLbl = document.getElementById('lidarPtsCount');
        if (cntLbl) cntLbl.textContent = densityCount.toLocaleString();
      });
    });

    var sweepBtn = document.getElementById('lidarScanToggle');
    if (sweepBtn) {
      sweepBtn.addEventListener('click', function () {
        sweepActive = !sweepActive;
        sweepBtn.classList.toggle('active', sweepActive);
        sweepBtn.textContent = 'Sweep: ' + (sweepActive ? 'ON' : 'OFF');
      });
    }

    // Main Render Loop
    function render() {
      if (!canvas.width || !canvas.height) resize();

      if (!isDragging) {
        rotY += 0.002;
      }

      if (sweepActive) {
        sweepX += 0.015;
        if (sweepX > 1.4) sweepX = -1.4;
      }

      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);

      var cx = w / 2;
      var cy = h / 2 + 30;
      var scale = Math.min(w, h) * 0.42;

      var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      var cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      var renderList = [];
      for (var i = 0; i < points.length; i++) {
        var p = points[i];

        var rx = p.x * cosY - p.z * sinY;
        var rz = p.x * sinY + p.z * cosY;

        var ry = p.y * cosX - rz * sinX;
        var rz2 = p.y * sinX + rz * cosX;

        var dist = 2.5 + rz2;
        var px = cx + (rx / dist) * scale;
        var py = cy - (ry / dist) * scale;
        var ptSize = Math.max(1.2, (1.8 / dist) * (window.devicePixelRatio || 1));

        var isSwept = sweepActive && Math.abs(p.x - sweepX) < 0.08;

        renderList.push({
          px: px,
          py: py,
          size: ptSize,
          depth: rz2,
          color: getPointColor(p, isSwept),
          isSwept: isSwept
        });
      }

      renderList.sort(function (a, b) { return b.depth - a.depth; });

      for (var j = 0; j < renderList.length; j++) {
        var item = renderList[j];
        ctx.fillStyle = item.color;
        ctx.fillRect(item.px - item.size / 2, item.py - item.size / 2, item.size, item.size);
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  })();
})();
