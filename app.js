"use strict";
/**
 * NV SHARP SOLUTIONS — CINEMATIC V2
 * Offline-capable native scroll choreography. A single sticky panel owns pinning;
 * every scene transform is determined by normalized scroll progress. No GSAP or
 * third-party runtime is required, and scrolling remains fully native.
 */
const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const smooth = (a, b, p) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const blend = (a, b, t) => a + (b - a) * clamp(t);
const windowMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const story = document.querySelector('[data-story]');
const header = document.getElementById('header');
const aircraft = document.querySelector('.flight-aircraft');
const exterior = document.querySelector('.flight-exterior');
const clouds = document.querySelector('.flight-clouds');
const sky = document.querySelector('.flight-sky-reveal');
const progressFill = document.getElementById('flight-progress-fill');
const counter = document.getElementById('chapter-index');
const captions = [...document.querySelectorAll('[data-chapter]')];
const glass = document.querySelector('.window-section');
const glassBackdrop = glass?.querySelector('.window-bg');
const closing = document.querySelector('.outro');
const closingBackdrop = closing?.querySelector('.outro-sky');
const menuButton = document.getElementById('menu-toggle');
const menu = document.getElementById('mobile-menu');
let displayedProgress = 0;
let previousChapter = -1;
let scheduled = false;

const progressOf = (node, start = 0, end = 1) => {
  const rect = node.getBoundingClientRect();
  const pageTravel = Math.max(1, rect.height - window.innerHeight);
  return clamp((-rect.top / pageTravel - start) / (end - start));
};

function paintFlight(p) {
  const mobile = window.innerWidth <= 800;
  const establish = smooth(0, .15, p);
  const glide = smooth(.15, .36, p);
  const move = smooth(.52, .78, p);
  const switchToExterior = smooth(.36, .52, p);
  const portal = smooth(.78, .94, p);

  // Level airframe. No rotation, skew, fake light sweep, or wobble.
  const aircraftScale = 1.02 + .08 * establish + .15 * glide;
  const aircraftX = -1 * establish - 2 * glide;
  aircraft.style.transform = `translate3d(${aircraftX}%,0,0) scale(${aircraftScale})`;
  aircraft.style.opacity = (1 - switchToExterior).toFixed(4);

  // Distant atmosphere moves slower than the aircraft.
  clouds.style.transform = `translate3d(${(-4.5 * p).toFixed(3)}%,${(-2 * p).toFixed(3)}%,0) scale(${(1.04 + .055 * p).toFixed(4)})`;

  // This is the approved *exterior-only* A330 photograph, not the rejected cabin shot.
  const windowScale = blend(1.05, mobile ? 1.35 : 1.65, move);
  const windowX = blend(0, mobile ? -1.8 : -4, move);
  exterior.style.opacity = switchToExterior.toFixed(4);
  exterior.style.transform = `translate3d(${windowX.toFixed(3)}%,0,0) scale(${windowScale.toFixed(4)})`;

  // Use a separate sharp cloud plate for the portal: no cabin or seats visible.
  if (mobile) {
    sky.style.clipPath = 'none';
    sky.style.opacity = portal.toFixed(4);
  } else {
    sky.style.opacity = '1';
    sky.style.clipPath = `circle(${(158 * portal).toFixed(2)}% at 86% 50%)`;
  }
  sky.style.transform = `scale(${(1.035 + .012 * portal).toFixed(4)})`;

  if (progressFill) progressFill.style.height = `${(100 * p).toFixed(2)}%`;
  const chapter = p < .39 ? 0 : p < .76 ? 1 : 2;
  if (chapter !== previousChapter) {
    counter.textContent = String(chapter + 1).padStart(2, '0');
    previousChapter = chapter;
  }
  const strengths = [
    1 - smooth(.28, .38, p),
    smooth(.39, .5, p) * (1 - smooth(.66, .76, p)),
    smooth(.76, .85, p) * (1 - smooth(.965, 1, p))
  ];
  captions.forEach((node, i) => {
    const value = strengths[i];
    node.style.opacity = value.toFixed(4);
    node.style.transform = `translate3d(0,${((1 - value) * 26).toFixed(2)}px,0)`;
    node.classList.toggle('is-active', value > .46);
  });
}

function paint() {
  scheduled = false;
  header?.classList.toggle('scrolled', window.scrollY > 25);
  if (windowMotion.matches || !story) return;
  const actual = progressOf(story);
  const step = window.innerWidth <= 800 ? .26 : .19;
  displayedProgress += (actual - displayedProgress) * step;
  if (Math.abs(actual - displayedProgress) < .00015) displayedProgress = actual;
  paintFlight(displayedProgress);

  // Parallax is local to its own section. It is not applied to the sticky pin.
  if (glass && glassBackdrop) {
    const rect = glass.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < innerHeight) {
      const fraction = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      const offset = blend(-1.8, 1.8, fraction);
      glassBackdrop.style.transform = `translate3d(0,${offset.toFixed(2)}%,0) scale(${blend(1.065, 1.01, fraction).toFixed(4)})`;
    }
  }
  if (closing && closingBackdrop) {
    const rect = closing.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < innerHeight) {
      const fraction = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      closingBackdrop.style.transform = `scale(${blend(1.1, 1.015, fraction).toFixed(4)})`;
    }
  }
  if (displayedProgress !== actual) schedule();
}
function schedule() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(paint);
  }
}

function initMotion() {
  if (windowMotion.matches) {
    document.documentElement.classList.remove('motion-enabled');
    [aircraft, exterior, clouds, sky, glassBackdrop, closingBackdrop, ...captions].filter(Boolean).forEach(element => element.removeAttribute('style'));
    return;
  }
  document.documentElement.classList.add('motion-enabled');
  displayedProgress = story ? progressOf(story) : 0;
  // Apply cinematic reveal only to content we can observe.
  if ('IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.intro-main h2,.intro-lower,.discover-header,.destination-card,.vision-body h2,.vision-body p,.outro-inner h2,.outro-inner p,.outro-button');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle('is-visible', e.isIntersecting));
    }, { threshold: .07, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(node => io.observe(node));
  } else {
    document.querySelectorAll('.motion-enabled .intro-main h2,.motion-enabled .intro-lower,.motion-enabled .discover-header,.motion-enabled .destination-card,.motion-enabled .vision-body h2,.motion-enabled .vision-body p,.motion-enabled .outro-inner h2,.motion-enabled .outro-inner p,.motion-enabled .outro-button').forEach(el => el.classList.add('is-visible'));
  }
  schedule();
}
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule, { passive: true });
windowMotion.addEventListener('change', () => {
  // Motion settings can be changed live; refresh to rebuild observer state cleanly.
  location.reload();
});

if (menu && menuButton) {
  const closeMenu = () => {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
  };
  menuButton.addEventListener('click', () => {
    const show = menu.hidden;
    menu.hidden = !show;
    menuButton.setAttribute('aria-expanded', String(show));
    menuButton.setAttribute('aria-label', show ? 'Close navigation menu' : 'Open navigation menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
initMotion();
