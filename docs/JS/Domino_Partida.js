/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 19/01/2019

        Objeto para la partida en curso

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 19/01/2019
*/

var Domino_Partida = function() {
    
    this.Jugador          = [];
    this.JugadorActual    = 0;    // Jugador del turno actual
    this.TurnoActual      = 0; 
    
    this.FichaIzquierda   = { };
    this.FichaDerecha     = { };
    
    this.Pasado           = 0;
    this.Ficha            = [];
    this.TiempoTurno      = 1000;
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
    
    // Función que devuelve el jugador que empieza la partida
    this.JugadorInicio = function() {
        // Miro que jugador empieza
        for (this.JugadorActual = 0; this.JugadorActual < 4; this.JugadorActual++) {
            for (j = 0; j < 7; j++) {
                if (this.Ficha[this.Jugador[this.JugadorActual][j]].Valores[0] === 6 && this.Ficha[this.Jugador[this.JugadorActual][j]].Valores[1] === 6) {
                    return this.JugadorActual;
                }
            }
        }        
    };
    
    this.Empezar = function() {
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
                this.Jugador[i][j] = (i *7) + j;
                this.Ficha[this.Jugador[i][j]].Colocada = false;
            }
        }
        
        // Coloco las fichas del jugador 1 y 3
        for (i = 0; i < 7; i++) {
            this.Ficha[this.Jugador[0][i]].RotarV();
            this.Ficha[this.Jugador[0][i]].Ficha.position.set(-4.5 + (1.5 * i), 0, 5.5);
            this.Ficha[this.Jugador[2][i]].RotarV();
            this.Ficha[this.Jugador[2][i]].Ficha.position.set(-4.5 + (1.5 * i), 0, -12);
        }
        
        // Coloco las fichas del jugador 2 y 4
        for (i = 0; i < 7; i++) {
            this.Ficha[this.Jugador[1][i]].RotarH();
            this.Ficha[this.Jugador[1][i]].Ficha.position.set(15, 0, -6.5 + (1.5 * i));
            this.Ficha[this.Jugador[3][i]].RotarH();
            this.Ficha[this.Jugador[3][i]].Ficha.position.set(-15, 0, -6.5 + (1.5 * i));
        }
        
        // Miro que jugador empieza
        this.JugadorInicio();
        
        this.MostrarMensaje(this.JugadorActual, "Jugador " + (this.JugadorActual + 1) + " empieza.");
        
        this.TurnoActual = 0;        
        window.ContadorDerecha      = 0;
        window.ContadorIzquierda    = 0;
        window.FinContadorIzquierda = 5;
        window.FinContadorDerecha   = 5;
        
        this.Turno();        
    };
    
    
    // Función que ejecuta un turno
    this.Turno = function() {

        console.log("Turno : " + this.TurnoActual);
        
//        this.AnimarLuz(this.JugadorActual);
        
        // En el primer turno se saca el doble 6
        if (this.TurnoActual === 0) {
            console.log("Jugador" + (this.JugadorActual + 1) + " empieza");
            for (var i = 0; i < 7; i ++) {
                if (this.Ficha[this.Jugador[this.JugadorActual][i]].Valores[0] === 6 && this.Ficha[this.Jugador[this.JugadorActual][i]].Valores[1] === 6) {
                    this.Ficha[this.Jugador[this.JugadorActual][i]].Colocar(false);
                    setTimeout(function() { this.Turno(); }.bind(this), this.TiempoTurno);
                }
            }
            
        }
        else {            
            console.log("Izq: " + this.FichaIzquierda.ValorLibre() + " Der: " + this.FichaDerecha.ValorLibre());            
            // Cuento las posibilidades para la izquierda y la derecha
            var Posibilidades = [];
            for (var i = 0; i < 7; i++) {
                if (this.Ficha[this.Jugador[this.JugadorActual][i]].Colocada === false) {
                    if (this.Ficha[this.Jugador[this.JugadorActual][i]].Valores[0] === this.FichaIzquierda.ValorLibre() || this.Ficha[this.Jugador[this.JugadorActual][i]].Valores[1] === this.FichaIzquierda.ValorLibre()) {
                        Posibilidades.push({ Pos : this.Jugador[this.JugadorActual][i], Rama : "izquierda" });
                    }
                    if (this.Ficha[this.Jugador[this.JugadorActual][i]].Valores[0] === this.FichaDerecha.ValorLibre() || this.Ficha[this.Jugador[this.JugadorActual][i]].Valores[1] === this.FichaDerecha.ValorLibre()) {
                        Posibilidades.push({ Pos : this.Jugador[this.JugadorActual][i], Rama : "derecha" });                        
                    }
                }
            }
            // Ordeno las posibilidades y dejo arriba las que tienen mas valor (Que son las que se tiene que sacar de encima antes)
            Posibilidades.sort(function(a, b){                
                return (this.Ficha[a.Pos].Valores[0] + this.Ficha[a.Pos].Valores[1] > this.Ficha[b.Pos].Valores[0] + this.Ficha[b.Pos].Valores[1]) ? a : b;
            }.bind(this));
            
            // Si tiene posibilidades
            if (Posibilidades.length > 0)  {
                this.Pasado = 0;

                // Turno de la máquina
                if (this.JugadorActual !== 0) {
                    // IA 1.0
                    var Rnd = 0;//RandInt(this.Posibilidades.length -1, 0);
                    if (Posibilidades[0].Rama === "izquierda") { 
                        this.Ficha[Posibilidades[0].Pos].Colocar(this.FichaIzquierda);
                        
                    }
                    else {
                        this.Ficha[Posibilidades[0].Pos].Colocar(this.FichaDerecha);
                        
                    }                    
//                    if (this.Ficha[Posibilidades[0].Pos].Rama === "izquierda") this.FichaIzquierda = Posibilidades[0].Pos;
//                    else                                                       this.FichaDerecha = Posibilidades[0].Pos;
                    
//                    Posibilidades[Rnd].Colocar();
                    console.log("Jugador" + (this.JugadorActual + 1) + " tira : " + this.Ficha[Posibilidades[0].Pos].Valores[0] + " | " + this.Ficha[Posibilidades[0].Pos].Valores[1]);
                    setTimeout(function() { this.Turno(); }.bind(this), this.TiempoTurno);
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
        
        // Compruebo si se ha terminado la partida
        if (this.Terminada() === true) return;
        
        this.TurnoActual ++;
        this.JugadorActual ++;
        if (this.JugadorActual > 3) {
            this.JugadorActual = 0;
        }
        // Se ha pasado, 
        if (this.Pasado > 0) {
            setTimeout(function() { this.Turno(); }.bind(this), this.TiempoTurno);
        }        
    };
    
    this.Terminada = function() {
        // Compruebo que el jugador actual no tenga 0 fichas
        var Colocadas = 0;
        for (i = 0; i < 7; i++) {
            if (this.Ficha[this.Jugador[this.JugadorActual][i]].Colocada === true) Colocadas ++;
        }
        
        if (Colocadas === 7) {
            this.MostrarMensaje(this.JugadorActual, "Jugador" + (this.JugadorActual + 1) +  " gana la partida!");
            document.getElementById("Empezar").style.display = "block";
            return true;
        }
        // Todos los jugadores han pasado
        if (this.Pasado === 4) {
            //this.MostrarMensaje(this.JugadorActual, "Jugador" + (this.JugadorActual + 1) +  " gana la partida!");
            document.getElementById("Empezar").style.display = "block";
            return true;            
        }        
    };
    
    // Función para mostrar un mensaje especifico para un jugador
    this.MostrarMensaje = function(Jugador, Texto) {
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
                setTimeout(function() { document.getElementById("Msg1").setAttribute("MsgVisible", "false"); }, this.TiempoTurno);
                Msg1.innerHTML = Texto;
                break;
            case 1 :
                Msg2.setAttribute("MsgVisible", "true");
                setTimeout(function() { document.getElementById("Msg2").setAttribute("MsgVisible", "false"); }, this.TiempoTurno);
                Msg2.innerHTML = Texto;
                break;
            case 2 : 
                Msg3.setAttribute("MsgVisible", "true");
                setTimeout(function() { document.getElementById("Msg3").setAttribute("MsgVisible", "false"); }, this.TiempoTurno);
                Msg3.innerHTML = Texto;
                break;
            case 3 :
                Msg4.setAttribute("MsgVisible", "true");
                setTimeout(function() { document.getElementById("Msg4").setAttribute("MsgVisible", "false"); }, this.TiempoTurno);
                Msg4.innerHTML = Texto;
                break;
        }        
    };
    
    // Coloca la ficha presionada por el jugador (si es posible)
    this.JugadorColocar = function() {
//        var Rama = "izquierda";
        if (this.JugadorActual === 0 && this.Jugador.length > 0) {
            for (var i = 0; i < 7; i++) {
                if (this.Ficha[this.Jugador[0][i]].Hover > 0 && this.Ficha[this.Jugador[0][i]].Colocada === false) {
                    // Si la ficha se puede colocar en las dos ramas
                    var nPos = -1;
                    if ((this.Ficha[this.Jugador[0][i]].Valores[0] === this.FichaIzquierda.ValorLibre() || this.Ficha[this.Jugador[0][i]].Valores[1] === this.FichaIzquierda.ValorLibre()) && 
                        (this.Ficha[this.Jugador[0][i]].Valores[0] === this.FichaDerecha.ValorLibre()   || this.Ficha[this.Jugador[0][i]].Valores[1] === this.FichaDerecha.ValorLibre()) && 
                        (this.FichaIzquierda.ValorLibre() !== this.FichaDerecha.ValorLibre())) {
                        
                        if (this.Ficha[this.Jugador[0][i]].Hover === 1) {
                            if (this.Ficha[this.Jugador[0][i]].Valores[0] == this.FichaIzquierda.ValorLibre()) nPos = this.FichaIzquierda;  
                            else                                                                               nPos = this.FichaDerecha;    
                        }
                        else if (this.Ficha[this.Jugador[0][i]].Hover === 2) {
                            if (this.Ficha[this.Jugador[0][i]].Valores[1] == this.FichaIzquierda.ValorLibre()) nPos = this.FichaIzquierda;  
                            else                                                                               nPos = this.FichaDerecha;    
                        }
                    }
                    else { // la ficha solo se puede colocar en una rama
                        if (this.Ficha[this.Jugador[0][i]].Valores[0] === this.FichaIzquierda.ValorLibre() || this.Ficha[this.Jugador[0][i]].Valores[1] === this.FichaIzquierda.ValorLibre()) {
                            nPos = this.FichaIzquierda;
                        }
                        if (this.Ficha[this.Jugador[0][i]].Valores[0] === this.FichaDerecha.ValorLibre() || this.Ficha[this.Jugador[0][i]].Valores[1] === this.FichaDerecha.ValorLibre()) {
                            nPos = this.FichaDerecha;
                        }
                    }
                    
                    if (nPos !== -1) {
                        console.log ("Jugador1 tira " + this.Ficha[this.Jugador[0][i]].Valores[0] + " | " + this.Ficha[this.Jugador[0][i]].Valores[1]);
                        this.Ficha[this.Jugador[0][i]].Colocar(nPos);
                        
                        // Compruebo si se ha terminado la partida
                        if (this.Terminada() === true) return;
                        
                        this.TurnoActual ++;
                        this.JugadorActual ++;
                        
                        setTimeout(function() { this.Turno(); }.bind(this), this.TiempoTurno);
                    }
                    
                    //if (this.Colocar(this.Jugador[0][i]) === true) {
//                    }
                }
            }
        }        
    };
    
};