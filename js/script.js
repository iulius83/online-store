// firebase database GET
const MENU_SERVER_URL = "https://online-shop-da8bf.firebaseio.com/.json";
const MENU_SERVER_ITEM = "https://online-shop-da8bf.firebaseio.com/";

// new EasyHTTP object
const http = new EasyHTTP;

// database weird-named keys stored here
let weirdKeys = [];

function getMenu() {
    http.get(MENU_SERVER_URL)
        .then(responseFromPromise => {
            let menuValues = Object.values(responseFromPromise);
            let menuKeys = Object.keys(responseFromPromise);
            weirdKeys.push(...menuKeys);
            generateMenu(menuValues);
        })
        .catch(e => console.log(e));
}

function generateMenu(list) {
    let body = document.getElementById('content-wrapper');

    let generatedBody = "";
    for (let i = 0; i < list.length; i++) {
        generatedBody += `
        <div class="main-content">
            <div class="img-wrapper">
                <img src=${list[i].url} alt="${list[i].name}">
            </div>
            <h1>${list[i].name}</h1>
            <h2>${list[i].price} $</h2>
            <button id="details" onclick="window.location.href='details.html?id=${weirdKeys[i]}'">Details</button>
        </div>
        `
    };
    body.innerHTML = generatedBody;
    showNumberOfProductsInCart();
}

function getDetails() {
    let id = window.location.toString().split('=')[1];

    http.get(`${MENU_SERVER_ITEM}${id}.json`)
        .then(responseFromPromise => {
            generateDetails(responseFromPromise);
        })
        .catch(e => console.log(e));
}

function showLoader() {
    let body = document.getElementById('main-wrapper');
    let generatedBody = `
        <div id="loader-wrapper">
            <img id="loader" src="img/loader.gif" alt="loader">
        </div>`
    body.innerHTML = generatedBody;
}

function generateDetails(element) {
    showLoader();

    let body = document.getElementById('main-wrapper');
    let id = window.location.toString().split('=')[1];
    setTimeout(() => {
        let generatedBody = `
            <div id="details-wrapper">
                <div class="col-left">
                    <img src="${element.url}" alt="${element.name}">
                </div>
                <div class="col-right">
                    <h1>${element.name}</h1>
                    <p>${element.description}</p>
                    <h2>${element.price} $</h2>
                    <hr>
                    <p>In stock: ${element.stock} items</p>
                    <label for="quantity" style="display: inline">Quantity:</label>
                    <input type="number" id="quantity" value="1">
                    <button onclick="addToCart('${id}')">Add to Cart</button>
                </div>
            </div>
        `
        body.innerHTML = generatedBody;
    }, 3000);

    showNumberOfProductsInCart();
}

function showNumberOfProductsInCart() {
    let productsInCart = JSON.parse(localStorage.getItem('shoppingCart'));

    if (productsInCart) {
        document.getElementById('shopping-cart').innerHTML = `<i class="fas fa-shopping-cart fa-sm"></i>&nbsp; &nbsp;Shopping Cart (${productsInCart.length})`;
    } else {
        document.getElementById('shopping-cart').innerHTML = `<i class="fas fa-shopping-cart fa-sm"></i>&nbsp; &nbsp;Shopping Cart (0)`;
    }
}

// listen for admin form submit and redirect to admin.html
let loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let username = document.getElementById('user-name').value;
        let password = document.getElementById('password').value;

        if (username === "iulius" && password === "123abc") {
            document.querySelector('.error-user').style.display = "none"
            document.querySelector('.error-pass').style.display = "none"

            showLoader();

            setTimeout(() => { window.location.href = 'admin/admin.html' }, 3000);
        } else if (!username) {
            document.querySelector('.error-user').style.display = "inline"
            document.querySelector('.error-pass').style.display = "inline"
        } else if (!password) {
            document.querySelector('.error-pass').style.display = "inline"
        } else {
            document.querySelector('.error-user').style.display = "none"
            document.querySelector('.error-pass').style.display = "none"
            document.querySelector('.error-incorrect').style.display = "inline"
        }
    });
}

// Local Storage functions
async function addToCart(itemID) {
    let response = await fetch(`${MENU_SERVER_ITEM}${itemID}.json`);
    let text = await response.text();
    let item = JSON.parse(text);

    let itemName = item.name;
    let itemURL = item.url;
    let itemPrice = item.price;
    let itemQuantity = document.getElementById('quantity').value;

    let itemObject = {
        name: itemName,
        url: itemURL,
        price: itemPrice,
        quantity: itemQuantity,
        subTotal: itemPrice * itemQuantity
    }

    if (localStorage.getItem('shoppingCart') === null) {
        showConfirmation();

        let shoppingCart = [];

        shoppingCart.push(itemObject);

        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    } else {
        showConfirmation();

        let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));

        shoppingCart.push(itemObject);

        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    }
}

function showConfirmation() {
    setTimeout(() => { showNumberOfProductsInCart(); }, 500);

    document.getElementById('confirm-cart').style.opacity = "100";
    document.querySelector('.col-right h1').style.filter = "blur(20px)";
    setTimeout(() => {
        document.getElementById('confirm-cart').style.opacity = "0";
        document.querySelector('.col-right h1').style.filter = "none";
     
    }, 4000)

    
}

function deleteItemFromCart(url) {
    document.getElementById('modal').style.display = "block";
    document.getElementById('main-wrapper').style.filter = "blur(8px)";
    document.getElementById('header').style.filter = "blur(8px)";

    document.getElementById('btn-no').addEventListener('click', function () {
        document.getElementById('modal').style.display = "none";
        document.getElementById('main-wrapper').style.filter = "none";
        document.getElementById('header').style.filter = "none";
    });

    document.getElementById('btn-yes').addEventListener('click', function () {
        document.getElementById('modal').style.display = "none";
        document.getElementById('main-wrapper').style.filter = "none";
        document.getElementById('header').style.filter = "none";

        let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));

        for (var i = 0; i < shoppingCart.length; i++) {
            if (shoppingCart[i].url == url) {
                shoppingCart.splice(i, 1);
            }
        }
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

        setTimeout(getFromLocalStorage, 1000)
    });
}

// get items from local storage
function getFromLocalStorage() {
    let productsInCart = JSON.parse(localStorage.getItem('shoppingCart'));



    if (productsInCart === null || productsInCart.length === 0) {
        let cartWrapper = document.getElementById('cart-wrapper');
        cartWrapper.innerHTML = "<h1>No Products in Cart!</h1>";

    } else if (productsInCart) {
        let cartTableBody = document.getElementById('cart-table-body');
        let totalColumn = document.querySelector('.col-right-cart');

        let generatedCart = "";
        let generatedTotal = "";
        let totalSum = 0;

        for (let i = 0; i < productsInCart.length; i++) {

            let name = productsInCart[i].name;
            let url = productsInCart[i].url;
            let price = productsInCart[i].price;
            let quantity = productsInCart[i].quantity;
            let subTotal = productsInCart[i].subTotal;

            generatedCart += `
                <tr>
                    <td class="image"><img src="${url}"></td>
                    <td>${name}</td>
                    <td class="price">${price} $</td>
                    <td class="quantity">
                        <span onclick="decrease('${url}')">
                            <i class="fas fa-minus"></i>
                        </span>${quantity}<span onclick="increase('${url}')">
                            <i class="fas fa-plus"></i>
                        </span></td>
                    <td class="sub-total">${subTotal} $</td>
                    <td class="remove-from-cart" onclick="deleteItemFromCart('${url}')">Remove</td>
                </tr>
            `
            totalSum += subTotal;
        }
        cartTableBody.innerHTML = generatedCart;

        let transportCost = 50;

        if (totalSum >= 200) {
            transportCost = 0;
        }

        generatedTotal = `
            <h5>Products number: ${productsInCart.length}</h5>
            <h5>Transport cost: ${transportCost} $</h5>
            <p>Free transport after 200$!</p>
            <h2>Total: ${totalSum + transportCost} $</h2>
            <button>Buy Now&nbsp;
                <i class="fas fa-angle-double-right"></i>
            </button>           
        `
        totalColumn.innerHTML = generatedTotal;
    }
}

function increase(url) {
    let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));

    for (var i = 0; i < shoppingCart.length; i++) {
        if (shoppingCart[i].url == url) {
            if (shoppingCart[i].quantity > 0) {
                shoppingCart[i].quantity++;
                shoppingCart[i].subTotal = shoppingCart[i].price * shoppingCart[i].quantity;
            }
        }
    }
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

    getFromLocalStorage();
}

function decrease(url) {
    let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));

    for (var i = 0; i < shoppingCart.length; i++) {
        if (shoppingCart[i].url == url) {
            if (shoppingCart[i].quantity > 1) {
                shoppingCart[i].quantity--;
                shoppingCart[i].subTotal = shoppingCart[i].price * shoppingCart[i].quantity;
            }
        }
    }

    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

    getFromLocalStorage();
}