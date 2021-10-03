window.addEventListener("load",function(t){

    var gameRender = document.getElementById("game");
    var loop = {};
    window.listPlayers = {};
    var controlls = {
        hasNewPLayer: false,
        hasMovePLayer:false,
        move:{
            "ArrowUp":false,
            "ArrowDown":false,
            "ArrowLeft":false,
            "ArrowRight":false,
            // Rotação
        }
    };
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#00a8ff');
    const camera = new THREE.PerspectiveCamera( 75,
                                                window.innerWidth / window.innerHeight,
                                                 0.1, 
                                                 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    gameRender.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry();
    //const materialChao = new THREE.MeshBasicMaterial( { color: 0x53a027 } );
    const materialPlayer = new THREE.MeshBasicMaterial( { color: 0x22a6dd } );
    let mapLength = 90;
    const loader = new THREE.TextureLoader();
    let textureChao = loader.load('/assets/js/texture.jpg')
    const texture = Promise.all([textureChao], (resolve, reject) => { resolve(texture);})
    .then(result => {
        setTimeout(function(){
            $('.loader').hide();
            renderer.render( scene, camera );
            $(gameRender).show();
        },700)
        
    });
    const materialChao = new THREE.MeshBasicMaterial({
        map: textureChao,
    });
    for(var i = -(mapLength/2); i < (mapLength / 2) ; i++ ){
        for(var j = -(mapLength/2); j < (mapLength/2); j++ ){
            let cube = new THREE.Mesh( geometry, materialChao );
            cube.position.x = i;
            cube.position.y = j;
            scene.add( cube );
        }
    }

    let player = new THREE.Mesh( geometry, materialPlayer );
    player.position.z = 2;
    scene.add( player );

    camera.position.z = 7;
    camera.position.y = -4;
    camera.rotation.x = 0.75;
    
    renderer.render( scene, camera );


    document.addEventListener('keyup', downKey);
    document.addEventListener('keydown', upKey);

    function upKey(e) {
        if (e.defaultPrevented) {
            return; // Do nothing if event already handled
        }
        //console.log("Up",` ${e.code}`);
        switch(e.code) {
            case "KeyW":
            case "ArrowUp":
                controlls.move.ArrowUp = true;
                break;
            case "KeyS":
            case "ArrowDown":
                // Handle "turn right"
                controlls.move.ArrowDown = true;
                break;
            case "KeyA":
            case "ArrowLeft":
                controlls.move.ArrowLeft = true;
                break;
            case "KeyD":
            case "ArrowRight":
                controlls.move.ArrowRight = true;
                break;
            // Rotação
            case "KeyQ":
                camera.rotation.x -= 0.2;
                renderer.render( scene, camera );
                break;
            case "KeyE":
                camera.rotation.x += 0.2;
                renderer.render( scene, camera );
                break;
            case "KeyZ":
                camera.rotation.z -= 0.2;
                renderer.render( scene, camera );
                break;
            case "KeyX":
                camera.rotation.z += 0.2;
                renderer.render( scene, camera );
                break;
        }
        //renderer.render( scene, camera );
        e.preventDefault();
    }
    function downKey(e){
        if (e.defaultPrevented) {
            return; // Do nothing if event already handled
        }
        //console.log("Down",` ${e.code}`);
        switch(e.code) {
            case "KeyW":
            case "ArrowUp":
                controlls.move.ArrowUp = false;
                break;
            case "KeyS":
            case "ArrowDown":
                // Handle "turn right"
                controlls.move.ArrowDown = false;
                break;
            case "KeyA":
            case "ArrowLeft":
                controlls.move.ArrowLeft = false;
                break;
            case "KeyD":
            case "ArrowRight":
                controlls.move.ArrowRight = false;
                break;
            // Rotação
        }
        e.preventDefault();
    }

    loop = setInterval(function(){
        
        hasRederer = false;

        //console.log(controlls)
        // Listener Key MOVE
        if(controlls.move.ArrowUp && (hasRederer = true)){
            camera.position.y += 0.2;
            player.position.y += 0.2;
        }
        if(controlls.move.ArrowDown && (hasRederer = true)){
            camera.position.y -= 0.2; 
            player.position.y -= 0.2; 
        }
        if(controlls.move.ArrowLeft && (hasRederer = true)){
            camera.position.x -= 0.2; 
            player.position.x -= 0.2;      
        }
        if(controlls.move.ArrowRight && (hasRederer = true)){
            camera.position.x += 0.2; 
            player.position.x += 0.2;       
        }
        if(controlls.hasNewPLayer && (hasRederer = true)){
            let numero = Object.keys(window.listPlayers);
            $("#latencia_painel_usuario_value").text(numero.length);
            controlls.hasNewPLayer = false; 
        }
        if(controlls.hasMovePLayer && (hasRederer = true)){
            controlls.hasNewPLayer = false; 
        }

        if(hasRederer){
            renderer.render( scene, camera );
        }
        
        let hasMove = controlls.move.ArrowUp || controlls.move.ArrowDown || controlls.move.ArrowLeft || controlls.move.ArrowRight;
        if(hasMove){
            window.socket.emit('move-player', JSON.stringify(player.position));
        }
        
        
        hasRederer = false;
        
    },80)

    window.newUsuario = function(data){
        let newPlayer =  JSON.parse(data);

        newPlayer.player = new THREE.Mesh( geometry, materialPlayer );
        
        if(typeof newPlayer.position != "undefined" && newPlayer.position.length > 1){
        
            newPlayer.position = JSON.parse(newPlayer.position);
            window.listPlayers[newPlayer.id].player.position.x = newPlayer.position.x;
            window.listPlayers[newPlayer.id].player.position.y = newPlayer.position.y;

        } else newPlayer.player.position.z = 2;

        if(typeof window.listPlayers[newPlayer.id]  == "undefined"){
            window.listPlayers[newPlayer.id] = newPlayer;
            scene.add( newPlayer.player );
            controlls.hasNewPLayer = true;
        }else{
            controlls.hasMovePLayer = true;
        }
    }

    window.moveUsuario = function(data){
        let newPlayer =  JSON.parse(data);
        newPlayer.position = JSON.parse(newPlayer.position);

        window.listPlayers[newPlayer.id].player.position.x = newPlayer.position.x;
        window.listPlayers[newPlayer.id].player.position.y = newPlayer.position.y;

        controlls.hasMovePLayer = true;
    }
    /*  const animate = function () {
            requestAnimationFrame( animate );

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render( scene, camera );
        };
        animate();
    */
});