
var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var dinoPosX = 42;
var dinoPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280/3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var contenedor;
var dino;
var textoScore;
var suelo;
var gameOver;

function Init(){
    time=new Date();
    Start();
    Loop();
}

function Loop(){
    deltaTime= (new Date() - time)/1000;
    time=new Date();
    Update()
    requestAnimationFrame (Loop);
}

function Start(){
    gameOver = document.querySelector(".game.over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
}

function HandleKeyDown(ev){
    if(ev.keyCode ==32){
        saltar();
    }
}

function saltar(){
    if(dinoPosY === sueloY){
        saltando=true;
        velY=impulso;
        dino.classList.remove("dino-corriendo");
    }
}

function Update(){

    if(parado) return;

    moverSuelo();
    moverDinosaurio();
    decidirCrearObstaculos();
    moverObstaculos();
    detectarColision();

    velY -= gravedad * deltaTime;
}

function moverSuelo(){
    sueloX += calcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function calcularDesplazamiento(){
    return velEscenario * deltaTime * gameVel;
}

function moverDinosaurio(){
    dinoPosY += velY * deltaTime;
    if(dinoPosY < sueloY){
        tocarSuelo();
    }
    dino.style.bottom = dinoPosY+"px";
}

function tocarSuelo(){
    dinoPosY = sueloY;
    velY = 0;
    if(saltando){
        dino.classList.add("dino-corriendo");
    }
    saltando=false;
}

function decidirCrearObstaculos(){
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <=0){
        crearObstaculo();
    }
}

function crearObstaculo(){
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("obstaculo");
    obstaculo.posX=contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin)/gameVel;
}

function moverObstaculos(){
    for(var i = obstaculos.length - 1; i >= 0; i--){
        if (obstaculos[i].posX < -obstaculos[i].clientWidth){
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i,1);
            ganarPuntos();
        }else{
            obstaculos[i].posX -= calcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function ganarPuntos(){
    score++;
    textoScore.innerText = score;
}

function detectarColision(){
    for(var i = 0; i < obstaculos.length; i++){
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth){
            break;
        }else{
            if(IsCollision(dino, obstaculos[i], 10, 30, 15, 20)){
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft){
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top))||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}

function GameOver(){
    estrellarse();
    gameOver.style.display = "block";
}

function estrellarse(){
    dino.classList.remove("dino-corriendo");
    dino.classList.add("dino-estrelllado");
    parado = true; 
}




