import * as THREE from 'three';

import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';

//Gestionnaire de chargement
const manager = new THREE.LoadingManager();
//Chargeur de fichiers TGA
const tgaLoader = new TGALoader(manager);
manager.addHandler(/\.tga$/i, tgaLoader);
//Chargeur de fichiers FBX
const loader = new FBXLoader(manager);

// Récupérer la zone HTML réservée au personnage
const preview = document.querySelector('#characterPreview');


//Création de la Scene
const scene = new THREE.Scene();
//Ajout lumiere ambiante
const ambientLight = new THREE.AmbientLight(0xffffff,5);
scene.add(ambientLight);
//Ajout lumiere directionnelle
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Création de la caméra et du renderer (une seule fois)
const camera = new THREE.PerspectiveCamera(
  40,
  preview.clientWidth / preview.clientHeight,
  1,
  1000
);
scene.add(camera);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(preview.clientWidth, preview.clientHeight);
preview.appendChild(renderer.domElement);

// Le personnage actuellement affiché
let personnageActuel = null;



// Charge et affiche le personnage choisi
async function chargerPersonnage(className) {
  loader.setResourcePath(`./assets/${className}/materials/`);

  const cheminModele = `./assets/${className}/${className}.fbx`;

  try {
    const nouveauPersonnage = await loader.loadAsync(cheminModele);

    // Retire l'ancien seulement quand le nouveau est chargé
    if (personnageActuel) {
      scene.remove(personnageActuel);
    }

    // Centre le nouveau personnage
    const box = new THREE.Box3().setFromObject(nouveauPersonnage);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    nouveauPersonnage.position.set(-center.x, -center.y, -center.z);
    nouveauPersonnage.rotation.y = 1;

    scene.add(nouveauPersonnage);
    personnageActuel = nouveauPersonnage;

    // Cadre la caméra selon la taille du modèle
    camera.position.set(0, 0, size.y * 2);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    console.log("Animations disponibles :", nouveauPersonnage.animations);
    
  } catch (error) {
    console.error("Impossible de charger le personnage :", cheminModele, error);
  }
}

// Charge la classe sélectionnée au démarrage
const selectElement = document.querySelector("#classe");
chargerPersonnage(personnageActuel);

// Recharge quand l'utilisateur choisit une autre classe
selectElement.addEventListener("change", (event) => {
  chargerPersonnage(event.target.value);
});


//Ajout animation par rapport au Delta
const clock = new THREE.Clock();
function animate(){
const delta = clock.getDelta();

  if (personnageActuel) {
    personnageActuel.rotation.y += delta;
  }

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


