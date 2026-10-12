(() => {
  const items = [...document.querySelectorAll('.cine-story,.cine-values,.lux-editorial,.lux-privacy,.ahad-studio')];
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduced) items.forEach(el => el.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
    items.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
  }

  const mobileCta = document.querySelector('.mobile-launch-cta');
  const heroCta = document.querySelector('.lux-hero .open-apply');
  const finalCta = document.querySelector('.lux-final');
  const mobileQuery = window.matchMedia('(max-width: 680px)');
  const setCta = () => {
    if (!mobileCta || !heroCta || !mobileQuery.matches) { mobileCta?.classList.remove('is-active'); return; }
    const h = heroCta.getBoundingClientRect();
    const f = finalCta?.getBoundingClientRect();
    const heroGone = h.bottom < 0;
    const finalVisible = !!f && f.top < window.innerHeight * 0.88;
    mobileCta.classList.toggle('is-active', heroGone && !finalVisible);
  };
  setCta();
  window.addEventListener('scroll', setCta, { passive: true });
  window.addEventListener('resize', setCta, { passive: true });
  mobileQuery.addEventListener?.('change', setCta);

  const track = document.querySelector('.ahad-studio-track');
  document.addEventListener('visibilitychange', () => { if (track) track.style.animationPlayState = document.hidden ? 'paused' : ''; });
})();
