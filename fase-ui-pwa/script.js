$(document).ready(function() {

    // ==========================================
    // 1. FILTRO DE BÚSQUEDA Y CATEGORÍAS
    // ==========================================
    function filterProducts() {
        let searchText = $('#searchProduct').val().toLowerCase();
        let category = $('#categoryFilter').val();

        $('.product-card').each(function() {
            let name = $(this).data('name').toLowerCase();
            let cat = $(this).data('category');

            let matchesSearch = name.includes(searchText);
            let matchesCategory = (category === 'all' || cat === category);

            if (matchesSearch && matchesCategory) {
                $(this).fadeIn('fast');
            } else {
                $(this).fadeOut('fast');
            }
        });
    }

    $('#searchProduct').off('keyup').on('keyup', filterProducts);
    $('#categoryFilter').off('change').on('change', filterProducts);

    // ==========================================
    // 2. VALIDACIÓN DEL FORMULARIO DE CONTACTO
    // ==========================================
    $('#contactForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        let nombre = $('#nombre');
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(nombre.val().trim())) {
            nombre.addClass('is-invalid'); isValid = false;
        } else { nombre.removeClass('is-invalid'); }

        let correo = $('#correo');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.val())) {
            correo.addClass('is-invalid'); isValid = false;
        } else { correo.removeClass('is-invalid'); }

        let mensaje = $('#mensaje');
        if (mensaje.val().trim() === '') {
            mensaje.addClass('is-invalid'); isValid = false;
        } else { mensaje.removeClass('is-invalid'); }

        if (isValid) {
            $('#formSuccess').slideDown('fast').delay(3000).slideUp('fast');
            this.reset();
        }
    });

    // ==========================================
    // 3. CARRITO DE COMPRAS Y TOAST ALERT
    // ==========================================
    let cart = [];
    let total = 0;

    // Delegación de eventos para añadir al carrito
    $('#productGrid').off('click', '.btn-add-cart').on('click', '.btn-add-cart', function() {
        let productName = $(this).data('product');
        let price = parseFloat($(this).data('price'));
        
        cart.push({ name: productName, price: price });
        total += price;

        updateCartUI();

        // Mostrar Toast Alert (Retroalimentación visual)
        $('#toastMsg').text('Añadido: ' + productName);
        $('#toastAlert').slideDown('fast').delay(2000).fadeOut('fast');
    });

    // Actualizar UI del carrito (Prevención de XSS)
    function updateCartUI() {
        $('#cartCount').text(cart.length);
        $('#cartTotal').text(total);

        let $list = $('#cartList');
        $list.empty();

        if (cart.length === 0) {
            $list.append('<li class="list-group-item bg-dark text-muted border-secondary text-center">El carrito esta vacio.</li>');
        } else {
            cart.forEach((item) => {
                // 🛡️ Anti-XSS: Creamos nodos con .text() en lugar de concatenar HTML
                let $li = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center border-secondary bg-dark text-white');
                let $name = $('<span>').text(item.name);
                let $price = $('<span>').addClass('text-warning fw-bold').text(item.price + ' Bs');
                
                $li.append($name, $price);
                $list.append($li);
            });
        }
    }

    // Abrir Modal del Carrito
    $('#btnCart').off('click').on('click', function(e) {
        e.preventDefault();
        let cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    });

    // Pagar (Checkout)
    $('#btnCheckout').off('click').on('click', function() {
        if (cart.length === 0) {
            $('#toastMsg').text('El carrito está vacío.');
            $('#toastAlert').find('.bi').removeClass('bi-check-circle-fill').addClass('bi-exclamation-triangle-fill');
            $('#toastAlert').slideDown('fast').delay(2000).fadeOut('fast');
            return;
        }
        
        // Simular compra
        $('#toastAlert').find('.bi').removeClass('bi-check-circle-fill').addClass('bi-check-double');
        $('#toastMsg').text('¡Compra realizada con éxito!');
        $('#toastAlert').slideDown('fast').delay(3000).fadeOut('fast');
        
        // Vaciar carrito
        cart = [];
        total = 0;
        updateCartUI();
        
        // Cerrar modal
        bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
    });

});
