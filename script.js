let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-count').textContent = cart.length;
    renderCart();
    showToast(`✅ ${name} added to cart!`, "add");
}

function removeFromCart(index) {
    const removed = cart.splice(index, 1)[0];
    document.getElementById('cart-count').textContent = cart.length;
    renderCart();
    showToast(`❌ ${removed.name} removed.`, "remove");
}

function renderCart() {
    const box = document.getElementById('cart-items');
    const totalBox = document.getElementById('cart-total');
    if (cart.length === 0) {
        box.innerHTML = "<p>No items yet.</p>";
        totalBox.innerHTML = "<b>Total: ₱0</b>";
    } else {
        box.innerHTML = cart.map((item, i) =>
            `<p><button class="remove-btn" onclick="removeFromCart(${i})">❌</button> ${item.name} - ₱${item.price}</p>`
        ).join("");
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalBox.innerHTML = `<b>Total: ₱${total}</b>`;
    }
}

function toggleCart() {
    const box = document.getElementById('cart-box');
    box.style.display = (box.style.display === "block") ? "none" : "block";
}

function openConfirm() {
    if (cart.length === 0) {
        showToast("⚠️ Your cart is empty.", "remove");
        return;
    }
    const overlay = document.getElementById("overlay");
    const list = document.getElementById("popup-items");
    const total = document.getElementById("popup-total");
    list.innerHTML = cart.map(item => `<li>${item.name} - ₱${item.price}</li>`).join("");
    total.textContent = "Total: ₱" + cart.reduce((sum, item) => sum + item.price, 0);
    overlay.style.display = "flex";
}

function closeConfirm(reset = false) {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    if (reset) document.getElementById('cart-box').style.display = "none";
}

function confirmCheckout() {
    if (cart.length === 0) {
        showToast("⚠️ Your cart is empty.", "remove");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    // ✅ Get logged-in user
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        showToast("⚠️ Please log in first before checkout.", "remove");
        return;
    }

    const username = loggedInUser.username;

    // ✅ Create order record
    const order = {
        date: new Date().toLocaleString(),
        total: total,
        items: cart.map(item => ({ name: item.name, price: item.price }))
    };

    // ✅ Save to that user's personal history
    let userHistory = JSON.parse(localStorage.getItem(`${username}_history`)) || [];
    userHistory.push(order);
    localStorage.setItem(`${username}_history`, JSON.stringify(userHistory));

    // ✅ Clear cart and close popup
    showToast(`🛒 Checkout completed! Total: ₱${total}.`, "checkout");
    cart = [];
    document.getElementById('cart-count').textContent = 0;
    renderCart();
    closeConfirm(true);
}



// Save checkout history
const order = {
    date: new Date().toLocaleString(),
    total: totalPrice,
    items: cartItems.map(item => ({ name: item.name, qty: item.qty }))
};

let history = JSON.parse(localStorage.getItem("checkoutHistory")) || [];
history.push(order);
localStorage.setItem("checkoutHistory", JSON.stringify(history));


function showToast(msg, type) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = `show toast-${type}`;
    setTimeout(() => { t.className = ""; }, 3000);
}

function filterProducts(cat) {
    const cards = document.querySelectorAll("#product-grid .card");
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");
    cards.forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.category === cat) ? 'flex' : 'none';
    });
}