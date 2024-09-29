// Variables globales
let archivoSeleccionado = 'peliculas.json'; // Almacena el archivo JSON seleccionado
const selectTipo = document.getElementById('tipo');
const inputBusqueda = document.getElementById('busqueda');
const btnBuscar = document.getElementById('buscarBtn');
const listaResultados = document.getElementById('resultados');

// Escuchador para cuando el usuario cambie entre películas y series
selectTipo.addEventListener('change', function () {
    archivoSeleccionado = selectTipo.value + '.json';

    // Disparar un evento personalizado para notificar sobre el cambio
    const eventoCambioArchivo = new CustomEvent('archivoCambiado', {
        detail: { archivo: archivoSeleccionado }
    });
    document.dispatchEvent(eventoCambioArchivo);
});

// Evento personalizado para mostrar un mensaje cuando cambia el archivo base
document.addEventListener('archivoCambiado', function (e) {
    alert(`El archivo de base ahora es: ${e.detail.archivo}`);
});

// Prevenir que se ingresen caracteres inválidos en el input
inputBusqueda.addEventListener('keydown', function (e) {
    const codigoTecla = e.keyCode;

    // Solo permitir letras, espacios y la tecla borrar
    if (
        (codigoTecla >= 65 && codigoTecla <= 90) || // Letras
        codigoTecla === 32 || // Espacio
        codigoTecla === 8 // Borrar
    ) {
        return true;
    } else {
        e.preventDefault(); // Prevenir cualquier otra tecla
    }
});

// Evento click del botón Buscar
btnBuscar.addEventListener('click', function () {
    // Obtener el término de búsqueda y asegurarse de que esté en mayúsculas
    const terminoBusqueda = inputBusqueda.value.toUpperCase();

    if (terminoBusqueda) {
        // Obtener el archivo JSON correspondiente
        fetch(archivoSeleccionado)
            .then(response => response.json())
            .then(datos => realizarBusqueda(datos.data, terminoBusqueda));
    } else {
        alert('Por favor, ingrese un término de búsqueda.');
    }
});

// Función para realizar la búsqueda dentro del archivo JSON
function realizarBusqueda(datos, termino) {
    // Limpiar los resultados anteriores
    listaResultados.innerHTML = '';

    // Recorrer los datos del archivo JSON
    datos.forEach(elemento => {
        // Verificar si el nombre del elemento comienza con el término de búsqueda
        if (elemento.nombre.startsWith(termino)) {
            // Crear el elemento <li> con el título y la sinopsis
            const li = document.createElement('li');
            li.textContent = elemento.nombre;

            const p = document.createElement('p');
            p.textContent = elemento.sinopsis;

            li.appendChild(p);
            listaResultados.appendChild(li);

            // Mostrar la sinopsis solo cuando se pase el mouse por encima
            li.addEventListener('mouseover', function () {
                p.style.display = 'block';
            });

            li.addEventListener('mouseout', function () {
                p.style.display = 'none';
            });
        }
    });

    // Si no hay coincidencias, mostrar un mensaje
    if (listaResultados.innerHTML === '') {
        listaResultados.innerHTML = '<li>No se encontraron resultados.</li>';
    }
}
