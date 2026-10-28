/* ==========================================================================
   Aynim - checkout page
   The shipping method changes the shipping cost and the final total
   ========================================================================== */

'use strict';

const summaryList = document.querySelector('.summary__list');
const shippingOptions = document.querySelectorAll('input[name="ship"]');
const base = Number(summaryList.dataset.base);

function updateTotal() {
  const chosen = document.querySelector('input[name="ship"]:checked');
  const cost = Number(chosen.dataset.cost);

  document.querySelector('[data-ship]').textContent = cost ? `${formatPrice(cost)} تومان` : 'رایگان';
  document.querySelector('[data-total]').textContent = `${formatPrice(base + cost)} تومان`;
}

shippingOptions.forEach((option) => option.addEventListener('change', updateTotal));
updateTotal();
