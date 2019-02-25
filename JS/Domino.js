/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 16/01/2019

        MAIN para el javascript

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 25/02/2019
*/

/* 
    TODO :
        - Nivell de dificultat (facil rand / normal)
        V Les finestres de victoria i derrota no posen els noms dels equips i dels jugadors guardats en el localstorage...
        - Idiomes (Catalá, Castellano, English)
            - El tema de les traduccions el veig complicat (sobretot pels spans que han de mostrar el nom del equip en mig d'una frase)
            - Lo millor seria crear un HTML per cada idioma??
        V Revisar tema movil, sobretot el touch, i veure que tots els menus no sobresurten de la pantalla
            V Touch revisat, ara sembla que funciona simulant desde el chrome.
        - Tinc 2 puntuacions per partida... en el UI i en Opciones.... i hi ha lio (si el poso a 100 i recarrego la pagina, mostra el 100, pero realment conta fins a 300)
        V Entre el moment que hi ha l'animació al colocar la ficha es pot posar una ficha com si no s'haques colocat la que s'esta animant
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
        'BotonLogo'                 : true,
        'BotonPantallaCompleta'     : true,
        'ElementoRaiz'              : document.body,
        'Pausar'                    : false,             // Pausa el canvas si la pestaña no tiene el foco del teclado
        'ColorFondo'                : 0xFFFFFF,
        'CapturaEjemplo'            : ""                 // Captura de pantalla para el ejemplo a "NuevoCanvas2D.png" se le añadirá "https://devildrey33.es/Web/Graficos/250x200_"
    }) === false) { return false; }
    
    // VERSIÓN DEL JUEGO A MANO
    document.getElementById("VersionDomino").innerHTML = "0.99";
    
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
        this.ComprobarMouse();
    },
    // Función que se llama al presionar un botón del mouse por el canvas
    MousePresionado : function(Evento) { },
    // Función que se llama al soltar un botón del mouse por el canvas
    MouseSoltado    : function(Evento) { 
        this.Partida.JugadorColocar();
    },
    // Función que se llama al entrar con el mouse en el canvas
    MouseEnter      : function(Evento) { },
    // Función que se llama al salir con el mouse del canvas
    MouseLeave      : function(Evento) { },
    // Función que se llama al presionar la pantalla
    TouchStart      : function(Evento) { 
        this.MouseMovido = true;
        this.PosMouse.x =   ( Evento.touches[0].clientX / window.innerWidth ) * 2 - 1;
	this.PosMouse.y = - ( Evento.touches[0].clientY / window.innerHeight ) * 2 + 1;        
//        this.Partida.JugadorColocar();
//        this.ComprobarMouse();
    },
    
    // Función que se llama al mover la presión sobre la pantalla
    TouchMove      : function(Evento) { 
        this.MouseMovido = true;
        this.PosMouse.x =   ( Evento.touches[0].clientX / window.innerWidth ) * 2 - 1;
	this.PosMouse.y = - ( Evento.touches[0].clientY / window.innerHeight ) * 2 + 1;        
//        this.ComprobarMouse();
    },    
    
    TouchEnd      : function(Evento) { 
/*        this.MouseMovido = true;
        this.PosMouse.x =   ( Evento.touches[0].clientX / window.innerWidth ) * 2 - 1;
	this.PosMouse.y = - ( Evento.touches[0].clientY / window.innerHeight ) * 2 + 1;        */
        this.Partida.JugadorColocar();
//        this.ComprobarMouse();
    },    
    // Función que se llama al presionar una tecla
    TeclaPresionada : function(Evento) { },
    // Función que se llama al soltar una tecla
    TeclaSoltada    : function(Evento) { },
    // Función que se llama al pausar el banner
    Pausa           : function() { },
    // Función que se llama al reanudar el banner
    Reanudar        : function() { },
//    Texturas        : new Domino_Texturas(),
    Partida         : new Domino_Partida(this),
    RayCaster       : new THREE.Raycaster(),
    PosMouse        : new THREE.Vector2(),
//    Opciones        : new Domino_Opciones(),
    
    // Función que inicia el ejemplo
    Iniciar         : function() {       
        // Fijo el modo landscape (NO VA...)
//        screen.orientation.lock("landscape");

        // Fuerzo a recargar todo el contenido (NO VA...)
        // Al StackOverflow es comenta que si fas "Request desktop site" es fa un hard reload inclus dels CSS
        // I si no.. amb el movil enxufat al PC Cmd+Shift+R...
        // Una altre solucio es afegir/modificar un parámetre get al link : ej: www.url.com/?a=1
        //window.location.reload(true);
        
        // Activo el mapeado de sombras
        this.Context.shadowMap.enabled	= true;
        // Creo la escena
        this.Escena = new THREE.Scene();
        // Creo la camara
        this.Camara = new THREE.PerspectiveCamera(75, this.Ancho / this.Alto, 0.5, 1000);
        this.Camara.Rotacion = { Grados : 0, Avance : (Math.PI / 180) / 1.5, Distancia : 7, MirarHacia : new THREE.Vector3(0, 0, 0), Animacion : true };
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

        this.CrearLuces();
        this.Partida.Opciones.Iniciar();
        UI.Iniciar();
//        this.Camara.Rotar();
        setTimeout(this.Partida.CrearFichas.bind(this.Partida), 10);
    },
    
    
    CrearLuces : function() {
        // Luz direccional
        this.DirLight = new THREE.DirectionalLight( 0xfff1e0, 0.281 );
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
        var RotZ = 0;
        switch (NumJugador) {
            case 0 :    // Abajo
                PosZ = -25;
                PosX = 0;
                break;
            case 1 :    // Derecha
                PosZ = -30;
                PosX = 30;
                RotZ = -Math.PI / 128;
                break;
            case 2 :    // Arriba
                PosZ = -50;
                PosX = 0;
                break;
            case 3 :    // Izquierda
                PosZ = -30;
                PosX = -30;
                RotZ = Math.PI / 128;
                break;
        }
        
        console.log(this.Camara.rotation);
        
        this.AniLuz = Animaciones.CrearAnimacion([
                    { Paso : { PX : this.DirLight.position.x , PZ : this.DirLight.position.z, RZ : this.Camara.rotation.y  } },
                    { Paso : { PX : PosX,                      PZ : PosZ                    , RZ : RotZ  }, Tiempo : 400, FuncionTiempo : FuncionesTiempo.SinInOut }
            ], { FuncionActualizar : function(Valores) { 
                    this.DirLight.position.set(Valores.PX, 40, Valores.PZ);                    
                    this.Camara.rotation.y = Valores.RZ;
                    //this.DirLight.needUpdate = true;
//                    this.DirLight.position.multiplyScalar( 20 );
            }.bind(this) });
        this.AniLuz.Iniciar();
    },
    
    
    ComprobarMouse  : function() {
        if (this.MouseMovido === false) return;
        if (typeof(this.Partida.Ficha[0]) === "undefined") return;
        
        
        this.RayCaster.setFromCamera(this.PosMouse, this.Camara);
        var intersects = this.RayCaster.intersectObjects( this.Escena.children, true );        
        var Hover = [ 0, 0, 0, 0, 0, 0, 0 ];
        
        
        // Compruebo si hay que hacer hover en alguna de las fichas del jugador 1
        for (var i = 0; i < intersects.length; i++ ) {
            for (var f = 0; f < 7; f++) {
                if (intersects[i].object === this.Partida.Ficha[f].Cara1 && this.Partida.Ficha[f].Colocada === false) {
                    Hover[f] = 1;
                }
                if (intersects[i].object === this.Partida.Ficha[f].Cara2 && this.Partida.Ficha[f].Colocada === false) {
                    Hover[f] = 2;
                }
                if (intersects[i].object === this.Partida.Ficha[f].Bola && this.Partida.Ficha[f].Colocada === false) {
                    Hover[f] = 3;
                }                
            }        
        }
        
        // Miro si hay algun cambio respecto los hovers (siempre que sea el jugador 1)
        if (this.Partida.JugadorActual === 0) {        
            for (var f = 0; f < 7; f++) {
                if (Hover[f] !== this.Partida.Ficha[f].Hover) {
                    this.Partida.Ficha[f].AsignarHover(Hover[f]);
                }
            }
        }
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
var Domino = {};
window.addEventListener('load', function() { Domino = new DominoThree; });