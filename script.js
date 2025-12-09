document.addEventListener('DOMContentLoaded', () => {
    // ================= CONFIGURACIÓN =================
    // CAMBIA ESTO POR TU NÚMERO (Sin el +)
    const telefonoVendedor = "18090000000"; 

    // ================= VARIABLES DEL SISTEMA =================
    const formulario = document.getElementById('formulario-producto');
    const contenedor = document.getElementById('contenedor-productos');
    const btnAdmin = document.getElementById('btn-admin');
    const seccionAdmin = document.getElementById('seccion-admin');

    // Verificación de seguridad (Para ver si el HTML está bien conectado)
    if (!btnAdmin || !seccionAdmin) {
        console.error("Error: No se encontraron los elementos HTML. Revisa los IDs en el index.html");
        return;
    }

    // Array para guardar productos
    let inventario = [];

    // ================= INICIO =================
    // Cargar productos guardados
    const guardados = localStorage.getItem('mis_accesorios');
    if (guardados) {
        try {
            inventario = JSON.parse(guardados);
            mostrarProductos();
        } catch (e) {
            console.error("Error al leer datos guardados", e);
        }
    }

    // ================= EVENTOS =================

    // 1. Botón para mostrar/ocultar el panel de vendedor
    btnAdmin.addEventListener('click', (e) => {
        e.preventDefault(); // Prevenir cualquier comportamiento extraño
        seccionAdmin.classList.toggle('oculto');
        console.log("Botón presionado, clase 'oculto' alternada.");
    });

    // 2. Función: PUBLICAR (Agregar producto)
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const urlInput = document.getElementById('input-url');
            const nombreInput = document.getElementById('input-nombre');
            const descInput = document.getElementById('input-desc');
            const precioInput = document.getElementById('input-precio');

            const nuevoProducto = {
                id: Date.now(),
                img: urlInput.value,
                nombre: nombreInput.value,
                desc: descInput.value,
                precio: precioInput.value
            };

            inventario.push(nuevoProducto);
            guardarEnNavegador();
            
            formulario.reset();
            mostrarProductos();
            alert("¡Producto publicado correctamente!");
        });
    }

    // ================= FUNCIONES LÓGICAS =================

    function guardarEnNavegador() {
        localStorage.setItem('mis_accesorios', JSON.stringify(inventario));
    }

    function mostrarProductos() {
        contenedor.innerHTML = ''; 

        if (inventario.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; width:100%;">No hay productos publicados aún.</p>';
            return;
        }

        inventario.forEach(producto => {
            const mensaje = `Hola, me interesa el accesorio "${producto.nombre}" que cuesta $${producto.precio}. ¿Está disponible?`;
            const linkWhatsApp = `https://wa.me/${telefonoVendedor}?text=${encodeURIComponent(mensaje)}`;

            const tarjeta = document.createElement('div');
            tarjeta.classList.add('card');
            
            tarjeta.innerHTML = `
                <img src="${producto.img}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/300?text=Sin+Imagen'">
                <div class="info">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.desc}</p>
                    <div class="precio">$${producto.precio}</div>
                    
                    <a href="${linkWhatsApp}" target="_blank" class="btn-whatsapp">
                        <i class="fa-brands fa-whatsapp"></i> Comprar
                    </a>

                    <button class="btn-eliminar" data-id="${producto.id}">
                        <i class="fa-solid fa-trash"></i> Eliminar
                    </button>
                </div>
            `;

            contenedor.appendChild(tarjeta);
        });

        // Agregar eventos a los botones de eliminar dinámicamente
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idEliminar = Number(e.target.closest('button').dataset.id);
                eliminarProducto(idEliminar);
            });
        });
    }

    function eliminarProducto(id) {
        let confirmar = confirm("¿Seguro que quieres borrar este producto?");
        if (confirmar) {
            inventario = inventario.filter(p => p.id !== id);
            guardarEnNavegador();
            mostrarProductos();
        }
    }
});
```

### 2. Verificación del HTML (`index.html`)
Asegúrate de que tus IDs sean **exactamente** estos. Si en tu HTML dice `id="btnAdmin"` (sin guion) y en el JS dice `id="btn-admin"`, no funcionará.

Pega esto en tu `index.html` para estar seguro:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tienda de Música</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <header>
        <div class="logo">
            <i class="fa-solid fa-guitar"></i> MusicStore
        </div>
        <!-- OJO: El ID debe ser btn-admin -->
        <button id="btn-admin" class="btn-admin">
            <i class="fa-solid fa-user-gear"></i> Área de Vendedor
        </button>
    </header>

    <!-- OJO: El ID debe ser seccion-admin y tener la clase oculto -->
    <section id="seccion-admin" class="admin-container oculto">
        <div class="form-wrapper">
            <h2>Publicar Nuevo Accesorio</h2>
            <form id="formulario-producto">
                <input type="text" id="input-url" placeholder="URL de la imagen" required>
                <input type="text" id="input-nombre" placeholder="Nombre del producto" required>
                <input type="text" id="input-desc" placeholder="Descripción breve" required>
                <input type="number" id="input-precio" placeholder="Precio ($)" required>
                <button type="submit" class="btn-publicar">Publicar ahora</button>
            </form>
        </div>
    </section>

    <main>
        <h1>Accesorios Disponibles</h1>
        <div id="contenedor-productos" class="grid-productos"></div>
    </main>

    <script src="script.js"></script>
</body>
</html>
