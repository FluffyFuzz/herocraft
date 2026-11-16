import * as THREE from 'three';
console.log("Object THREE",THREE);


const scene = new THREE.Scene();
console.log("Objet SCENE",scene);
console.log("scene.type",scene.type);
console.log("scene.length",scene.children.length);

const camera = new THREE.PerspectiveCamera( 75, 60 / 100, 1, 1000 );
scene.add( camera );

console.log("Camera object : ",camera);
camera.position.z =10;
camera.lookAt(0,0,0);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
