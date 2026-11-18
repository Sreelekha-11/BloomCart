
const products = [
    {
        id: 1,
        name: "Red Rose",
        category: "Roses",
        price: 599,
        image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 2,
        name: "Pink Lily Elegance",
        category: "Lilies",
        price: 749,
        image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 3,
        name: "Spring Garden Bouquet",
        category: "Spring Flowers",
        price: 899,
        image: "https://i.pinimg.com/originals/ca/62/4d/ca624d37674bd4fbccbf2e3485ebed84.jpg"
    },
    {
        id: 4,
        name: "Colorful Flower Mix",
        category: "Bouquets",
        price: 699,
        image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 5,
        name: "Pink Lily Bouquet",
        category: "Lilies",
        price: 849,
        image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=700&q=85"
    },

    
    {
        id: 6,
        name: "Fresh Daisy Bunch",
        category: "Spring Flowers",
        price: 499,
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=700&q=85"
    },
    
    {
        id: 7,
        name: "Rose Collection",
        category: "Roses",
        price: 799,
        image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=700&q=85"
    },
    
    
    {
        id: 8,
        name: "Lovely Gift Bouquet",
        category: "Gifts",
        price: 999,
        image: "https://i.pinimg.com/originals/56/6a/39/566a397e344a067bef3c900ddc06a56d.jpg"
    },
];

let cart = [];
let currentCategory = "All";

const productGrid = document.getElementById("productGrid");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const menuButton = document.getElementById("menuButton");
const navbar = document.getElementById("navbar");


function displayProducts() {
    const searchText = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(function(product) {
        const matchesCategory =
            currentCategory === "All" ||
            product.category === currentCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    productGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
        emptyMessage.hidden = false;
        return;
    }

    emptyMessage.hidden = true;

    filteredProducts.forEach(function(product) {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
            >

            <div class="product-info">
                <h3>${product.name}</h3>

                <p class="product-category">${product.category}</p>

                <div class="product-bottom">
                    <span class="product-price">₹${product.price}</span>

                    <button
                        class="add-button"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart +
                    </button>
                </div>
            </div>
        `;

        productGrid.appendChild(productCard);
    });
}

function setCategory(category) {
    currentCategory = category;

    document.querySelectorAll(".filter-button").forEach(function(button) {
        button.classList.toggle(
            "active",
            button.dataset.filter === category
        );
    });

    displayProducts();
}

document.querySelectorAll(".filter-button").forEach(function(button) {
    button.addEventListener("click", function() {
        setCategory(button.dataset.filter);
    });
});


document.querySelectorAll(".category-card").forEach(function(card) {
    card.addEventListener("click", function() {
        setCategory(card.dataset.category);

        document.getElementById("shop").scrollIntoView({
            behavior: "smooth"
        });
    });
});



searchInput.addEventListener("input", function() {
    displayProducts();
});



function addToCart(productId) {
    const selectedProduct = products.find(function(product) {
        return product.id === productId;
    });

    const existingItem = cart.find(function(item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...selectedProduct,
            quantity: 1
        });
    }

    updateCart();
}



function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="cart-empty">Your cart is empty. Add some beautiful flowers!</p>
        `;
    }

    cart.forEach(function(item) {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>

                <div class="quantity-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>

            <button
                class="remove-button"
                onclick="removeFromCart(${item.id})"
            >
                Remove
            </button>
        `;

        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = "₹" + total;
}



function changeQuantity(productId, change) {
    const item = cart.find(function(product) {
        return product.id === productId;
    });

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    updateCart();
}


function removeFromCart(productId) {
    cart = cart.filter(function(item) {
        return item.id !== productId;
    });

    updateCart();
}



cartButton.addEventListener("click", function() {
    cartOverlay.classList.add("show");
});


function hideCart() {
    cartOverlay.classList.remove("show");
}

closeCart.addEventListener("click", hideCart);

checkoutButton.addEventListener("click", hideCart);

cartOverlay.addEventListener("click", function(event) {
    if (event.target === cartOverlay) {
        hideCart();
    }
});


document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        hideCart();
    }
});

menuButton.addEventListener("click", function() {
    navbar.classList.toggle("show");
});

document.querySelectorAll(".navbar a").forEach(function(link) {
    link.addEventListener("click", function() {
        navbar.classList.remove("show");
    });
});


displayProducts();
updateCart();
