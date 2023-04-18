import * as THREE from 'three';
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const mat_shape = new THREE.MeshPhongMaterial({ 
	color:0x1E2E50 
});

export async function preload_object() {
	
  	return new Promise((resolve) => {

		const sg = new THREE.Group();
		const svgUrl = '/static/vectors/threejs_logo.svg'; // Non Commercial Logo
		const loader = new SVGLoader();

		loader.load(svgUrl, (data) => {
			var extrudeOptions = {
		      depth: 7,
		      bevelEnabled: false
		    }
			for( var path of data.paths ){
				for( var shape of SVGLoader.createShapes( path ) ){
					var geometry = new THREE.ExtrudeGeometry( shape, extrudeOptions ),
							mesh = new THREE.Mesh( geometry, mat_shape );

					mesh.castShadow = true;

					sg.add( mesh );
				}
			}

			const box = new THREE.Box3().setFromObject(sg);
			const size = new THREE.Vector3();
			box.getSize(size);

			const yOffset = (size.y / -2);
			const xOffset = (size.x / -2);

			sg.children.forEach(item => {
			  item.position.x = xOffset;
			  item.position.y = yOffset;
			});

			sg.scale.set(0.005, 0.005, 0.005)

			resolve(sg);
		});

    });
};