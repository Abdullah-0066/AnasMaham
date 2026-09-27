document.addEventListener('DOMContentLoaded', () => {
  const envelope = document.getElementById('envelope');
  const envelopeVideo = document.getElementById('envelopeVideo');
  const heroVideo = document.getElementById('heroVideo');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const petalsContainer = document.getElementById('petals');
  const preloader = document.getElementById('preloader');

  let opened = false;
  let musicOn = true;

  heroVideo.play().catch(() => {});

  /* ---------- Preloader ---------- */
  const hidePreloader = () => preloader && preloader.classList.add('hide');
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 300));
  }
  setTimeout(hidePreloader, 2200); // safety fallback

  /* ---------- Envelope tap ---------- */
  envelope.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    envelope.classList.add('opening');

    envelopeVideo.classList.add('show');
    envelopeVideo.muted = false;
    const playPromise = envelopeVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        envelopeVideo.muted = true;
        envelopeVideo.play().catch(() => {});
      });
    }

    if (musicOn) {
      bgMusic.volume = 0.55;
      bgMusic.play().catch(() => {});
    }

    const revealHero = () => {
      envelope.classList.add('hide');
      setTimeout(() => {
        envelope.style.display = 'none';
      }, 950);

      setTimeout(() => {
        if (window.scrollY < 40) {
          window.scrollBy({ top: window.innerHeight * 0.4, behavior: 'smooth' });
        }
      }, 4000);
    };

    envelopeVideo.addEventListener('ended', revealHero, { once: true });
    envelopeVideo.addEventListener('error', () => {
      if (!envelope.classList.contains('hide')) revealHero();
    }, { once: true });
  });

  /* ---------- Music toggle ---------- */
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    musicOn = !musicOn;
    musicToggle.classList.toggle('muted', !musicOn);
    musicToggle.setAttribute('aria-pressed', String(musicOn));
    if (musicOn) {
      bgMusic.play().catch(() => {});
    } else {
      bgMusic.pause();
    }
  });

  /* ---------- Falling petals ---------- */
  function spawnPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 8 + Math.random() * 10;
    const startX = Math.random() * 100;
    const fallDuration = 9 + Math.random() * 7;
    const swayDuration = 3 + Math.random() * 3;
    const delay = Math.random() * 0.6;
    const drift = Math.random() * 30 - 15;

    petal.style.left = startX + 'vw';
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.animationDelay = `${delay}s, ${delay}s`;
    petal.style.setProperty('--drift', drift + 'px');

    petalsContainer.appendChild(petal);
    setTimeout(() => petal.remove(), (fallDuration + delay) * 1000 + 200);
  }

  for (let i = 0; i < 10; i++) {
    setTimeout(spawnPetal, i * 400);
  }
  setInterval(spawnPetal, 650);

  /* ---------- Flying butterflies ---------- */
  const butterflyContainer = document.getElementById('butterflies');

  function makeButterflySVG() {
    return `
      <svg viewBox="0 0 40 30">
        <line x1="20" y1="6" x2="20" y2="24" stroke="currentColor" stroke-width="1.2"/>
        <g class="wing wing-l">
          <path d="M20 14 C10 -2 -2 2 1 13 C-2 22 10 27 20 16 Z" fill="currentColor" opacity="0.85"/>
        </g>
        <g class="wing wing-r">
          <path d="M20 14 C30 -2 42 2 39 13 C42 22 30 27 20 16 Z" fill="currentColor" opacity="0.85"/>
        </g>
      </svg>`;
  }

  function spawnButterfly() {
    if (!butterflyContainer) return;
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly';
    butterfly.innerHTML = makeButterflySVG();

    const startX = 5 + Math.random() * 90;
    const size = 22 + Math.random() * 16;
    const duration = 10 + Math.random() * 6;
    const dx1 = (Math.random() * 24 - 12) + 'vw';
    const dx2 = (Math.random() * 30 - 15) + 'vw';
    const dx3 = (Math.random() * 36 - 18) + 'vw';
    const rot1 = (Math.random() * 20 - 10) + 'deg';
    const rot2 = (Math.random() * 26 - 13) + 'deg';
    const rot3 = (Math.random() * 20 - 10) + 'deg';
    const colors = ['var(--terracotta)', 'var(--gold)', 'var(--peach)'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    butterfly.style.left = startX + 'vw';
    butterfly.style.width = size + 'px';
    butterfly.style.height = (size * 0.72) + 'px';
    butterfly.style.color = color;
    butterfly.style.animationDuration = duration + 's';
    butterfly.style.setProperty('--dx1', dx1);
    butterfly.style.setProperty('--dx2', dx2);
    butterfly.style.setProperty('--dx3', dx3);
    butterfly.style.setProperty('--rot1', rot1);
    butterfly.style.setProperty('--rot2', rot2);
    butterfly.style.setProperty('--rot3', rot3);

    butterflyContainer.appendChild(butterfly);
    setTimeout(() => butterfly.remove(), duration * 1000 + 300);
  }

  for (let i = 0; i < 3; i++) {
    setTimeout(spawnButterfly, i * 1800);
  }
  setInterval(spawnButterfly, 4200);

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Countdown ---------- */
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');

  if (cdDays && cdHours && cdMins && cdSecs) {
    // Sunday, 29th November 2026, reception 7:00 PM, Pakistan Standard Time (UTC+5)
    const targetDate = new Date('2026-11-29T19:00:00+05:00').getTime();
    const pad = (n) => String(Math.max(n, 0)).padStart(2, '0');

    function updateCountdown() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        cdDays.textContent = '00';
        cdHours.textContent = '00';
        cdMins.textContent = '00';
        cdSecs.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      cdDays.textContent = pad(days);
      cdHours.textContent = pad(hours);
      cdMins.textContent = pad(mins);
      cdSecs.textContent = pad(secs);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});

