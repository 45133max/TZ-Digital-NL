/**
 * TZ Digital — Main scroll controller
 * Single RAF loop drives Lenis, ScrollTrigger sync, and scroll-linked effects.
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobilePortfolioQuery = window.matchMedia('(max-width: 768px)');

  function isPortfolioSwipeMode() {
    return mobilePortfolioQuery.matches && !prefersReducedMotion;
  }

  gsap.registerPlugin(ScrollTrigger);
  // Mobile browsers fire resize events when the address bar hides/shows mid-scroll —
  // without this, ScrollTrigger's own pin math can jump when that happens.
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* --------------------------------------------------------------------------
     Lenis smooth scroll
     -------------------------------------------------------------------------- */

  const lenis = new Lenis({
    duration: prefersReducedMotion ? 0 : 1.2,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    smoothWheel: !prefersReducedMotion,
  });

  if (!prefersReducedMotion) {
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop: function (value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect: function () {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });
  }

  /* --------------------------------------------------------------------------
     DOM references
     -------------------------------------------------------------------------- */

  const nav = document.getElementById('nav');
  const heroPin = document.getElementById('hero-pin');
  const hero = document.getElementById('hero');
  const heroHeadline = document.getElementById('hero-headline');
  const heroCta = document.getElementById('hero-cta');
  const heroTrust = document.getElementById('hero-trust');
  const heroCanvas = document.getElementById('hero-canvas');
  const portfolioPin = document.getElementById('portfolio-pin');
  const portfolio = document.getElementById('work');
  const portfolioTrack = document.getElementById('portfolio-track');
  const portfolioDots = document.querySelectorAll('.portfolio__dot');

  /* --------------------------------------------------------------------------
     Cached viewport/pin measurements — only recomputed on a debounced resize,
     never mid-scroll. Fixes the mobile address-bar-collapse jitter that made
     the hero rotation and portfolio pan look laggy/reset-y on phones.
     -------------------------------------------------------------------------- */

  let viewportHeight = window.innerHeight;
  let heroPinHeight = 0;
  let portfolioPinHeight = 0;

  function setViewportUnit() {
    viewportHeight = window.innerHeight;
    document.documentElement.style.setProperty('--vh', viewportHeight * 0.01 + 'px');
  }

  function measurePinHeights() {
    if (heroPin) heroPinHeight = heroPin.offsetHeight;
    if (portfolioPin) portfolioPinHeight = portfolioPin.offsetHeight;
  }

  setViewportUnit();
  measurePinHeights();

  /* --------------------------------------------------------------------------
     ScrollTrigger pinning (no scrub callbacks — progress read in RAF)
     -------------------------------------------------------------------------- */

  if (!prefersReducedMotion) {
    ScrollTrigger.create({
      trigger: heroPin,
      start: 'top top',
      end: 'bottom bottom',
      pin: hero,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });

    if (!mobilePortfolioQuery.matches) {
      ScrollTrigger.create({
        trigger: portfolioPin,
        start: 'top top',
        end: 'bottom bottom',
        pin: portfolio,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
    }
  }

  /* --------------------------------------------------------------------------
     Hero Three.js scene
     -------------------------------------------------------------------------- */

  let heroScene = null;
  if (heroCanvas && window.TZHeroScene) {
    heroScene = window.TZHeroScene(heroCanvas, { reducedMotion: prefersReducedMotion });
  }

  /* --------------------------------------------------------------------------
     Headline choreography (plays once on load)
     -------------------------------------------------------------------------- */

  function initHeadlineAnimation() {
    if (!heroHeadline) return;

    if (prefersReducedMotion) {
      heroHeadline.classList.add('is-animated');
      if (heroCta) heroCta.classList.add('is-visible');
      if (heroTrust) heroTrust.classList.add('is-visible');
      return;
    }

    const words = heroHeadline.querySelectorAll('.word');
    words.forEach(function (word, i) {
      word.style.animationDelay = i * 60 + 'ms';
    });

    heroHeadline.classList.add('is-animated');

    const totalWordDelay = words.length * 60 + 600;
    setTimeout(function () {
      if (heroCta) heroCta.classList.add('is-visible');
      setTimeout(function () {
        if (heroTrust) heroTrust.classList.add('is-visible');
      }, 200);
    }, totalWordDelay);
  }

  /* --------------------------------------------------------------------------
     Scroll progress helpers
     -------------------------------------------------------------------------- */

  function getPinProgress(pinEl, cachedPinHeight) {
    if (!pinEl) return 0;
    const rect = pinEl.getBoundingClientRect();
    const maxScroll = cachedPinHeight - viewportHeight;
    if (maxScroll <= 0) return 0;
    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / maxScroll));
  }

  /* --------------------------------------------------------------------------
     Scroll-linked state (updated once per frame)
     -------------------------------------------------------------------------- */

  let lastActiveDot = -1;

  function updateScrollEffects() {
    const heroProgress = prefersReducedMotion ? 1 : getPinProgress(heroPin, heroPinHeight);
    const portfolioProgress = prefersReducedMotion ? 0 : getPinProgress(portfolioPin, portfolioPinHeight);

    if (heroScene) {
      heroScene.updateProgress(heroProgress);
    }

    if (portfolioTrack && !prefersReducedMotion && !isPortfolioSwipeMode()) {
      const translateX = portfolioProgress * 200;
      portfolioTrack.style.transform = 'translate3d(-' + translateX + 'vw, 0, 0)';
    } else if (portfolioTrack && isPortfolioSwipeMode()) {
      portfolioTrack.style.transform = 'none';
    }

    if (portfolioDots.length && !isPortfolioSwipeMode()) {
      const activeIndex = prefersReducedMotion
        ? 0
        : Math.min(2, Math.round(portfolioProgress * 2));
      if (activeIndex !== lastActiveDot) {
        portfolioDots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === activeIndex);
        });
        lastActiveDot = activeIndex;
      }
    }

    if (nav) {
      nav.classList.toggle('nav--scrolled', lenis.scroll > 60);
    }
  }

  /* --------------------------------------------------------------------------
     Single RAF scroll loop
     -------------------------------------------------------------------------- */

  function scrollLoop(time) {
    lenis.raf(time);
    if (!prefersReducedMotion) {
      ScrollTrigger.update();
    }
    updateScrollEffects();
    requestAnimationFrame(scrollLoop);
  }

  requestAnimationFrame(scrollLoop);

  if (portfolioTrack && portfolioDots.length) {
    portfolioTrack.addEventListener(
      'scroll',
      function () {
        if (!isPortfolioSwipeMode()) return;
        const panels = portfolioTrack.querySelectorAll('.portfolio__panel');
        let activeIndex = 0;
        let closest = Infinity;
        panels.forEach(function (panel, i) {
          const dist = Math.abs(panel.offsetLeft - portfolioTrack.scrollLeft);
          if (dist < closest) {
            closest = dist;
            activeIndex = i;
          }
        });
        if (activeIndex !== lastActiveDot) {
          portfolioDots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === activeIndex);
          });
          lastActiveDot = activeIndex;
        }
      },
      { passive: true }
    );
  }

  /* --------------------------------------------------------------------------
     IntersectionObserver — one-shot fade-in effects
     -------------------------------------------------------------------------- */

  if (!prefersReducedMotion) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in-view').forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-in-view').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --------------------------------------------------------------------------
     Resize handler
     -------------------------------------------------------------------------- */

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      setViewportUnit();
      if (heroScene) heroScene.resize();
      ScrollTrigger.refresh();
      measurePinHeights();
      if (portfolioTrack && isPortfolioSwipeMode()) {
        portfolioTrack.style.transform = 'none';
      }
      updateScrollEffects();
    }, 150);
  });

  /* --------------------------------------------------------------------------
     Contact form — Formspree AJAX submit
     -------------------------------------------------------------------------- */

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('form-status');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.classList.remove('form-status--success', 'form-status--error');
      }

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
        .then(function (response) {
          const isNl = document.documentElement.lang === 'nl';
          if (response.ok) {
            if (statusEl) {
              statusEl.textContent = isNl
                ? "Bedankt — we nemen binnen 24 uur contact met u op."
                : "Thanks — we'll get back to you within 24 hours.";
              statusEl.classList.add('form-status--success');
            }
            contactForm.reset();
          } else {
            return response.json().then(function (data) {
              const message =
                data && data.errors && data.errors.length
                  ? data.errors.map(function (err) { return err.message; }).join(', ')
                  : isNl
                    ? "Er ging iets mis. Probeer het opnieuw of mail ons rechtstreeks."
                    : "Something went wrong. Please try again or email us directly.";
              throw new Error(message);
            });
          }
        })
        .catch(function (error) {
          if (statusEl) {
            const isNl = document.documentElement.lang === 'nl';
            statusEl.textContent = error.message || (isNl
              ? "Er ging iets mis. Probeer het opnieuw of mail ons rechtstreeks."
              : "Something went wrong. Please try again or email us directly.");
            statusEl.classList.add('form-status--error');
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = document.documentElement.lang === 'nl'
              ? 'Bericht versturen'
              : 'Send message';
          }
        });
    });
  }

  /* --------------------------------------------------------------------------
     Smooth-scroll same-page anchor links (nav + CTA buttons) via Lenis
     -------------------------------------------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      lenis.scrollTo(targetEl, {
        offset: -80,
        duration: prefersReducedMotion ? 0 : 1.4,
      });
    });
  });

  /* --------------------------------------------------------------------------
     Init
     -------------------------------------------------------------------------- */

  initHeadlineAnimation();
  updateScrollEffects();
  ScrollTrigger.refresh();
})();
