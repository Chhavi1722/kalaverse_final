document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Find the product
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'shop.html';
        return;
    }
    
    // Set product details
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `₹${product.price}`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-category').textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    document.getElementById('product-artisan').textContent = "Shanti Devi";
    document.getElementById('product-location').textContent = "Rajasthan, India";
    
    // Set product images
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.image;
    mainImage.alt = product.name;
    
    // For demo purposes, we'll use the same image as thumbnails
    // In a real app, you'd have multiple images
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    for (let i = 0; i < 3; i++) {
        const thumbnail = document.createElement('img');
        thumbnail.src = product.image;
        thumbnail.alt = `${product.name} thumbnail ${i + 1}`;
        thumbnail.addEventListener('click', function() {
            mainImage.src = this.src;
        });
        thumbnailContainer.appendChild(thumbnail);
    }
    
    // Add to cart button
    document.getElementById('add-to-cart-btn').addEventListener('click', function() {
        addToCart(product);
    });
    
    // Contact seller button
    document.getElementById('contact-seller-btn').addEventListener('click', function() {
        window.location.href = `contact.html?product=${encodeURIComponent(product.name)}`;
    });
    
    // Load related products
    loadRelatedProducts(product);
});

function loadRelatedProducts(currentProduct) {
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    const productGrid = document.querySelector('.related-products .product-grid');
    
    if (relatedProducts.length === 0) {
        productGrid.innerHTML = '<p>No related products found.</p>';
        return;
    }
    
    productGrid.innerHTML = relatedProducts.map(product => `
        <div class="product-card">
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="product-info">
                <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
                <p>${product.description}</p>
                <div class="product-price">₹${product.price}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to buttons
    document.querySelectorAll('.related-products .add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });
}