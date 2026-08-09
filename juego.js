// 1. LISTA DE PALABRAS CON IMÁGENES DE INTERNET YA INCLUIDAS
const bancoPalabras = [
    {
        palabra: "MAMÁ",
        silabas: ["MA", "MÁ"],
        completa: "MAMÁ",
        // Imagen infantil de una mamá abrazando
        imagen: "mama.jpg" 
    },
    {
        palabra: "PAPÁ",
        silabas: ["PA", "PÁ"],
        completa: "PAPÁ",
        // Imagen infantil de un papá con su hijo
        imagen: "papa.jpg"
    },
    {
        palabra: "SAPO",
        silabas: ["SA", "PO"],
        completa: "SAPO",
        // Imagen de un sapito verde animado
        imagen: "https://freepik.com"
    },
    {
        palabra: "LUNA",
        silabas: ["LU", "NA"],
        completa: "LUNA",
        // Imagen de una luna sonriente con estrellas
        imagen: "https://freepik.com"
    }
];

let indiceActual = 0;
let letrasCorrectas = 0;

const contenedorCasillas = document.getElementById('contenedor-casillas');
const contenedorLetras = document.getElementById('contenedor-letras');
const imagenAyuda = document.getElementById('dibujo-ayuda');
const flecha = document.getElementById('flechaLectora');

// Creamos el sonido de aplausos directamente desde internet
const sonidoAplausos = new Audio("https://google.com");

function cargarPalabra() {
    letrasCorrectas = 0;
    flecha.className = "flecha-oculta";
    contenedorCasillas.innerHTML = "";
    contenedorLetras.innerHTML = "";
    
    let datosActuales = bancoPalabras[indiceActual];
    
    // Aquí se coloca la foto automáticamente en la pantalla
    imagenAyuda.src = datosActuales.imagen;

    // Crear casillas
    for (let i = 0; i < datosActuales.palabra.length; i++) {
        let casilla = document.createElement('div');
        casilla.className = "casilla";
        casilla.id = "casilla-" + i;
        casilla.setAttribute('data-esperado', datosActuales.palabra[i]);
        casilla.innerText = "?";
        
        casilla.addEventListener('dragover', (e) => e.preventDefault());
        casilla.addEventListener('drop', (e) => soltarLetra(e, casilla));
        
        contenedorCasillas.appendChild(casilla);
    }

    // Crear letras abajo mezcladas
    let letrasMezcladas = datosActuales.palabra.split('').sort(() => Math.random() - 0.5);
    
    letrasMezcladas.forEach((letra, index) => {
        let bloqueLetra = document.createElement('div');
        bloqueLetra.className = "letra";
        bloqueLetra.draggable = true;
        bloqueLetra.id = "letra-" + index;
        bloqueLetra.innerText = letra;
        
        bloqueLetra.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', e.target.innerText);
            e.dataTransfer.setData('id', e.target.id);
        });
        
        contenedorLetras.appendChild(bloqueLetra);
    });
}

function soltarLetra(e, casilla) {
    const letraArrastrada = e.dataTransfer.getData('text');
    const idArrastrado = e.dataTransfer.getData('id');
    const letraEsperada = casilla.getAttribute('data-esperado');

    if (letraArrastrada === letraEsperada && casilla.innerText === "?") {
        casilla.innerText = letraArrastrada;
        casilla.style.backgroundColor = "#9CFF2E";
        casilla.style.border = "5px solid #21922C";
        casilla.style.color = "#000000";
        
        document.getElementById(idArrastrado).style.visibility = 'hidden';
        decirVoz(letraArrastrada);
        letrasCorrectas++;

        if (letrasCorrectas === bancoPalabras[indiceActual].palabra.length) {
            flecha.className = "flecha-visible";
        }
    }
}

function leerPalabra() {
    let datos = bancoPalabras[indiceActual];
    let tiempo = 0;

    // 1. Lee las sílabas despacio
    datos.silabas.forEach((silaba) => {
        setTimeout(() => {
            decirVoz(silaba);
        }, tiempo);
        tiempo += 1200;
    });

    // 2. Dice la palabra completa y suenan los aplausos
    setTimeout(() => {
        decirVoz("¡" + datos.completa + "!");
        
        // ¡Aquí suenan los aplausos!
        sonidoAplausos.play();
        
        indiceActual++;
        if (indiceActual >= bancoPalabras.length) {
            indiceActual = 0; 
        }
        
        // Espera 3 segundos celebrando antes de pasar al siguiente dibujo
        setTimeout(() => {
            cargarPalabra();
        }, 3000);

    }, tiempo);
}

function decirVoz(texto) {
    const lectura = new SpeechSynthesisUtterance(texto);
    lectura.lang = 'es-ES';
    lectura.rate = 0.8;
    window.speechSynthesis.speak(lectura);
}

function reiniciarJuego() {
    indiceActual = 0;
    cargarPalabra();
}

window.onload = cargarPalabra;
// --- SISTEMA DE MÚLTIPLES USUARIOS Y CONTRASEÑAS ---

// Aquí creas la lista de todos los niños autorizados. ¡Añade los que quieras!
const listaUsuarios = [
    { usuario: "naomi", clave: "naomi01" },
    { usuario: "ian", clave: "ian01" },
    { usuario: "diego", clave: "diego01" },
    { usuario: "rihna", clave: "rihna01" },
    { usuario: "chritopher", clave: "chritopher01" },
    { usuario: "oscar", clave: "oscar01" },
    { usuario: "douglas", clave: "douglas01" },
    { usuario: "harley", clave: "harley01" },
    { usuario: "invitado", clave: "1234" }
];

function validarIngreso() {
    // Convertimos a minúsculas por si el niño escribe con mayúsculas por error
    const usuarioIngresado = document.getElementById("usuario-input").value.trim().toLowerCase();
    const claveIngresada = document.getElementById("clave-input").value.trim();
    const mensajeError = document.getElementById("mensaje-error");

    // Buscamos si los datos ingresados coinciden con alguien de nuestra lista
    const usuarioEncontrado = listaUsuarios.find(u => u.usuario === usuarioIngresado && u.clave === claveIngresada);

    if (usuarioEncontrado) {
        // ¡Éxito! Escondemos la pantalla de login y activamos el juego
        document.getElementById("pantalla-login").style.display = "none";
        document.getElementById("interfaz-juego").style.display = "block";
        
        // El juego saluda al niño por su propio nombre
        decirVoz("¡Hola " + usuarioIngresado + "! Bienvenido a ABC Kids. ¡Vamos a jugar!");
    } else {
        // Si no existe o la clave está mal, muestra el error en rojo
        mensajeError.style.display = "block";
        decirVoz("Usuario o contraseña incorrectos. Inténtalo otra vez.");
    }
}
