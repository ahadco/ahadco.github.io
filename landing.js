(() => {
  const APPLY_ENDPOINT = 'https://ypnmnmsynmhrgidgwnve.supabase.co/functions/v1/ahad-apply';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const landing = $('#landingView');
  const auth = $('#authView');
  const dialog = $('#applyDialog');
  const form = $('#publicMarriageForm');
  const status = $('#publicFormStatus');
  const submit = $('#publicFormSubmit');

  function openApply(trigger) {
    if (!dialog) return;
    const gender = trigger?.dataset?.gender;
    if (gender && form) {
      form.elements.gender.value = gender;
      form.elements.seeking_gender.value = gender === 'man' ? 'woman' : 'man';
    }
    status.textContent = '';
    status.className = 'lux-form-status';
    dialog.showModal();
    setTimeout(() => form?.elements?.age?.focus(), 80);
  }

  function openAuth() {
    landing?.classList.add('hidden');
    auth?.classList.remove('hidden');
    if (!$('#backToLanding') && $('.auth-card')) {
      const back = document.createElement('button');
      back.type = 'button';
      back.id = 'backToLanding';
      back.className = 'button soft wide';
      back.textContent = 'العودة إلى موقع عهد';
      $('.auth-card').appendChild(back);
    }
    $('#authEmail')?.focus();
  }

  function backToLanding() {
    auth?.classList.add('hidden');
    landing?.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $$('.open-apply').forEach(btn => btn.addEventListener('click', () => openApply(btn)));
  $$('.open-auth').forEach(btn => btn.addEventListener('click', openAuth));
  $('.lux-dialog-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  document.addEventListener('click', e => {
    if (e.target?.id === 'backToLanding') backToLanding();
  });

  $('#luxMenu')?.addEventListener('click', e => {
    const open = landing?.classList.toggle('nav-open');
    e.currentTarget.setAttribute('aria-expanded', String(!!open));
  });
  $$('.lux-nav a').forEach(a => a.addEventListener('click', () => landing?.classList.remove('nav-open')));
  $$('.open-apply, .open-auth').forEach(btn => btn.addEventListener('click', () => landing?.classList.remove('nav-open')));
  window.addEventListener('resize', () => { if (window.innerWidth >= 1050) landing?.classList.remove('nav-open'); }, { passive: true });

  // Lightweight reveal animation: disabled automatically for reduced-motion users.
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const age = Number(fd.get('age'));
    const min = Number(fd.get('preferred_min_age') || 0) || null;
    const max = Number(fd.get('preferred_max_age') || 0) || null;

    if (!Number.isFinite(age) || age < 18) {
      status.textContent = 'الخدمة للبالغين 18 سنة أو أكثر.';
      status.className = 'lux-form-status error';
      return;
    }
    if (fd.get('gender') === 'woman' && fd.get('marital_status') === 'married') {
      status.textContent = 'لا يمكن استقبال طلب امرأة على ذمة زواج قائم عبر هذا المسار.';
      status.className = 'lux-form-status error';
      return;
    }
    if (!phone && !email) {
      status.textContent = 'أدخل رقم جوال أو بريدًا إلكترونيًا واحدًا على الأقل.';
      status.className = 'lux-form-status error';
      return;
    }
    if (min && max && min > max) {
      status.textContent = 'العمر المفضل من يجب أن يكون أقل من أو يساوي العمر إلى.';
      status.className = 'lux-form-status error';
      return;
    }

    const payload = {
      gender: fd.get('gender'),
      age,
      city: String(fd.get('city') || '').trim(),
      nationality: String(fd.get('nationality') || '').trim(),
      marital_status: fd.get('marital_status'),
      marriage_path: fd.get('marriage_path') === 'both' ? 'either' : fd.get('marriage_path'),
      seeking_gender: fd.get('seeking_gender'),
      phone: phone || null,
      email: email || null,
      short_intro: String(fd.get('intro') || '').trim() || null,
      preferred_age_min: min,
      preferred_age_max: max,
      source: 'website',
      consent_privacy: fd.get('consent') === 'on',
      consent_contact: fd.get('consent') === 'on',
      website: String(fd.get('website') || '').trim()
    };

    submit.disabled = true;
    submit.textContent = 'جاري إرسال الطلب…';
    status.textContent = 'يتم الآن إرسال طلبك بشكل آمن للمراجعة.';
    status.className = 'lux-form-status pending';

    try {
      const response = await fetch(APPLY_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = response.status === 409
          ? 'يوجد طلب سابق ببيانات التواصل نفسها. سنعتمد طلبك السابق.'
          : (body.error || body.message || 'تعذر إرسال الطلب الآن. حاول مرة أخرى بعد قليل.');
        throw new Error(message);
      }
      form.reset();
      status.textContent = 'تم استلام طلبك بنجاح. ستراجعه عهد قبل أي خطوة تالية.';
      status.className = 'lux-form-status success';
      submit.textContent = 'تم استلام الطلب ✓';
      setTimeout(() => { if (dialog.open) dialog.close(); }, 2600);
    } catch (err) {
      status.textContent = err.message || 'تعذر إرسال الطلب.';
      status.className = 'lux-form-status error';
      submit.disabled = false;
      submit.textContent = 'إرسال الطلب للمراجعة';
      return;
    }
    setTimeout(() => {
      submit.disabled = false;
      submit.textContent = 'إرسال الطلب للمراجعة';
    }, 3000);
  });
})();