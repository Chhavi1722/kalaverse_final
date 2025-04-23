document.addEventListener('DOMContentLoaded', function() {
    const shopGrid = document.querySelector('.shop-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Filter products based on category
    function filterProducts(category) {
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);
        
        renderProducts(filteredProducts);
    }
    
    // Render products to the grid
    function renderProducts(productsToRender) {
        shopGrid.innerHTML = productsToRender.map(product => `
            <div class="product-card" data-category="${product.category}">
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
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                addToCart(product);
            });
        });
    }
    
    // Set active filter button
    function setActiveFilter(category) {
        filterButtons.forEach(button => {
            if (button.getAttribute('data-category') === category) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // Initialize with category from URL or default to 'all'
    const initialCategory = categoryParam || 'all';
    setActiveFilter(initialCategory);
    filterProducts(initialCategory);
    
    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            setActiveFilter(category);
            filterProducts(category);
            
            // Update URL without reload
            const url = new URL(window.location);
            url.searchParams.set('category', category);
            window.history.pushState({}, '', url);
        });
    });
});