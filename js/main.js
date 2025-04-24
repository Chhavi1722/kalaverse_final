// Common functionality across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Update cart count in navbar
    updateCartCount();
    
    // Load featured products on home page
    if (document.querySelector('.product-grid')) {
        loadFeaturedProducts();
    }
    
    // Cart link functionality
    const cartLinks = document.querySelectorAll('.cart-link');
    cartLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    });
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const countElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    countElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems(); // Only on cart page
}

// Sample product data (in a real app, this would come from an API)
const products = [
    {
        id: 1,
        name: 'Handwoven Silk Saree',
        category: 'textiles',
        price: 2500,
        description: 'Traditional handwoven silk saree with gold zari work',
        image: 'https://images.unsplash.com/photo-1646282994816-a8078310f263?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 2,
        name: 'Terracotta Pot',
        category: 'pottery',
        price: 1200,
        description: 'Handcrafted terracotta pot with traditional designs',
        image: 'https://plus.unsplash.com/premium_photo-1703772891967-78a0630981cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 3,
        name: 'Silver Tribal Necklace',
        category: 'jewelry',
        price: 1800,
        description: 'Handmade silver necklace with tribal motifs',
        image: 'https://images.unsplash.com/photo-1725446572865-61e02db0d159?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 4,
        name: 'Handpainted Wall Hanging',
        category: 'home-decor',
        price: 1500,
        description: 'Colorful wall hanging with folk art designs',
        image: 'https://images.unsplash.com/photo-1653227907877-e097195908fb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 5,
        name: 'Cotton Kalamkari Dupatta',
        category: 'textiles',
        price: 800,
        description: 'Hand-painted cotton dupatta with natural dyes',
        image: 'https://images.unsplash.com/photo-1651910031229-d6b1e6d0308d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 6,
        name: 'Brass Diya Set',
        category: 'home-decor',
        price: 600,
        description: 'Set of 3 handcrafted brass diyas for home decor',
        image: 'https://plus.unsplash.com/premium_photo-1679811670791-47b9ea32b3ac?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
];

function loadFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    // Get 4 random products
    const featuredProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    productGrid.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">₹${product.price}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });
}
// Add this at the bottom of main.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
  // Add this to your main.js
function loadRazorpay() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        document.body.appendChild(script);
    });
}

// Call this when your app initializes
loadRazorpay().then(() => {
    console.log('Razorpay loaded');
});