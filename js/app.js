let juegos = [];

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

function mostrarJuegos(juegos) {
    
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

function buscarJuego(evento) {
    const textoBusqueda = evento.target.value.toLowerCase();

    const juegosFiltrados = juegos.filter(juego =>
        juego.titulo.toLowerCase().includes(textoBusqueda)
    );

    mostrarJuegos(juegosFiltrados);

    actualizarContador(juegosFiltrados.length);
}

function mostrarFicha(index) {
    
    const juego = juegos[index];

    const modal = document.getElementById("game-modal");

    const body = document.getElementById("modal-body");

    body.innerHTML = `
        <h2>${juego.titulo}</h2>

        <p><strong>Plataforma:</strong> ${juego.plataforma}</p>
        <p><strong>Género:</strong> ${juego.genero}</p>
        <p><strong>Terminado</strong> ${juego.terminado}</p>
        <p><strong>Completado:</strong> ${juego.completado}</p>
        <p><strong>Platino:</strong> ${juego.platino}</p>
        <p><strong>Formato:</strong> ${juego.formato}</p>
        <p><strong>Precio:</strong> ${juego.precio}</p>
        <p><strong>Origen:</strong> ${juego.origen}</p>

        <hr>

        <p>${juego.observaciones || "Sin observaciones"}</p>

    `;

    modal.style.display = "flex";
}

cargarCSV();

const buscador = document.getElementById("search-input");

buscador.addEventListener("input", buscarJuego);

document.getElementById("close-modal")
.addEventListener("click", () => {

    document.getElementById("game-modal")
    .style.display = "none";


});