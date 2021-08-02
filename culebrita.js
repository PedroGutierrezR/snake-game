/**CONSTANTES**/

let DIRECCIONES = {
    ARRIBA: 1,
    ABAJO: 2,
    IZQUIERDA: 3,
    DERECHA: 4
}
//CONTANTE VELOCIDAD DEL JUEGO
let FPS = 1000 / 15;

//CONSTANTE PARA DIBUJAR EN EL CANVAS
let JUEGO_CANVAS = document.getElementById("juegoCanvas");
let CTX = JUEGO_CANVAS.getContext("2d");

//CONSTANTE PARA AGREGARLE LA ANIMACIÓN DEL SHAKE
let CONTENEDOR_NINTENDO = document.getElementById("contenedorNintendo");

//CONSTANTE PARA MOSTRAR LOS PUNTOS CUANDO LA CULEBRA COME
let PUNTOS_TEXTO = document.getElementById("puntos");

//CONSTANTES PARA SACAR TITULO Y DIFICULTAD AL ROTAR EL TELEFONO
let BANNER_ROTAR_TELEFONO = document.getElementById("bannerRotarTelefono");
let TITULO = document.getElementById("titulo");
let DIFICULTAD = document.getElementById("contenedorDificultad");
let BOTON_CERRAR_BANNER = document.getElementById("botonCerrarBanner");

//CONSTANTES PARA SONIDOS DEL JUEGO
let SONIDO_GANASTE_PUNTO = new Audio("comer.wav");
let SONIDO_MORISTE = new Audio("dolor.wav");

//CONSTANTES PARA BOTONES
let BUTTON_EASY = document.getElementById("easy");
let BUTTON_NORMAL = document.getElementById("normal");
let BUTTON_HARD = document.getElementById("hard");

//CONSTANTES PARA ACCEDER A LAS CLASES DEL CSS
let CSS_CLASE_SACUDIR_HORIZONTALMENTE = "shake-horizontal";
let CSS_CLASE_ESCONDER = "esconder";
let CSS_CLASE_CAMBIAR_COLOR_BOTON = "botonPresionado";


/**ESTADO DEL JUEGO**/

let culebra;
let direccionActual;
let nuevaDireccion;
let comida;
let ciclo;
let puntos;

//Estan declaradas las variables globales. Se inicializa el juego cuando llamamos a la funcion "empezar juego"

/**DIBUJAR**/

function rellenarCuadrado(context, posX, posY){
    context.beginPath();
    context.fillStyle = "#393640";
    context.fillRect(posX, posY, 20, 20);
    context.stroke();
}

function dibujarCulebra(context, culebra){
    for(let i = 0; i < culebra.length; i++){
        rellenarCuadrado(context, culebra[i].posX, culebra[i].posY);
    }
}
 
function dibujarComida(context, comida){
   rellenarCuadrado(context, comida.posX, comida.posY);
}

function dibujarParedes(context) {
    context.beginPath();
    context.lineWidth = "2";
    context.rect(20, 20, 560, 560);
    context.stroke();
}

function dibujarTexto(context, texto, x, y) {
    context.font = "28px Arial";
    context.textAlign = "center";
    context.fillStyle = "black";
    context.fillText(texto, x, y);
}

/**CULEBRA**/

function moverCulebra(direccion, culebra){
    let cabezaPosX = culebra[0].posX;
    let cabezaPosY = culebra[0].posY;

    if(direccion === DIRECCIONES.DERECHA){
        cabezaPosX += 20;
    } else if (direccion === DIRECCIONES.IZQUIERDA){
        cabezaPosX -= 20;
    } else if (direccion === DIRECCIONES.ABAJO){
        cabezaPosY += 20;
    } else if (direccion === DIRECCIONES.ARRIBA){
        cabezaPosY -= 20;
    }
    // Agregamos la nueva cabeza al principio de la lista
    culebra.unshift({posX: cabezaPosX, posY: cabezaPosY});
    // Borramos la cola de la culebra
   return culebra.pop(); //{posX, posY}
}

function culebraComioComida(culebra, comida) {
    return culebra[0].posX === comida.posX && culebra[0].posY === comida.posY;
}

/**COMIDA**/

function generarNuevaPosicionDeComida(culebra) {
    while (true){
        
        let columnaX = Math.max(Math.floor(Math.random() * 29), 1);
        let columnaY = Math.max(Math.floor(Math.random() * 29), 1);
        
        let posX = columnaX * 20;
        let posY = columnaY * 20;

        let colisionConCulebra = false;
        for (let i = 0; i < culebra.length; i++){
            if (culebra[i].posX === posX && culebra[i].posY === posY) {
                colisionConCulebra = true;
                break;
            }
        }

        if (colisionConCulebra === true) {
            continue;
        }

        return{posX: posX, posY: posY};
    }

}

/**COLISIONES**/

function ocurrioColision(culebra) {
    let cabeza = culebra[0];

    if (
        cabeza.posX < 20 ||
        cabeza.posY < 20 ||
        cabeza.posX === 580 ||
        cabeza.posY === 580
    ) {
        return true;
    }

    if (culebra.length === 1) {
        return false;
    }

    for (let i = 1; i < culebra.length; i++) {
        if (cabeza.posX === culebra[i].posX && cabeza.posY === culebra[i].posY) {
            return true;
       }
    }

    return false;
}

/**PUNTAJE**/
 
function mostrarPuntos(puntos) {
    PUNTOS_TEXTO.innerText = "PUNTOS: " + puntos;
}

function incrementarPuntaje() {
    puntos++;
    mostrarPuntos(puntos);
    SONIDO_GANASTE_PUNTO.play();
}

/**RESPONSIVE**/

window.addEventListener("orientationchange", function () {
    TITULO.classList.add(CSS_CLASE_ESCONDER);
    BANNER_ROTAR_TELEFONO.classList.remove(CSS_CLASE_ESCONDER);
    DIFICULTAD.classList.add(CSS_CLASE_ESCONDER);
});

BOTON_CERRAR_BANNER.addEventListener("click", function () {
    TITULO.classList.remove(CSS_CLASE_ESCONDER);
    BANNER_ROTAR_TELEFONO.classList.add(CSS_CLASE_ESCONDER);
    DIFICULTAD.classList.remove(CSS_CLASE_ESCONDER);  
})

/**CICLO DEL JUEGO**/

document.addEventListener("keydown", function(e){
    if(e.code === "ArrowUp" && direccionActual !== DIRECCIONES.ABAJO){
        nuevaDireccion = DIRECCIONES.ARRIBA;
    } else if(e.code === "ArrowDown" && direccionActual !== DIRECCIONES.ARRIBA){
        nuevaDireccion = DIRECCIONES.ABAJO;
    } else if(e.code === "ArrowLeft" && direccionActual !== DIRECCIONES.DERECHA){
        nuevaDireccion = DIRECCIONES.IZQUIERDA;
    } else if(e.code === "ArrowRight" &&direccionActual !== DIRECCIONES.IZQUIERDA){
        nuevaDireccion = DIRECCIONES.DERECHA;
    }
});

function cicloDeJuego(){
    let colaDescartada = moverCulebra(nuevaDireccion, culebra);
    direccionActual = nuevaDireccion;

    if (culebraComioComida(culebra, comida)) {
        culebra.push(colaDescartada);
        comida = generarNuevaPosicionDeComida(culebra);
        incrementarPuntaje();
    }

    if (ocurrioColision(culebra)) {
        gameOver();
        SONIDO_MORISTE.play();
        return;
    }

    CTX.clearRect(0, 0, 600, 600);
    dibujarParedes(CTX);
    dibujarCulebra(CTX, culebra);
    dibujarComida(CTX, comida);  
}

function gameOver() {
    clearInterval(ciclo);
    ciclo = undefined;
    dibujarTexto(CTX, "¡Fin del juego!", 300, 260);
    dibujarTexto(CTX, "¡Click o tecla espacio para volver a jugar!", 300, 310);
    CONTENEDOR_NINTENDO.classList.add(CSS_CLASE_SACUDIR_HORIZONTALMENTE);
}

function empezarJuego() {
    culebra = [
        {posX: 60, posY: 20},
        {posX: 40, posY: 20},
        {posX: 20, posY: 20},
    ];
     
    direccionActual = DIRECCIONES.DERECHA;
    nuevaDireccion = DIRECCIONES.DERECHA;
    
    comida = generarNuevaPosicionDeComida(culebra);
    puntos = 0;
    
    mostrarPuntos(puntos);

    CONTENEDOR_NINTENDO.classList.remove(CSS_CLASE_SACUDIR_HORIZONTALMENTE);

    ciclo = setInterval(cicloDeJuego, FPS);
    

}

dibujarParedes(CTX);
dibujarTexto(CTX, "¡Click o tecla espacio para empezar a jugar!", 300, 260);
dibujarTexto(CTX, " Desktop: Muévete con ← ↓ ↑ →", 300, 310);
dibujarTexto(CTX, " Móvil: Tap para girar la culebra", 300, 360);

JUEGO_CANVAS.addEventListener("click", function(){
    if (ciclo === undefined) {
        empezarJuego();
        return;
    }

    if (direccionActual === DIRECCIONES.ABAJO) {
        nuevaDireccion = DIRECCIONES.IZQUIERDA;
    } else if (direccionActual === DIRECCIONES.IZQUIERDA) {
        nuevaDireccion = DIRECCIONES.ARRIBA;
    } else if (direccionActual === DIRECCIONES.ARRIBA) {
        nuevaDireccion = DIRECCIONES.DERECHA;
    } else if (direccionActual === DIRECCIONES.DERECHA) {
        nuevaDireccion = DIRECCIONES.ABAJO;
    }
});

window.addEventListener("keydown", function(e) {
    if (ciclo === undefined && e.code === "Space") {
        empezarJuego();
    }
});

BUTTON_EASY.addEventListener("click", function() {
    FPS = 1000 / 9;
    BUTTON_EASY.classList.add(CSS_CLASE_CAMBIAR_COLOR_BOTON);
    BUTTON_NORMAL.classList.remove(CSS_CLASE_CAMBIAR_COLOR_BOTON);
    BUTTON_HARD.classList.remove(CSS_CLASE_CAMBIAR_COLOR_BOTON);
});
BUTTON_NORMAL.addEventListener("click", function() {
    FPS = 1000 / 15;
    BUTTON_NORMAL.classList.add(CSS_CLASE_CAMBIAR_COLOR_BOTON);
    BUTTON_EASY.classList.remove(CSS_CLASE_CAMBIAR_COLOR_BOTON);
    BUTTON_HARD.classList.remove(CSS_CLASE_CAMBIAR_COLOR_BOTON);

});
BUTTON_HARD.addEventListener("click", function() {
    FPS = 1000 / 21;
    BUTTON_HARD.classList.add(CSS_CLASE_CAMBIAR_COLOR_BOTON);
    BUTTON_EASY.classList.remove(CSS_CLASE_CAMBIAR_COLOR_BOTON);
    BUTTON_NORMAL.classList.remove(CSS_CLASE_CAMBIAR_COLOR_BOTON);
});
