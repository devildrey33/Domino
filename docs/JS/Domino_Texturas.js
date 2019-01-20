/* 
    Domino ThreeJS creado por Josep Antoni Bover Comas el 16/01/2019

        Objeto estatico que contiene las 7 posibles texturas de una cara de la ficha 

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 16/01/2019
*/




// Objeto único que contiene las 7 texturas necesarias para las fichas
var Domino_Texturas = function() {
    // Tamaño de los puntos
    this.TamPuntos = 50;
    
    this.Textura = [];
    this.Buffer  = [];
    // Inicia las texturas
    this.Iniciar = function() {
        for (i = 0; i < 7; i++) {
            // Creo el buffer
            this.Buffer[i] = new BufferCanvas(512, 512);
            // Pinto el borde gris
            this.Buffer[i].Context.strokeStyle = 'rgb(200, 200, 200)';
            this.Buffer[i].Context.lineWidth  = 12;
            this.Buffer[i].Context.strokeRect(0, 0, 512, 512);
            // Pinto el separador
            this.Buffer[i].Context.fillStyle = 'rgb(0, 0, 0)';
            this.Buffer[i].Context.fillRect(500, 48, 12, 416);
        }
        
        // Pinto la ficha 1
        this.Buffer[1].Context.beginPath();
        this.Buffer[1].Context.arc(256, 256, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[1].Context.fill();
        
        // Pinto la ficha 2
        this.Buffer[2].Context.beginPath();
        this.Buffer[2].Context.arc(128, 128, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[2].Context.fill();
        this.Buffer[2].Context.beginPath();
        this.Buffer[2].Context.arc(384, 384, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[2].Context.fill();
        
        // Pinto la ficha 3
        this.Buffer[3].Context.beginPath();
        this.Buffer[3].Context.arc(128, 128, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[3].Context.fill();
        this.Buffer[3].Context.beginPath();
        this.Buffer[3].Context.arc(256, 256, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[3].Context.fill();
        this.Buffer[3].Context.beginPath();
        this.Buffer[3].Context.arc(384, 384, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[3].Context.fill();
        
        // Pinto la ficha 4
        this.Buffer[4].Context.beginPath();
        this.Buffer[4].Context.arc(128, 128, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[4].Context.fill();
        this.Buffer[4].Context.beginPath();
        this.Buffer[4].Context.arc(384, 384, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[4].Context.fill();
        this.Buffer[4].Context.beginPath();
        this.Buffer[4].Context.arc(128, 384, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[4].Context.fill();
        this.Buffer[4].Context.beginPath();
        this.Buffer[4].Context.arc(384, 128, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[4].Context.fill();

        // Pinto la ficha 5
        this.Buffer[5].Context.beginPath();
        this.Buffer[5].Context.arc(128, 128, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[5].Context.fill();
        this.Buffer[5].Context.beginPath();
        this.Buffer[5].Context.arc(384, 384, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[5].Context.fill();
        this.Buffer[5].Context.beginPath();
        this.Buffer[5].Context.arc(128, 384, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[5].Context.fill();
        this.Buffer[5].Context.beginPath();
        this.Buffer[5].Context.arc(384, 128, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[5].Context.fill();
        this.Buffer[5].Context.beginPath();
        this.Buffer[5].Context.arc(256, 256, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[5].Context.fill();
        
        // Pinto la ficha 6
        this.Buffer[6].Context.beginPath();
        this.Buffer[6].Context.arc(128, 128, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[6].Context.fill();
        this.Buffer[6].Context.beginPath();
        this.Buffer[6].Context.arc(384, 384, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[6].Context.fill();
        this.Buffer[6].Context.beginPath();
        this.Buffer[6].Context.arc(128, 384, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[6].Context.fill();
        this.Buffer[6].Context.beginPath();
        this.Buffer[6].Context.arc(384, 128, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[6].Context.fill();
        this.Buffer[6].Context.beginPath();
        this.Buffer[6].Context.arc(256, 384, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[6].Context.fill();
        this.Buffer[6].Context.beginPath();
        this.Buffer[6].Context.arc(256, 128, this.TamPuntos, 0, Math.PI * 2);
        this.Buffer[6].Context.fill();
        
        
        for (i = 0; i < 7; i++) {
            this.Textura[i] = new THREE.Texture(this.Buffer[i].Canvas);
            this.Textura[i].needsUpdate = true;
        }
        
        
        this.MaterialBase  = new THREE.MeshPhongMaterial({ color: 0x111111, specular : 0x555555, transparent : false, opacity:1.0, shininess : 200 });
        this.MaterialCara  = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, specular : 0xFFFFFF, transparent : false, opacity:1.0, shininess : 200 });
        this.MaterialCaraR = new THREE.MeshPhongMaterial({ color: 0xFFEE94, specular : 0xFFEE94, transparent : false, opacity:1.0, shininess : 200 });
    }
}

Texturas = new Domino_Texturas();