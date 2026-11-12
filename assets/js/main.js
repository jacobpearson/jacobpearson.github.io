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

    // ── Hero typewriter: rotate the orange phrase ─────────────────────────
    var rotator = document.querySelector('.hero-rotator[data-phrases]');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rotator && !reduceMotion) {
      var phrases;
      try { phrases = JSON.parse(rotator.dataset.phrases); } catch (e) { phrases = null; }
      if (phrases && phrases.length > 1) {
        var headline = rotator.closest('.hero-headline');
        var cursor = headline.querySelector('.hero-cursor');
        var HOLD = 4000, DELETE_MS = 35, TYPE_MS = 65, GAP = 350;
        var index = 0;

        // Lock the headline height to the tallest phrase so nothing below jumps.
        var lockHeight = function () {
          var current = rotator.textContent;
          headline.style.minHeight = '';
          var tallest = 0;
          phrases.forEach(function (p) {
            rotator.textContent = p;
            tallest = Math.max(tallest, headline.offsetHeight);
          });
          rotator.textContent = current;
          headline.style.minHeight = tallest + 'px';
        };
        lockHeight();
        var resizeTimer;
        window.addEventListener('resize', function () {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(lockHeight, 150);
        });

        // Timer that waits while the tab is hidden.
        var wait = function (ms, fn) {
          setTimeout(function run() {
            if (document.hidden) { setTimeout(run, 500); } else { fn(); }
          }, ms);
        };

        var typing = function (on) { if (cursor) cursor.classList.toggle('is-typing', on); };

        var erase = function () {
          typing(true);
          var text = rotator.textContent;
          if (text.length) {
            rotator.textContent = text.slice(0, -1);
            wait(DELETE_MS, erase);
          } else {
            typing(false);
            index = (index + 1) % phrases.length;
            wait(GAP, type);
          }
        };

        var type = function () {
          typing(true);
          var target = phrases[index];
          var text = rotator.textContent;
          if (text.length < target.length) {
            rotator.textContent = target.slice(0, text.length + 1);
            wait(TYPE_MS + Math.random() * 45, type);
          } else {
            typing(false);
            wait(HOLD, erase);
          }
        };

        // First phrase is already on screen: let the entrance animation finish, then hold.
        wait(500 + HOLD, erase);
      }
    }
  }

  // Handle both deferred and already-loaded cases
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
