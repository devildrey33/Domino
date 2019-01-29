/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 20/01/2019

        Objeto que controla el interfaz de usuario HTML del juego

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 28/01/2019
*/

var Domino_UI = function() {
    
    this.PuntuacionPorPartida = 300; // Por defecto las partidas son de 300 puntos
    
    this.Iniciar = function() {
        // Boton empezar
        document.getElementById("BotonEmpezar").onclick = function() {
            Domino.Partida.Empezar();
        };
        // Boton continuar (victoria / derrota)
        document.getElementById("BotonContinuar").onclick = function() {
            Domino.Partida.Continuar();
        };
        // Boton continuar empate
        document.getElementById("BotonContinuar2").onclick = function() {
            Domino.Partida.Continuar();
        };
        // Boton terminar la partida
        document.getElementById("BotonTerminar").onclick = function() {
            UI.OcultarGanador();
            UI.MostrarEmpezar();
        };
        // Edit del nombre del equipo 1
        document.getElementById("NEquipo1").onchange = function() {
            Domino.Partida.Opciones.AsignarNombreEquipo("1", document.getElementById("NEquipo1").value);
        };

        // Edit del nombre del equipo 2
        document.getElementById("NEquipo2").onchange = function() {
            Domino.Partida.Opciones.AsignarNombreEquipo("2", document.getElementById("NEquipo2").value);
        };
        
        // Edit del nombre del jugador 1
        document.getElementById("NNombre1").onchange = function() {
            Domino.Partida.Opciones.AsignarNombreJugador("1", document.getElementById("NNombre1").value);
        };

        // Edit del nombre del jugador 2
        document.getElementById("NNombre2").onchange = function() {
            Domino.Partida.Opciones.AsignarNombreJugador("2", document.getElementById("NNombre2").value);
        };
        
        // Edit del nombre del jugador 3
        document.getElementById("NNombre3").onchange = function() {
            Domino.Partida.Opciones.AsignarNombreJugador("3", document.getElementById("NNombre3").value);
        };
        
        // Edit del nombre del jugador 4
        document.getElementById("NNombre4").onchange = function() {
            Domino.Partida.Opciones.AsignarNombreJugador("4", document.getElementById("NNombre4").value);
        };
        
        // Checkbox Jugar al descubierto
        document.getElementById("Opciones_Descubierto").onclick = function() {
            Domino.Partida.Opciones.AsignarDescubierto(document.getElementById("Opciones_Descubierto").checked);
        };
        
        // CheckBox animar turno en 3d
        document.getElementById("Opciones_AnimarTurno").onclick = function() {
            Domino.Partida.Opciones.AsignarAniTurno(document.getElementById("Opciones_AnimarTurno").checked);
        };
        
        // Checkbox ayuda para el jugador
        document.getElementById("Opciones_Ayuda").onclick = function() {
            Domino.Partida.Opciones.AsignarAyuda(document.getElementById("Opciones_Ayuda").checked);
        };
        
        // Botones con las puntuaciones máximas
        for (var i = 1; i < 7; i++) {
            document.getElementById("Puntos" + i * 100).onclick = function(Pos) {
                this.AsignarPuntuacionPorPartida(Pos * 100);
            }.bind(this, i);
        }
        
        this.MostrarEmpezar();
    };
    
    // Mostrar menu para empezar una partida
    this.MostrarEmpezar = function() {
        document.getElementById("MarcoEmpezar").setAttribute("visible", "true");
    };
    
    // Mostrar menu para ocultar una partida
    this.OcultarEmpezar = function() {
        document.getElementById("MarcoEmpezar").setAttribute("visible", "false");
    };
    
    // Mostrar menu para continuar una partida
    this.MostrarContinuar = function(Equipo, Puntos, P1, P2, P3, P4) {
        document.getElementById("MarcoContinuar").setAttribute("visible", "true");
        document.getElementById("PG_Equipo").innerHTML = Equipo;
        document.getElementById("PG_Puntos").innerHTML = Puntos;
        document.getElementById("MV_P1").innerHTML = P1;
        document.getElementById("MV_P2").innerHTML = P2;
        document.getElementById("MV_P3").innerHTML = P3;
        document.getElementById("MV_P4").innerHTML = P4;
        document.getElementById("MV_P13").innerHTML = P1 + P3;
        document.getElementById("MV_P24").innerHTML = P2 + P4;
        if (Equipo === "1") {   // Gana el equipo 1
            document.getElementById("MV_E1").className = "Empate_Victoria";
            document.getElementById("MV_E2").className = "Empate_Derrota";
        }
        else {                          // Gana el equipo 2
            document.getElementById("MV_E1").className = "Empate_Derrota";
            document.getElementById("MV_E2").className = "Empate_Victoria";
        }
        
    };
        
    this.OcultarContinuar = function() {
        document.getElementById("MarcoContinuar").setAttribute("visible", "false");
    };
    
    // Mostrar menu para continuar una partida
    this.MostrarEmpate = function(P1, P2, P3, P4) {
        document.getElementById("MarcoEmpate").setAttribute("visible", "true");
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
        document.getElementById("MarcoEmpate").setAttribute("visible", "false");
    };
    
    this.AsignarPuntuacionPorPartida = function(Puntos) {
        for (var i = 1; i < 7; i++) {
            document.getElementById("Puntos" + i * 100).className = "";
        }
        document.getElementById("Puntos" + Puntos).className = "PuntosMarcados";
        this.PuntuacionPorPartida = Puntos;
        Domino.Partida.Opciones.AsignarPuntosPorPartida(Puntos);
    };
    
    this.MostrarDatosMano = function() {
        document.getElementById("DatosJuego").setAttribute("Visible", "true");
        document.getElementById("Historial").setAttribute("Visible", "true");
    };
    
    this.OcultarDatosMano = function() {
        document.getElementById("DatosJuego").setAttribute("Visible", "false");
        document.getElementById("Historial").setAttribute("Visible", "false");
    };
    
    this.MostrarGanador = function (Equipo, Puntos)  {
        document.getElementById("MarcoTerminado").setAttribute("visible", "true");
        document.getElementById("EquipoGanador").innerHTML = Equipo;
        document.getElementById("PuntosGanador").innerHTML = Puntos;
    };
    
    this.OcultarGanador = function ()  {
        document.getElementById("MarcoTerminado").setAttribute("visible", "false");
    };
    
    this.MostrarVictoria = function() {
        document.getElementById("VictoriaDerrota").innerHTML = "<div id='Victoria'><img src='./SVG/Partida.svg#Ganada' /></div>";
    };
    
    this.MostrarDerrota = function() {
        document.getElementById("VictoriaDerrota").innerHTML = "<div id='Derrota'><img src='./SVG/Partida.svg#Perdida' /></div>";        
    };
    
    this.MostrarPartidaGanada = function() {
        document.getElementById("VictoriaDerrota").innerHTML = "<div id='ParitdaGanada'><img src='./SVG/PartidaGanada.svg' /></div>";
    };
    
    this.MostrarPartidaPerdida = function() {
        this.MostrarDerrota();
        //document.getElementById("VictoriaDerrota").innerHTML = "<div id='Derrota'><img src='./SVG/Partida.svg#Perdida' /></div>";
    };
            
};

var UI = new Domino_UI();

