/* Objeto para crear animaciones de tiempo creado por Josep Antoni Bover.
 *  Creado el 25/08/2016
 *  Ultima modificación el 27/08/2017
 * */



/* Funciones de tiempo :    https://github.com/mietek/ease-tween/blob/master/src/index.js
                            https://gist.github.com/mckamey/3783009      */

// Ejemplo : 
    /*  var Animacion = ObjetoAnimacion.CrearAnimacion([
            { 'Paso' : { X : 100, Y: -100 }}, // El primer paso es el punto de inicio, y no tiene ni retraso, ni tiempo, ni función de tiempo.
            { 'Paso' : { X :   0, Y:    0 }, 'Retraso' : 100, 'Tiempo' : 1000, 'FuncionTiempo' : FuncionesTiempo.SinOut }
            { 'Paso' : { X : 100, Y: -100 }, 'Retraso' : 100, 'Tiempo' : 1000, 'FuncionTiempo' : FuncionesTiempo.SinIn  }
        ], { 
            "Invertir"          : true,                            // Invertir la animación al terminar los pasos
            "Repetir"           : 2,                               // Repetir 2 veces
            "FuncionActualizar" : function(Valores) { },           // Función que se llama cada vez que se actualizan los valores
            "FuncionIniciado"   : function() { }                   // Función que se llama al iniciar la animación
            "FuncionTerminado"  : function() { }                   // Función que se llama al terminar la animación
            "Const"             : { ... }                          // Array de variables constantes que podrás utilizar desde Valores.Const
        });*/
 
 // Añadido 26/08/2017 : 
 // - Solucionado bug al utilizar mas de una vez la funcion ObjetoAnimacion_Animacion.Iniciar() que des-ajustaba los tiempos (no se reiniciaba this._Avance a 0...)
 // - Creado el objeto ObjetoAnimacion_Rand para usarse con los valores de los pasos, de esta forma cada vez que llames a ObjetoAnimacion_Animacion.Iniciar() utilizará la función rand
 //   con los valores min/max especificados inicialmente. (1 preset de animación con valores aleatórios :O)
"use strict";     
    
var FuncionesTiempo = {
    Linear          : function(Tiempo) { return Tiempo;                                   },
    SinIn           : function(Tiempo) { return 1 - Math.cos(Tiempo * Math.PI / 2);       },
    SinOut          : function(Tiempo) { return Math.sin(Tiempo * Math.PI / 2);           },
    SinInOut        : function(Tiempo) { return -0.5 * (Math.cos(Math.PI * Tiempo) - 1);  },
    CubicInOut      : function(Tiempo) { 
        return (Tiempo < 0.5) ? 
            4.0 * Tiempo * Tiempo * Tiempo : 
            0.5 * Math.pow(2.0 * Tiempo - 2.0, 3.0) + 1.0; 
    },
    CircularInOut   : function(Tiempo) {
        return (Tiempo < 0.5) ?
            0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * Tiempo * Tiempo)) :
            0.5 * (Math.sqrt((3.0 - 2.0 * Tiempo) * (2.0 * Tiempo - 1.0)) + 1.0);
    }
};
    
    
var ObjetoAnimacion = function() {
    // Array de animaciones
    this.Animaciones = [];
    this.EnPausa = false;
    this.Tick = 0;
    // Actualiza las animaciones
    this.Actualizar = function(nTick) {
        if (this.EnPausa === true) { return; }
//        var Tick;
        if (typeof(nTick) === 'undefined') { this.Tick = Date.now(); }
        else                               { this.Tick = nTick;}
        
        for (var i = this.Animaciones.length - 1; i > -1; i--) {
            if (this.Animaciones[i].Actualizar(this.Tick) === true) { // Si ha terminado, elimino la animación del array de animaciones pendientes
                this.Animaciones.splice(i, 1);
            }
        }
    };
    
    // Función que pausa TODAS las animaciones de este objeto
    this.Pausa = function() {
        console.log("ObjetoAnimacion::Pausa");
        this.EnPausa = true;
    };
    
    // Función que reanuda TODAS las animaciones de este objeto
    this.Reanudar = function() {
        console.log("ObjetoAnimacion::Reanudar");
        this.Tick = Date.now();
        // Actualizo el ultimo tick de todas las animaciones para que no pase nada de tiempo desde que se ha pausado
        for (var i = this.Animaciones.length - 1; i > -1; i--) {
            this.Animaciones[i]._UltimoTick = this.Tick - 1;
        }
        this.EnPausa = false;
    };
        
    // Termina y elimina todas las animaciones en curso
    this.Limpiar = function() {
        for (var i = this.Animaciones.length - 1; i > -1; i--) {
            this.Animaciones[i].Terminar();
        }
        this.Animaciones = [];
    };

    this.CrearAnimacion = function(Pasos, Opciones) {
        return new ObjetoAnimacion_Animacion(Pasos, Opciones, this, false);
    };    
    
    // NOTA las transiciones y las repeticiones no se llevan muy bien...
    // no se puede utilizar la opción Invertir
    this.CrearTransicion = function(Pasos, Opciones) {
        return new ObjetoAnimacion_Animacion(Pasos, Opciones, this, true);
    };    
};


// Función que contiene los datos de una animación
var ObjetoAnimacion_Animacion = function(ArrayPasos, Opciones, Padre, nTransicion) {    
    this._Padre              = Padre;                           // ObjetoAnimacion padre
    this._UltimoTick         = 0;                               // Ultimo date.now que se ha obtenido con la función Actualizar
    this._PasosIniciales     = ArrayPasos;                      // Array con los parámetros    
    this.Pasos               = [];                              // Array con los parámetros    
    this._PosPasos           = 1;                               // Posición dentro del array de datos
    this._Avance             = 0;                               // Avance puede ser de 0 a 1
    this._Invertido          = nTransicion;                     // Invertir animación (para las transiciones empieza en true)
    this._Terminado          = false;                           // Animación terminada
    this._Opciones           = { Repetir : 0, Invertir : false, FuncionActualizar : function(Valores) { }, FuncionIniciado : function() { }, FuncionTerminado : function() { } };
    if (typeof (Opciones) !== 'undefined') { 
        if (typeof Opciones.Repetir !== "undefined")           { this._Opciones.Repetir = Opciones.Repetir;                     }
        if (typeof Opciones.Invertir !== "undefined")          { this._Opciones.Invertir = Opciones.Invertir;                   }
        if (typeof Opciones.FuncionActualizar !== "undefined") { 
            this._Opciones.FuncionActualizar = Opciones.FuncionActualizar; 
        }
        if (typeof Opciones.FuncionIniciado !== "undefined")   { this._Opciones.FuncionIniciado = Opciones.FuncionIniciado;     }
        if (typeof Opciones.FuncionTerminado !== "undefined")  { 
            this._Opciones.FuncionTerminado = Opciones.FuncionTerminado;  
        }
        if (typeof Opciones.Const !== "undefined")             { this.Const = Opciones.Const;                                   }
    }
    // Completo los datos de cada paso
/*    for (var Paso in this.Pasos) {
        if (typeof this.Pasos[Paso].Tiempo === "undefined")         { this.Pasos[Paso].Tiempo = 1; }
        if (typeof this.Pasos[Paso].Retraso === "undefined")        { this.Pasos[Paso].Retraso = 0; }
        if (typeof this.Pasos[Paso].FuncionTiempo === "undefined")  { this.Pasos[Paso].FuncionTiempo = FuncionesTiempo.Linear; }
    }*/

    // Miro si hay valores aleatorios los inicio 
    for (var i = 0; i < this._PasosIniciales.length; i++) {        
        var nPaso = { };
        for (var Indice in this._PasosIniciales[i]) {   
            nPaso[Indice] = { };
            for (var Indice2 in this._PasosIniciales[i][Indice]) {   
                if (this._PasosIniciales[i][Indice][Indice2] instanceof ObjetoAnimacion_Rand) { 
                    nPaso[Indice][Indice2] = this._PasosIniciales[i][Indice][Indice2].Iniciar();
                }
                else {
                    nPaso[Indice][Indice2] = this._PasosIniciales[i][Indice][Indice2];
                }
            }
        }
        if (typeof this._PasosIniciales[i].Retraso !== "undefined")       { nPaso.Retraso = this._PasosIniciales[i].Retraso;             }
        else                                                              { nPaso.Retraso = 0; }
        if (typeof this._PasosIniciales[i].Tiempo !== "undefined")        { nPaso.Tiempo = this._PasosIniciales[i].Tiempo;               }
        else                                                              { nPaso.Tiempo = 1; }
        if (typeof this._PasosIniciales[i].FuncionTiempo !== "undefined") { nPaso.FuncionTiempo = this._PasosIniciales[i].FuncionTiempo; }
        else                                                              { nPaso.FuncionTiempo = FuncionesTiempo.Linear; }
        this.Pasos.push( nPaso );
    }
    
    this._PasoOrig           = this.Pasos[this._PosPasos - 1]; // Array de pasos inicial
    this._PasoDest           = this.Pasos[this._PosPasos];     // Siguiente array de pasos
    this._Retraso            = this._PasoDest.Retraso;
    
    

    // Valores iniciales
    for (var Indice in this._PasoOrig.Paso) {                            
        this[Indice] = this._PasoOrig.Paso[Indice];
    }
    // usar ObjetoAnimacion_Animacion.AsignarValoresIniciales
    // this._Opciones.FuncionActualizar(this);
    
    this.Iniciar = function() {
        var AniCreada = false;
        // Agrego la animacion al array de animaciones del padre (si no existe)
        for (var i = 0; i < this._Padre.Animaciones.length; i++) {
            if (this._Padre.Animaciones[i] === this) {
                AniCreada = true;
                break;
            }
        }        
        if (AniCreada === false) { // No se está animando
            this._Padre.Animaciones.push(this);
            
//            this.Pasos = this._PasosIniciales;
            
            this._PosPasos = 1;
            this._PasoOrig           = this.Pasos[this._PosPasos - 1]; 
            this._PasoDest           = this.Pasos[this._PosPasos];
            this._Retraso            = this._PasoDest.Retraso;
            this._UltimoTick         = 0;
            this._Avance             = 0;
            // TODO : s'ha de copiar el array de pasos per executar els ObjetoAnimacion_Rand, i recarregar-lo despres cada cop al iniciar...
            
            // Busco las variables que sean una instancia de ObjetoAnimacion_Rand y ejecuto el rand
            for (var i = 0; i < this._PasosIniciales.length; i++) {
                for (var Valor in this._PasosIniciales[i].Paso) {
                    if (this._PasosIniciales[i].Paso[Valor] instanceof ObjetoAnimacion_Rand) { 
                        this.Pasos[i].Paso[Valor] = this._PasosIniciales[i].Paso[Valor].Iniciar();
                    }
                }
            }
            
            this._Opciones.FuncionIniciado();
        }
        this._Terminado = false;
    };
    
    /* Asigna los valores iniciales de la animación a las variables y ejecuta la primera FuncionActualizar */
    this.AsignarValoresIniciales = function() {
        this._Opciones.FuncionActualizar(this);
    };
    
    
    // Inicia la transición (de principio a fin, o del final al principio
    this.Transicion = function() {
        this._Invertido = !this._Invertido;

        var AniCreada = false;
        // Agrego la animacion al array de animaciones del padre (si no existe)
        for (var i = 0; i < this._Padre.Animaciones.length; i++) {
            if (this._Padre.Animaciones[i] === this) {
                AniCreada = true;
                break;
            }
        }
        if (AniCreada === false) { // No se está animando
            this._Padre.Animaciones.push(this);
            if (this._Invertido === false) {
                // Si está en el paso final, asigno el paso actual al primer paso
                this._PosPasos = 1;
                this._PasoOrig           = this.Pasos[this._PosPasos - 1]; 
                this._PasoDest           = this.Pasos[this._PosPasos];
                this._Retraso            = this._PasoDest.Retraso;
            }
            else {
                // Si está en el paso inicial, asigno el paso actual al ultimo paso
                this._PosPasos = this.Pasos.length - 1;
                this._PasoOrig           = this.Pasos[this._PosPasos]; 
                this._PasoDest           = this.Pasos[this._PosPasos - 1];
                this._Retraso            = this._PasoOrig.Retraso;
            }
            this._Avance = 0;
            this._UltimoTick = 0;
        }
        else { // Animación en curso
            var PasoD = this._PasoDest;
            var PasoO = this._PasoOrig;
            this._PasoDest = PasoO;
            this._PasoOrig = PasoD;
/*            this.Cancelar();*/
            var Avance = Math.abs(this._Avance - 1);
            this._Avance = Avance;
            var FuncionTiempo = this._PasoDest.FuncionTiempo(this._Avance);            
            for (var Indice in this._PasoOrig.Paso) {                    
                this[Indice] = PasoO[Indice] - (PasoO[Indice] - PasoD[Indice]) * FuncionTiempo;
            }            
        }
        
        this._Terminado = false;
        
    };

    // Función que termina la animación y la deja tal y como está
    this.Cancelar = function() {
        this._Opciones.FuncionIniciado();
        this._Opciones.FuncionTerminado();
        this._Terminado = true;                       
    };

    // Función que termina la animación y deja los valores en su estado final
    this.Terminar = function() {
        // Busco las variables que sean una instancia de ObjetoAnimacion_Rand y pongo el valor máximo para tener algun valor de referencia en las futuras funciones Iniciado y Terminado
        for (var i = 0; i < this.Pasos.length; i++) {
            this.Pasos.forEach(function(Valor, Indice, Array) {
                if (Valor instanceof ObjetoAnimacion_Rand) { 
                    this.Pasos[Indice] = Valor.Max;
                }
            });
        }        
        
        this._Opciones.FuncionIniciado();
        for (var Indice in this.Pasos[this.Pasos.length - 1].Paso) {                    
            this[Indice] = this.Pasos[this.Pasos.length - 1].Paso[Indice];
        }                        
        this._Opciones.FuncionTerminado();
        this._Terminado = true;            
        this._Opciones.FuncionActualizar(this);
    };

    this.Actualizar = function(t) {
        if (this._Terminado === true) { return true; }
        var Ret = 0;
        if (this._UltimoTick !== 0) {
            (this._Invertido === false) ? Ret = this.ActualizarNormal(t) : Ret = this.ActualizarInvertido(t);
        }
        this._UltimoTick = t;
        return Ret;
    };

    // Actualiza la animación
    this.ActualizarNormal = function(t) {
        // Tiempo desde el ultimo frame a este frame
        var TiempoFrame = t - this._UltimoTick;
        // Aplico el retraso si existe
        if (this._Retraso > 0) {
            this._Retraso = this._Retraso - TiempoFrame; 
        }
        // Avance de la animación
        else {
            // Sumo o resto el avance de la animación
            this._Avance += (TiempoFrame / this._PasoDest.Tiempo);
//            console.log(this._Avance);
            var FuncionTiempo = this._PasoDest.FuncionTiempo(this._Avance);
            // Paso por completar
            if (this._Avance < 1 && this._Avance > -1) {
                for (var Indice in this._PasoDest.Paso) {                    
                    this[Indice] = this._PasoOrig.Paso[Indice] - (this._PasoOrig.Paso[Indice] - this._PasoDest.Paso[Indice]) * FuncionTiempo;
                }
                this._Opciones.FuncionActualizar(this);
            }
            // Paso completado
            else {
                // Valores finales de este paso
                for (var Indice in this._PasoDest.Paso) {                    
                    this[Indice] = this._PasoDest.Paso[Indice];
                }    
                this._Opciones.FuncionActualizar(this);
                // Avanzo al siguiente paso
                this._PosPasos ++;
                if (this._PosPasos < this.Pasos.length) {
                    this._PasoOrig = this.Pasos[this._PosPasos - 1];
                    this._PasoDest = this.Pasos[this._PosPasos];
                    this._Retraso = this._PasoDest.Retraso;                    
                    this._Avance = 0;
                }
                // No hay mas pasos
                else {
                    if (this._Opciones.Invertir === false) {
                        // no hay mas repeticiones
                        if (this._Opciones.Repetir <= 0) {
                            this._Opciones.FuncionTerminado();
                            this._Terminado = true;
//                            console.log("--------------");
                        }
                        // siguiente repetición
                        else {
                            this._Opciones.Repetir --;
                            this._PosPasos = 1;
                            this._PasoOrig = this.Pasos[this._PosPasos - 1]; 
                            this._PasoDest = this.Pasos[this._PosPasos];                                
                            this._Retraso = this._PasoDest.Retraso;                    
                            this._Avance = 0;
                        }
                    }
                    // invierto la animación
                    else {
                        this._PosPasos = this.Pasos.length - 1;
                        this._PasoOrig = this.Pasos[this._PosPasos]; 
                        this._PasoDest = this.Pasos[this._PosPasos - 1];                                
                        this._Retraso = this._PasoOrig.Retraso;                    
                        this._Avance = 0;
                        this._Invertido = true;
                    }
                }
            }
        }                
        return this._Terminado;
    };
    
    // Actualiza la animación a la inversa
    this.ActualizarInvertido = function(t) {
//        console.log("ActualizarInvertido");
        // Tiempo desde el ultimo frame a este frame
        var TiempoFrame = t - this._UltimoTick;
        // Sumo o resto el avance de la animación
        this._Avance += (TiempoFrame / this._PasoOrig.Tiempo);
        var FuncionTiempo = this._PasoDest.FuncionTiempo(this._Avance);
        // Paso por completar
        if (this._Avance < 1 && this._Avance > -1) {
            for (var Indice in this._PasoDest.Paso) {                    
                this[Indice] = this._PasoOrig.Paso[Indice] - (this._PasoOrig.Paso[Indice] - this._PasoDest.Paso[Indice]) * FuncionTiempo;
            }
            this._Opciones.FuncionActualizar(this);
        }
        // Paso completado
        else {
            // Aplico el retraso si existe
            if (this._Retraso > 0) {
                this._Retraso = this._Retraso - TiempoFrame; 
            }
            // Siguiente paso
            else {
                // Valores finales de este paso
                for (var Indice in this._PasoDest.Paso) {                    
                    this[Indice] = this._PasoDest.Paso[Indice];
                }    
                this._Opciones.FuncionActualizar(this);
                // Avanzo al siguiente paso
                this._PosPasos --;
                if (this._PosPasos > 0) {
                    this._PasoOrig = this.Pasos[this._PosPasos];
                    this._PasoDest = this.Pasos[this._PosPasos - 1];
                    this._Retraso = this._PasoOrig.Retraso;                    
                    this._Avance = 0;
                }
                // No hay mas pasos
                else {
                    if (this._Opciones.Invertir === true) {
                        this._Invertido = false;
                    }
                    // No hay mas repeticiones
                    if (this._Opciones.Repetir === 0) {
                        this._Opciones.FuncionTerminado();
                        this._Terminado = true;
                    }
                    else {
                        this._Opciones.Repetir --;
                        this._PosPasos = 1;
                        this._PasoOrig = this.Pasos[this._PosPasos - 1]; 
                        this._PasoDest = this.Pasos[this._PosPasos];                                
                        this._Avance = 0;
                        this._Retraso = this._PasoOrig.Retraso;                                            
                    }
                }
            }
        }
                
        this._UltimoTick = t;
        return this._Terminado;
    };    
};



// Objeto que servira de enlace para hacer un rand a un valor cada vez que se ejecute la funcion iniciar del ObjetoAnimacion_Animacion
var ObjetoAnimacion_Rand = function(Max, Min) {
    this.Min = Min;
    this.Max = Max;
    this.Iniciar = function() {
        this.Valor = Rand(Max, Min);
        return this.Valor;        
    };
};

