// 1. BANCO DE PALABRAS CON TUS IMÁGENES ESPECÍFICAS
const bancoPalabras = [
    {
        palabra: "MAMA",
        silabas: ["MA", "MA"],
        completa: "MAMÁ",
        imagen: "mimama.jpg" 
    },
    {
        palabra: "PAPA",
        silabas: ["PA", "PA"],
        completa: "PAPÁ",
        imagen: "mipapa.jpg" 
    },
    {
        palabra: "SAPO",
        silabas: ["SA", "PO"],
        completa: "SAPO",
        imagen: "sapo.jpg"
    },
    {
        palabra: "LUNA",
        silabas: ["LU", "NA"],
        completa: "LUNA",
        imagen: "luna.jpg"
    }
];

let indiceActual = 0;
let letrasCorrectas = 0;

const contenedorCasillas = document.getElementById('contenedor-casillas');
const contenedorLetras = document.getElementById('contenedor-letras');
const imagenAyuda = document.getElementById('dibujo-ayuda');
const flecha = document.getElementById('flechaLectora');
const sonidoAplausos = new Audio("https://google.com");

// 2. LISTA DE USUARIOS AUTORIZADOS
const listaUsuarios = [
    { usuario: "naomi", clave: "naomi01" },
    { usuario: "diego", clave: "diego01" },
    { usuario: "lucas", clave: "niño5" },
    { usuario: "invitado", clave: "1234" }
];

// Revisa si el niño ya había entrado antes
function verificarSesionGuardada() {
    const usuarioGuardado = localStorage.getItem("usuarioABC");
    
    if (usuarioGuardado) {
        document.getElementById("pantalla-login").style.display = "none";
        document.getElementById("interfaz-juego").style.display = "block";
        cargarPalabra();
        setTimeout(() => {
            decirVoz("¡Hola de nuevo " + usuarioGuardado + "! Vamos a jugar.");
        }, 500);
    } else {
        document.getElementById("pantalla-login").style.display = "flex";
    }
}

function validarIngreso() {
    const usuarioIngresado = document.getElementById("usuario-input").value.trim().toLowerCase();
    const claveIngresada = document.getElementById("clave-input").value.trim();
    const mensajeError = document.getElementById("mensaje-error");

    const usuarioEncontrado = listaUsuarios.find(u => u.usuario === usuarioIngresado && u.clave === claveIngresada);

    if (usuarioEncontrado) {
        localStorage.setItem("usuarioABC", usuarioIngresado);
        document.getElementById("pantalla-login").style.display = "none";
        document.getElementById("interfaz-juego").style.display = "block";
        cargarPalabra();
        decirVoz("¡Hola " + usuarioIngresado + "! ¡Vamos a jugar!");
    } else {
        mensajeError.style.display = "block";
        decirVoz("Datos incorrectos. Inténtalo otra vez.");
    }
}

// 3. LÓGICA DEL JUEGO
function cargarPalabra() {
    letrasCorrectas = 0;
    flecha.className = "flecha-oculta";
    contenedorCasillas.innerHTML = "";
    contenedorLetras.innerHTML = "";
    
    let datosActuales = bancoPalabras[indiceActual];
    imagenAyuda.src = datosActuales.imagen;

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

    datos.silabas.forEach((silaba) => {
        setTimeout(() => {
            decirVoz(silaba);
        }, tiempo);
        tiempo += 1200;
    });

    setTimeout(() => {
        decirVoz("¡" + datos.completa + "!");
        sonidoAplausos.play();
        
        indiceActual++;
        if (indiceActual >= bancoPalabras.length) {
            indiceActual = 0; 
        }
        
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

// 4. FUNCIONES DE CERRAR SESIÓN Y REGISTRAR HIJO
function cerrarSesion() {
    localStorage.removeItem("usuarioABC");
    decirVoz("¡Adiós! Vuelve pronto.");
    document.getElementById("interfaz-juego").style.display = "none";
    document.getElementById("pantalla-login").style.display = "flex";
    document.getElementById("usuario-input").value = "";
    document.getElementById("clave-input").value = "";
    document.getElementById("mensaje-error").style.display = "none";
}

function solicitarRegistro() {
    alert("👋 ¡Hola papá o mamá!\n\nPara registrar a tu hijo y asignarle un usuario único, por favor envíame un mensaje por WhatsApp o correo diciendo el nombre de tu pequeño. ¡Yo lo activaré de inmediato!");
}

// AL CARGAR LA PÁGINA: Arranca la revisión de la memoria
window.onload = verificarSesionGuardada;
