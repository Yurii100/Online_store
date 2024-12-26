const mainBlock = document.querySelector("main.items");

function showCart() {
    const shopBlock = document.querySelector(".shop-cart-block");

    shopBlock.classList.toggle("active");

    if (shopBlock.classList.contains("active")) {
        mainBlock.style.width = "60%";
    }
        
    else {
        mainBlock.style.width = "90%";
    }    
};

let items = []
async function loadData() {
    await fetch("http://localhost:3000/api/shop-items").then(response => {return response.json()}).then(data => {
        items = data
        data.forEach((item) => {
            mainBlock.innerHTML += `<div class="item">
                <img src="img/${item.img}">
                <a href="/Online_store/public/product.html?id=${item.id}"><h4>${item.name} – ${item.price}$</h4></a>
                <p>${item.desc}</p>
                <div class="add-to-cart" onclick="addToCart(${item.id})"><i class="fas fa-cart-plus"></i></div>
            </div>`;
        })
    }).catch(err => {console.error("Ошибка при выполнении запроса", err)});
};

loadData();

let shopCart = [];
if (localStorage.getItem("shopCart") != undefined) {
    shopCart = JSON.parse(localStorage.getItem("shopCart"));
    showCart();
    updateShopCart();
};

function addToCart(id) {
    let itemInCart = shopCart.find((item) => item.id == id);
    if (itemInCart) {
        changeCountItems('+', id);
    } else {
        let item = items.find((item) => item.id == id);
        shopCart.push({
            ...item,
            count: 1
        });
    }

    updateShopCart();
};

function updateShopCart() {
    const shopCartItems = document.querySelector("#shop-cart");
    shopCartItems.innerHTML = "";

    let elementCount = 0, totalPrice = 0;
    shopCart.forEach((el) => {
        shopCartItems.innerHTML += `<div class="shop-item">
                <div class="info">
                    <img src="img/${el.img}" alt="${el.name}">
                    <span class="title">${el.name}</span>
                </div>
                <div class="price">${el.price}$</div>
                <div class="count">
                    <button class="minus" onclick="changeCountItems('-', ${el.id})">-</button>
                    <span><input type="text" value="${el.count}" onchange="changeInputItems(${el.id}, this.value)" data-id="${el.id}"></span>
                    <button class="plus" onclick="changeCountItems('+', ${el.id})">+</button>
                </div>
                <button class="remove" onclick="removeFromCart(${el.id})"><i class="fa-solid fa-trash-can"></i></button>
            </div>`;

        elementCount += el.count;
        totalPrice += el.price * el.count;
    });

    let ft = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    document.querySelector("#count-items").textContent = elementCount;
    document.querySelector(".go-shop b").textContent = ft.format(totalPrice);

    localStorage.setItem("shopCart", JSON.stringify(shopCart));
};

function changeCountItems(action, id) {
    let item = shopCart.find((item) => item.id == id);
    if (action == '-' && item.count > 1)
        item.count--;
    else if (action == '+' && item.count < item.leftItems)
        item.count++;
    else if (action == '-' && item.count == 1)
        shopCart = shopCart.filter((item) => item.id != id);

    updateShopCart();
};

function changeInputItems(id, value) { 
    let item = shopCart.find((item) => item.id == id); 
    value = parseInt(value); 
    if (isNaN(value) || value < 1 || value > item.leftItems) { 
        alert(`Указано неверное значение. Верное значение должно быть от 1 до ${item.leftItems}`);
        document.querySelector(`input[data-id="${id}"]`).value = item.count; 
    } else {
        item.count = value;
        updateShopCart();
    }
};

function removeFromCart(id) { 
    shopCart = shopCart.filter(item => item.id !== id); 
    updateShopCart(); 
};

function clearCart() { 
    shopCart = []; 
    updateShopCart(); 
};

async function makeOrder() {
    let insertOrder = [];
    shopCart.forEach(el => {
        insertOrder.push({item_id: el.id, count: el.count})
    });
    const result = await fetch("http://localhost:3000/api/shop-items", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(insertOrder)
    });
    if (result.status == 200) {
        localStorage.removeItem("shopCart");
        shopCart = [];
        updateShopCart();
        document.querySelector(".go-shop").textContent = "Заказ оформлен";
    };
};

const navItem = document.querySelectorAll("nav span");
navItem.forEach(el => {
    el.addEventListener("click", () => {
        mainBlock.innerHTML = "";
        items.forEach(item => {
            if (el.classList.value == item.category || el.classList.value == "All") {
                mainBlock.innerHTML += `<div class="item">
                    <img src="img/${item.img}">
                    <a href="/Online_store/public/product.html?id=${item.id}"><h4>${item.name} – ${item.price}$</h4></a>
                    <p>${item.desc}</p>
                    <div class="add-to-cart" onclick="addToCart(${item.id})"><i class="fas fa-cart-plus"></i></div>
                </div>`;
            }
        })
    })
});