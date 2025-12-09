// ================= CONFIGURACIÓN =================
// Pon tu número con código de país (ej: 1809... para RD, 52... para MX, etc)
// Sin el signo de más (+)
const telefonoVendedor = "18292693105"; 

// ================= VARIABLES DEL SISTEMA =================
const formulario = document.getElementById('formulario-producto');
const contenedor = document.getElementById('contenedor-productos');
const btnAdmin = document.getElementById('btn-admin');
const seccionAdmin = document.getElementById('seccion-admin');

// Array para guardar productos
let inventario = [];

// ================= EVENTOS =================

// 1. Cuando la página carga, leer lo guardado
document.addEventListener('DOMContentLoaded', () => {
    // Intentar leer del navegador
    const guardados = localStorage.getItem('mis_accesorios');
    if (guardados) {
        inventario = JSON.parse(guardados);
        mostrarProductos();
    }
});

// 2. Botón para mostrar/ocultar el panel de vendedor
btnAdmin.addEventListener('click', () => {
    seccionAdmin.classList.toggle('oculto');
});

// 3. Función: PUBLICAR (Agregar producto)
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que se recargue la página

    // Capturar datos de los inputs
    const nuevoProducto = {
        id: Date.now(), // Crea un ID único basado en la hora
        img: document.getElementById('input-url').value,
        nombre: document.getElementById('input-nombre').value,
        desc: document.getElementById('input-desc').value,
        precio: document.getElementById('input-precio').value
    };

    // Agregar al inventario
    inventario.push(nuevoProducto);

    // Guardar en memoria del navegador
    guardarEnNavegador();

    // Limpiar formulario y repintar la pantalla
    formulario.reset();
    mostrarProductos();
    alert("¡Producto publicado correctamente!");
});

// ================= FUNCIONES LÓGICAS =================

function guardarEnNavegador() {
    localStorage.setItem('mis_accesorios', JSON.stringify(inventario));
}

// Función que dibuja el HTML de las tarjetas
function mostrarProductos() {
    contenedor.innerHTML = ''; // Limpiar contenedor

    inventario.forEach(producto => {
        // Crear mensaje personalizado para WhatsApp
        const mensaje = `Hola, me interesa el accesorio "${producto.nombre}" que cuesta $${producto.precio}. ¿Está disponible?`;
        // Crear enlace de WhatsApp
        const linkWhatsApp = `https://wa.me/${telefonoVendedor}?text=${encodeURIComponent(mensaje)}`;

        // Crear el HTML de la tarjeta
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('card');
        
        tarjeta.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/300?text=Sin+Imagen'">
            <div class="info">
                <h3>${producto.nombre}</h3>
                <p>${producto.desc}</p>
                <div class="precio">$${producto.precio}</div>
                
                <a href="${linkWhatsApp}" target="_blank" class="btn-whatsapp">
                    <i class="fa-brands fa-whatsapp"></i> Comprar / Preguntar
                </a>

                <button onclick="eliminarProducto(${producto.id})" class="btn-eliminar">
                    <i class="fa-solid fa-trash"></i> Eliminar publicación
                </button>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}

// Función para borrar un producto
window.eliminarProducto = (id) => {
    let confirmar = confirm("¿Seguro que quieres borrar este producto?");
    if (confirmar) {
        // Filtrar el inventario para quitar el que coincida con el ID
        inventario = inventario.filter(p => p.id !== id);
        guardarEnNavegador();
        mostrarProductos();
    }
}