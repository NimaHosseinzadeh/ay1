/* ==========================================================================
   Aynim - cart page
   Prices are read from data-price / data-old on each .item
   ========================================================================== */

'use strict';

const cartItems = document.querySelector('.items');
const cartSummary = document.querySelector('.summary');
const cartCount = document.querySelector('[data-count]');

function setText(name, value) {
  document.querySelector(`[data-sum="${name}"]`).textContent = value;
}

function updateCart() {
  const items = cartItems.querySelectorAll('.item');
  let subtotal = 0;
  let discount = 0;

  items.forEach((item) => {
    const price = Number(item.dataset.price);
    const old = Number(item.dataset.old) || price;
    const qty = Math.max(1, Number(item.querySelector('.item__qty').value) || 1);

    item.querySelector('.item__total').textContent = `${formatPrice(price * qty)} تومان`;
    subtotal += old * qty;
    discount += (old - price) * qty;
  });

  setText('subtotal', `${formatPrice(subtotal)} تومان`);
  setText('discount', `${formatPrice(discount)} تومان`);
  setText('total', `${formatPrice(subtotal - discount)} تومان`);
  cartCount.textContent = `${formatPrice(items.length)} کالا در سبد شما`;

  // Empty cart
  if (!items.length) {
    cartSummary.hidden = true;
    cartItems.outerHTML = '<p class="empty">سبد خرید شما خالی است. <a href="shop.html">رفتن به فروشگاه</a></p>';
  }
}

cartItems.addEventListener('input', updateCart);

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('.item__remove');
  if (!button) return;

  button.closest('.item').remove();
  updateCart();
});

updateCart();
