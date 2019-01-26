/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 20/01/2019

        Objeto que controla el interfaz de usuario HTML del juego

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 26/01/2019
*/

var Domino_UI = function() {
    
    this.PuntuacionPorPartida = 300; // Por defecto las partidas son de 300 puntos
    
    this.Iniciar = function() {
        // Boton empezar
        document.getElementById("BotonEmpezar").onclick = function() {
            Domino.Partida.Empezar();
        };
        
        document.getElementById("BotonContinuar").onclick = function() {
            Domino.Partida.Continuar();
        };
        
        document.getElementById("BotonContinuar2").onclick = function() {
            Domino.Partida.Continuar();
        };
        
        // Botones con las puntuaciones máximas
        for (var i = 1; i < 7; i++) {
            document.getElementById("Puntos" + i * 100).onclick = function(Pos) {
                this.AsignarPuntuacionPorPartida(Pos * 100);
            }.bind(this, i);
        }
        document.getElementById("MarcoEmpezar").style.display = "block";        
    };
    
    // Mostrar menu para empezar una partida
    this.MostrarEmpezar = function() {
        document.getElementById("MarcoEmpezar").style.display = "block";
    };
    
    // Mostrar menu para ocultar una partida
    this.OcultarEmpezar = function() {
        document.getElementById("MarcoEmpezar").style.display = "none";
    };
    
    // Mostrar menu para continuar una partida
    this.MostrarContinuar = function(Equipo, Puntos) {
        document.getElementById("MarcoContinuar").style.display = "block";
        document.getElementById("PG_Equipo").innerHTML = Equipo;
        document.getElementById("PG_Puntos").innerHTML = Puntos;
    };
        
    this.OcultarContinuar = function() {
        document.getElementById("MarcoContinuar").style.display = "none";
    };
    
    // Mostrar menu para continuar una partida
    this.MostrarEmpate = function(P1, P2, P3, P4) {
        document.getElementById("MarcoEmpate").style.display = "block";
        document.getElementById("ME_P1").innerHTML = P1;
        document.getElementById("ME_P2").innerHTML = P2;
        document.getElementById("ME_P3").innerHTML = P3;
        document.getElementById("ME_P4").innerHTML = P4;
        document.getElementById("ME_P13").innerHTML = P1 + P3;
        document.getElementById("ME_P24").innerHTML = P2 + P4;
        var Equipo = 0;
        if (P1 + P3 === P2 + P4) {
            document.getElementById("ME_E1").className = "Empate_Derrota";
            document.getElementById("ME_E2").className = "Empate_Derrota";
        }
        else if (P1 + P3 < P2 + P4) {   // Gana el equipo 1 por sumar menos puntos
            document.getElementById("ME_E1").className = "Empate_Victoria";
            document.getElementById("ME_E2").className = "Empate_Derrota";
            Equipo = 1;
        }
        else {                          // Gana el equipo 2 por sumar menos puntos
            document.getElementById("ME_E1").className = "Empate_Derrota";
            document.getElementById("ME_E2").className = "Empate_Victoria";
            Equipo = 2;
        }
        
        if (Equipo === 0) { // Empate
            document.getElementById("TxtVictoria").style.display = "none";
            document.getElementById("TxtEmpate").style.display = "table";
        }
        else { // Victoria de un equipo
            document.getElementById("TxtVictoriaPuntos").innerHTML = P1 + P2 + P3 + P4;
            document.getElementById("TxtVictoriaEquipo").innerHTML = Equipo;  
            document.getElementById("TxtVictoria").style.display = "table";
            document.getElementById("TxtEmpate").style.display = "none";  
        }
    };
        
    this.OcultarEmpate = function() {
        document.getElementById("MarcoEmpate").style.display = "none";
    };
    
    this.AsignarPuntuacionPorPartida = function(Puntos) {
        for (var i = 1; i < 7; i++) {
            document.getElementById("Puntos" + i * 100).className = "";
        }
        document.getElementById("Puntos" + Puntos).className = "PuntosMarcados";
        this.PuntuacionPorPartida = Puntos;
    };
    
    this.MostrarDatosMano = function() {
        document.getElementById("DatosJuego").setAttribute("Visible", "true");
        document.getElementById("Historial").setAttribute("Visible", "true");
    };
    
    this.OcultarDatosMano = function() {
        document.getElementById("DatosJuego").setAttribute("Visible", "false");
        document.getElementById("Historial").setAttribute("Visible", "false");
    };
    
    this.MostrarGanador = function ()  {
        
    };
    
    this.OcultarGanador = function ()  {
        
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

