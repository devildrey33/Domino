/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 20/01/2019

        Objeto que controla el interfaz de usuario HTML del juego

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificaci√≥n el 25/02/2019
*/

var Domino_UI = function() {
    
    this.PuntuacionPorPartida = 300; // Por defecto las partidas son de 300 puntos
    
    this.Iniciar = function() {
        
        // Boton Equipos
        document.getElementById("BotonEquipos").onclick = function() {
            UI.OcultarEmpezar();
            UI.MostrarEquipos();
        };
        // Boton Opciones
        document.getElementById("BotonOpciones").onclick = function() {
            UI.OcultarEmpezar();
            UI.MostrarOpciones();
        };
        
        // Boton Cerrar Equipos
        document.getElementById("BotonCerrarEquipos").onclick = function() {
            UI.OcultarEquipos();
            UI.MostrarEmpezar();
        };
        // Boton Cerrar Opciones
        document.getElementById("BotonCerrarOpciones").onclick = function() {
            UI.OcultarOpciones();
            UI.MostrarEmpezar();
        };
        
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
        
        
        // Editar Equipo
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
        
        
        // Opciones
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
        
        // Botones para cambiar el idioma
        // Boton English
        document.getElementById("Idioma_en").onclick = function() {
            Domino.Partida.Opciones.AsignarIdioma('en');
            document.getElementById('Idioma_en').className  = "IdiomaMarcado";
            document.getElementById('Idioma_cat').className = "";
            document.getElementById('Idioma_es').className  = "";
        };
        // Boton Catal‡
        document.getElementById("Idioma_cat").onclick = function() {
            Domino.Partida.Opciones.AsignarIdioma('cat');
            document.getElementById('Idioma_en').className  = "";
            document.getElementById('Idioma_cat').className = "IdiomaMarcado";
            document.getElementById('Idioma_es').className  = "";
        };
        // Boton Castellano
        document.getElementById("Idioma_es").onclick = function() {
            Domino.Partida.Opciones.AsignarIdioma('es');
            document.getElementById('Idioma_en').className  = "";
            document.getElementById('Idioma_cat').className = "";
            document.getElementById('Idioma_es').className  = "IdiomaMarcado";
        };
        
        
        // Botones con las puntuaciones m·ximas
        for (var i = 1; i < 7; i++) {
            document.getElementById("Puntos" + i * 100).onclick = function(Pos) {
                this.AsignarPuntuacionPorPartida(Pos * 100);
            }.bind(this, i);
        }
                
        this.MostrarEmpezar();
    };
    
    // Mostrar men˙ para empezar una partida
    this.MostrarEmpezar = function() {
        document.getElementById("MarcoEmpezar").setAttribute("visible", "true");
    };
    
    // Mostrar menu para ocultar una partida
    this.OcultarEmpezar = function() {
        document.getElementById("MarcoEmpezar").setAttribute("visible", "false");
    };

    // Mostrar menu para editar los equipos
    this.MostrarEquipos = function() {
        document.getElementById("MarcoEquipos").setAttribute("visible", "true");
    };
    
    // Mostrar menu para ocultar el men˙ para editar equipos
    this.OcultarEquipos = function() {
        document.getElementById("MarcoEquipos").setAttribute("visible", "false");
    };
    
    // Mostrar menu para editar las opciones
    this.MostrarOpciones = function() {
        document.getElementById("MarcoOpciones").setAttribute("visible", "true");
    };
    
    // Mostrar menu para ocultar el men˙ de las opciones
    this.OcultarOpciones = function() {
        document.getElementById("MarcoOpciones").setAttribute("visible", "false");
    };
    
    
    // Mostrar menu para continuar una partida
    this.MostrarContinuar = function(Equipo, Puntos, P1, P2, P3, P4) {
        
        document.getElementById("PG_Puntos").innerHTML = Puntos;
        document.getElementById("MV_P1").innerHTML = P1;
        document.getElementById("MV_P2").innerHTML = P2;
        document.getElementById("MV_P3").innerHTML = P3;
        document.getElementById("MV_P4").innerHTML = P4;
        document.getElementById("MV_P13").innerHTML = P1 + P3;
        document.getElementById("MV_P24").innerHTML = P2 + P4;
        
        // Nombres de los jugadores y equipos
        document.getElementById("MV_E1").innerHTML = Domino.Partida.Opciones.NombreEquipo[0];
        document.getElementById("MV_E2").innerHTML = Domino.Partida.Opciones.NombreEquipo[1];
        document.getElementById("MVN_P1").innerHTML = Domino.Partida.Opciones.NombreJugador[0];
        document.getElementById("MVN_P2").innerHTML = Domino.Partida.Opciones.NombreJugador[1];
        document.getElementById("MVN_P3").innerHTML = Domino.Partida.Opciones.NombreJugador[2];
        document.getElementById("MVN_P4").innerHTML = Domino.Partida.Opciones.NombreJugador[3];
        
        if (Equipo === "1") {   // Gana el equipo 1
            document.getElementById("PG_Equipo").innerHTML = Domino.Partida.Opciones.NombreEquipo[0];
            document.getElementById("MV_E1").className = "Empate_Victoria";
            document.getElementById("MV_E2").className = "Empate_Derrota";
        }
        else {                          // Gana el equipo 2
            document.getElementById("PG_Equipo").innerHTML = Domino.Partida.Opciones.NombreEquipo[1];
            document.getElementById("MV_E1").className = "Empate_Derrota";
            document.getElementById("MV_E2").className = "Empate_Victoria";
        }        

        document.getElementById("MarcoContinuar").setAttribute("visible", "true");        
    };
        
    this.OcultarContinuar = function() {
        document.getElementById("MarcoContinuar").setAttribute("visible", "false");
    };
    
    // Mostrar menu para continuar una partida
    this.MostrarEmpate = function(P1, P2, P3, P4) {
        document.getElementById("ME_P1").innerHTML = P1;
        document.getElementById("ME_P2").innerHTML = P2;
        document.getElementById("ME_P3").innerHTML = P3;
        document.getElementById("ME_P4").innerHTML = P4;
        document.getElementById("ME_P13").innerHTML = P1 + P3;
        document.getElementById("ME_P24").innerHTML = P2 + P4;
        
        // Nombres de los jugadores y equipos
        document.getElementById("ME_E1").innerHTML = Domino.Partida.Opciones.NombreEquipo[0];
        document.getElementById("ME_E2").innerHTML = Domino.Partida.Opciones.NombreEquipo[1];
        document.getElementById("MEN_P1").innerHTML = Domino.Partida.Opciones.NombreJugador[0];
        document.getElementById("MEN_P2").innerHTML = Domino.Partida.Opciones.NombreJugador[1];
        document.getElementById("MEN_P3").innerHTML = Domino.Partida.Opciones.NombreJugador[2];
        document.getElementById("MEN_P4").innerHTML = Domino.Partida.Opciones.NombreJugador[3];
        
        
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
            document.getElementById("TxtVictoriaEquipo").innerHTML = Domino.Partida.Opciones.NombreEquipo[Equipo - 1];  
            document.getElementById("TxtVictoria").style.display = "table";
            document.getElementById("TxtEmpate").style.display = "none";  
        }
        
        document.getElementById("MarcoEmpate").setAttribute("visible", "true");
        
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
    
    // FunciÛn que refresca los datos de la mano, en el div superior izquierdo.
    this.MostrarDatosMano = function() {
        document.getElementById("DatosJuego").setAttribute("Visible", "true");
        document.getElementById("NombreEquipo1").innerHTML = Domino.Partida.Opciones.NombreEquipo[0];
        document.getElementById("NombreEquipo2").innerHTML = Domino.Partida.Opciones.NombreEquipo[1];
        // Si no es un dispositivo mÛvil, muestro el historial de tiradas en un div superior derecho.
        if (ObjetoNavegador.EsMovil() === false) {
            document.getElementById("Historial").setAttribute("Visible", "true");
        }
    };
    
    this.OcultarDatosMano = function() {
        document.getElementById("DatosJuego").setAttribute("Visible", "false");
        document.getElementById("Historial").setAttribute("Visible", "false");
    };
    
    this.MostrarGanador = function (Equipo, Puntos)  {
        document.getElementById("MarcoTerminado").setAttribute("visible", "true");
        document.getElementById("EquipoGanador").innerHTML = (Equipo === "1") ? Domino.Partida.Opciones.NombreEquipo[0] : Domino.Partida.Opciones.NombreEquipo[2];
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

