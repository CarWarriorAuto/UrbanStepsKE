/**
 * UrbanStepKE Interactivity Script
 * Handles: Dynamic Loading (Newest First), LocalStorage, Slider, and Cart feedback
 */

document.addEventListener('DOMContentLoaded', () => {
    
  // --- NEW: DYNAMIC PRODUCT DETAIL LOADER ---
    const loadProductDetails = () => {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (productId) {
            // 1. Get products from BOTH sources
            const customProducts = JSON.parse(localStorage.getItem('userProducts')) || [];
            // Make sure 'products' (from products.js) is also included
            const allProducts = typeof products !== 'undefined' ? [...customProducts, ...products] : customProducts;

            // 2. Find the product that matches the ID in the URL
            const product = allProducts.find(p => p.id == productId);

            if (product) {
                // Update Main Image
                const mainImg = document.getElementById('mainImg');
                if (mainImg) mainImg.src = product.image;

                // Update Title
                const titleElem = document.querySelector('h1.fw-bold');
                if (titleElem) titleElem.innerText = product.name;

                // Update Price
                const priceElem = document.querySelector('.text-danger');
                if (priceElem) priceElem.innerText = `KSh ${Number(product.price).toLocaleString()}`;

                // Update Original Price
                const oldPriceElem = document.querySelector('.text-decoration-line-through');
                if (oldPriceElem) {
                    if (product.originalPrice) {
                        oldPriceElem.innerText = `KSh ${Number(product.originalPrice).toLocaleString()}`;
                        oldPriceElem.style.display = 'inline'; // Show it
                    } else {
                        oldPriceElem.style.display = 'none'; // Hide if no original price
                    }
                }

                // Update WhatsApp Link
                const waBtn = document.querySelector('a[href*="wa.me"]');
                if (waBtn) {
                    waBtn.href = `https://wa.me/254700000000?text=I am interested in the ${product.name}`;
                }
                
                // Update Sizes (if container exists)
                const sizeContainer = document.getElementById('size-picker');
                if (sizeContainer && product.sizes) {
                    sizeContainer.innerHTML = '';
                    product.sizes.forEach(size => {
                        sizeContainer.innerHTML += `<button class="btn btn-outline-dark size-btn">${size}</button>`;
                    });
                }
            }
        }
    };
    loadProductDetails();

    // 1. AUTOMATED PRODUCT GENERATOR
    function displayProducts() {
        const leavingContainer = document.getElementById('leaving-stock-container');
        const bestSellersContainer = document.getElementById('best-sellers-container');

        // Safety check
        if (!leavingContainer || !bestSellersContainer || typeof products === 'undefined') return;

        // --- FETCH LOCAL STORAGE PRODUCTS ---
        const customProducts = JSON.parse(localStorage.getItem('userProducts')) || [];
        
        // --- UPDATE: COMBINE WITH CUSTOM PRODUCTS FIRST ---
        const allProducts = [...customProducts, ...products];

        // Clear existing static items
        leavingContainer.innerHTML = '';
        bestSellersContainer.innerHTML = '';

        allProducts.forEach(product => {
            const productHTML = `
                <div class="col-6 col-md-3 mb-4">
                    <div class="position-relative h-100 shoe-card-border shadow-sm rounded">
                        <a href="details.html?id=${product.id}" class="text-decoration-none text-dark stretched-link">
                            <div class="product-img-box d-flex align-items-center justify-content-center p-3" style="height: 250px; background-color: #f0f0f0;">
                                ${product.tag ? `<span class="label-text ${product.tag === 'SALE' ? 'text-orange' : 'text-black'}">${product.tag}</span>` : ''}
                                <img src="${product.image}" class="img-fluid" alt="${product.name}" style="max-height: 100%; object-fit: contain;">
                            </div>
                            <div class="p-3 bg-white border-top">
                                <h5 class="product-title" style="font-weight: 500; font-size: 13px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.name}</h5>
                                <p class="mb-0" style="font-size: 13px;">
                                    ${product.originalPrice ? `<span class="text-muted text-decoration-line-through me-2">KSh ${Number(product.originalPrice).toLocaleString()}</span>` : ''}
                                    <span class="fw-bold">KSh ${Number(product.price).toLocaleString()}</span>
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            `;

            if (product.category === "Leaving Stock") {
                leavingContainer.innerHTML += productHTML;
            } else if (product.category === "Best Sellers") {
                bestSellersContainer.innerHTML += productHTML;
            }
        });
    }

    // Run the generator on page load
    displayProducts();

    // 2. SNEAKER SLIDER LOGIC
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const scrollContainer = document.getElementById('best-sellers-container');

    if (nextBtn && prevBtn && scrollContainer) {
        nextBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
        });
    }

    // 3. CART NOTIFICATION SYSTEM
    let cartCount = 0;
    const cartDisplay = document.querySelector('.fa-shopping-cart')?.parentElement;

    document.addEventListener('click', (e) => {
        if (e.target.innerText.toLowerCase().includes('add to cart') || e.target.classList.contains('btn-add-cart')) {
            e.preventDefault();
            cartCount++;
            
            if (cartDisplay) {
                cartDisplay.innerHTML = `<i class="fas fa-shopping-cart"></i> (${cartCount})`;
            }
            
            const btn = e.target;
            const originalText = btn.innerText;
            btn.innerText = "Added!";
            btn.style.backgroundColor = "#28a745";
            btn.style.color = "white";
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
            }, 2000);
        }
    });

    // 4. IMAGE ERROR HANDLING
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'https://via.placeholder.com/300x300?text=UrbanStepKE+Sneaker';
        }
    }, true);

});