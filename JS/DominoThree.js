/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 16/01/2019

        MAIN para el javascript

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 16/01/2019
*/

// Constructor
var DominoThree = function() {
    // Llamo al constructor del ObjetoBanner
    if (ObjetoCanvas.call(this, { 
        'Tipo'                      : 'THREE',
        'Ancho'                     : 'Auto',
        'Alto'                      : 'Auto',
        'Entorno'                   : 'Normal',
        'MostrarFPS'                : false,
        'BotonLogo'                 : false,
        'BotonPantallaCompleta'     : true,
        'ElementoRaiz'              : document.body,
        'Pausar'                    : false,             // Pausa el canvas si la pestaña no tiene el foco del teclado
        'ColorFondo'                : 0xFFFFFF,
        'CapturaEjemplo'            : ""                 // Captura de pantalla para el ejemplo a "NuevoCanvas2D.png" se le añadirá "https://devildrey33.es/Web/Graficos/250x200_"
    }) === false) { return false; }
    
    // Se ha creado el canvas, inicio los valores de la animación ... 
    this.Iniciar();
    
    // Esconde la ventana que informa al usuario de que se está cargando la animación. (REQUERIDO)
    this.Cargando(false);
};

DominoThree.prototype = Object.assign( Object.create(ObjetoCanvas.prototype) , {
    constructor     : DominoThree, 
    // Función que se llama al redimensionar el documento
    Redimensionar   : function() {    },
    // Función que se llama al hacer scroll en el documento    
    Scroll          : function() {    },
    // Función que se llama al mover el mouse por el canvas
    MouseMove       : function(Evento) { 
        this.MouseMovido = true;
        this.PosMouse.x = ( Evento.clientX / window.innerWidth ) * 2 - 1;
	this.PosMouse.y = - ( Evento.clientY / window.innerHeight ) * 2 + 1;

    },
    // Función que se llama al presionar un botón del mouse por el canvas
    MousePresionado : function(Evento) { },
    // Función que se llama al soltar un botón del mouse por el canvas
    MouseSoltado    : function(Evento) { 
        if (this.JugadorActual === 0 && this.Jugador.length > 0) {
            for (var i = 0; i < 7; i++) {
                if (this.Jugador[0][i].Hover === true) {
                    if (this.Colocar(this.Jugador[0][i]) === true) {
                        this.TurnoActual ++;
                        this.JugadorActual ++;
                    }
                }
            }
        }
    },
    // Función que se llama al entrar con el mouse en el canvas
    MouseEnter      : function(Evento) { },
    // Función que se llama al salir con el mouse del canvas
    MouseLeave      : function(Evento) { },
    // Función que se llama al presionar una tecla
    TeclaPresionada : function(Evento) { },
    // Función que se llama al soltar una tecla
    TeclaSoltada    : function(Evento) { },
    // Función que se llama al presionar la pantalla
    TouchStart      : function(Evento) { },
    // Función que se llama al soltar el dedo de la pantalla
    TouchEnd        : function(Evento) { },    
    // Función que se llama al pausar el banner
    Pausa           : function() { },
    // Función que se llama al reanudar el banner
    Reanudar        : function() { },
    // Función que inicia el ejemplo
    Iniciar         : function() {       
        // Activo el mapeado de sombras
        this.Context.shadowMap.enabled	= true;
        // Creo la escena
        this.Escena = new THREE.Scene();
        // Creo la camara
        this.Camara = new THREE.PerspectiveCamera(75, this.Ancho / this.Alto, 0.5, 1000);
        this.Camara.Rotacion = { Grados : 0, Avance : (Math.PI / 180) / 1.5, Distancia : 5, MirarHacia : new THREE.Vector3(0, 0, 0), Animacion : true };
        this.Camara.position.set(0, 10, this.Camara.Rotacion.Distancia);        
        
        // Función para que la cámara rote alrededor de la escena
        this.Camara.Rotar = function() {
            if (this.Rotacion.Animacion === true) {
                this.Rotacion.Grados += this.Rotacion.Avance;
                this.position.x = this.Rotacion.Distancia * Math.cos(this.Rotacion.Grados);
                this.position.z = this.Rotacion.Distancia * Math.sin(this.Rotacion.Grados);
                this.lookAt(this.Rotacion.MirarHacia); 
            }
        };
        this.Escena.add(this.Camara);
        this.Camara.lookAt(this.Camara.Rotacion.MirarHacia); 

        // Plano para el suelo
        this.Suelo = new THREE.Mesh(    new THREE.PlaneGeometry(300, 300), 
                                        new THREE.MeshPhongMaterial({ color: 0xaaccaa, specular : 0xddEEdd }));
        this.Suelo.rotation.x = -Math.PI / 2;
        this.Suelo.position.y = -0.2;
        //this.Suelo.position.x = -25;
        this.Suelo.position.z = 15;
        this.Suelo.castShadow = false;
        this.Suelo.receiveShadow = true;
        this.Escena.add(this.Suelo);
        
        // Inicio las texturas del domino
        Texturas.Iniciar();
        this.CrearFichas();

        this.CrearLuces();
//        this.Camara.Rotar();
    },
    
    CrearFichas : function() {
        if (typeof(this.Ficha) !== "undefined") {
            for (var i = 0; i< 28; i++) {
                this.Escena.remove(this.Ficha[i].Ficha);
            }
        }
        this.Ficha = [];
        // Creo las fichas ordenadas
        var Pos = [ -4.5, -5.0 ];
        for (var i = 0; i< 28; i++) {
            this.Ficha[i] = new Domino_Ficha();
            this.Ficha[i].Crear(i);
            this.Escena.add(this.Ficha[i].Ficha);
            this.Ficha[i].Ficha.position.set(Pos[0], 0.0, Pos[1]);
            Pos[0] += 1.5;
            if (Pos[0] > 5.0) {
                Pos[0] = -4.5;
                Pos[1] += 2.5;
            }            
        }        
    },
    
    CrearLuces : function() {
        // Luz direccional
        this.DirLight = new THREE.DirectionalLight( 0xfff1e0, 0.241 );
        this.DirLight.position.set( 0, 40, -30 ); //.normalize();
//        this.DirLight.position.multiplyScalar( 20 );
        this.DirLight.castShadow = true;
        this.DirLight.shadow.mapSize.width = 2048;
        this.DirLight.shadow.mapSize.height = 2048;
        var d = 40;
        this.DirLight.shadow.camera.left = -d;
        this.DirLight.shadow.camera.right = d;
        this.DirLight.shadow.camera.top = d;
        this.DirLight.shadow.camera.bottom = -d;
        this.DirLight.shadow.camera.far = 3500;
//        this.DirLight.target = this.Ficha.Ficha;
        this.Escena.add( this.DirLight );
        
        // Luz de ambiente  
        this.HemiLight = new THREE.HemisphereLight( 0xeeeeee, 0xffffff, 0.7 );
        this.HemiLight.color.setHSL( 0.6, 0.6, 0.6 );
        this.HemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        this.HemiLight.position.set( 0, 0, 0 );
        this.Escena.add( this.HemiLight );                 
    },
        
    // Mueve la luz al jugador especificado
    AnimarLuz       : function(NumJugador) {
        if (typeof(this.AniLuz) !== "undefined") {
            this.AniLuz.Terminar();
        }
        var PosX = 0;
        var PosZ = 0;
        switch (NumJugador) {
            case 0 :    // Abajo
                PosZ = -10;
                PosX = 0;
                break;
            case 1 :    // Derecha
                PosZ = -20;
                PosX = 30;
                break;
            case 2 :    // Arriba
                PosZ = -50;
                PosX = 0;
                break;
            case 3 :    // Izquierda
                PosZ = -20;
                PosX = -30;
                break;
        }
        
        this.AniLuz = Animaciones.CrearAnimacion([
                    { Paso : { PX : this.DirLight.position.x , PZ : this.DirLight.position.z  } },
                    { Paso : { PX : PosX,                      PZ : PosZ  }, Tiempo : 300, FuncionTiempo : FuncionesTiempo.Lineal }
            ], { FuncionActualizar : function(Valores) { 
                    this.DirLight.position.set(Valores.PX, 40, Valores.PZ);                    
                    //this.DirLight.needUpdate = true;
//                    this.DirLight.position.multiplyScalar( 20 );
            }.bind(this) });
        this.AniLuz.Iniciar();
    },
    
    Jugador          : [],
    JugadorActual    : 0,    // Jugador del turno actual
    TurnoActual      : 0, 
    RayCaster        : new THREE.Raycaster(),
    PosMouse         : new THREE.Vector2(),
    
    FichaIzquierda   : [], 
    FichaIzquierdaN  : 0, // Número de fichas que salen por la izquierda
    FichaDerecha     : [],
    FichaDerechaN    : 0, // Número de fichas que salen por la derecha
    
    PosibilidadesI   : [],
    PosibilidadesD   : [],
    Pasado           : 0,
    
    
    // Función que devuelve el jugador que empieza la partida
    JugadorInicio   : function() {
        // Miro que jugador empieza
        for (this.JugadorActual = 0; this.JugadorActual < 4; this.JugadorActual++) {
            for (j = 0; j < 7; j++) {
                if (this.Jugador[this.JugadorActual][j].Valores[0] === 6 && this.Jugador[this.JugadorActual][j].Valores[1] === 6) {
                    return this.JugadorActual;
                }
            }
        }        
    },
    
    Empezar         : function() {
        this.CrearFichas();
        
        document.getElementById("Empezar").style.display = "none";
        this.Jugador = [];
        this.Pasado = 0;
        
        // Mezclo el array de las fichas
        var j, x, i;
        for (i = this.Ficha.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = this.Ficha[i];
            this.Ficha[i] = this.Ficha[j];
            this.Ficha[j] = x;
        }
        
        // Reparto las fichas
        for (i = 0; i < 4; i ++) {
            this.Jugador[i] = [];
            for (j = 0; j < 7; j++) {
                this.Jugador[i][j] = this.Ficha[(i *7) + j];
                this.Jugador[i][j].Colocada = false;
            }
        }
        
        // Coloco las fichas del jugador 1 y 3
        for (i = 0; i < 7; i++) {
            this.Jugador[0][i].RotarV();
            this.Jugador[0][i].Ficha.position.set(-4.5 + (1.5 * i), 0, 5.5);
            this.Jugador[2][i].RotarV();
            this.Jugador[2][i].Ficha.position.set(-4.5 + (1.5 * i), 0, -12);
        }
        
        // Coloco las fichas del jugador 2 y 4
        for (i = 0; i < 7; i++) {
            this.Jugador[1][i].RotarH();
            this.Jugador[1][i].Ficha.position.set(13, 0, -6.5 + (1.5 * i));
            this.Jugador[3][i].RotarH();
            this.Jugador[3][i].Ficha.position.set(-13, 0, -6.5 + (1.5 * i));
        }
        
        // Miro que jugador empieza
        this.JugadorInicio();
        
        this.MostrarMensaje(this.JugadorActual, "Jugador " + (this.JugadorActual + 1) + " empieza.");
        
        this.TurnoActual = 0;        
        
        this.Turno();
    },
    
    
    ComprobarMouse  : function() {
        if (this.MouseMovido === false) return;
        if (typeof(this.Jugador[0]) === "undefined") return;
        
        this.RayCaster.setFromCamera(this.PosMouse, this.Camara);
        var intersects = this.RayCaster.intersectObjects( this.Escena.children, true );        
        var Hover = [ false, false, false, false, false, false, false ];
        
        
        // Compruebo si hay que hacer hover en alguna de las fichas del jugador 1
        for (var i = 0; i < intersects.length; i++ ) {
            for (var f = 0; f < 7; f++) {
                if (intersects[i].object === this.Jugador[0][f].Cara1 || intersects[i].object === this.Jugador[0][f].Cara2 || intersects[i].object === this.Jugador[0][f].Base) {
                    if (this.Jugador[0][f].Colocada === false)  Hover[f] = true;
                }
            }        
        }
        
        // Miro si hay algun cambio respecto los hovers
        for (var f = 0; f < 7; f++) {
            if (Hover[f] !== this.Jugador[0][f].Hover) {
                this.Jugador[0][f].AsignarHover(Hover[f]);
            }
        }
        
    },
    
    
    // Función que calcula el turno actual
    Turno           : function() {
        
        console.log("Turno : " + this.TurnoActual);
        
        this.AnimarLuz(this.JugadorActual);
        
        // En el primer turno se saca el doble 6
        if (this.TurnoActual === 0) {
            console.log("Jugador" + (this.JugadorActual + 1) + " empieza");
            for (var i = 0; i < 7; i ++) {
                if (this.Jugador[this.JugadorActual][i].Valores[0] === 6 && this.Jugador[this.JugadorActual][i].Valores[1] === 6) {
                    this.FichaDerecha   = this.Jugador[this.JugadorActual][i];
                    this.FichaIzquierda = this.Jugador[this.JugadorActual][i];                    
                    this.Colocar(this.Jugador[this.JugadorActual][i]);
                }
            }
            
        }
        else {            
            console.log("Izq: " + this.FichaIzquierda.ValorIzq() + " Der: " + this.FichaDerecha.ValorDer());            
            // Cuento las posibilidades para la izquierda y la derecha
            this.Posibilidades = [];
            for (var i = 0; i < 7; i++) {
                if (this.Jugador[this.JugadorActual][i].Colocada === false) {
                    if (this.Jugador[this.JugadorActual][i].Valores[0] === this.FichaIzquierda.ValorIzq() || this.Jugador[this.JugadorActual][i].Valores[1] === this.FichaIzquierda.ValorIzq()) {
                        this.Posibilidades.push(this.Jugador[this.JugadorActual][i]);
                    }
                    if (this.Jugador[this.JugadorActual][i].Valores[0] === this.FichaDerecha.ValorDer() || this.Jugador[this.JugadorActual][i].Valores[1] === this.FichaDerecha.ValorDer()) {
                        this.Posibilidades.push(this.Jugador[this.JugadorActual][i]);                        
                    }
                }
            }
            // Ordeno las posibilidades y dejo arriba las que tiene mas valor
            this.Posibilidades.sort(function(a, b){
                return (a.Valores[0] + a.Valores[1] > b.Valores[0] + b.Valores[1]) ? a : b;
            });
            
            // Si tiene posibilidades
            if (this.Posibilidades.length > 0)  {
                this.Pasado = 0;

                // Turno de la máquina
                if (this.JugadorActual !== 0) {
                    // IA 1.0
                    var Rnd = 0;//RandInt(this.Posibilidades.length -1, 0);
                    this.Colocar(this.Posibilidades[Rnd]);
                    console.log("Jugador" + (this.JugadorActual + 1) + " tira : " + this.Posibilidades[Rnd].Valores[0] + " | " + this.Posibilidades[Rnd].Valores[1]);
                }
                // Turno del jugador
                else {
                    this.MostrarMensaje(this.JugadorActual, "Tu turno");
                    return;
                }
            }
            // No hay posibilidades, paso
            else {
                console.log("Jugador" + (this.JugadorActual + 1) + " pasa");
                this.MostrarMensaje(this.JugadorActual, "Jugador" + (this.JugadorActual + 1) +  " Pasa...");
                this.Pasado++;
            }
        }
        
        
        // Compruebo que el jugador actual no tenga 0 fichas
        var Colocadas = 0;
        for (i = 0; i < 7; i++) {
            if (this.Jugador[this.JugadorActual][i].Colocada === true) Colocadas ++;
        }
        
        if (Colocadas === 7) {
            this.MostrarMensaje(this.JugadorActual, "Jugador" + (this.JugadorActual + 1) +  " gana la partida!");
            document.getElementById("Empezar").style.display = "block";
            return;
        }
        // Todos los jugadores han pasado
        if (this.Pasado === 4) {
            //this.MostrarMensaje(this.JugadorActual, "Jugador" + (this.JugadorActual + 1) +  " gana la partida!");
            document.getElementById("Empezar").style.display = "block";
            return;            
        }
        
        
        this.TurnoActual ++;
        this.JugadorActual ++;
        if (this.JugadorActual > 3) {
            this.JugadorActual = 0;
        }
        // Se ha pasado, 
        if (this.Pasado > 0) {
            this.Turno();
        }
    },
    
    MostrarMensaje  : function(Jugador, Texto) {
        var Msg1 = document.getElementById("Msg1");
        var Msg2 = document.getElementById("Msg2");
        var Msg3 = document.getElementById("Msg3");
        var Msg4 = document.getElementById("Msg4");
        
/*        Msg1.setAttribute("MsgVisible", "false");
        Msg2.setAttribute("MsgVisible", "false");
        Msg3.setAttribute("MsgVisible", "false");
        Msg4.setAttribute("MsgVisible", "false");*/
        switch (Jugador) {
            case 0 : 
                Msg1.setAttribute("MsgVisible", "true");
                setTimeout(function() { document.getElementById("Msg1").setAttribute("MsgVisible", "false"); }, 1000);
                Msg1.innerHTML = Texto;
                break;
            case 1 :
                Msg2.setAttribute("MsgVisible", "true");
                setTimeout(function() { document.getElementById("Msg2").setAttribute("MsgVisible", "false"); }, 1000);
                Msg2.innerHTML = Texto;
                break;
            case 2 : 
                Msg3.setAttribute("MsgVisible", "true");
                setTimeout(function() { document.getElementById("Msg3").setAttribute("MsgVisible", "false"); }, 1000);
                Msg3.innerHTML = Texto;
                break;
            case 3 :
                Msg4.setAttribute("MsgVisible", "true");
                setTimeout(function() { document.getElementById("Msg4").setAttribute("MsgVisible", "false"); }, 1000);
                Msg4.innerHTML = Texto;
                break;
        }        
    },
    
    // Función que coloca una ficha de cualquier jugador en el tablero (si es posible, devuelve false en caso de no ser posible)
    Colocar         : function(Ficha) {
        var RotZ = 0;
        var PosX = 0;
        var PosY = -2;
        
        if (this.TurnoActual === 0) {
            Ficha.Colocar(PosX, PosY, Math.PI / 2, this.Turno.bind(this) ); // Coloco el doble 6 vertical y paso al siguiente turno
            return true;
        }
        else {
            
            if (Ficha.Valores[0] === this.FichaIzquierda.ValorIzq()) {
                if (Ficha.Valores[0] === Ficha.Valores[1]) { // la nueva ficha es doble
                    RotZ = Math.PI / 2;
                    PosX = this.FichaIzquierda.Ficha.position.x - 1.5; 
                }
                else {  // ficha normal invertida
                    RotZ = -Math.PI;
                    PosX = (this.FichaIzquierda.Vertical() === true) ? this.FichaIzquierda.Ficha.position.x - 1.5 : this.FichaIzquierda.Ficha.position.x - 2.0;
                }
                Ficha.Colocar(PosX, PosY, RotZ, this.Turno.bind(this));                
                this.FichaIzquierda = Ficha;
                this.FichaIzquierdaN++;
                return true;
            }
            
            if (Ficha.Valores[1] === this.FichaIzquierda.ValorIzq()) {
                if (Ficha.Valores[0] === Ficha.Valores[1]) {    // ficha doble
                    RotZ = Math.PI / 2;
                    PosX = this.FichaIzquierda.Ficha.position.x - 1.5;
                }
                else {        // ficha normal                     
                    PosX = (this.FichaIzquierda.Vertical() === true) ? this.FichaIzquierda.Ficha.position.x - 1.5 : this.FichaIzquierda.Ficha.position.x - 2.0;
                }                
                Ficha.Colocar(PosX, PosY, RotZ, this.Turno.bind(this));                
                this.FichaIzquierda = Ficha;
                this.FichaIzquierdaN++;
                return true;
            }
            
            if (Ficha.Valores[0] === this.FichaDerecha.ValorDer()) {
                if (Ficha.Valores[0] === Ficha.Valores[1]) {    // ficha doble
                    RotZ = Math.PI / 2; // rotación vertical
                    PosX = this.FichaDerecha.Ficha.position.x + 1.5;                    
                }
                else {  // ficha normal
                    PosX = (this.FichaDerecha.Vertical() === true) ? this.FichaDerecha.Ficha.position.x + 1.5 : this.FichaDerecha.Ficha.position.x + 2.0;
                }
                Ficha.Colocar(PosX, PosY, RotZ, this.Turno.bind(this));                
                this.FichaDerecha = Ficha;
                this.FichaDerechaN++;
                return true;
            }

            if (Ficha.Valores[1] === this.FichaDerecha.ValorDer()) {
                if (Ficha.Valores[0] === Ficha.Valores[1]) {    // ficha doble
                    RotZ = Math.PI / 2; // rotación vertical
                    PosX = this.FichaDerecha.Ficha.position.x + 1.5;                    
                }
                else {  // ficha normal invertida
                    RotZ = Math.PI;
                    PosX = (this.FichaDerecha.Vertical() === true) ? this.FichaDerecha.Ficha.position.x + 1.5 : this.FichaDerecha.Ficha.position.x + 2.0;
                }
                Ficha.Colocar(PosX, PosY, RotZ, this.Turno.bind(this));                
                this.FichaDerecha = Ficha;    
                this.FichaDerechaN++;
                return true
            }
        }
        
        return false;
    },
    
    // Función que pinta cada frame de la animación
    Pintar          : function() {  
        this.ComprobarMouse();
        
        Animaciones.Actualizar();
        
        //this.Camara.Rotar();
        this.Context.render(this.Escena, this.Camara);  
    }
});

// Inicialización del canvas en el Load de la página
var Domino = null;
window.addEventListener('load', function() { Domino = new DominoThree; });