document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('rzp-button');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', initiateRazorpayPayment);
    }
});

function initiateRazorpayPayment() {
    // Calculate total amount
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50;
    const total = subtotal + shipping;
    
    // Create order data
    const orderData = {
        amount: total * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: "order_" + Math.floor(Math.random() * 1000000),
        notes: {
            products: JSON.stringify(cart.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity
            })))
        }
    };

    // Options for Razorpay
    const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your actual key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Kalaverse",
        description: "Purchase of artisan products",
        image: "images/logo.png",
        order_id: "", // We'll get this from your backend
        handler: function(response) {
            // Payment success handler
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            
            // Clear cart after successful payment
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Redirect to confirmation page
            window.location.href = "order-confirmation.html";
        },
        prefill: {
            name: "Customer Name", // You can get these from a form
            email: "customer@example.com",
            contact: "9000000000"
        },
        notes: orderData.notes,
        theme: {
            color: "#8B5A2B" // Match your brand color
        }
    };

    // Create Razorpay instance
    const rzp = new Razorpay(options);
    
    // For production, you would first create an order on your backend
    // and then get the order_id. Here's a simplified version:
    
    // For testing without backend:
    fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('YOUR_KEY_ID:YOUR_KEY_SECRET')
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        options.order_id = data.id;
        const rzp = new Razorpay(options);
        rzp.open();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error initiating payment. Please try again.');
    });
}