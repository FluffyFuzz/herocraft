import * as THREE from 'three';

import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';

// Récupérer la zone HTML réservée au personnage
const preview = document.querySelector('#characterPreview');



//Gestionnaire de chargement
const manager = new THREE.LoadingManager();
//Chargeur de fichiers TGA
const tgaLoader = new TGALoader(manager);
manager.addHandler(/\.tga$/i, tgaLoader);
//Chargeur de fichiers FBX
const loader = new FBXLoader(manager);
//Dossier des textures
loader.setResourcePath('./assets/mirana/materials/');


//Création de la Scene
const scene = new THREE.Scene();

//Ajout lumiere ambiante
const ambientLight = new THREE.AmbientLight(0xffffff,5);
scene.add(ambientLight);
//Ajout lumiere directionnelle
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

//Chargement du personnage mirana
const object = await loader.loadAsync('./assets/mirana/mirana_econ.fbx');
scene.add(object);
console.log("Personnage chargé :", object);

//Ajoute une box3 pour delimiter mirana
const box = new THREE.Box3().setFromObject(object);
console.log(box);
// Récupérer les dimensions
const size = box.getSize(new THREE.Vector3());
console.log("Dimensions :", size);
// Récupérer le centre
const center = box.getCenter(new THREE.Vector3());
console.log("Centre :", center)
object.position.x = -center.x;
object.position.y = -center.y;
object.position.z = -center.z;
object.rotation.y = 1;


//Creation et ajout de la camera
const camera = new THREE.PerspectiveCamera(
  40,
  preview.clientWidth / preview.clientHeight,
  1,
  1000
);
scene.add(camera);
camera.position.z = size.y * 2;
camera.lookAt(0, 0, 0);

//Creation de l'object 3D (geometry + material = mesh)
const geometry = new THREE.BoxGeometry( 5, 1, 6 );
const material = new THREE.MeshBasicMaterial({color: 0x0080ff});
const cube = new THREE.Mesh( geometry, material );
cube.rotation.y = 2;
cube.rotation.z = -20;
cube.rotation.x = -20;
scene.add( cube );


//Generation du rendu 3D sur écran 2D
const renderer = new THREE.WebGLRenderer();
renderer.setSize(preview.clientWidth,preview.clientHeight);
preview.appendChild(renderer.domElement);
renderer.render( scene, camera );

//Ajout animation par rapport au Delta
const clock = new THREE.Clock();
function animate(){
const Delta = clock.getDelta() * 1;
object.rotation.y +=Delta;
renderer.render(scene, camera);
requestAnimationFrame(animate);
}

//Resize en cas de changement de taille de la fenetre 
function onWindowResize() {
  const width = preview.clientWidth;
  const height = preview.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}



animate();
onWindowResize();
window.addEventListener('resize', onWindowResize);