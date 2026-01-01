/**
 * UrbanStepsKE - Admin Management Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initial display of inventory list on page load
    displayAdminInventory();

    // Handle form submission to add new product
    const adminForm = document.getElementById('admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Create new product object from form inputs
            const newProduct = {
                id: Date.now(), // Generate unique ID
                name: document.getElementById('p-name').value,
                price: parseInt(document.getElementById('p-price').value),
                originalPrice: document.getElementById('p-original-price').value ? parseInt(document.getElementById('p-original-price').value) : null,
                category: document.getElementById('p-category').value,
                tag: document.getElementById('p-tag').value,
                // Convert size string "40,41" into array ["40", "41"]
                sizes: document.getElementById('p-sizes').value.split(',').map(s => s.trim()),
                description: document.getElementById('p-desc').value,
                image: document.getElementById('p-image').value
            };

            // Save to LocalStorage
            let customProducts = JSON.parse(localStorage.getItem('userProducts')) || [];
            customProducts.unshift(newProduct);
            localStorage.setItem('userProducts', JSON.stringify(customProducts));

            alert("Product added successfully!");
            this.reset();
            displayAdminInventory(); // Refresh the list view
        });
    }
});

/**
 * Function to render the list of custom added products
 */
function displayAdminInventory() {
    const listContainer = document.getElementById('admin-inventory-list');
    if (!listContainer) return;

    const customProducts = JSON.parse(localStorage.getItem('userProducts')) || [];

    if (customProducts.length === 0) {
        listContainer.innerHTML = '<p class="text-muted mb-0">No custom products added yet.</p>';
        return;
    }

    let listHTML = '<div class="list-group list-group-flush">';
    
    customProducts.forEach(product => {
        listHTML += `
            <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                <div class="d-flex align-items-center">
                    <img src="${product.image}" class="inventory-thumb me-3" alt="thumb">
                    <div>
                        <h6 class="mb-0">${product.name}</h6>
                        <small class="text-muted">KSh ${product.price.toLocaleString()} | ${product.category}</small>
                    </div>
                </div>
                <button onclick="deleteProduct(${product.id})" class="btn btn-sm btn-outline-danger">
                    Delete
                </button>
            </div>
        `;
    });

    listHTML += '</div>';
    listContainer.innerHTML = listHTML;
}

/**
 * Global function to delete a single product
 */
window.deleteProduct = function(id) {
    if (confirm("Are you sure you want to remove this item?")) {
        let customProducts = JSON.parse(localStorage.getItem('userProducts')) || [];
        customProducts = customProducts.filter(p => p.id !== id);
        localStorage.setItem('userProducts', JSON.stringify(customProducts));
        displayAdminInventory(); // Refresh list
    }
};

/**
 * Global function to clear all custom products
 */
window.clearCustomProducts = function() {
    if (confirm("This will delete ALL custom products. Are you sure?")) {
        localStorage.removeItem('userProducts');
        displayAdminInventory(); // Refresh list
    }
};