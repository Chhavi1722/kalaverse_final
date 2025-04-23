document.addEventListener('DOMContentLoaded', function() {
    renderCartItems();
    updateCartSummary();

    // Event delegation for dynamic elements
    document.getElementById('cart-items').addEventListener('click', function(e) {
        const itemElement = e.target.closest('.cart-item');
        if (!itemElement) return;

        const itemId = parseInt(itemElement.dataset.id);

        // Handle remove button
        if (e.target.classList.contains('remove-btn')) {
            removeFromCart(itemId);
            return;
        }

        // Handle quantity decrease
        if (e.target.classList.contains('minus')) {
            updateQuantity(itemId, -1);
            return;
        }

        // Handle quantity increase
        if (e.target.classList.contains('plus')) {
            updateQuantity(itemId, 1);
        }
    });
});

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn primary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="item-price">₹${item.price}</div>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn minus">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus">+</button>
            </div>
            <div class="item-total">₹${item.price * item.quantity}</div>
            <button class="remove-btn">Remove</button>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity < 1) {
        cart.splice(itemIndex, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50; // Fixed shipping for demo
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('shipping').textContent = `₹${shipping}`;
    document.getElementById('total').textContent = `₹${total}`;
}