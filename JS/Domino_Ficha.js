/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 16/01/2019

        Objeto para una ficha del domino

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 28/01/2019
*/

/* 
    0   0   0   0   0   0   0               3   3   3   3                   6
    -   -   -   -   -   -   -               -   -   -   -                   -
    0   1   2   3   4   5   6               3   4   5   6                   6

    
    1   1   1   1   1   1                   4   4   4
    -   -   -   -   -   -                   -   -   -
    1   2   3   4   5   6                   4   5   6

    2   2   2   2   2                       5   5
    -   -   -   -   -                       -   -
    2   3   4   5   6                       5   6
*/

// Creo el objeto animación
var Animaciones = new ObjetoAnimacion;



var Domino_Ficha = function() {
    this.Valores    = [ 0, 0 ];
    this.Ficha      = new THREE.Object3D();
    this.Hover      = 0;                    // puede ser 0, 1, 2
    this.Colocada   = false;                // La ficha se ha colocado
    this.Escala     = 1.0;                  // Escala para la ficha (para el efecto hover)
    this.Direccion  = "nada";               // Puede ser nada, izquierda, derecha, arriba, abajo, y centro
    this.Rama       = "nada";               // Puede ser nada, izq, y der
    
    // Hay que especificar un valor de 0 a 27 con el tipo de ficha
    // Devuelve el grupo de objetos que forman la ficha listo para aladir a la escena
    this.Crear = function(Tipo) {
        // Asigno los valores de la ficha 
        switch (Tipo) {
            case 0  :    this.Valores = [ 0, 0 ];      break;
            case 1  :    this.Valores = [ 0, 1 ];      break;
            case 2  :    this.Valores = [ 0, 2 ];      break;
            case 3  :    this.Valores = [ 0, 3 ];      break;
            case 4  :    this.Valores = [ 0, 4 ];      break;
            case 5  :    this.Valores = [ 0, 5 ];      break;
            case 6  :    this.Valores = [ 0, 6 ];      break;
            case 7  :    this.Valores = [ 1, 1 ];      break;
            case 8  :    this.Valores = [ 1, 2 ];      break;
            case 9  :    this.Valores = [ 1, 3 ];      break;
            case 10 :    this.Valores = [ 1, 4 ];      break;
            case 11 :    this.Valores = [ 1, 5 ];      break;
            case 12 :    this.Valores = [ 1, 6 ];      break;
            case 13 :    this.Valores = [ 2, 2 ];      break;
            case 14 :    this.Valores = [ 2, 3 ];      break;
            case 15 :    this.Valores = [ 2, 4 ];      break;
            case 16 :    this.Valores = [ 2, 5 ];      break;
            case 17 :    this.Valores = [ 2, 6 ];      break;
            case 18 :    this.Valores = [ 3, 3 ];      break;
            case 19 :    this.Valores = [ 3, 4 ];      break;
            case 20 :    this.Valores = [ 3, 5 ];      break;
            case 21 :    this.Valores = [ 3, 6 ];      break;
            case 22 :    this.Valores = [ 4, 4 ];      break;
            case 23 :    this.Valores = [ 4, 5 ];      break;
            case 24 :    this.Valores = [ 4, 6 ];      break;
            case 25 :    this.Valores = [ 5, 5 ];      break;
            case 26 :    this.Valores = [ 5, 6 ];      break;
            case 27 :    this.Valores = [ 6, 6 ];      break;
        }
                
        // Creo el rectangulo que hace de base negra
        this.Base = new THREE.Mesh(  new THREE.BoxGeometry( 2.0, 1.0, 0.1 ), 
                                     Texturas.MaterialBase);
//        this.Ficha.name = "Ficha";
        this.Ficha.add(this.Base);
        this.Base.position.set(0.0, 0.0, -0.1);
        // Activo las sombras para la ficha
        this.Base.castShadow = true;
        this.Base.receiveShadow = true;
        
                
        // Creo la primera cara
        this.Cara1 = new THREE.Mesh(  new THREE.BoxGeometry( 1.0, 1.0, 0.1 ), Texturas.MaterialCara);        
        this.Ficha.add(this.Cara1);
        this.Cara1.position.set(-0.5, 0.0, 0.0);
        
        this.Textura1 = new THREE.Mesh( new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial( { map: Texturas.Textura[this.Valores[0]], transparent : true, opacity:1.0  }) );
        this.Ficha.add(this.Textura1);
        this.Textura1.position.set(-0.5, 0.0, 0.055);

        
        // Creo la segunda cara
        this.Cara2 = new THREE.Mesh(  new THREE.BoxGeometry( 1.0, 1.0, 0.1 ), Texturas.MaterialCara);
        this.Ficha.add(this.Cara2);
        this.Cara2.position.set(0.5, 0.0, 0.0);
        
        this.Textura2 = new THREE.Mesh( new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial( { map: Texturas.Textura[this.Valores[1]], transparent : true, opacity:1.0  }) );
        this.Ficha.add(this.Textura2);
        this.Textura2.rotation.z = Math.PI;
        this.Textura2.position.set(0.5, 0.0, 0.055);
        
        
        this.Bola = new THREE.Mesh(new THREE.SphereGeometry( 0.1, 32, 32 ), new THREE.MeshPhongMaterial( { color: 0x999999, specular : 0xccffcc, transparent : false, opacity: 1.0 } ));
//        this.Bola.position.set(0.0, 0.0, 0.05);
        this.Ficha.add(this.Bola);
        
        // Roto la ficha para que quede de cara
        this.Ficha.rotation.x = -Math.PI / 2;
        
        return this.Ficha;
    };
    
    this.RotarBocaAbajo = function() {
        this.Ficha.rotation.x = Math.PI / 2;
    };
    
    this.RotarBocaArriba = function() {
        this.Ficha.rotation.x = -Math.PI / 2;
    };
    
    this.RotarV = function() {
        this.Ficha.rotation.z = Math.PI / 2;
    };
    
    this.RotarH = function() {
        this.Ficha.rotation.z = 0.0;
    };
       
    this.AsignarHover = function(Hover) {
        if (typeof(this.AniHover) !== "undefined") {
            if (this.AniHover.Terminado() === false) return;
//            this.AniHover.Terminar();
        }
        
        this.Hover = Hover;
        
        if (typeof(Domino.Partida.FichaDerecha.ValorLibre) === "undefined") return;
        
        // Doble posibilidad
        if ((Domino.Partida.FichaDerecha.ValorLibre()   === this.Valores[0] || Domino.Partida.FichaDerecha.ValorLibre()   === this.Valores[1]) &&   // Si el valor libre derecho coincide con algun valor de la ficha
            (Domino.Partida.FichaIzquierda.ValorLibre() === this.Valores[0] || Domino.Partida.FichaIzquierda.ValorLibre() === this.Valores[1]) &&   // Si el valor libre izquierdo coincide con algun valor de la ficha
            (Hover > 0) &&                                                                                                                          // Si la ficha está hover
            (Domino.Partida.FichaIzquierda.ValorLibre() !== Domino.Partida.FichaDerecha.ValorLibre())) {                                            // Si la rama izquierda y la rama derecha no tienen el mismo valor libre
            if (Hover === 1) {
                this.Cara1.material = Texturas.MaterialCaraR;
                this.Cara2.material = Texturas.MaterialCara;
            }
            else if (Hover === 2) {
                this.Cara1.material = Texturas.MaterialCara;
                this.Cara2.material = Texturas.MaterialCaraR;
            }
        }
        else {
            this.Cara1.material = Texturas.MaterialCara;                
            this.Cara2.material = Texturas.MaterialCara;                            
        }
        
        // Está hover
        if (Hover > 0) {
            this.AniHover = Animaciones.CrearAnimacion([
                    { Paso : { Escala : this.Escala, z : 6.0 } },
                    { Paso : { Escala : 1.2,         z : 5.6                   }, Tiempo : 300, FuncionTiempo : FuncionesTiempo.Lineal }
            ], { FuncionActualizar : function(Valores) { 
//                    this.Ficha.position.z = Valores.z;
                    this.Ficha.scale.set(Valores.Escala, Valores.Escala, Valores.Escala);
                    this.Escala = Valores.Escala;
            }.bind(this) });
        }
        else {
            this.AniHover = Animaciones.CrearAnimacion([
                    { Paso : { Escala : this.Escala, z : 5.6   } },
                    { Paso : { Escala : 1.0,         z : 6.0                     }, Tiempo : 300, FuncionTiempo : FuncionesTiempo.Lineal }
            ], { FuncionActualizar : function(Valores) { 
  //                  this.Ficha.position.z = Valores.z;
                    this.Ficha.scale.set(Valores.Escala, Valores.Escala, Valores.Escala);
                    this.Escala = Valores.Escala;
            }.bind(this) });            
        }
        
        this.AniHover.Iniciar();
    };
    
    
    
    this.Colocar = function(FichaOrigen, Jugador1) {
        var Ret = { PosX : 0, PosZ : -2, RotZ : 0 };
        // Es la primera ficha (6 doble)
        if (FichaOrigen === false) {
            this.Direccion = "centro";
            Ret.RotZ = Math.PI / 2;
            window.ContadorDerecha      = 0;
            window.ContadorIzquierda    = 0;
            window.FinContadorIzquierda = 5;
            window.FinContadorDerecha   = 5;
        }
        else {
            // Miro la dirección de la ficha origen
            switch (FichaOrigen.Direccion) {
                case "centro" :
                    // Si las dos ramas están libres, elijo uno al azar
                    if (FichaOrigen === Domino.Partida.FichaIzquierda && FichaOrigen === Domino.Partida.FichaDerecha) {
                        if (RandInt() === 0)  { 
                            Ret = this.BuscarPosIzq(FichaOrigen);
                            this.Direccion = "izquierda";
                            this.Rama = "izquierda";
                        }
                        else {
                            Ret = this.BuscarPosDer(FichaOrigen);
                            this.Direccion = "derecha";
                            this.Rama = "derecha";
                        }
                    }
                    else { // Solo hay una rama libre
                        if (FichaOrigen === Domino.Partida.FichaIzquierda) {
                            Ret = this.BuscarPosIzq(FichaOrigen);
                            this.Direccion = "izquierda";
                            this.Rama = "izquierda";                            
                        }
                        else {
                            Ret = this.BuscarPosDer(FichaOrigen);
                            this.Direccion = "derecha";
                            this.Rama = "derecha";                            
                        }
                    }
                    break;
                    
                case "izquierda" :
                    if (FichaOrigen.Rama === "izquierda") {
                        // Correción para las fichas dobles si se llega al final de la izquierda
/*                        if (window.ContadorIzquierda === window.FinContadorIzquierda && this.FichaDoble() === true) {
                            window.FinContadorIzquierda++;
                        }*/
                        
                        if (window.ContadorIzquierda !== 5) {
                            Ret = this.BuscarPosIzq(FichaOrigen);
                            this.Direccion = "izquierda";
                        }
                        else if (window.ContadorIzquierda === window.FinContadorIzquierda) {
                            Ret = this.BuscarPosInf(FichaOrigen);
                            this.Direccion = "abajo";
                        }
                    }
                    else {
                        Ret = this.BuscarPosIzq(FichaOrigen);
                        this.Direccion = "izquierda";
                    }                        
                    this.Rama = (FichaOrigen.Rama !== "nada") ? FichaOrigen.Rama : "izquierda";                                                
                    break;
                    
                case "derecha" :
                    if (FichaOrigen.Rama === "derecha") {
                        // Correción para las fichas dobles si se llega al final de la derecha
/*                        if (window.ContadorDerecha === window.FinContadorDerecha && this.FichaDoble() === true) {
                            window.FinContadorDerecha++;
                        }*/
                            
                        if (window.ContadorDerecha !== 5) {
                            Ret = this.BuscarPosDer(FichaOrigen);
                            this.Direccion = "derecha";
                        }
                        else if (window.ContadorDerecha === window.FinContadorDerecha) {
                            Ret = this.BuscarPosSup(FichaOrigen);
                            this.Direccion = "arriba";
                        }
                    }
                    else {
                        Ret = this.BuscarPosDer(FichaOrigen);
                        this.Direccion = "derecha";
                    }                        
                    this.Rama = (FichaOrigen.Rama !== "nada") ? FichaOrigen.Rama : "derecha";                                                
                    break;
                    
                case "abajo" :
                    Ret = this.BuscarPosInfDer(FichaOrigen);
                    this.Rama = "izquierda";
                    this.Direccion = "derecha";
                    break;
                
                case "arriba" :
                    Ret = this.BuscarPosSupIzq(FichaOrigen);
                    this.Direccion = "izquierda";
                    this.Rama = "derecha";
                    break;
                
            }
            // Incremento el contador de la rama actual
            if (this.Rama === "izquierda") {
                window.ContadorIzquierda ++;                
//                Domino.Partida.FichaIzquierda = this;
            }
            else {
                window.ContadorDerecha ++;
//                Domino.Partida.FichaDerecha = this;
            }
            
            if (this.Direccion === "nada") {
                putaputaputa();
            }
            
            console.log("Colocar : r : " + this.Rama + ", d : " + this.Direccion + ", Pos:[" + Ret.PosX + ", " + Ret.PosZ + ", " + Ret.RotZ + "]");
        }
        
        
        // Termino las posibles animaciones en curso
        if (typeof(this.AniHover) !== "undefined")    this.AniHover.Terminar();        
        if (typeof(this.AniColocar) !== "undefined")  this.AniColocar.Terminar();
        
        
        this.Colocada = true;
        
        var Retraso = (typeof(Jugador1) === "undefined") ? 400 : 0;
        
        this.AniColocar = Animaciones.CrearAnimacion([
                { Paso : { Escala : this.Escala,    x : this.Ficha.position.x,  z : this.Ficha.position.z,  rx : this.Ficha.rotation.x, rz : this.Ficha.rotation.z  } },
                { Paso : { Escala : 1.0,            x : Ret.PosX,               z : Ret.PosZ,               rx : -Math.PI / 2,          rz : Ret.RotZ  }, Tiempo : 400, Retraso : Retraso, FuncionTiempo : FuncionesTiempo.SinInOut }
            ], {
            FuncionActualizar : function(Valores) { 
                this.Ficha.scale.set(Valores.Escala, Valores.Escala, Valores.Escala);
                this.Escala = Valores.Escala;
                this.Ficha.position.set(Valores.x, this.Ficha.position.y, Valores.z);
                this.Ficha.rotation.z = Valores.rz;
                this.Ficha.rotation.x = Valores.rx;
            }.bind(this),
            FuncionTerminado : function() {
                if (this.Rama === "nada") {
                    Domino.Partida.FichaIzquierda = this;
                    Domino.Partida.FichaDerecha   = this;                
                }
                else if (this.Rama === "izquierda") Domino.Partida.FichaIzquierda = this;
                else                                Domino.Partida.FichaDerecha   = this;
                
                // Una vez se ha colocado la ficha paso al siguiente turno y jugador
                Domino.Partida.JugadorActual ++;
                if (Domino.Partida.JugadorActual > 3) {
                    Domino.Partida.JugadorActual = 0;
                }
                Domino.Partida.TurnoActual ++;
                
            }.bind(this)
            
        });            
        this.AniColocar.Iniciar();
        
    };
    
    
    
    this.FichaDoble = function() {
        if (this.Valores[0] == this.Valores[1]) return true;
        return false;
    };


    this.ValorLibre = function() {
        switch (this.Direccion) {
            // solo para el 6 doble
            case "centro"       : return this.Valores[0];       
            // Si está rotado 180 grados es el valor 1, si no es el valor 0
            case "izquierda"    : return (this.Ficha.rotation.z === Math.PI) ? this.Valores[1] :  this.Valores[0];
            case "derecha"      : return (this.Ficha.rotation.z === Math.PI) ? this.Valores[0] :  this.Valores[1];
            case "arriba"       : return (this.Ficha.rotation.z === Math.PI / 2) ? this.Valores[1] : this.Valores[0];
            case "abajo"        : return (this.Ficha.rotation.z === Math.PI / 2) ? this.Valores[0] : this.Valores[1];
        }
        return -1;
    };
    

    this.BuscarPosIzq = function(FichaDesde) {
        var Ret = { PosX : 0, PosZ : FichaDesde.Ficha.position.z, RotZ : 0 };
        if (this.FichaDoble() === true) { 
            Ret.RotZ = Math.PI / 2;
            Ret.PosX = FichaDesde.Ficha.position.x - 1.5;
        }
        else {
            if (this.Valores[0] === FichaDesde.ValorLibre()) Ret.RotZ = Math.PI;
            Ret.PosX = (FichaDesde.FichaDoble() === true && FichaDesde.Ficha.rotation.z !== 0) ? FichaDesde.Ficha.position.x - 1.5 : FichaDesde.Ficha.position.x - 2.0;            
        }
        return Ret;
    };

    this.BuscarPosDer = function(FichaDesde) {
        var Ret = { PosX : 0, PosZ : FichaDesde.Ficha.position.z, RotZ : 0 };
        if (this.FichaDoble() === true) { 
            Ret.RotZ = Math.PI / 2;
            Ret.PosX = FichaDesde.Ficha.position.x + 1.5;
        }
        else {
            if (this.Valores[1] === FichaDesde.ValorLibre()) Ret.RotZ = Math.PI;
            Ret.PosX = (FichaDesde.FichaDoble() === true && FichaDesde.Ficha.rotation.z !== 0) ? FichaDesde.Ficha.position.x + 1.5 : FichaDesde.Ficha.position.x + 2.0;            
        }
        return Ret;        
    };
    
    this.BuscarPosSup = function(FichaDesde) {
        var Ret = { PosX : 0, PosZ : FichaDesde.Ficha.position.z, RotZ : 0 };
        if (this.Valores[0] === FichaDesde.ValorLibre()) Ret.RotZ = Math.PI / 2;
        else                                             Ret.RotZ = Math.PI + (Math.PI / 2);
        if (FichaDesde.FichaDoble() === true) {
            Ret.PosX = FichaDesde.Ficha.position.x;            
            Ret.PosZ = FichaDesde.Ficha.position.z - 2.0;            
        }
        else {
            Ret.PosX = FichaDesde.Ficha.position.x + 0.5;
            Ret.PosZ = FichaDesde.Ficha.position.z - 1.5;            
        }
        return Ret;
    };
    
    this.BuscarPosSupIzq = function(FichaDesde) {
        var Ret = { PosX : 0, PosZ : FichaDesde.Ficha.position.z, RotZ : 0 };
        if (this.FichaDoble() === true) {
            Ret.PosX = FichaDesde.Ficha.position.x;
            Ret.PosZ = FichaDesde.Ficha.position.z - 1.5;
            Ret.RotZ = 0.0;
        }
        else {
            if (this.Valores[0] === FichaDesde.ValorLibre()) Ret.RotZ = Math.PI;
            else                                             Ret.RotZ = 0;
            Ret.PosX = FichaDesde.Ficha.position.x - 0.5;
            Ret.PosZ = FichaDesde.Ficha.position.z - 1.5;
        }
        return Ret;        
    };
    
    this.BuscarPosInf  = function(FichaDesde) {
        var Ret = { PosX : 0, PosZ : FichaDesde.Ficha.position.z, RotZ : 0 };
        if (this.Valores[0] === FichaDesde.ValorLibre()) Ret.RotZ = Math.PI + (Math.PI / 2);
        else                                             Ret.RotZ = Math.PI / 2;
        if (FichaDesde.FichaDoble() === true) {
            Ret.PosX = FichaDesde.Ficha.position.x;            
            Ret.PosZ = FichaDesde.Ficha.position.z + 2.0;            
        }
        else {
            Ret.PosX = FichaDesde.Ficha.position.x - 0.5;
            Ret.PosZ = FichaDesde.Ficha.position.z + 1.5;            
        }
        return Ret;        
    };
    
    this.BuscarPosInfDer  = function(FichaDesde) {
        var Ret = { PosX : 0, PosZ : FichaDesde.Ficha.position.z, RotZ : 0 };
        if (this.FichaDoble() === true) {
            Ret.PosX = FichaDesde.Ficha.position.x;
            Ret.PosZ = FichaDesde.Ficha.position.z + 1.5;
            Ret.RotZ = 0.0;
        }
        else {
            if (this.Valores[0] === FichaDesde.ValorLibre()) Ret.RotZ = 0;
            else                                             Ret.RotZ = Math.PI;
            Ret.PosX = FichaDesde.Ficha.position.x + 0.5;
            Ret.PosZ = FichaDesde.Ficha.position.z + 1.5;
        }
        return Ret;        
    };


};


