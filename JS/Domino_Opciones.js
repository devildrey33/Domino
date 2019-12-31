/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 16/01/2019

        Objeto que controla las variables que requieren ser guardadas en disco (nombres de equipo y jugadores, opciones varias)

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 14/12/2019
*/


var Domino_Opciones = function () {
    this.NombreJugador     = [ /*"Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4"*/ ];
    this.NombreEquipo      = [ /*"Equipo 1", "Equipo 2"*/ ];
    this.PuntosPorPartida  = 300;
    this.Descubierto       = "false";
    this.AniTurno          = "true";
    this.Ayuda             = "true";
    this.Idioma            = 'es';
    this.Iniciar = function() {
        this.Idioma = this.IdiomaPorDefecto();
        // Cargo el idioma
        if (window.localStorage.Idioma)             this.Idioma = window.localStorage.getItem("Idioma");
        // Asigno el idioma al attributo lang del HTML
        document.documentElement.setAttribute("lang", this.Idioma);
        if (this.Idioma === 'en')  document.getElementById("Idioma_en").className = "IdiomaMarcado";
        if (this.Idioma === 'cat') document.getElementById("Idioma_cat").className = "IdiomaMarcado";
        if (this.Idioma === 'es')  document.getElementById("Idioma_es").className = "IdiomaMarcado";
        
        // Cargo las opciones del local storage (si existen)
        if (window.localStorage.PuntosPorPartida)   this.PuntosPorPartida = window.localStorage.getItem("PuntosPorPartida");
        if (window.localStorage.Descubierto)        this.Descubierto      = window.localStorage.getItem("Descubierto");
        if (window.localStorage.AniTurno)           this.AniTurno         = window.localStorage.getItem("AniTurno");
        if (window.localStorage.Ayuda)              this.Ayuda            = window.localStorage.getItem("Ayuda");
        
        this.NombresPorDefecto();
/*        if (window.localStorage.Jugador1)           this.NombreJugador[0] = window.localStorage.getItem("Jugador1");
        if (window.localStorage.Jugador2)           this.NombreJugador[1] = window.localStorage.getItem("Jugador2");
        if (window.localStorage.Jugador3)           this.NombreJugador[2] = window.localStorage.getItem("Jugador3");
        if (window.localStorage.Jugador4)           this.NombreJugador[3] = window.localStorage.getItem("Jugador4");
        if (window.localStorage.Equipo1)            this.NombreEquipo[0]  = window.localStorage.getItem("Equipo1");
        if (window.localStorage.Equipo2)            this.NombreEquipo[1]  = window.localStorage.getItem("Equipo2");*/
        
        // Asigno las opciones al UI
        document.getElementById("Puntos" + this.PuntosPorPartida).className = "PuntosMarcados";
        document.getElementById("Opciones_Descubierto").checked = (this.Descubierto === "true") ? true : false;
        document.getElementById("Opciones_AnimarTurno").checked = (this.AniTurno === "true")    ? true : false;
        document.getElementById("Opciones_Ayuda").checked       = (this.Ayuda === "true")       ? true : false;
        
/*        document.getElementById("Opciones_Descubierto").setAttribute("checked", (this.Descubierto === "false") ? "" : "checked");
        document.getElementById("Opciones_AnimarTurno").setAttribute("checked", (this.AniTurno === "false") ? "" : "checked");
        document.getElementById("Opciones_Ayuda").setAttribute("checked", (this.Ayuda === "false") ? "" : "checked");*/
/*        // Asigno los nombres de los jugadopres en el UI
        document.getElementById("NNombre1").value = this.NombreJugador[0];
        document.getElementById("NNombre2").value = this.NombreJugador[1];
        document.getElementById("NNombre3").value = this.NombreJugador[2];
        document.getElementById("NNombre4").value = this.NombreJugador[3];
        // Asigno los nombres de los equipos en el UI
        document.getElementById("NEquipo1").value = this.NombreEquipo[0];
        document.getElementById("NEquipo2").value = this.NombreEquipo[1];*/
    };
    
    // Función que determina el idioma por defecto en la primera sesión, si ninguno coincide, se elige Ingles.
    this.IdiomaPorDefecto = function() {
        var Idioma = navigator.language || navigator.userLanguage;
        // Si coincide con uno de los idiomas, lo devuelvo
        if (Idioma === 'en' || Idioma === 'cat' || Idioma === 'es')    return Idioma;
        // Si no coincide devuelvo ingles por defecto
        return 'en';
    };
    
    // Función que asigna los nombres (de equipo i jugadores) por defecto, o los que hay guardados en el local storage
    this.NombresPorDefecto = function() {
        var Nombres = { 
            'en' : { 
                'j' : 'Player',
                'e' : 'Team'
            },
            'cat' : { 
                'j' : 'Jugador',
                'e' : 'Equip'
            },
            'es' : { 
                'j' : 'Jugador',
                'e' : 'Equipo'
            }
        };
        
        if (window.localStorage.Jugador1)           this.NombreJugador[0] = window.localStorage.getItem("Jugador1");
        else                                        this.NombreJugador[0] = Nombres[document.documentElement.lang]['j'] + "1";
        if (window.localStorage.Jugador2)           this.NombreJugador[1] = window.localStorage.getItem("Jugador2");
        else                                        this.NombreJugador[1] = Nombres[document.documentElement.lang]['j'] + "2";
        if (window.localStorage.Jugador3)           this.NombreJugador[2] = window.localStorage.getItem("Jugador3");
        else                                        this.NombreJugador[2] = Nombres[document.documentElement.lang]['j'] + "3";
        if (window.localStorage.Jugador4)           this.NombreJugador[3] = window.localStorage.getItem("Jugador4");
        else                                        this.NombreJugador[3] = Nombres[document.documentElement.lang]['j'] + "4";
        if (window.localStorage.Equipo1)            this.NombreEquipo[0]  = window.localStorage.getItem("Equipo1");
        else                                        this.NombreEquipo[0]  = Nombres[document.documentElement.lang]['e'] + "1";
        if (window.localStorage.Equipo2)            this.NombreEquipo[1]  = window.localStorage.getItem("Equipo2");        
        else                                        this.NombreEquipo[1]  = Nombres[document.documentElement.lang]['e'] + "2";
        
        // Asigno los nombres de los jugadopres en el UI
        document.getElementById("NNombre1").value = this.NombreJugador[0];
        document.getElementById("NNombre2").value = this.NombreJugador[1];
        document.getElementById("NNombre3").value = this.NombreJugador[2];
        document.getElementById("NNombre4").value = this.NombreJugador[3];
        // Asigno los nombres de los equipos en el UI
        document.getElementById("NEquipo1").value = this.NombreEquipo[0];
        document.getElementById("NEquipo2").value = this.NombreEquipo[1];        
    };
    
    this.AsignarPuntosPorPartida = function(Puntos) {
        window.localStorage.setItem("PuntosPorPartida", Puntos);
        this.PuntosPorPartida = Puntos;
    };
    
    this.AsignarNombreJugador = function(Jugador, Nombre) {
        if (Nombre === "") Nombre = "Jugador " + Jugador;
        window.localStorage.setItem("Jugador" + Jugador, Nombre);
        this.NombreJugador[Jugador - 1] = Nombre;
    };
    
    this.AsignarNombreEquipo = function(Equipo, Nombre) {
        if (Nombre === "") Nombre = "Equipo " + Equipo;
        window.localStorage.setItem("Equipo" + Equipo, Nombre);
        this.NombreEquipo[Equipo - 1] = Nombre;
    };
    
    this.AsignarDescubierto = function(Descubierto) {
        window.localStorage.setItem("Descubierto", Descubierto);
        if (Descubierto === false)      this.Descubierto = "false";
        else if (Descubierto === true)  this.Descubierto = "true";
        else                            this.Descubierto = Descubierto;
    };
    
    this.AsignarAniTurno = function(AniTurno) {
        window.localStorage.setItem("AniTurno", AniTurno);
        if (AniTurno === false)      this.AniTurno = "false";
        else if (AniTurno === true)  this.AniTurno = "true";
        else                         this.AniTurno = AniTurno;
    };
    
    this.AsignarAyuda = function(Ayuda) {
        window.localStorage.setItem("Ayuda", Ayuda);
        if (Ayuda === false)      this.Ayuda = "false";
        else if (Ayuda === true)  this.Ayuda = "true";
        else                      this.Ayuda = Ayuda;
    };
    
    this.AsignarIdioma = function(Idioma) {
        window.localStorage.setItem("Idioma", Idioma);
        document.documentElement.setAttribute("lang", Idioma);
        this.Idioma = Idioma;
        this.NombresPorDefecto();
    };
    
};

//Opciones = new Domino_Opciones;