/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 16/01/2019

        Objeto que controla las variables que requieren ser guardadas en disco

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 26/02/2019
*/


var Domino_Opciones = function () {
    this.NombreJugador     = [ "Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4" ];
    this.NombreEquipo      = [ "Equipo 1", "Equipo 2" ];
    this.PuntosPorPartida  = 300;
    this.Descubierto       = "false";
    this.AniTurno          = "true";
    this.Ayuda             = "true";
    this.Iniciar = function() {
        // Cargo las opciones del local storage (si existen)
        if (window.localStorage.PuntosPorPartida)   this.PuntosPorPartida = window.localStorage.getItem("PuntosPorPartida");
        if (window.localStorage.Descubierto)        this.Descubierto      = window.localStorage.getItem("Descubierto");
        if (window.localStorage.AniTurno)           this.AniTurno         = window.localStorage.getItem("AniTurno");
        if (window.localStorage.Ayuda)              this.Ayuda            = window.localStorage.getItem("Ayuda");
        if (window.localStorage.Jugador1)           this.NombreJugador[0] = window.localStorage.getItem("Jugador1");
        if (window.localStorage.Jugador2)           this.NombreJugador[1] = window.localStorage.getItem("Jugador2");
        if (window.localStorage.Jugador3)           this.NombreJugador[2] = window.localStorage.getItem("Jugador3");
        if (window.localStorage.Jugador4)           this.NombreJugador[3] = window.localStorage.getItem("Jugador4");
        if (window.localStorage.Equipo1)            this.NombreEquipo[0]  = window.localStorage.getItem("Equipo1");
        if (window.localStorage.Equipo2)            this.NombreEquipo[1]  = window.localStorage.getItem("Equipo2");

        // Asigno las opciones al UI
        document.getElementById("Puntos" + this.PuntosPorPartida).className = "PuntosMarcados";
        document.getElementById("Opciones_Descubierto").checked = (this.Descubierto === "true") ? true : false;
        document.getElementById("Opciones_AnimarTurno").checked = (this.AniTurno === "true")    ? true : false;
        document.getElementById("Opciones_Ayuda").checked       = (this.Ayuda === "true")       ? true : false;
        
/*        document.getElementById("Opciones_Descubierto").setAttribute("checked", (this.Descubierto === "false") ? "" : "checked");
        document.getElementById("Opciones_AnimarTurno").setAttribute("checked", (this.AniTurno === "false") ? "" : "checked");
        document.getElementById("Opciones_Ayuda").setAttribute("checked", (this.Ayuda === "false") ? "" : "checked");*/
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
        else if (Descubierto === false) this.Descubierto = "true";
        else                            this.Descubierto = Descubierto;
    };
    
    this.AsignarAniTurno = function(AniTurno) {
        window.localStorage.setItem("AniTurno", AniTurno);
        if (AniTurno === false)      this.AniTurno = "false";
        else if (AniTurno === false) this.AniTurno = "true";
        else                         this.AniTurno = AniTurno;
    };
    
    this.AsignarAyuda = function(Ayuda) {
        window.localStorage.setItem("Ayuda", Ayuda);
        if (Ayuda === false)      this.Ayuda = "false";
        else if (Ayuda === false) this.Ayuda = "true";
        else                      this.Ayuda = Ayuda;
    };
    
};

//Opciones = new Domino_Opciones;