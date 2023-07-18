// Obtener los productos guardados en el localStorage o crear un array vacío si no existen
var products = JSON.parse(localStorage.getItem('products')) || [];
var taxAmt = 0.19; // Chile

// Función para guardar los productos en el localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
};

// Función para mostrar los productos en la tabla
function renderProductList(filteredList) {
    var productList = document.getElementById('productList');
    productList.innerHTML = '';

    var productsToRender = filteredList || products;

    for (var i = 0; i < productsToRender.length; i++) {
        var product = productsToRender[i];

        var row = document.createElement('tr');
        row.innerHTML = `
        <th scope="row">${product.id}</th>
        <td>${product.code}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.tax}</td>
        <td>
            <button class="btn btn-sm btn-primary modify-product-btn" data-bs-toggle="modal" data-bs-target="#modifyProductModal" data-product-id="${product.id}">Modificar</button>
            <button class="btn btn-sm btn-danger delete-product-btn" data-product-id="${product.id}">Eliminar</button>
        </td>
        `;

        productList.appendChild(row);
    }

    // Agregar el evento de clic al botón "Eliminar" de cada producto
    var deleteProductBtns = document.getElementsByClassName('delete-product-btn');
    for (var i = 0; i < deleteProductBtns.length; i++) {
        var deleteProductBtn = deleteProductBtns[i];
        deleteProductBtn.addEventListener('click', function () {
            var productId = parseInt(this.getAttribute('data-product-id'));
            var productIndex = products.findIndex(function (product) {
                return product.id === productId;
            });

            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                renderProductList();
                saveProducts();
            }
        });
    }
}

// Función para buscar productos por nombre
function searchProducts(event) {
    if (event.key === 'Enter') {
        var searchInput = document.getElementById('searchInput');
        var searchTerm = searchInput.value.toLowerCase();

        var filteredProducts = products.filter(function (product) {
            return product.name.toLowerCase().includes(searchTerm);
        });

        renderProductList(filteredProducts);
    }
}

// Función para agregar un nuevo producto
function addProduct() {
    var codeInput = document.getElementById('newProductCode');
    var nameInput = document.getElementById('newProductName');
    var priceInput = document.getElementById('newProductPrice');

    var code = codeInput.value;
    var name = nameInput.value;
    var price = parseFloat(priceInput.value);
    var tax = price * taxAmt;

    if (!code || !name || isNaN(price) || isNaN(tax)) {
        Swal.fire('Campos incompletos', 'Por favor, ingresa todos los campos correctamente.', 'warning');
        return;
    }

    var nextId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    var newProduct = {
        id: nextId,
        code: code,
        name: name,
        price: price,
        tax: tax
    };

    products.push(newProduct);

    codeInput.value = '';
    nameInput.value = '';
    priceInput.value = '';

    var addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));
    addProductModal.hide();

    renderProductList();
    saveProducts();

    Swal.fire('Producto agregado', 'El producto ha sido agregado exitosamente.', 'success');
};

// Función para modificar un producto existente
function modifyProduct() {
    var productId = parseInt(modifyProductModal.getAttribute('data-product-id'));
    var modifiedProduct = products.find(function (product) {
        return product.id === productId;
    });

    var codeInput = document.getElementById('productCode');
    var nameInput = document.getElementById('productName');
    var priceInput = document.getElementById('productPrice');

    modifiedProduct.code = codeInput.value;
    modifiedProduct.name = nameInput.value;
    modifiedProduct.price = parseFloat(priceInput.value);
    modifiedProduct.tax = modifiedProduct.price * taxAmt

    var bootstrapModal = bootstrap.Modal.getInstance(modifyProductModal);
    bootstrapModal.hide();


    renderProductList();
    saveProducts();
}

// Función para eliminar todos los productos y limpiar el localStorage
function deleteAllProducts() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            products = [];
            localStorage.removeItem('products');
            renderProductList();
            Swal.fire('Eliminados', 'Todos los productos han sido eliminados.', 'success');
        }
    });
}

// Evento al cargar la página
window.onload = function () {
    renderProductList();

    var searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keydown', searchProducts);

    var saveNewProductBtn = document.getElementById('saveNewProductBtn');
    saveNewProductBtn.addEventListener('click', addProduct);

    var deleteAllBtn = document.getElementById('deleteAllBtn');
    deleteAllBtn.addEventListener('click', deleteAllProducts);

    var saveProductBtn = document.getElementById('saveProductBtn');
    saveProductBtn.addEventListener('click', modifyProduct);

    // Agregar el evento de clic al botón "Nuevo Producto"
    var addProductBtn = document.getElementById('addProductBtn');
    addProductBtn.addEventListener('click', function () {
        var addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));
        addProductModal.show();
    });

    // Agregar el evento de clic al botón "Modificar" de cada producto
    var modifyProductBtns = document.getElementsByClassName('modify-product-btn');
    var modifyProductModal = document.getElementById('modifyProductModal');
    for (var i = 0; i < modifyProductBtns.length; i++) {
        var modifyProductBtn = modifyProductBtns[i];
        modifyProductBtn.addEventListener('click', function () {
            var productId = parseInt(this.getAttribute('data-product-id'));
            var product = products.find(function (product) {
                return product.id === productId;
            });

            //var modifyProductModal = document.getElementById('modifyProductModal');
            modifyProductModal = document.getElementById('modifyProductModal');
            modifyProductModal.setAttribute('data-product-id', product.id);

            var codeInput = document.getElementById('productCode');
            var nameInput = document.getElementById('productName');
            var priceInput = document.getElementById('productPrice');

            codeInput.value = product.code;
            nameInput.value = product.name;
            priceInput.value = product.price;

            var bootstrapModal = bootstrap.Modal.getInstance(modifyProductModal);
            bootstrapModal.show();
        });
    }
};
