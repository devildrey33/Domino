/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 20/01/2019

        Objeto que controla el interfaz de usuario HTML del juego

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 20/01/2019
*/

var Domino_UI = function() {
    
    this.PuntuacionPorPartida = 300; // Por defecto las partidas son de 300 puntos
    
    this.Iniciar = function() {
        // Boton empezar
        document.getElementById("BotonEmpezar").onclick = function() {
            Domino.Partida.Empezar();
        };
        
        // Botones con las puntuaciones máximas
        for (var i = 1; i < 7; i++) {
            document.getElementById("Puntos" + i * 100).onclick = function(Pos) {
                this.AsignarPuntuacionPorPartida(Pos * 100);
            }.bind(this, i);
        }
    };
    
    // Mostrar menu para empezar una partida
    this.MostrarEmpezar = function() {
        document.getElementById("MarcoEmpezar").style.display = "block";
    };
    
    // Mostrar menu para ocultar una partida
    this.OcultarEmpezar = function() {
        document.getElementById("MarcoEmpezar").style.display = "none";
    };
    
    this.AsignarPuntuacionPorPartida = function(Puntos) {
        for (var i = 1; i < 7; i++) {
            document.getElementById("Puntos" + i * 100).className = "";
        }
        document.getElementById("Puntos" + Puntos).className = "PuntosMarcados";
        this.PuntuacionPorPartida = Puntos;
    };
    
    this.MostrarPartida = function() {
        document.getElementById("MarcoPartida").setAttribute("Visible", "true");
    };
    
    this.OcultarPartida = function() {
        document.getElementById("MarcoPartida").setAttribute("Visible", "false");
    };
    
    
    // Función para mostrar un mensaje especifico para un jugador
    // ColFondo puede ser : "negro", "rojo", "verde"
    /*this.MostrarMensaje = function(Jugador, Texto, ColFondo) {
        var ColorFondo = (typeof(ColFondo) === "undefined") ? "negro" : ColFondo;
        var Msg = document.getElementById("Msg" + (Jugador + 1));
        Msg.setAttribute("MsgVisible", "true");        
        Msg.setAttribute("ColorFondo", ColorFondo);
        setTimeout(function(J) { document.getElementById("Msg" + J).setAttribute("MsgVisible", "false"); }.bind(this, (Jugador + 1)), this.TiempoTurno);
        Msg.innerHTML = Texto;
    };*/
    
};

var UI = new Domino_UI();

