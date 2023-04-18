import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { preload_object } from "/static/scripts/preload_object.js"

let scene, camera, renderer, stats, controls, shapeGroup;
let light, container, statbox, floor;
let HEIGHT, WIDTH, windowHalfX, windowHalfY;
let SPEED = 0.003;

let _was = null;
let _is = performance.now();

const mat_shape = new THREE.MeshPhongMaterial({ 
	color:0x1E2E50 
});

const mat_floor = new THREE.MeshBasicMaterial({
	color: 0x5ec2e6,
	alphaMap: new THREE.TextureLoader().load('/static/textures/floor.jpg'),
	transparent: true,
});

const mat_shadow_plane = new THREE.ShadowMaterial({
	opacity: 0.2, 
	color: 0x4d6fb7
});

function initiate() {

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera();
	camera.position.z = 5;
	camera.position.y = 3;
	
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	controls = new OrbitControls(camera, renderer.domElement);
	stats = new Stats();

	container = document.getElementById('webgl');
	container.appendChild(renderer.domElement);

	statbox = document.getElementById('stats');
	statbox.appendChild(stats.dom);

	updateRenderer()

}

function createLights() {

	const ambient = new THREE.AmbientLight(0x444444);
	scene.add(ambient);

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(-50, 150, 100);
	light.target.position.set(0, 0, 0);
	light.intensity = 0.9;
	light.castShadow = true;
	light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
	scene.add(light);
}

function createFloor(){ 
	
	const plane = new THREE.PlaneBufferGeometry(10,10);
	
	floor = new THREE.Mesh(plane, mat_shadow_plane);
	floor.rotation.x = -Math.PI/2;
	floor.position.y = -2;
	floor.castShadow = false;
	floor.receiveShadow = true;

	const floor_tex = new THREE.Mesh(plane, mat_floor);
	floor_tex.rotation.x = -Math.PI/2;
	floor_tex.position.y = -2.001;
	floor_tex.castShadow = false;
	floor_tex.receiveShadow = false;

	scene.add(floor);
	scene.add(floor_tex);
}

function createScene() {
	createLights()
	scene.add(shapeGroup)
	createFloor()	
}

(async function main() {
	shapeGroup = await preload_object();

	initiate()
	createScene()
	animate()
})();

function rotateCube() {
	shapeGroup.rotation.x -= SPEED * 2;
	shapeGroup.rotation.y -= SPEED * 2;
	shapeGroup.rotation.z -= SPEED;
}

function animate() {
	requestAnimationFrame((t) => {
		if (_was === null) {
			_was = t;
		}
		stats.update();
		const time = performance.now() / 1000;
		const dt = time - _is;
		_is = time;
		
		rotateCube()
		
		renderer.clear();
		renderer.render(scene, camera);
		scene.traverse(function(mesh) {
			if (mesh.update !== undefined) {
				mesh.update();
			}
		});
		animate();
		_was = t;
	});
}

function updateRenderer() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	windowHalfX = WIDTH / 2;
	windowHalfY = HEIGHT / 2;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

window.addEventListener('resize', updateRenderer)
