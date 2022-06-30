import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export default class Viewer {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.grid = new THREE.GridHelper(1000, 1000);
        this.stats = new Stats();

        this.renderer.setSize(this.width, this.height);
        this.cube = this.createCube(true);

        this.camera.position.set(1,3,4);
        
        this.scene.add(this.grid)

        let objLoader = new OBJLoader();

        const light = new THREE.PointLight( 0xBBFFFF, 1, 100 );
        light.position.set(1,1,1);

        this.scene.add(light)

        // load a resource
        objLoader.load(
            // resource URL
            'models1/monkey.obj',
            // called when resource is loaded
            object => {
                object.position.set(0,1,0)
                this.scene.add(object)
            },
            // called when loading is in progresses
            xhr => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            error => {
                console.log( 'An error happened ' + error );
            }
        );

        document.body.appendChild(this.stats.dom);

        this.animate();

        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        const render = () => {
            requestAnimationFrame(render);

            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this.stats.update();
        }
        render();        
    }    

    createCube(wireframe) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: wireframe } );
        
        return new THREE.Mesh(geometry, material);
    }
}