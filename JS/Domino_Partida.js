/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 19/01/2019

        Objeto para la partida en curso

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 29/07/2021

      - Solucionado bug que permitia darle dobleclick al boton para continuar la partida, y ejecutaba 2 partidas simultaneamente....
*/

var Domino_Partida = function() {    
    this.JugadorActual      = 0;                // Jugador del turno actual
    this.TurnoActual        = 0;                // Tu7rno actual
    this.Mano               = 0;                // Número de mano
    this.FichaIzquierda     = { };              // Fichas por la izquierda
    this.FichaDerecha       = { };              // Fichas por la derecha
    
    this.Pasado             = 0;                // Veces que se ha pasado
    this.Ficha              = [];               // Array de fichas
    this.TiempoTurno        = 1250;
    this.TimerMsg           = [ 0, 0, 0, 0 ];
    this.ManoTerminada      = false;            // Si se ha terminado la mano (juego individual)
    this.PuntosEquipo1      = 0;                // Puntos del primer equipo
    this.PuntosEquipo2      = 0;                // Puntos del segundo equipo

    this.ContinuandoPartida = false;            // Variable que previene que se inicien 2 manos a la vez
    
    this.Opciones         = new Domino_Opciones;
    //this.Domino           = nDomino;
    
    this.CrearFichas = function() {
        if (this.Ficha.length !== 0) {
            for (var i = 0; i< 28; i++) {
                Domino.Escena.remove(this.Ficha[i].Ficha);
            }
        }
        this.Ficha = [];
        // Creo las fichas ordenadas
        var Pos = [ -4.5, -5.0 ];
        for (var i = 0; i< 28; i++) {
            this.Ficha[i] = new Domino_Ficha();
            this.Ficha[i].Crear(i);
            Domino.Escena.add(this.Ficha[i].Ficha);
            this.Ficha[i].Ficha.position.set(Pos[0], 0.0, Pos[1]);
            this.Ficha[i].RotarV();
            Pos[0] += 1.5;
            if (Pos[0] > 5.0) {
                Pos[0] = -4.5;
                Pos[1] += 2.5;
            }            
        }        
    };    
    
    // Función que devuelve el jugador que empieza la mano
    this.JugadorInicio = function() {
        // Miro que jugador empieza
        for (this.JugadorActual = 0; this.JugadorActual < 4; this.JugadorActual++) {
            for (j = 0; j < 7; j++) {
                if (this.Ficha[(this.JugadorActual * 7) + j].Valores[0] === 6 && this.Ficha[(this.JugadorActual * 7) + j].Valores[1] === 6) {
                    return this.JugadorActual;
                }
            }
        }        
    };
    
    this.Empezar = function() {        
        this.Mano = 0;
        this.PuntosEquipo1 = 0;
        this.PuntosEquipo2 = 0;
        this.Opciones.PuntosPorPartida = UI.PuntuacionPorPartida;
        this.Continuar();
    };
    
    this.Continuar = function() {

        console.log("----------------------------------------");
        console.log("Partida.Continuar()", this.ContinuandoPartida);
        if (this.ContinuandoPartida === true) return;
        this.ContinuandoPartida = true;
        

        // Oculto el menu para empezar la partida
        UI.OcultarEmpezar();   
        // Oculto el menu para continuar la siguiente mano (desde una victoria)
        UI.OcultarContinuar();           
        // Oculto el menu para continuar la siguiente mano (desde un empate)
        UI.OcultarEmpate();   
        
        // Se ha terminado la partida
        if (this.PuntosEquipo1 >= this.Opciones.PuntosPorPartida || this.PuntosEquipo2 >= this.Opciones.PuntosPorPartida) {
            var Equipo = (this.PuntosEquipo1 >= this.PuntosEquipo2) ? "1" : "2";
            UI.MostrarGanador(Equipo, (this.PuntosEquipo1 >= this.PuntosEquipo2) ? this.PuntosEquipo1 : this.PuntosEquipo2 );
            if (Equipo === "1") UI.MostrarPartidaGanada();
            else                UI.MostrarPartidaPerdida();
            return;
        }
        
        // Muestro el menu con los datos de la mano actual
        UI.MostrarDatosMano();
        
        this.Mano ++;
        this.ManoTerminada = false;
        
        // Borro el historial de fichas
        document.getElementById("Historial").innerHTML = "";
        
        // Vuelvo a crear las fichas
        this.CrearFichas();
        
//        this.Jugador = [];
        this.Pasado = 0;
        
        // Mezclo el array de las fichas
        var j, x, i;
        for (i = this.Ficha.length - 1; i > 0; i--) {
            this.Ficha[i].Colocada = false;
            j = Math.floor(Math.random() * (i + 1));
            x = this.Ficha[i];
            this.Ficha[i] = this.Ficha[j];
            this.Ficha[j] = x;            
        }
        
        // Reparto las fichas
/*        for (i = 0; i < 4; i ++) {
            this.Jugador[i] = [];
            for (j = 0; j < 7; j++) {
                this.Jugador[i][j] = (i *7) + j;
                this.Ficha[this.Jugador[i][j]].Colocada = false;
            }
        }*/
        
        // Coloco las fichas del jugador 1 y 3
        for (i = 0; i < 7; i++) {
            this.Ficha[i].RotarV();
            this.Ficha[i].Ficha.position.set(-3.8 + (1.25 * i), 0, 5.5);
            this.Ficha[14 + i].RotarV();
            if (this.Opciones.Descubierto === "false") this.Ficha[14 + i].RotarBocaAbajo();
            this.Ficha[14 + i].Ficha.position.set(-3.8 + (1.25 * i), 0, -12);
        }
        
        // Coloco las fichas del jugador 2 y 4
        for (i = 0; i < 7; i++) {
            this.Ficha[7 + i].RotarH();
            if (this.Opciones.Descubierto === "false") this.Ficha[7 + i].RotarBocaAbajo();
            this.Ficha[7 + i].Ficha.position.set(15, 0, -6.5 + (1.25 * i));
            this.Ficha[21 + i].RotarH();
            if (this.Opciones.Descubierto === "false") this.Ficha[21 + i].RotarBocaAbajo();
            this.Ficha[21 + i].Ficha.position.set(-15, 0, -6.5 + (1.25 * i));
        }
        
        // Miro que jugador empieza
        this.JugadorInicio();
        
        this.MostrarMensaje(this.JugadorActual, "<span>" + this.Opciones.NombreJugador[this.JugadorActual] + " </span> " +
                                                "<span" +
                                                    "data-idioma-en='starts'" +
                                                    "data-idioma-cat='comença'" +
                                                    "data-idioma-es='empieza'></span>");
                                            
        
        this.TurnoActual = 0;        
        window.ContadorDerecha      = 0;
        window.ContadorIzquierda    = 0;
        window.FinContadorIzquierda = 5;
        window.FinContadorDerecha   = 5;

        
        this.Turno();        
    };
    
    
    // Función que ejecuta un turno
    this.Turno = function() {
        if (this.ManoTerminada === true) return;

        console.log("Turno : " + this.TurnoActual);
        
        document.getElementById("Mano").innerHTML    = this.Mano;
        document.getElementById("Turno").innerHTML   = this.TurnoActual;
        document.getElementById("Jugador").innerHTML = (this.JugadorActual + 1);
        document.getElementById("Equipo1").innerHTML = this.PuntosEquipo1;
        document.getElementById("Equipo2").innerHTML = this.PuntosEquipo2;

        // Animar la camara y la luz en cada turno
        if (this.Opciones.AniTurno === "true") {
            Domino.AnimarLuz(this.JugadorActual);
        }
        
        // En el primer turno se saca el doble 6
        if (this.TurnoActual === 0) {
            console.log(this.Opciones.NombreJugador[this.JugadorActual] + " empieza");
            for (var i = 0; i < 7; i ++) {
                if (this.Ficha[(this.JugadorActual * 7) + i].Valores[0] === 6 && this.Ficha[(this.JugadorActual * 7) + i].Valores[1] === 6) {
                    this.Ficha[(this.JugadorActual * 7) + i].Colocar(false);
                    setTimeout(function() { this.Turno(); }.bind(this), this.TiempoTurno);                    
//                    this.MostrarMensaje(this.JugadorActual, "Jugador" + (this.JugadorActual + 1) + " tira : " + this.Ficha[(this.JugadorActual * 7) + i].Valores[1] + " | " + this.Ficha[(this.JugadorActual * 7) + i].Valores[0]);
                    this.MostrarMensaje(this.JugadorActual, "<span>" + this.Opciones.NombreJugador[this.JugadorActual] + "</span>" + 
                                                            "<span " + 
                                                                "data-idioma-en=' throws : '" + 
                                                                "data-idioma-cat=' tira : '"  + 
                                                                "data-idioma-es=' tira : '></span>" +
                                                            "<img src='./SVG/Domino.svg#Ficha_6-6' />");                    
                }
            }
            
        }
        // El resto de turnos 
        else {            
            console.log("Izq: " + this.FichaIzquierda.ValorLibre() + " Der: " + this.FichaDerecha.ValorLibre());            
            // Cuento las posibilidades para la izquierda y la derecha
            var Posibilidades = [];
            for (var i = 0; i < 7; i++) {
                if (this.Ficha[(this.JugadorActual * 7) + i].Colocada === false) {
                    // posibilidades de la rama izquierda (partiendo del 6 doble hasta el final)
                    if (this.Ficha[(this.JugadorActual * 7) + i].Valores[0] === this.FichaIzquierda.ValorLibre() || this.Ficha[(this.JugadorActual * 7) + i].Valores[1] === this.FichaIzquierda.ValorLibre()) {
                        Posibilidades.push({ Pos : (this.JugadorActual * 7) + i, Rama : "izquierda" });
                    }
                    // posibilidades de la rama derecha (partiendo del 6 doble hasta el final)
                    if (this.Ficha[(this.JugadorActual * 7) + i].Valores[0] === this.FichaDerecha.ValorLibre() || this.Ficha[(this.JugadorActual * 7) + i].Valores[1] === this.FichaDerecha.ValorLibre()) {
                        Posibilidades.push({ Pos : (this.JugadorActual * 7) + i, Rama : "derecha" });                        
                    }
                }
            }
            // Ordeno las posibilidades y dejo arriba las que tienen mas valor (Que son las que se tiene se que sacar de encima antes)
            Posibilidades.sort(function(a, b){                
                return (this.Ficha[a.Pos].Valores[0] + this.Ficha[a.Pos].Valores[1] > this.Ficha[b.Pos].Valores[0] + this.Ficha[b.Pos].Valores[1]) ? a : b;
            }.bind(this));
            
            // Si tiene posibilidades
            if (Posibilidades.length > 0)  {
                this.Pasado = 0;

                // Turno de la maquina
                if (this.JugadorActual !== 0) {
                    // IA 1.0
                    // TODO : Segun la dificultad se hace un rand para ver si toca el movimiento lógico, o un movimiento al azar)
                    // Ej : Facil (20% logica, 80 azar, normal 50%-50%, dificil 90%-10%)
                    var Rnd = 0;//RandInt(this.Posibilidades.length -1, 0);
                    if (Posibilidades[0].Rama === "izquierda") { 
                        this.Ficha[Posibilidades[0].Pos].Colocar(this.FichaIzquierda);
                    }
                    else {
                        this.Ficha[Posibilidades[0].Pos].Colocar(this.FichaDerecha);
                    }                    
                    this.MostrarMensaje(this.JugadorActual, "<span>" + this.Opciones.NombreJugador[this.JugadorActual] + "</span> " + 
                                        "<span " + 
                                               "data-idioma-en=' throws : '" + 
                                               "data-idioma-cat=' tira : '"  + 
                                               "data-idioma-es=' tira : '></span>" + 
                                        "<img src='./SVG/Domino.svg#Ficha_" + this.Ficha[Posibilidades[0].Pos].Valores[1] + "-" + this.Ficha[Posibilidades[0].Pos].Valores[0] +"' />");
                    console.log("Jugador" + (this.JugadorActual + 1) + " tira : " + this.Ficha[Posibilidades[0].Pos].Valores[1] + " | " + this.Ficha[Posibilidades[0].Pos].Valores[0]);
                    setTimeout(function() { this.Turno(); }.bind(this), this.TiempoTurno);
                }
                // Turno del jugador
                else {
                    this.MostrarMensaje(this.JugadorActual, "<span>" + this.Opciones.NombreJugador[0] + "</span>" + 
                                                            "<span  data-idioma-en=' your turn ' " +
                                                               "data-idioma-cat=' el teu torn ' " + 
                                                               "data-idioma-es=' tu turno '></span>");
                    this.MostrarAyuda();
                    return;
                }
            }
            // No hay posibilidades, paso
            else {
                console.log("Jugador" + (this.JugadorActual + 1) + " pasa");
                this.MostrarMensaje(this.JugadorActual, "<span>" + this.Opciones.NombreJugador[this.JugadorActual] +  "</span> " +
                                                        "<span " +
                                                            "data-idioma-en='Pass...'" + 
                                                            "data-idioma-cat='Pasa...'" +
                                                            "data-idioma-es='Pasa...'" + ">" + 
                                                        "</span>", "rojo");
                this.Pasado++;
                this.TurnoActual ++;
                this.JugadorActual ++;
                if (this.JugadorActual > 3) {
                    this.JugadorActual = 0;
                }
                
            }
        }
        
        // Compruebo si se ha terminado la mano
        if (this.ComprobarManoTerminada() === true) {
            this.ContinuandoPartida = false;
            return;
        }
        
        // Se ha pasado, 
        if (this.Pasado > 0) {
            setTimeout(function() { this.Turno(); }.bind(this), this.TiempoTurno);
        }        
    };
    
    // Resalta las fichas que se pueden tirar en este turno
    this.MostrarAyuda = function () {
        if (this.Opciones.Ayuda === "false") return;
        var Ayuda = [];
        // Determino las posibilidades y las guardo en el array Ayuda
        for (var i = 0; i < 7; i++) {
            if (this.Ficha[i].Colocada === false) {
                if ((this.Ficha[i].Valores[0] === this.FichaIzquierda.ValorLibre() || this.Ficha[i].Valores[1] === this.FichaIzquierda.ValorLibre()) ||
                    (this.Ficha[i].Valores[0] === this.FichaDerecha.ValorLibre()   || this.Ficha[i].Valores[1] === this.FichaDerecha.ValorLibre())) {
                    Ayuda.push(i);
                }
            }
        }
        var Pos = [ 5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5 ];
        for (var i = 0; i < Ayuda.length; i++) {
            if (this.Ficha[Ayuda[i]].Valores[0] == this.Ficha[Ayuda[i]].Valores[1])     Pos[Ayuda[i]] = 4.75;
            else                                                                        Pos[Ayuda[i]] = 5.0;
        }        
        
        if (typeof(this.AniAyuda) !== "undefined") {
            this.AniAyuda.Terminar();
        }
        this.AniAyuda = Animaciones.CrearAnimacion([
                { Paso : { P0 : this.Ficha[0].Ficha.position.z, P1 : this.Ficha[1].Ficha.position.z, P2 : this.Ficha[2].Ficha.position.z, P3 : this.Ficha[3].Ficha.position.z, P4 : this.Ficha[4].Ficha.position.z, P5 : this.Ficha[5].Ficha.position.z, P6 : this.Ficha[6].Ficha.position.z  } },
                { Paso : { P0 : Pos[0], P1 : Pos[1], P2 : Pos[2], P3 : Pos[3], P4 : Pos[4], P5 : Pos[5], P6 : Pos[6]  }, Tiempo : 400, FuncionTiempo : FuncionesTiempo.SinInOut }
            ], {
            FuncionActualizar : function(Valores) { 
                if (this.Ficha[0].Colocada === false) this.Ficha[0].Ficha.position.set(this.Ficha[0].Ficha.position.x, this.Ficha[0].Ficha.position.y, Valores.P0);
                if (this.Ficha[1].Colocada === false) this.Ficha[1].Ficha.position.set(this.Ficha[1].Ficha.position.x, this.Ficha[1].Ficha.position.y, Valores.P1);
                if (this.Ficha[2].Colocada === false) this.Ficha[2].Ficha.position.set(this.Ficha[2].Ficha.position.x, this.Ficha[2].Ficha.position.y, Valores.P2);
                if (this.Ficha[3].Colocada === false) this.Ficha[3].Ficha.position.set(this.Ficha[3].Ficha.position.x, this.Ficha[3].Ficha.position.y, Valores.P3);
                if (this.Ficha[4].Colocada === false) this.Ficha[4].Ficha.position.set(this.Ficha[4].Ficha.position.x, this.Ficha[4].Ficha.position.y, Valores.P4);
                if (this.Ficha[5].Colocada === false) this.Ficha[5].Ficha.position.set(this.Ficha[5].Ficha.position.x, this.Ficha[5].Ficha.position.y, Valores.P5);
                if (this.Ficha[6].Colocada === false) this.Ficha[6].Ficha.position.set(this.Ficha[6].Ficha.position.x, this.Ficha[6].Ficha.position.y, Valores.P6);
            }.bind(this)            
        });            
        this.AniAyuda.Iniciar();
    };
    
    this.OcultarAyuda = function() {
        if (this.Opciones.Ayuda === "false") return;
        if (typeof(this.AniAyuda) !== "undefined") {
            this.AniAyuda.Terminar();
        }
        this.AniAyuda = Animaciones.CrearAnimacion([
                { Paso : { P0 : this.Ficha[0].Ficha.position.z, P1 : this.Ficha[1].Ficha.position.z, P2 : this.Ficha[2].Ficha.position.z, P3 : this.Ficha[3].Ficha.position.z, P4 : this.Ficha[4].Ficha.position.z, P5 : this.Ficha[5].Ficha.position.z, P6 : this.Ficha[6].Ficha.position.z  } },
                { Paso : { P0 : 5.5, P1 : 5.5, P2 : 5.5, P3 : 5.5, P4 : 5.5, P5 : 5.5, P6 : 5.5  }, Tiempo : 400, FuncionTiempo : FuncionesTiempo.SinInOut }
            ], {
            FuncionActualizar : function(Valores) { 
                if (this.Ficha[0].Colocada === false) this.Ficha[0].Ficha.position.set(this.Ficha[0].Ficha.position.x, this.Ficha[0].Ficha.position.y, Valores.P0);
                if (this.Ficha[1].Colocada === false) this.Ficha[1].Ficha.position.set(this.Ficha[1].Ficha.position.x, this.Ficha[1].Ficha.position.y, Valores.P1);
                if (this.Ficha[2].Colocada === false) this.Ficha[2].Ficha.position.set(this.Ficha[2].Ficha.position.x, this.Ficha[2].Ficha.position.y, Valores.P2);
                if (this.Ficha[3].Colocada === false) this.Ficha[3].Ficha.position.set(this.Ficha[3].Ficha.position.x, this.Ficha[3].Ficha.position.y, Valores.P3);
                if (this.Ficha[4].Colocada === false) this.Ficha[4].Ficha.position.set(this.Ficha[4].Ficha.position.x, this.Ficha[4].Ficha.position.y, Valores.P4);
                if (this.Ficha[5].Colocada === false) this.Ficha[5].Ficha.position.set(this.Ficha[5].Ficha.position.x, this.Ficha[5].Ficha.position.y, Valores.P5);
                if (this.Ficha[6].Colocada === false) this.Ficha[6].Ficha.position.set(this.Ficha[6].Ficha.position.x, this.Ficha[6].Ficha.position.y, Valores.P6);
            }.bind(this)            
        });            
        this.AniAyuda.Iniciar();
        
    };
    
    this.ComprobarManoTerminada = function() {
        if (this.ManoTerminada === true) return true;
        // Compruebo que el jugador actual no tenga 0 fichas
        var Colocadas = 0, Equipo = "1";
        for (i = 0; i < 7; i++) {
            if (this.Ficha[(this.JugadorActual * 7) + i].Colocada === true) Colocadas ++;
        }
        
        if (Colocadas === 7) {
            var P1 = this.ContarPuntos(0), P2 = this.ContarPuntos(1), P3 = this.ContarPuntos(2), P4 = this.ContarPuntos(3);
            this.MostrarMensaje(this.JugadorActual, "<span>" + this.Opciones.NombreJugador[this.JugadorActual] + "</span>" + 
                                                    "<span " +
                                                        "data-idioma-en=' wons this hand!'" +
                                                        "data-idioma-en=' guanya aquesta má!'" +
                                                        "data-idioma-en=' gana esta mano!'" + "></span>", "verde");
            this.ManoTerminada = true;            
            // Cuento los puntos y muestro los valores
            var Puntos = 0;
            for (i = 0; i < 4; i++) {
                Puntos += this.ContarPuntos(i);
            }
            Equipo = (this.JugadorActual === 0 || this.JugadorActual === 2) ? "1" : "2";
            if (Equipo === "1") {
                this.PuntosEquipo1 += Puntos;
                UI.MostrarVictoria();
            }
            else {
                this.PuntosEquipo2 += Puntos;
                UI.MostrarDerrota();
            }
            document.getElementById("Equipo1").innerHTML = this.PuntosEquipo1;
            document.getElementById("Equipo2").innerHTML = this.PuntosEquipo2;
            
//            if (this.PuntosEquipo1 >= this.Opciones.PuntosPorPartida || this.PuntosEquipo2 >= this.Opciones.PuntosPorPartida) UI.MostrarGanador(Equipo, (Equipo === "1") ? this.PuntosEquipo1 : this.PuntosEquipo2);
            UI.MostrarContinuar(Equipo, Puntos, P1, P2, P3, P4);                        
        }
        // Todos los jugadores han pasado
        if (this.Pasado === 4) {
            var J = (this.JugadorActual + 1) + 1;
            if (J > 4) J = 1;
//            this.MostrarMensaje(this.JugadorActual, "Jugador" + J +  " ha bloqueado la mano!", "verde");
            this.ManoTerminada = true;                        
            // http://www.ludoteka.com/domino.html
            // Por cierre o tranca:     cuando ninguno de los 4 jugadores puede seguir colocando ninguna de sus fichas. 
            //                          En este caso se suman los puntos de las fichas que no han sido jugadas por ambos jugadores de cada pareja, 
            //                          ganando aquella que totalice una suma menor. En caso de empate, la mano no cuenta a efectos de puntuación.
            var P1 = this.ContarPuntos(0), P2 = this.ContarPuntos(1), P3 = this.ContarPuntos(2), P4 = this.ContarPuntos(3);
            if ((P1 + P3) === (P2 + P4)) { // EMPATE (no se contabiliza nada)
                UI.MostrarEmpate(P1, P2, P3, P4);
            }
            else {
                if ((P1 + P3) < (P2 + P4)) { // Gana el equipo 1
                    this.PuntosEquipo1 += (P1 + P2 + P3 + P4);
                    Equipo = "1";
                    UI.MostrarVictoria();
                }
                else if ((P1 + P3) > (P2 + P4)) { // Gana el equipo 2
                    this.PuntosEquipo2 += (P1 + P2 + P3 + P4);
                    Equipo = "2";
                    UI.MostrarDerrota();
                }
                UI.MostrarEmpate(P1, P2, P3, P4);
                
            }

            document.getElementById("Equipo1").innerHTML = this.PuntosEquipo1;
            document.getElementById("Equipo2").innerHTML = this.PuntosEquipo2;
            
        }        

        if (this.ManoTerminada === true) {
            for (var i = 0; i < this.Ficha.length; i++) {
                this.Ficha[i].RotarBocaArriba();
            }
/*            if (this.PuntosEquipo1 >= this.Opciones.PuntosPorPartida || this.PuntosEquipo2 >= this.Opciones.PuntosPorPartida) { // Se ha terminado la partida
                // Oculto el menu para continuar la siguiente mano (desde una victoria)
                UI.OcultarContinuar();           
                // Oculto el menu para continuar la siguiente mano (desde un empate)
                UI.OcultarEmpate();                   
                
                UI.MostrarGanador((this.PuntosEquipo1 >= this.PuntosEquipo2) ? "1" : "2", (this.PuntosEquipo1 >= this.PuntosEquipo2) ? this.PuntosEquipo1 : this.PuntosEquipo2 );
            }*/
            return true;
        }
        
        return false;
    };
    
    this.ContarPuntos = function(Jugador) {
        var Total = 0;
        for (var i = 0; i < 7; i++) {
            if (this.Ficha[(Jugador * 7) + i].Colocada === false) {
                Total += (this.Ficha[(Jugador * 7) + i].Valores[0] + this.Ficha[(Jugador * 7) + i].Valores[1]);
            }
        }
        return Total;
    };
    
    // Función para mostrar un mensaje especifico para un jugador
    this.MostrarMensaje = function(Jugador, Texto, ColFondo) {
        var ColorFondo = (typeof(ColFondo) === "undefined") ? "negro" : ColFondo;
        var Msg = document.getElementById("Msg" + (Jugador + 1));
        Msg.setAttribute("MsgVisible", "true");        
        Msg.setAttribute("ColorFondo", ColorFondo);
        if (this.TimerMsg[Jugador] !== 0) clearTimeout(this.TimerMsg);
        this.TimerMsg[Jugador] = setTimeout(function(J) { document.getElementById("Msg" + (J + 1)).setAttribute("MsgVisible", "false"); this.TimerMsg[J] = 0; }.bind(this, Jugador), this.TiempoTurno * 2);
        Msg.innerHTML = Texto;               
        
        
        var Historial = document.getElementById("Historial");
        Historial.innerHTML = Historial.innerHTML + "<div class='Historial_" + ColorFondo + "'>" + Texto + "</div>";
        Historial.scrollTo(0, Historial.scrollHeight);
    };
    
    // Coloca la ficha presionada por el jugador (si es posible)
    this.JugadorColocar = function() {
//        var Rama = "izquierda";
        if (this.JugadorActual === 0) {
            
            // Miro que no se este colocando una ficha
            for (var f = 0; f < this.Ficha.length; f++) {
                if (typeof(this.Ficha[f].AniColocar) !== "undefined") {
                    if (this.Ficha[f].AniColocar.Terminado() === false)
                        return;
                }
            }
            
            for (var i = 0; i < 7; i++) {
                // Es muy importante saber si la ficha está hover o no
                if (this.Ficha[i].Hover > 0 && this.Ficha[i].Colocada === false) {
                    // Si la ficha se puede colocar en las dos ramas
                    var nPos = -1;
                    if ((this.Ficha[i].Valores[0] === this.FichaIzquierda.ValorLibre() || this.Ficha[i].Valores[1] === this.FichaIzquierda.ValorLibre()) && 
                        (this.Ficha[i].Valores[0] === this.FichaDerecha.ValorLibre()   || this.Ficha[i].Valores[1] === this.FichaDerecha.ValorLibre()) && 
                        (this.FichaIzquierda.ValorLibre() !== this.FichaDerecha.ValorLibre())) {
                        
                        if (this.Ficha[i].Hover === 1) {
                            if (this.Ficha[i].Valores[0] === this.FichaIzquierda.ValorLibre()) nPos = this.FichaIzquierda;  
                            else                                                               nPos = this.FichaDerecha;    
                        }
                        else if (this.Ficha[i].Hover === 2) {
                            if (this.Ficha[i].Valores[1] === this.FichaIzquierda.ValorLibre()) nPos = this.FichaIzquierda;  
                            else                                                               nPos = this.FichaDerecha;    
                        }
                    }
                    else { // la ficha solo se puede colocar en una rama
                        if (this.Ficha[i].Valores[0] === this.FichaIzquierda.ValorLibre() || this.Ficha[i].Valores[1] === this.FichaIzquierda.ValorLibre()) {
                            nPos = this.FichaIzquierda;
                        }
                        if (this.Ficha[i].Valores[0] === this.FichaDerecha.ValorLibre() || this.Ficha[i].Valores[1] === this.FichaDerecha.ValorLibre()) {
                            nPos = this.FichaDerecha;
                        }
                    }
                    
                    if (nPos !== -1) {
                        console.log ("Jugador1 tira " + this.Ficha[i].Valores[0] + " | " + this.Ficha[i].Valores[1]);
                        this.Ficha[i].Colocar(nPos, true);
                        this.MostrarMensaje(this.JugadorActual, "<span>" + this.Opciones.NombreJugador[this.JugadorActual] + "</span> " + 
                                            " <span " +
                                                "data-idioma-en=' throws : '" + 
                                                "data-idioma-cat=' tira : '" + 
                                                "data-idioma-cas=' tira : '>" + 
                                            "</span>" + 
                                            "<img src='./SVG/Domino.svg#Ficha_" + this.Ficha[i].Valores[1] + "-" + this.Ficha[i].Valores[0] +"' />");
                        
                        // Compruebo si se ha terminado la mano
                        if (this.ComprobarManoTerminada() === true) return;
                        
                        this.OcultarAyuda();
                        setTimeout(function() { this.Turno(); }.bind(this), this.TiempoTurno);
                    }
                    
                }
            }
        }        
    };
    
};