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

  function openAuth() { location.href = "./app.html"; }

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


  const syncSeeking = () => {
    if (!form) return;
    const g = form.elements.gender?.value;
    if (g === 'man') form.elements.seeking_gender.value = 'woman';
    if (g === 'woman') form.elements.seeking_gender.value = 'man';
    const married = form.elements.marital_status?.querySelector('option[value="married"]');
    if (married) married.disabled = g === 'woman';
    if (g === 'woman' && form.elements.marital_status?.value === 'married') form.elements.marital_status.value = '';
  };
  form?.elements?.gender?.addEventListener('change', syncSeeking);
  syncSeeking();
  if (location.hash === '#apply') setTimeout(() => openApply(document.querySelector('.open-apply')), 120);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const age = Number(fd.get('age'));
    const gender = String(fd.get('gender') || '');
    const countryCodeRaw = String(fd.get('country_code') || 'SA').toUpperCase();
    const countryCode = countryCodeRaw;
    if (!/^(SA|AE|KW|QA|BH|OM)$/.test(countryCode)) {
      status.textContent = 'اختر دولة مدعومة من القائمة.';
      status.className = 'lux-form-status error';
      return;
    }
    const expectedSeeking = gender === 'man' ? 'woman' : gender === 'woman' ? 'man' : '';
    if (expectedSeeking) form.elements.seeking_gender.value = expectedSeeking;
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
      gender,
      country_code: countryCode,
      age,
      city: String(fd.get('city') || '').trim(),
      nationality: String(fd.get('nationality') || '').trim(),
      marital_status: fd.get('marital_status'),
      marriage_path: fd.get('marriage_path') === 'both' ? 'either' : fd.get('marriage_path'),
      seeking_gender: expectedSeeking || fd.get('seeking_gender'),
      phone: phone || null,
      email: email || null,
      short_intro: String(fd.get('intro') || '').trim() || null,
      preferred_age_min: min,
      preferred_age_max: max,
      source: 'website',
      consent_privacy: fd.get('consent_privacy') === 'on',
      consent_contact: fd.get('consent_contact') === 'on',
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