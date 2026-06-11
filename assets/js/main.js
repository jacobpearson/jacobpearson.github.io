(function () {
  'use strict';

  // ── Nav: frosted glass at 60px scroll (desktop) ──────────────────────────
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  function triggerPageLoaded() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('page-loaded');
      });
    });
  }

  function init() {
    // ── Page entrance stagger ─────────────────────────────────────────────
    // Double rAF ensures initial opacity-0 is painted before animating.
    // visibilitychange fallback handles background-tab opens (Ctrl+click).
    if (document.hidden) {
      document.addEventListener('visibilitychange', function onVisible() {
        if (!document.hidden) {
          document.removeEventListener('visibilitychange', onVisible);
          triggerPageLoaded();
        }
      });
    } else {
      triggerPageLoaded();
    }

    // ── Scroll reveal ─────────────────────────────────────────────────────
    if (typeof IntersectionObserver !== 'undefined') {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // No IntersectionObserver: show everything immediately
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('is-revealed');
      });
    }

    // ── Count-up animation (about page sidebar stats) ─────────────────────
    var countEls = document.querySelectorAll('[data-count]');
    if (countEls.length && typeof IntersectionObserver !== 'undefined') {
      var easeOutQuad = function (t) { return 1 - (1 - t) * (1 - t); };

      var fmtNum = function (n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); };

      var animateCount = function (el) {
        var target = parseInt(el.dataset.count, 10);
        var duration = 1100;
        var start = null;

        var tick = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          el.textContent = fmtNum(Math.round(easeOutQuad(p) * target));
          if (p < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = fmtNum(target);
          }
        };
        requestAnimationFrame(tick);
      };

      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      countEls.forEach(function (el) { countObserver.observe(el); });
    }
  }

  // Handle both deferred and already-loaded cases
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
