/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 16/01/2019

        Objeto para una ficha del domino

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 16/01/2019
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
    this.Valores  = [ 0, 0 ];
    this.Ficha    = new THREE.Object3D();
    this.Hover    = false;
    this.Colocada = false;
    this.Escala   = 1.0;
    
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
        
        
        this.Ficha.rotation.x = -Math.PI / 2;
        //this.Ficha.rotation.z = Math.PI / 2;
        this.RotarV();
        
//        if (this.Valores[0] === this.Valores[1]) this.Vertical = true;
        
        return this.Ficha;
    };
    
    
    this.RotarV = function() {
        this.Ficha.rotation.z = Math.PI / 2;
    };
    
    this.RotarH = function() {
        this.Ficha.rotation.z = 0.0;
    };
       
    this.AsignarHover = function(Hover) {
        if (typeof(this.AniHover) !== "undefined") {
            this.AniHover.Terminar();
        }
        
        this.Hover = Hover;
        
        if (Hover === true) {
            this.AniHover = Animaciones.CrearAnimacion([
                    { Paso : { Escala : this.Escala, y : this.Ficha.position.y   } },
                    { Paso : { Escala : 1.2, y : 0.5  }, Tiempo : 300, FuncionTiempo : FuncionesTiempo.Lineal }
            ], { FuncionActualizar : function(Valores) { 
                    //this.Ficha.position.y = Valores.y;
                    this.Ficha.scale.set(Valores.Escala, Valores.Escala, Valores.Escala);
                    this.Escala = Valores.Escala;
            }.bind(this) });
        }
        else {
            this.AniHover = Animaciones.CrearAnimacion([
                    { Paso : { Escala : this.Escala, y : this.Ficha.position.y   } },
                    { Paso : { Escala : 1.0, y : 0.0  }, Tiempo : 300, FuncionTiempo : FuncionesTiempo.Lineal }
            ], { FuncionActualizar : function(Valores) { 
                    //this.Ficha.position.y = Valores.y;
                    this.Ficha.scale.set(Valores.Escala, Valores.Escala, Valores.Escala);
                    this.Escala = Valores.Escala;
            }.bind(this) });            
        }
        
        this.AniHover.Iniciar();
    };
    
    // Hace una animación para colocar la ficha en el tablero
    // RotZ :
    //      - 0             : horizontal mirando a la izquierda (cara1, cara2)
    //      - Math.PI / 2   : vertical
    //      - Mathi.PI      : horizontal mirando a la derecha   (cara2, cara1)
    this.Colocar = function(PosX, PosZ, RotZ, nFuncionTerminar) {
        if (typeof(this.AniHover) !== "undefined") {
            this.AniHover.Terminar();
        }
        if (typeof(this.AniColocar) !== "undefined") {
            this.AniColocar.Terminar();
        }
        
        this.Colocada = true;
        this.FT = nFuncionTerminar;
        // Rotación
        //var RotZ = (Vertical === true) ? RotZ = Math.PI / 2 : 0.0;

        this.AniColocar = Animaciones.CrearAnimacion([
                { Paso : { Escala : this.Escala,    x : this.Ficha.position.x,  z : this.Ficha.position.z,  rz : this.Ficha.rotation.z  } },
                { Paso : { Escala : 1.0,            x : PosX,                   z : PosZ,                   rz : RotZ  }, Tiempo : 400, FuncionTiempo : FuncionesTiempo.SinInOut }
            ], {
//            FuncionTerminado  : nFuncionTerminar,
            FuncionActualizar : function(Valores) { 
                //this.Ficha.position.y = Valores.y;
                this.Ficha.scale.set(Valores.Escala, Valores.Escala, Valores.Escala);
                this.Escala = Valores.Escala;
                this.Ficha.position.set(Valores.x, this.Ficha.position.y, Valores.z);
                this.Ficha.rotation.z = Valores.rz;
            }.bind(this)
            
        });            
        
        setTimeout(nFuncionTerminar, 1000);
        
        this.AniColocar.Iniciar();
    };
    
    // devuelve true si está invertido (para las fichas verticales devuelve false)
    this.Invertido = function() {
      if (this.Ficha.rotation.z !== 0 && this.Vertical() === false)  return true;
      return false;
    };
    
    this.ValorIzq = function() {
        if (this.Ficha.rotation.z !== 0) return this.Valores[1];
        else                             return this.Valores[0];
    };

    this.ValorDer = function() {
        if (this.Ficha.rotation.z !== 0) return this.Valores[0];
        else                             return this.Valores[1];
    };
    
    this.Vertical = function() {
        if (this.Valores[0] == this.Valores[1]) return true;
        return false;
    };

};


