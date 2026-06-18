let juegos = [];

let juegosMostrados =  [];

async function cargarCSV() {
    
    const respuesta = await fetch("data/juegos.csv");
    const texto = await respuesta.text();

    const filas = texto.split("\n");

    juegos = [];

    for (let i = 1; i < filas.length; i++) {

        const fila = filas[i].trim();

        if (!fila) continue;

        const datos = fila.split(";");

        const juego = {

            titulo: datos[0],
            observaciones: datos[1],
            plataforma: datos[2],
            terminado: datos[3],
            completado: datos[4],
            platino: datos[5],
            genero: datos[6],
            formato: datos[7],
            precio: datos[8],
            origen: datos[9]

    };

    juegos.push(juego);
    
}

console.log("Juegos cargados:", juegos.length);

console.log(juegos);

mostrarJuegos(juegos);

actualizarEstadisticas(juegos);

actualizarContador(juegos.length);

cargarFiltros();

function actualizarEstadisticas(juegos) {

    const total = juegos.length;

    const terminados = juegos.filter(
        juego => juego.terminado === "SI"
    ).length;

    const completados = juegos.filter(
        juego => juego.completado === "SI"
    ).length;

document.getElementById("total-games").textContent = total;

document.getElementById("completed-games").textContent = terminados;

document.getElementById("fully-completed-games").textContent = completados;
    
}

}

function actualizarContador(mostrados) {
    
    const contador = document.getElementById("results-counter");

    contador.textContent =

        `Mostrando ${mostrados} de ${juegos.length} juegos`;
}

function cargarFiltros () {

    const plataformaSelect = document.getElementById("platform-filter");

    const generoSelect = document.getElementById("genre-filter");

    const formatoSelect = document.getElementById("format-filter");

    const plataformas = [
        ...new Set(
            juegos.map(juego => juego.plataforma)
        )
    ];

    const generos = [
        ... new Set(
            juegos.map(juego => juego.genero)
        )
    ];

    const formatos = [
        ... new Set(
            juegos.map(juego => juego.formato)
        )
    ];

    plataformas.sort();
    generos.sort();
    formatos.sort();

    plataformas.forEach(plataforma => {

        plataformaSelect.innerHTML += `
            <option value="${plataforma}">
                ${plataforma}
            </option>
        `;
    });

    generos.forEach(genero => {

        generoSelect.innerHTML += `
            <option value="${genero}">
                ${genero}
            </option>
        `;

    });

    formatos.forEach(formato => {

        formatoSelect.innerHTML += `
            <option value="${formato}">
                ${formato}
            </option>
        `;

    });

}

function aplicarFiltros() {

    const textoBusqueda =
        document.getElementById("search-input")
        .value
        .toLowerCase();

    const plataforma =
        document.getElementById("platform-filter")
        .value;

    const genero =
        document.getElementById("genre-filter")
        .value;
    
    const formato =
        document.getElementById("format-filter")
        .value;

    const terminado =
        document.getElementById("finished-filter")
        .value;

    const resultado = juegos.filter(juego => {

        const coincideTexto =
            juego.titulo
                .toLowerCase()
                .includes(textoBusqueda);

        const coincidePlataforma =
            !plataforma ||
            juego.plataforma === plataforma;

        const coincideGenero =
            !genero ||
            juego.genero === genero;

        const coincideFormato =
            !formato ||
            juego.formato === formato;

        const coincideTerminado =
            !terminado ||
            juego.terminado === terminado;

        return (
            coincideTexto &&
            coincidePlataforma &&
            coincideGenero &&
            coincideFormato &&
            coincideTerminado
        );
    });

    mostrarJuegos(resultado);

    actualizarContador(resultado.length);

}

function mostrarJuegos(juegos) {

    juegosMostrados = juegos;
    
    const contenedor = document.getElementById("games-container");

    contenedor.innerHTML = "";

    juegos.forEach((juego, index) => {

        contenedor.innerHTML += `
            <div class="game-card" onclick="mostrarFicha(${index})">
                <h3>${juego.titulo}</h3>
                <p>${juego.plataforma}</p>
                <p>${juego.genero}</p>
            </div>
        `;
        
    });
}

function mostrarFicha(index) {
    
    const juego = juegosMostrados[index];

    const modal = document.getElementById("game-modal");

    const body = document.getElementById("modal-body");

    body.innerHTML = `
        <h2>${juego.titulo}</h2>

        <div class="info-group">
            <div class="info-label">🎮 Plataforma</div>
           <span class="badge">${juego.plataforma}</span>
        </div>

        <div class="info-group">
            <div class="info-label">🏷 Género</div>
           <span class="badge">${juego.genero}</span>
        </div>

        <div class="info-group">
            <div class="info-label">💿 Formato</div>
           <span class="badge">${juego.formato}</span>
        </div>

        <div class="info-group">
            <div class="info-label">💰 Precio</div>
           <span class="badge">${juego.precio}</span>
        </div>

        <div class="info-group">
            <div class="info-label">📦 Origen</div>
           <span class="badge">${juego.origen}</span>
        </div>

        <div class="info-group">
            <div class="info-label">Estado</div>
        
            <span class="badge ${juego.terminado === 'SI' ? 'badge-success' : 'badge-danger'}">
                ${juego.terminado === 'SI' ? '✅ Terminado' : '❌ No terminado'}
            </span>

            <span class="badge ${juego.completado === 'SI' ? 'badge-success' : 'badge-warning'}">
                ${juego.completado === 'SI' ? '🏆 Completado' : '⌛ Pendiente'}
            </span>
        </div>

        <hr>

        <div class="info-group">
            <div class="info-label">📋 Observaciones</div>

            <p>
                ${juego.observaciones || "Sin Observaciones"}
            </p>
        </div>

    `;

    modal.style.display = "flex";
}

cargarCSV();

const buscador = document.getElementById("search-input");

buscador.addEventListener("input", aplicarFiltros);

document.getElementById("platform-filter")
    .addEventListener("change", aplicarFiltros);

document.getElementById("genre-filter")
    .addEventListener("change", aplicarFiltros);

document.getElementById("format-filter")
    .addEventListener("change", aplicarFiltros);
    
document.getElementById("finished-filter")
    .addEventListener("change", aplicarFiltros);    

window.addEventListener("DOMContentLoaded", () => {

    document.getElementById("close-modal")
        .addEventListener("click", () => {

            document.getElementById("game-modal")
                .style.display = "none";

        });        

});

window.addEventListener("click",(evento) => {

    const modal =
        document.getElementById("game-modal");

    if (evento.target === modal) {

        modal.style.display = "none";

    }

});