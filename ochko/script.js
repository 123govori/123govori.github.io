new Swiper('#gallerySwiper', {
  effect: 'coverflow',
  centeredSlides: true,
  slidesPerView: 'auto',
  spaceBetween: 16,
  loop: true,
  speed: 700,
  grabCursor: true,
  coverflowEffect: {
    rotate: 20,
    stretch: 0,
    depth: 80,
    modifier: 1,
    slideShadows: false,
  },
  breakpoints: {
    640: {
      spaceBetween: 24,
      coverflowEffect: { rotate: 30, stretch: 0, depth: 120, modifier: 1, slideShadows: false },
    },
    860: {
      spaceBetween: 32,
      coverflowEffect: { rotate: 35, stretch: 0, depth: 160, modifier: 1, slideShadows: false },
    },
  },
  mousewheel: { forceToAxis: true, sensitivity: 0.6 },
  pagination: { el: '.gallery-swiper .swiper-pagination', clickable: true },
  navigation: {
    nextEl: '.gallery-swiper .swiper-button-next',
    prevEl: '.gallery-swiper .swiper-button-prev',
  },
});

(function () {
  const colorOptions = document.getElementById('colorOptions');
  const productPrice = document.getElementById('productPrice');
  const summaryColor = document.getElementById('summaryColor');
  const summaryTotal = document.getElementById('summaryTotal');
  const inputColor = document.getElementById('inputColor');
  const inputTotal = document.getElementById('inputTotal');
  const form = document.getElementById('orderForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  const state = {
    colorLabel: 'Black',
    colorValue: 'black',
    colorBase: 52900,
  };

  function formatRub(amount) {
    return amount.toLocaleString('ru-RU') + ' ₽';
  }

  function updateTotals() {
    const total = state.colorBase;
    productPrice.textContent = 'Итого: ' + formatRub(total);
    summaryColor.textContent = state.colorLabel;
    summaryTotal.textContent = formatRub(total);
    inputColor.value = state.colorValue;
    inputTotal.value = String(total);
  }

  colorOptions.addEventListener('click', function (e) {
    const btn = e.target.closest('.variant-card');
    if (!btn) return;
    colorOptions.querySelectorAll('.variant-card').forEach((el) => el.classList.remove('variant-card--active'));
    btn.classList.add('variant-card--active');
    state.colorLabel = btn.querySelector('.variant-card__name').textContent.trim();
    state.colorValue = btn.dataset.color;
    state.colorBase = Number(btn.dataset.price);
    updateTotals();
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    formStatus.textContent = '';
    formStatus.removeAttribute('data-state');

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
      comment: formData.get('comment'),
      color: formData.get('color'),
      total: Number(formData.get('total')),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Создаём платёж…';

    try {
      const response = await fetch('/.netlify/functions/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('payment_failed');
      }

      const data = await response.json();
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }
      throw new Error('no_confirmation_url');
    } catch (err) {
      formStatus.textContent = 'Не удалось перейти к оплате. Попробуйте ещё раз или напишите нам на почту.';
      formStatus.setAttribute('data-state', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Перейти к оплате';
    }
  });

  updateTotals();
})();
