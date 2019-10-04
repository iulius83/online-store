// firebase database GET
const MENU_SERVER_URL = "https://online-shop-da8bf.firebaseio.com/.json";
const MENU_SERVER_ITEM = "https://online-shop-da8bf.firebaseio.com/";

// new EasyHTTP object
const http = new EasyHTTP;

// database weird-named keys stored here
let weirdKeys = [];

function showLoader() {
    let body = document.getElementById('main-wrapper');
    let generatedBody = `
        <div id="loader-wrapper">
            <img id="loader" src="../img/loader.gif" alt="loader">
        </div>`
    body.innerHTML = generatedBody;
}

function getAdminMenu() {
    http.get(MENU_SERVER_URL)
        .then(responseFromPromise => {
            let menuValues = Object.values(responseFromPromise);
            let menuKeys = Object.keys(responseFromPromise);
            weirdKeys.push(...menuKeys);
            generateAdminMenu(menuValues);
        })
        .catch(e => console.log(e));
}

function generateAdminMenu(list) {
    let body = document.querySelector('.admin-table tbody');

    let generatedBody = "";
    for (let i = 0; i < list.length; i++) {
        generatedBody += `
        <tr class="item-row">
            <td class="image"><img src=${list[i].url} alt="${list[i].name}"></td>
            <td class="name" onclick="window.location.href='edit-item.html?id=${weirdKeys[i]}'">${list[i].name}</td>
            <td class="price">${list[i].price} $</td>
            <td class="stock">${list[i].stock}</td>
            <td class="remove" onclick="removeItem('${weirdKeys[i]}')">Remove</td>
        </tr>
        `
    };
    body.innerHTML = generatedBody;
}

// listen for form submit and add item
let addItemForm = document.getElementById('create-new');
if (addItemForm) {
    addItemForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let name = document.getElementById('product-name').value;
        let url = document.getElementById('product-URL-image').value;
        let price = document.getElementById('product-price').value;
        let description = document.getElementById('product-description').value;
        let stock = document.getElementById('product-stock').value;

        let itemObject = {
            "name": name,
            "url": url,
            "price": price,
            "description": description,
            "stock": stock
        };

        if (name && url && price && description && stock) {
            document.querySelector('.error-name').style.display = 'none';
            document.querySelector('.error-url').style.display = 'none';
            document.querySelector('.error-price').style.display = 'none';
            document.querySelector('.error-description').style.display = 'none';
            document.querySelector('.error-stock').style.display = 'none';

            http.post(MENU_SERVER_URL, itemObject)
                .then(response => console.log(response))
                .catch(error => console.log(error));

            showLoader();

            setTimeout(() => { window.location.href = 'admin.html' }, 3500)

        } else {
            document.querySelector('.error-name').style.display = 'inline';
            document.querySelector('.error-url').style.display = 'inline';
            document.querySelector('.error-price').style.display = 'inline';
            document.querySelector('.error-description').style.display = 'inline';
            document.querySelector('.error-stock').style.display = 'inline';
        }
    });
}

// delete function
function removeItem(key) {
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

        http.delete(`${MENU_SERVER_ITEM}${key}.json`)
            .then(response => console.log(response))
            .catch(e => console.log(e));

            showLoader();

            setTimeout(() => { window.location.href = 'admin.html' }, 3500)
    });
}

// get the item details and populate modify form
function getModifyDetails() {
    let id = window.location.toString().split('=')[1];

    http.get(`${MENU_SERVER_ITEM}${id}.json`)
        .then(response => {
            document.getElementById('product-name').value = response.name;
            document.getElementById('product-URL-image').value = response.url;
            document.getElementById('product-price').value = response.price;
            document.getElementById('product-description').value = response.description;
            document.getElementById('product-stock').value = response.stock;

        })
        .catch(error => console.log(error));
}

// listen for form submit and modify the selected entry
let modifyItemForm = document.getElementById('modify-item');
if (modifyItemForm) {
    modifyItemForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let name = document.getElementById('product-name').value;
        let url = document.getElementById('product-URL-image').value;
        let price = document.getElementById('product-price').value;
        let description = document.getElementById('product-description').value;
        let stock = document.getElementById('product-stock').value;

        let itemObject = {
            "name": name,
            "url": url,
            "price": price,
            "description": description,
            "stock": stock
        };

        let id = window.location.toString().split('=')[1];

        if (name && url && price && description && stock) {
            document.querySelector('.error-name').style.display = 'none';
            document.querySelector('.error-url').style.display = 'none';
            document.querySelector('.error-price').style.display = 'none';
            document.querySelector('.error-description').style.display = 'none';
            document.querySelector('.error-stock').style.display = 'none';

            http.put(`${MENU_SERVER_ITEM}${id}.json`, itemObject)
                .then(response => console.log(response))
                .catch(error => console.log(error));

            showLoader();

            setTimeout(() => { window.location.href = 'admin.html' }, 3500)

        } else {
            document.querySelector('.error-name').style.display = 'inline';
            document.querySelector('.error-url').style.display = 'inline';
            document.querySelector('.error-price').style.display = 'inline';
            document.querySelector('.error-description').style.display = 'inline';
            document.querySelector('.error-stock').style.display = 'inline';
        }
    });
}

