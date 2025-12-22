import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// TU CONFIGURACIÓN REAL DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAen72yZmcxLW_PoqkOsuG0RTgBGF7O61g",
  authDomain: "musicologiastore.firebaseapp.com",
  databaseURL: "https://musicologiastore-default-rtdb.firebaseio.com",
  projectId: "musicologiastore",
  storageBucket: "musicologiastore.firebasestorage.app",
  messagingSenderId: "43587604396",
  appId: "1:43587604396:web:4da021dad824c3a2503409",
  measurementId: "G-D2SWD6KZF9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const productosRef = ref(db, 'productos');

const TELEFONO = "18292693105";
const CLAVE_ADMIN = "05050801"; // <--- Cambia esta clave si quieres otra
let esAdmin = false;

// FUNCIONES GLOBALES PARA EL HTML
window.accesoAdmin = function() {
    const pass = prompt("Introduce la clave de vendedor:");
    if (pass === CLAVE_ADMIN) {
        esAdmin = true;
        document.getElementById('seccion-admin').classList.remove('oculto');
        document.getElementById('btn-admin-acceso').classList.add('oculto');
        document.getElementById('btn-cerrar-sesion').classList.remove('oculto');
        renderizar(); // Volver a dibujar para mostrar botones de borrar
    } else {
        alert("Clave incorrecta. Solo el dueño puede publicar.");
    }
};

window.cerrarSesion = function() {
    esAdmin = false;
    document.getElementById('seccion-admin').classList.add('oculto');
    document.getElementById('btn-admin-acceso').classList.remove('oculto');
    document.getElementById('btn-cerrar-sesion').classList.add('oculto');
    renderizar();
};

// PUBLICAR PRODUCTO
const form = document.getElementById('formulario-producto');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevoProducto = {
        img: document.getElementById('input-url').value,
        nombre: document.getElementById('input-nombre').value,
        desc: document.getElementById('input-desc').value,
        precio: document.getElementById('input-precio').value
    };
    
    push(productosRef, nuevoProducto);
    form.reset();
    alert("¡Producto publicado y guardado en la nube!");
});

// RENDERIZAR (LEER DATOS EN TIEMPO REAL)
function renderizar() {
    onValue(productosRef, (snapshot) => {
        const contenedor = document.getElementById('contenedor-productos');
        contenedor.innerHTML = "";
        const data = snapshot.val();
        
        if (!data) {
            contenedor.innerHTML = "<p style='text-align:center; width:100%'>No hay productos disponibles.</p>";
            return;
        }

        Object.keys(data).forEach(id => {
            const prod = data[id];
            const mensajeWa = encodeURIComponent(`Hola MusicologiaStore, me interesa: ${prod.nombre} ($${prod.precio})`);
            const linkWa = `https://wa.me/${TELEFONO}?text=${mensajeWa}`;

            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <img src="${prod.img}" onerror="this.src='https://via.placeholder.com/300?text=Sin+Imagen'">
                <div class="info">
                    <h3>${prod.nombre}</h3>
                    <p>${prod.desc}</p>
                    <div class="precio">$${prod.precio}</div>
                    <a href="${linkWa}" target="_blank" class="btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> Comprar</a>
                    ${esAdmin ? `<button onclick="eliminarProducto('${id}')" class="btn-eliminar">Eliminar</button>` : ''}
                </div>
            `;
            contenedor.appendChild(div);
        });
    });
}

// ELIMINAR PRODUCTO
window.eliminarProducto = function(id) {
    if(confirm("¿Borrar este producto para siempre?")) {
        const itemRef = ref(db, `productos/${id}`);
        remove(itemRef);
    }
};

// Iniciar carga
renderizar();