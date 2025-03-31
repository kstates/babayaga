import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { frameArea } from './utils';

const loader = new GLTFLoader();

// Scene, camera, and canvas setup
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x3f63b5 );
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector('#c');

// Lights
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0x817297;  // light purple 
const intensity = .8;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

const dirColor = 0xFFFFFF;
const dirIntensity = 1.5;
const dirLight = new THREE.DirectionalLight(dirColor, dirIntensity);
dirLight.position.set(0, 10, 0);
dirLight.target.position.set(-5, 0, 0);
scene.add(dirLight);
scene.add(dirLight.target);

// Orbit Controls 
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

// Render
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

loader.load('gas-station.glb', function (gltf) {
    const root = gltf.scene;
    scene.add(root);

    const box = new THREE.Box3().setFromObject(root);
 
    const boxSize = box.getSize(new THREE.Vector3()).length();
    const boxCenter = box.getCenter(new THREE.Vector3());
 
    // set the camera to frame the box
    frameArea(boxSize * 1.1, boxSize, boxCenter, camera);
 
    // update the Trackball controls to handle the new size
    controls.maxDistance = boxSize * 10;
    controls.target.copy(boxCenter);
    controls.update();
}, undefined, function (error) {
    console.error(error);
});

camera.position.z = 5;

function animate() {
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);