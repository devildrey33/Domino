/* Fusión del ObjetoCanvas (originalmente destinado a tests de banners) con el ObjetoBanner 
    Creado el 14/10/2016 por Josep Antoni Bover Comas para devildrey33.es 
    Ultima modificación :  28/02/2019 
 */

/* NOTA Importante, inicialmente este objeto se creo con la finalidad de probar banners para mi web, pero con el tiempo lo he estado enriqueciendo y adaptando para poder crear
 * presentaciones 2D o 3D, y ahora este objeto conserva el modo banner de mi web por compatibilidad y tambien por la pereza de tener que mantener 2 objetos distintos que en esencia hacen lo mismo. 
 * La estructura HTML puede que sea excesiva, para una demostración 2d/3d pero ofrece ciertas ventajas, de las que en teoría ya no me tengo que preocupar, por ejemplo :
 *  Muestra los frames por segundo si no se desactiva en las opciones 
 *  Muestra si se está cargando algun archivo externo (texturas/modelos/audio/video/etc..) basta con utilizar ObjetoCanvas.Cargando(BOOL) 
 *  Permite pausar el canvas si este se encuentra en segundo plano, y nos muestra un mensaje si está pausado.
 *  (SOLO EN Entorno:'Normal') Muestra un boton iniciar animación, que además pone el canvas a pantalla completa. */
 
/* NOTA [27/08/2017] : Solucionado bug con el boton de pantalla completa, que no funcionaba correctamente en dispositivos moviles */

/*  Opciones['Tipo']                    puede ser : 
                                           - 2d       , Canvas con funciones 2D.                       (POR DEFECTO)
                                          - THREE    , Canvas utilizando la API del Three.js
    Opciones['Ancho']                   por defecto el ancho se adapta al contenedor, establece un ancho en pixeles para que sea fijo.
    Opciones['Alto']                    por defecto la altura se adapta al contenedor, establece una altura en pixeles para que sea fija.
    Opciones['Entorno']                 puede ser :
                                            - Normal   , Canvas para crear tests rapidos.               (POR DEFECTO)
                                            - Banner   , Canvas diseñado para el Banner de devildrey33.
    Opciones['Idioma']                  puede ser : 'es'pañol o 'en'glish.                              ('es' POR DEFECTO)
    Opciones['MostrarFPS']              puede ser : true o false.                                       (TRUE POR DEFECTO)
    Opciones['BotonPantallaCompleta']   puede ser : true o false.                                       (TRUE POR DEFECTO)
    Opciones['BotonLogo']               puede ser : true o false.                                       (TRUE POR DEFECTO)
    Opciones['ElementoRaiz']            elemento del HTML donde se creará el canvas                     (POR DEFECTO es 'document.body')
    Opciones['ColorFondo']              color del fondo en HEX (SOLO para THREE.js)                     (POR DEFECTO es '0x312E35' gris oscuro) 
    Opciones['CapturaEjemplo']          nombre del archivo que contiene la captura de pantalla          (Enlazará a '/Web/Graficos/250x200_')
    Opciones['ForzarLandscape']         fuerza al dispositivo movil para mostrarse apaisado (NO FUNCIONA BIEN!!!!)
*/
"use strict";

var ObjetoCanvas = function(Opciones) {
    // Constantes
    this.Constantes = { 
        Radiant : Math.PI / 180, // 360 deg = Math.PI * 2
        TAU     : Math.PI * 2 
    };
    
    // Opciones por defecto, puedes modificar las opciones creando un objeto que contenga una o mas opciones a modificar, y pasando el array en el constructor del ObjetoCanvas
    this.OpcionesCanvas  = { 
        Tipo                    : '2d',
        Ancho                   : 'Auto',
        Alto                    : 'Auto',
        Entorno                 : 'Normal',
        Idioma                  : 'es',             
        MostrarFPS              : true,
        BotonesPosicion         : "derecha",        // Puede ser 'derecha' o 'izquierda'
        BotonPantallaCompleta   : true,
        BotonLogo               : true,
        BotonExtraHTML          : "",               // Contenido extra para los botones del lateral inferior izquierdo (solo se usa en el ejemplo sinusoidal y cyberparasit)
        ElementoRaiz            : document.body,
        Pausar                  : true,             // Pausar si el canvas está en segundo plano
        ColorFondo              : 0x312E35,         // Color del fondo por defecto (solo si usas THREE.js)
        CapturaEjemplo          : "",
        ForzarLandscape         : false             // Fuerza al dispositivo movil para que se muestre solo apaisado
    };
    // Copio las nuevas opciones encima de las opciones por defecto
    if (typeof Opciones === 'object') {
        for (var Indice in Opciones) {
            this.OpcionesCanvas[Indice] = Opciones[Indice];
        }
    }
            
    // En el entorno Normal hay que crear todas las etiquetas
    if (this.OpcionesCanvas['Entorno'] === 'Normal') {
        // Creo la cabecera vacia si no existe
        if (!document.getElementById("ObjetoCanvas")) {
            var PreCabecera = document.createElement('div');
            PreCabecera.id = "ObjetoCanvas";
            this.OpcionesCanvas['ElementoRaiz'].appendChild(PreCabecera);
        }
        // Creo las etiquetas que contienen información adicional sobre la animación
        this.Cabecera = document.getElementById("ObjetoCanvas");
        this.Textos = { 
            en  : [ "Loading..." , "Paused"  , "Start"  , "Frames per second" , "Full Screen"      , "Restore Screen"    , "devildrey33 home page", "Error loading WebGL"   ],
            es  : [ "Cargando...", "En Pausa", "Iniciar", "Frames por segundo", "Pantalla Completa", "Restaurar Pantalla", "Página de devildrey33", "Error iniciando WebGL" ],
            cat : [ "Carregan...", "En Pausa", "Iniciar", "Frames per segon"  , "Pantalla Completa", "Restaurar Pantalla", "Página de devildrey33", "Error inician WebGL"   ] 
        };
        var StrHtml = '<div id="Cabecera_Cargando" class="MarcoCanvas"><span>' + this.Textos[this.OpcionesCanvas.Idioma][0] + '</span></div>' +
            "<canvas id='Cabecera_Canvas'></canvas>" +
            '<div id="Cabecera_PausaAni" class="MarcoCanvas">' + this.Textos[this.OpcionesCanvas.Idioma][1] + '</div>' + 
            '<div id="Cabecera_Iniciar" class="MarcoCanvas">' + this.Textos[this.OpcionesCanvas.Idioma][2] + '</div>' + 
            '<div id="Cabecera_Error" class="MarcoCanvas" visible="false">Error :</div>';
        // Etiqueta para el marco de los botones
        StrHtml += "<div id='ObjetoCanvas_Controles' alinear='" + this.OpcionesCanvas.BotonesPosicion + "'>";
        // Marco FPS
        if (this.OpcionesCanvas.MostrarFPS === true) {
            StrHtml += "<div class='ObjetoCanvas_Marco' title='" + this.Textos[this.OpcionesCanvas.Idioma][3] + "'>" +
                    "<span id='ObjetoCanvas_FPS'>60</span>" +
                    "<span id='ObjetoCanvas_TxtFPS'>fps</span>" +
                "</div>";
        }
        // Boton / botones extra
        if (this.OpcionesCanvas.BotonExtraHTML !== "") { StrHtml += this.OpcionesCanvas.BotonExtraHTML; }
        // Boton pantalla completa / restaurar pantalla
        if (this.OpcionesCanvas.BotonPantallaCompleta === true) {
            StrHtml += "<div class='ObjetoCanvas_Boton' id='ObjetoCanvas_PantallaCompleta' title='" + this.Textos[this.OpcionesCanvas.Idioma][4] + "'>" +
                    "<img src='https://cdn.rawgit.com/devildrey33/devildrey33/ddb01d71/Web/SVG/Iconos50x50.svg#svg-pantalla-completa' />" +
                "</div>" +
                "<div class='ObjetoCanvas_Boton' id='ObjetoCanvas_RestaurarPantalla' title='" + this.Textos[this.OpcionesCanvas.Idioma][5] +"'>" +
                    "<img src='https://cdn.rawgit.com/devildrey33/devildrey33/ddb01d71/Web/SVG/Iconos50x50.svg#svg-restaurar-pantalla' />" +
                "</div>";
        }
        // Boton con el logo
        if (this.OpcionesCanvas.BotonLogo === true) {
            StrHtml +=  "<a href='https://github.com/devildrey33' class='ObjetoCanvas_Boton' target='_blank' title='"+ this.Textos[this.OpcionesCanvas.Idioma][6] +"' id='ObjetoCavas_Logo'>" +
                    "<img src='https://cdn.rawgit.com/devildrey33/devildrey33/ddb01d71/Web/SVG/Iconos50x50.svg#svg-logo' />" +
                    "<div id='ObjetoCavas_TextoLogo'>" +
                        "<span>D</span>" + "<span>E</span>" + "<span>V</span>" + "<span>I</span>" + "<span>L</span>" + "<span>D</span>" + "<span>R</span>" + "<span>E</span>" + "<span>Y</span>" + "<span>&nbsp;</span>" + "<span>3</span>" + "<span>3</span>" +
                    "</div>" +
                "</a>";
        }        
        StrHtml += "</div>";

        this.Cabecera.innerHTML = this.Cabecera.innerHTML + StrHtml;
        
        if (this.OpcionesCanvas.BotonPantallaCompleta === true) {
            // Botones restaurar y pantalla completa
            var bPantallaCompleta = document.getElementById("ObjetoCanvas_PantallaCompleta");
            var bRestaurarPantalla = document.getElementById("ObjetoCanvas_RestaurarPantalla");
//            if (this.OpcionesCanvas.BotonPantallaCompleta === true) { bPantallaCompleta.style.display = "block"; }
//            else                                                    { bPantallaCompleta.style.display = "none"; }
            bRestaurarPantalla.style.display = "none";
            // Eventos para los botones pantalla completa y restaurar pantalla
            bPantallaCompleta.addEventListener("click", function() { this.PantallaCompleta(); }.bind(this));
            bRestaurarPantalla.addEventListener("click", function() { this.RestaurarPantalla(); }.bind(this));
        
            // Eventos para determinar si está en pantalla completa
            document.addEventListener('webkitfullscreenchange', this.EventoPantallaCompleta.bind(this), false);
            document.addEventListener('mozfullscreenchange', this.EventoPantallaCompleta.bind(this), false);
            document.addEventListener('msfullscreenchange', this.EventoPantallaCompleta.bind(this), false);
            document.addEventListener('fullscreenchange', this.EventoPantallaCompleta.bind(this), false);
        }
    
//        if (this.OpcionesCanvas.BotonLogo === false) { document.getElementById("ObjetoCavas_Logo").style.display = "none"; }                       
    }
    // En el entorno Banner las etiquetas ya estan creadas, pero hay que eliminar y volver a crear el canvas
    else if (this.OpcionesCanvas['Entorno'] === 'Banner') {
        this.Cabecera = document.getElementById("Cabecera");
        // Hay que eliminar la etiqueta canvas por que al crear un 2d context encima de un webgl context y viceversa produce error.
        if (document.getElementById('Cabecera_Canvas')) { this.Cabecera.removeChild(document.getElementById('Cabecera_Canvas')); }
        this.Cabecera.innerHTML = this.Cabecera.innerHTML + "<canvas id='Cabecera_Canvas'></canvas>";        
        // Marco que contiene la información de la animación del banner
        document.getElementById("CabeceraAutorAni_HTML").innerHTML = "<div>"+ this.Nombre +"</div>" +
                                                                     "<div><span style='color:#AAA;'>Concepto original : </span><b>" + this.IdeaOriginal + "</b></div>" + 
                                                                     "<a href='" + this.URL + "' target='_blank'>" + this.NombreURL + "</a>";        
        this.Cabecera.setAttribute("animar", true); /* Transición hover para el marco del banner que permite elegir la animación */
    }    
    
    // Asigno el estado cargando, que muestra una ventana que avisa al usuario.
    this.Cabecera.setAttribute("cargando", true);
    // Obtengo la etiqueta canvas    
    this.Canvas = document.getElementById("Cabecera_Canvas");        
    
//    this._EsMovil = -1; // no se ha hecho la detección de dispositivos moviles

    // Tamaño del canvas
    this.Ancho          = 0;                                                // Ancho del canvas
    this.Alto           = 0;                                                // Altura del canvas
    
    // Determino el ancho y altura del canvas (fijo o variable)
    if (this.OpcionesCanvas.Ancho !== "Auto") { this.Ancho = this.OpcionesCanvas.Ancho; }
    if (this.OpcionesCanvas.Alto !== "Auto")  { this.Alto = this.OpcionesCanvas.Alto; }        
    // Si el canvas es de ancho fijo, añado el css para centrar-lo
    if (this.OpcionesCanvas.Ancho !== "Auto") { this.Canvas.style.width = this.Ancho + "px"; this.Canvas.style.left = "calc(50% - (" + this.Ancho + "px / 2))"; }
    if (this.OpcionesCanvas.Alto !== "Auto")  { this.Canvas.style.height = this.Alto + "px"; this.Canvas.style.top = "calc(50% - (" + this.Ancho + "px / 2))";  }
    
    if (this.OpcionesCanvas.ForzarLandscape === true) {
        this.Cabecera.setAttribute("forzarlandscape", true);
    }
    
    // Creación del contexto
    try {
        if (this.OpcionesCanvas.Tipo.toLowerCase() === '2d') {
            this.Context    = this.Canvas.getContext("2d");                         // Contexto 2D
            console.log("ObjetoCanvas iniciado en modo 2d");
        }
        else if (this.OpcionesCanvas.Tipo.toLowerCase() === 'three') {
            if (ObjetoNavegador.EsMovil() === true) { // El antialias no va con el samsung galaxy alpha...
               this.Context = new THREE.WebGLRenderer({ canvas : this.Canvas });    // Contexto THREE.JS
                console.log("ObjetoCanvas iniciado en modo THREE sin antialias");
            }
            else {
               this.Context = new THREE.WebGLRenderer({ canvas : this.Canvas, antialias : true });    // Contexto THREE.JS
                console.log("ObjetoCanvas iniciado en modo THREE con antialias");
            }
            this.Context.setClearColor(this.OpcionesCanvas.ColorFondo, 1);    // Color del fondo
        }
    }
    catch ( error ) {
        this.MostrarErrorIniciarWebGL(error);
        return false;
    }    
    
    this.RAFID          = 0;                                                // Request Animation Frame ID
    this.FPS_UltimoTick = Date.now() + 1000;                                // Ultimo Tick del sistema + 1000ms
    this.FPS_Contador   = 0;                                                // Contador de frames por segundo    
    this.FocoWeb        = true;                                             // Foco de la ventana de la web
    this.Tick           = 0;                                                // Date.now actualizado en cada frame
    // Calculo el tamaño del canvas
    this.EventoRedimensionar();
    
    // Evento mouse movimiento
    this.EnlazarEventos();
    
    // Estado cargando
    this.Cargando(true);
    
    this.RAFID = window.requestAnimationFrame(this.Actualizar.bind(this));           
    
    return true;
};

ObjetoCanvas.prototype.MostrarErrorIniciarWebGL = function(error) {
    // Escondo los controles
    document.getElementById("ObjetoCanvas_Controles").style.display = "none";
    // Muestro la ventana con el error y una captura del ejemplo
    var VentanaError = document.getElementById("Cabecera_Error");
    VentanaError.setAttribute("visible", "true");
    var Captura = (this.OpcionesCanvas["CapturaEjemplo"] === "") ? "" : "<br />" + "<img src='https://cdn.rawgit.com/devildrey33/devildrey33/2ff5c5dc/Web/Graficos/250x200_" + this.OpcionesCanvas["CapturaEjemplo"] + "'>";
    VentanaError.innerHTML = "<span>" + this.Textos[this.OpcionesCanvas.Idioma][7] + " : " + error + "</span>" + Captura;
    this.Cargando(false);
};

ObjetoCanvas.prototype.Terminar = function() {
    if (this.RAFID !== 0) {
        window.cancelAnimationFrame(this.RAFID); 
    }
    
    if (this.OpcionesCanvas.Entorno === "Normal") {
        if (ObjetoNavegador.EsMovil() === true) {
            this.Cabecera.removeEventListener('touchstart', this.hEventoTouchStart);
            this.Cabecera.removeEventListener('touchmove', this.hEventoTouchMove);
            this.Cabecera.removeEventListener('touchend', this.hEventoTouchEnd);
        }
        else {
            this.Cabecera.removeEventListener('mousedown', this.hEventoMousePresionado);
            this.Cabecera.removeEventListener('mouseup', this.hEventoMouseSoltado);
        }
        window.removeEventListener('keydown', this.hEventoTeclaPresionada);
        window.removeEventListener('keyup', this.hEventoTeclaSoltada);    
    }
    
//    if (this.Animaciones) { this.Animaciones.Limpiar(); }
    
    if (ObjetoNavegador.EsMovil() === false) {
        this.Cabecera.removeEventListener('mousemove', this.hEventoMouseMove);
    }
    this.Cabecera.removeEventListener('mouseenter', this.hEventoMouseEnter);
    this.Cabecera.removeEventListener('mouseleave', this.hEventoMouseLeave);        
    window.removeEventListener('resize', this.hEventoRedimensionar);
    window.removeEventListener('scroll', this.hEventoScroll);
    window.removeEventListener('blur', this.hEventoFocoPerdido);
    window.removeEventListener('focus', this.hEventoFocoRecibido);
    console.log("ObjetoCanvas.Terminar");
};

ObjetoCanvas.prototype.EnlazarEventos = function() {
    // Necesito guardar una variable con cada evento reconvertido con bind, para poder hacer mas tarde el removeEventListener
    if (this.OpcionesCanvas.Entorno === "Normal") { // Canvas que puede recibir eventos
        if (ObjetoNavegador.EsMovil() === true) {
            this.hEventoTouchStart       = this.EventoTouchStart.bind(this);
            this.hEventoTouchMove        = this.EventoTouchMove.bind(this);
            this.hEventoTouchEnd         = this.EventoTouchEnd.bind(this);        
            this.Cabecera.addEventListener('touchstart', this.hEventoTouchStart);
            this.Cabecera.addEventListener('touchmove', this.hEventoTouchMove);
            this.Cabecera.addEventListener('touchend', this.hEventoTouchEnd);
        }
        else {
            this.hEventoMousePresionado = this.EventoMousePresionado.bind(this);
            this.hEventoMouseSoltado    = this.EventoMouseSoltado.bind(this);
            this.Cabecera.addEventListener('mousedown', this.hEventoMousePresionado);
            this.Cabecera.addEventListener('mouseup', this.hEventoMouseSoltado);
        }
        this.hEventoTeclaPresionada = this.EventoTeclaPresionada.bind(this);
        this.hEventoTeclaSoltada    = this.EventoTeclaSoltada.bind(this);
        window.addEventListener('keydown', this.hEventoTeclaPresionada);
        window.addEventListener('keyup', this.hEventoTeclaSoltada);
    }
    this.hEventoMouseEnter      = this.EventoMouseEnter.bind(this);
    this.hEventoMouseLeave      = this.EventoMouseLeave.bind(this);
    this.hEventoRedimensionar   = this.EventoRedimensionar.bind(this);
    this.hEventoScroll          = this.EventoScroll.bind(this);
    this.hEventoFocoPerdido     = this.EventoFocoPerdido.bind(this);
    this.hEventoFocoRecibido    = this.EventoFocoRecibido.bind(this);
    if (ObjetoNavegador.EsMovil() === false) {
        this.hEventoMouseMove       = this.EventoMouseMove.bind(this);
        this.Cabecera.addEventListener('mousemove', this.hEventoMouseMove);
    }
    
    this.Cabecera.addEventListener('mouseenter', this.hEventoMouseEnter);
    this.Cabecera.addEventListener('mouseleave', this.hEventoMouseLeave);
    
    window.addEventListener('resize', this.hEventoRedimensionar);
    window.addEventListener('scroll', this.hEventoScroll);
    window.addEventListener('blur', this.hEventoFocoPerdido);
    window.addEventListener('focus', this.hEventoFocoRecibido);        
};



// Evento que salta cuando se obtiene el foco de la ventana
ObjetoCanvas.prototype.EventoFocoRecibido = function() {
//    console.log("Foco de la ventana recibido");
    this.FocoWeb = true;
    if (this.OpcionesCanvas.Entorno === "Normal") {
        this.EventoReanudar();
    }
    // En el entorno banner, solo se reanuda si el banner es visible en la ventana
    else if (this.OpcionesCanvas.Entorno === "Banner" && window.scrollX < 190) {
        this.EventoReanudar();
    }
};
    
// Evento que salta cuando se pierde el foco de la ventana
ObjetoCanvas.prototype.EventoFocoPerdido = function() {
//    console.log("Foco de la ventana perdido");
    this.FocoWeb = false;
    this.EventoPausa();
};
  
// Función que devuelve el pixel ratio del dispositivo actual
/*ObjetoCanvas.prototype.PixelRatio = function() {
    var ratio = 1;
    // To account for zoom, change to use deviceXDPI instead of systemXDPI
    if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
        // Only allow for values > 1
        ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
    }
    else if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    }
    return ratio;    
};*/

/*
ObjetoCanvas.prototype.EsMovil = function() {
    return ObjetoNavegador.EsMovil();
};*/

// Función que determina el estado de carga (cargando/completo) true / false
ObjetoCanvas.prototype.Cargando = function(carga) {
    this.Cabecera.setAttribute("cargando", carga);
};

// Función que obtiene el estado de carga
ObjetoCanvas.prototype.EstaCargando = function() {
    var Ret = this.Cabecera.getAttribute("cargando");
    return (Ret === "true" || Ret === true);
};

// Función interna utilizada por requestAnimationFrame para actualizar y pintar la animación
ObjetoCanvas.prototype.Actualizar = function() {
    this.Tick = Date.now();
    if (this.OpcionesCanvas.MostrarFPS === true) { this.FPS(); }
    this.RAFID = window.requestAnimationFrame(this.Actualizar.bind(this));
    this.Pintar.apply(this); 
};

// Función que procesa el evento keydown
ObjetoCanvas.prototype.EventoTeclaPresionada = function(event) {    
    if (typeof(this.TeclaPresionada) !== "undefined") { this.TeclaPresionada.apply(this, [ event ]); }        
};
// Función que procesa el evento keyup
ObjetoCanvas.prototype.EventoTeclaSoltada = function(event) {    
    if (typeof(this.TeclaSoltada) !== "undefined") { this.TeclaSoltada.apply(this, [ event ]); }    
};

// Función que procesa el evento mousemove
ObjetoCanvas.prototype.EventoMouseMove = function(event) {    
    if (typeof(this.MouseMove) !== "undefined") { this.MouseMove.apply(this, [ event ] ); }
};

// Función que procesa el evento mousedown
ObjetoCanvas.prototype.EventoMousePresionado = function(event) {    
    if (typeof(this.MousePresionado) !== "undefined") { this.MousePresionado.apply(this, [ event ]); }
};
// Función que procesa el evento mouseup
ObjetoCanvas.prototype.EventoMouseSoltado = function(event) {    
    if (typeof(this.MouseSoltado) !== "undefined") {  this.MouseSoltado.apply(this, [ event ]);   }
};

// Función que procesa el evento mousemove
ObjetoCanvas.prototype.EventoMouseEnter = function(event) {
    if (typeof(this.MouseEnter) !== "undefined") { this.MouseEnter.apply(this, [ event ]); }
};

// Función que procesa el evento mousemove
ObjetoCanvas.prototype.EventoMouseLeave = function(event) { 
    if (typeof(this.MouseLeave) !== "undefined") { this.MouseLeave.apply(this, [ event ]); }
};

// Función que procesa el evento touchstart
ObjetoCanvas.prototype.EventoTouchStart = function(event) {    
    if (typeof(this.TouchStart) !== "undefined") { this.TouchStart.apply(this, [ event ]); }
};
// Función que procesa el evento touchmove
ObjetoCanvas.prototype.EventoTouchMove = function(event) {    
    if (typeof(this.TouchMove) !== "undefined") {  this.TouchMove.apply(this, [ event ]);   }
};
// Función que procesa el evento touchend
ObjetoCanvas.prototype.EventoTouchEnd = function(event) {    
    if (typeof(this.TouchEnd) !== "undefined") {  this.TouchEnd.apply(this, [ event ]);   }
};


// Función que obtiene el tamaño del canvas una vez redimensionado.
ObjetoCanvas.prototype.EventoRedimensionar = function() {
    console.log("Evento Resize : ", window.innerWidth, window.innerHeight, window.devicePixelRatio, window.screen.availWidth, window.screen.availHeight);
//    console.log("esmovil" + ObjetoNavegador.EsMovil());
    // portrait
    if (this.OpcionesCanvas.ForzarLandscape === true && ObjetoNavegador.EsMovil() === true && window.innerWidth < window.innerHeight) {
        // Invierto el nuevo ancho y la nueva altura (si no son fijas) para forzar el modo landscape
        if (this.OpcionesCanvas.Ancho === "Auto") { this.Ancho  = window.screen.availHeight;  }
        if (this.OpcionesCanvas.Alto === "Auto")  { this.Alto   = window.screen.availWidth; }        
        this.Cabecera.style.left = -(this.Ancho - this.Alto) / 2 + "px";
        this.Cabecera.style.top = (this.Ancho - this.Alto) / 2 + "px";
        this.Cabecera.style.width = this.Ancho + "px";
        this.Cabecera.style.height = this.Alto + "px";
    }
    else {
        if (this.OpcionesCanvas['Entorno'] === 'normal') {
            this.Cabecera.style.width  = "100%";
            this.Cabecera.style.height = "100%";
            this.Cabecera.style.left = "0px";
            this.Cabecera.style.top  = "0px";
        }
        // Calculo el nuevo ancho y la nueva altura (si no son fijas)
        if (this.OpcionesCanvas.Ancho === "Auto") { this.Ancho  = this.Cabecera.offsetWidth;  }
        if (this.OpcionesCanvas.Alto === "Auto")  { this.Alto   = this.Cabecera.offsetHeight; }
    }
    // Asigno el alto y el ancho a los atributos del canvas
    this.Canvas.setAttribute("width", this.Ancho);
    this.Canvas.setAttribute("height", this.Alto);
    if (this.OpcionesCanvas.Tipo.toLowerCase() === "three") { // redimensionar el THREE.JS
        this.Context.setSize(this.Ancho, this.Alto);
        if (this.Camara !== null && typeof(this.Camara) !== 'undefined') { // Si hay una camara creada
            this.Camara.aspect = this.Ancho / this.Alto;
            this.Camara.updateProjectionMatrix();            
        }
    }
    // 
    if (typeof(this.Redimensionar) !== "undefined") {
        this.Redimensionar.apply(this);
    }
};

// Función para pausar la animación
// - Hay que detectar cuando la animación no es visible y cuando la ventana no tiene el foco para pausar la animación
// - En modo depuración nunca se hace la pausa (esto es para poder depurar el Three.js en el Three.js.inspector)
ObjetoCanvas.prototype.EventoPausa = function() {
    if (this.RAFID !== 0 && this.OpcionesCanvas.Pausar === true) {
        this.Cabecera.setAttribute("animar", false);
        console.log("ObjetoCanvas.Pausa");
        window.cancelAnimationFrame(this.RAFID); 
        this.RAFID = 0;
//        this.TickPausa = this.Tick;
        if (typeof this.Pausa !== 'undefined') {  this.Pausa();   }
    }
};

// Función para reanudar la animación desde el ultimo punto
ObjetoCanvas.prototype.EventoReanudar = function() {
    if (this.RAFID === 0 && this.FocoWeb === true) {
        this.Cabecera.setAttribute("animar", true);
        this.RAFID = window.requestAnimationFrame(this.Actualizar.bind(this)); 
        console.log("ObjetoCanvas.Reanudar RAFID = " + this.RAFID);
//        this.TickInicio = (this.Tick - this.TickPausa);
        if (typeof this.Pausa !== 'undefined') {  this.Reanudar();   }
    }
};

// Función que controla el scroll para determinar si la animación sigue a la vista o no y de esta forma detenerla / reanudarla
ObjetoCanvas.prototype.EventoScroll = function() {
    // Llamo a la función Scroll del NuevoObjeto (si existe)
    if (this.OpcionesCanvas.Entorno === "Banner") {
        var PS = $(window).scrollTop();
        var Altura = this.Cabecera.offsetHeight;
        if (PS > Altura) {
            this.EventoPausa();
        }
        else if (PS < Altura) {
            this.EventoReanudar();
        }
    }
    // Llamo a la función Scroll si existe en la clase heredada.
    if (typeof(this.Scroll) !== "undefined") {
        this.Scroll.apply(this);
    }            
};

// Función que cuenta los frames por segundo
ObjetoCanvas.prototype.FPS = function() {
    if (this.Tick > this.FPS_UltimoTick) {
        this.FPS_UltimoTick = this.Tick + 1000;
        var SpanFPS = document.getElementById("ObjetoCanvas_FPS");
        SpanFPS.innerHTML = this.FPS_Contador;
        var Parte = 256 / 60;
        SpanFPS.style.color = "rgb(" + Math.round(255 - (this.FPS_Contador * Parte)) + "," + Math.round(this.FPS_Contador * Parte) + ", 0)";
        this.FPS_Contador = 0;
    }
    else {
        this.FPS_Contador ++;
    }
};

// Modo pantalla completa
ObjetoCanvas.prototype.PantallaCompleta = function() {    
//    var RFS = document.body.requestFullscreen || document.body.msRequestFullscreen || document.body.mozRequestFullScreen || document.body.webkitRequestFullscreen;
    var RFS = this.Cabecera.requestFullscreen || this.Cabecera.msRequestFullscreen || this.Cabecera.mozRequestFullScreen || this.Cabecera.webkitRequestFullscreen;
//    RFS.call(this.Cabecera);
    RFS.call(document.body);
};

// Restaurar pantalla completa
ObjetoCanvas.prototype.RestaurarPantalla = function() {    
    var EFS = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
    EFS.call(document);
};

// Evento que avisa si se ha pasado a pantalla completa, o se ha restaurado  
ObjetoCanvas.prototype.EventoPantallaCompleta = function(Evento) {    
    var PantallaCompleta = (document.fullscreenElement || document.msFullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement);
    // Si no encuentro la función fullscreenElement (en firefox no va...), miro si la altura de la pantalla es igual a la altura de la pestaña
    if (!PantallaCompleta) { PantallaCompleta = (Math.abs(screen.height - window.innerHeight) === 0); }
    console.log("ObjetoCanvas.EventoPantallaCompleta " + PantallaCompleta );
    // Si screenTop es 0 es que está en modo pantalla completa.
    document.getElementById("ObjetoCanvas_PantallaCompleta").style.display = (!PantallaCompleta) ? "block" : "none";
    document.getElementById("ObjetoCanvas_RestaurarPantalla").style.display = (!PantallaCompleta) ? "none" : "block";
};


////////////////////////////////////////////////////////////////////////////
// Objeto que crea y contiene un canvas 2d para utilizarlo de back buffer //
////////////////////////////////////////////////////////////////////////////
var BufferCanvas = function(Ancho, Alto) {
    this.Canvas = document.createElement("canvas");
    this.Canvas.setAttribute("width", Ancho);
    this.Canvas.setAttribute("height", Alto);
    this.Context = this.Canvas.getContext("2d"); 
    this.Ancho = Ancho;
    this.Alto = Alto;
};


// Objeto para detectar el navegador actual
var ObjetoNavegador = new function() {
    this._EsMovil = -1;
    // Devuelve true si es un dispositivo movil
    this.EsMovil = function() {
        if (this._EsMovil === -1) {
            if( navigator.userAgent.match(/Android/i)       ||
                navigator.userAgent.match(/webOS/i)         ||
                navigator.userAgent.match(/iPhone/i)        ||
                navigator.userAgent.match(/iPad/i)          ||
                navigator.userAgent.match(/iPod/i)          ||
                navigator.userAgent.match(/BlackBerry/i)    ||
                navigator.userAgent.match(/Windows Phone/i) ) {
                this._EsMovil = true;
                return true;
            }
            else {
//                console.log("ObjetoCanvas.EsMovil : false");
                this._EsMovil = false;
                return false;
            }
        }
        return this._EsMovil;
    };
    
    this._EsFirefox = -1;
    // Devuelve true si es un navegador firefox
    this.EsFirefox = function() {
        if (this._EsFirefox === -1) {
            (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) ? this._EsFirefox = false : this._EsFirefox = true;
        }
        return this._EsFirefox;
    };
};





    
/* Función para generar un valor aleatório entero */
/* Si no se especifican parametros devuelve 0 o 1 */
/* Si solo se especifica un parámetro, el primer parámetro será el máximo, y el mínimo será 0 */
/* Si se especifican dos parámetros, el primero es el máximo, y el segundo es el mínimo. */
function RandInt(Max, Min) {
    return Math.round(Rand(Max, Min));
}


/* Si no se especifican parametros devuelve 0 o 1 
   Si se especifica solo el Máximo, el mínimo será 0 */
function Rand(Max, Min) {
    var min = (typeof(Min) !== "undefined") ? Min : 0; // Si no se especifica el mínimo por defecto es 0
    var max = (typeof(Max) !== "undefined") ? Max : 1; // Si no se especifica el máximo por defecto es 1
    return min + Math.random() * (max - min);    
}      
