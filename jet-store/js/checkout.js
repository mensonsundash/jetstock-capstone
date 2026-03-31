document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutMessage = document.getElementById("checkoutMessage");
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  if (!checkoutForm) return;

  // Read cart from localStorage through existing cart.js helpers
  const cartItems = getCartItemsArray();

  // If cart is empty, show message and stop
  if (!cartItems.length) {
    checkoutItems.innerHTML = `
      <div class="alert alert-light border mb-0">
        <div class="fw-semibold">Your cart is empty</div>
        <div class="text-secondary small">Add products before checkout.</div>
      </div>
    `;
    checkoutTotal.textContent = "0.00";
    placeOrderBtn.disabled = true;
    return;
  }

  // Render checkout summary
  renderCheckoutSummary(cartItems);

  // Handle form submit
  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      customer: {
        full_name: document.getElementById("full_name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
      },
      items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.qty,
      })),
    };

    // Basic frontend validation
    if (!payload.customer.full_name || !payload.customer.email) {
      showMessage("Full name and email are required.", "danger");
      return;
    }

    try {
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = "Placing Order...";

      const result = await apiRequest("/store/checkout", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Clear cart after successful checkout
      clearCart();

      showMessage(
        `Order placed successfully. Order ID: ${result.data.order_id}`,
        "success"
      );

      checkoutForm.reset();
      checkoutItems.innerHTML = "";
      checkoutTotal.textContent = "0.00";

      // Optional redirect back to shop
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1800);
    } catch (error) {
      showMessage(error.message || "Checkout failed", "danger");
    } finally {
      placeOrderBtn.disabled = false;
      placeOrderBtn.textContent = "Place Order";
    }
  });

  // Render cart items into checkout summary
  function renderCheckoutSummary(items) {
    checkoutItems.innerHTML = items
      .map(
        ({ product, qty }) => `
          <div class="d-flex align-items-center gap-3 border rounded p-2">
            <img
              src="${product.image_url || ""}"
              alt="${product.name}"
              width="60"
              height="60"
              style="object-fit: cover; border-radius: 6px;"
            />
            <div class="flex-grow-1">
              <div class="fw-semibold">${product.name}</div>
              <div class="text-secondary small">
                Qty: ${qty} · $${Number(product.price).toFixed(2)} each
              </div>
            </div>
            <div class="fw-bold">
              $${(Number(product.price) * qty).toFixed(2)}
            </div>
          </div>
        `
      )
      .join("");

    const total = items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.qty;
    }, 0);

    checkoutTotal.textContent = total.toFixed(2);
  }

  // Show bootstrap alert messages
  function showMessage(message, type = "success") {
    checkoutMessage.innerHTML = `
      <div class="alert alert-${type}" role="alert">
        ${message}
      </div>
    `;
  }
});