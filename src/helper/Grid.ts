import * as THREE from 'three';

/**
 * Grid.
 *
 */
class Grid extends THREE.WireframeGeometry {

    /**
     * Constructs a Grid.
     *
     * @param {number} [min=-1000] - The min position of grid.
     * @param {number} [max=1000] - The max position of grid.
     * @param {number} [step0=100] - The big step of grid.
     * @param {number} [step1=10] - The small step of grid.
     */
    constructor(min: number = -100, max: number = 100, step0: number = 5, step1: number = 1, plane = "xz") {
        super();

        let position = Array<THREE.Vector3>();
        let indices = Array<number>();
        let color = Array<THREE.Color>();
        let bcolor = 0.5;
        let scolor = 0.1;
        for (let i = min; i <= max; i += step1) {
            if (i == 0) {
                switch (plane) {
                    case 'xz':
                        // x 
                        position.push(new THREE.Vector3(min, 0, i));
                        position.push(new THREE.Vector3(0, 0, i));
                        // z 
                        position.push(new THREE.Vector3(i, 0, min));
                        position.push(new THREE.Vector3(i, 0, 0));
                        break;
                    case 'xy':
                        // x 
                        position.push(new THREE.Vector3(min, i, 0));
                        position.push(new THREE.Vector3(0, i, 0));
                        // y 
                        position.push(new THREE.Vector3(i, min, 0));
                        position.push(new THREE.Vector3(i, 0, 0));
                        break;
                    case 'yz':
                        // y 
                        position.push(new THREE.Vector3(0, min, i));
                        position.push(new THREE.Vector3(0, 0, i));
                        // z 
                        position.push(new THREE.Vector3(0, i, min));
                        position.push(new THREE.Vector3(0, i, 0));
                        break;
                }
            } else {
                switch (plane) {
                    case 'xz':
                        // x 
                        position.push(new THREE.Vector3(min, 0, i));
                        position.push(new THREE.Vector3(max, 0, i));
                        // z 
                        position.push(new THREE.Vector3(i, 0, min));
                        position.push(new THREE.Vector3(i, 0, max));
                        break;
                    case 'xy':
                        // x 
                        position.push(new THREE.Vector3(min, i, 0));
                        position.push(new THREE.Vector3(max, i, 0));
                        // y 
                        position.push(new THREE.Vector3(i, min, 0));
                        position.push(new THREE.Vector3(i, max, 0));
                        break;
                    case 'yz':
                        // y 
                        position.push(new THREE.Vector3(0, min, i));
                        position.push(new THREE.Vector3(0, max, i));
                        // z 
                        position.push(new THREE.Vector3(0, i, min));
                        position.push(new THREE.Vector3(0, i, max));
                        break;
                }
            }


            if (i == 0) {
                switch (plane) {
                    case 'xz':
                        // x 
                        color.push(new THREE.Color(scolor, 0, 0));
                        color.push(new THREE.Color(scolor, 0, 0));
                        // z 
                        color.push(new THREE.Color(0, 0, scolor));
                        color.push(new THREE.Color(0, 0, scolor));
                        break;
                    case 'xy':
                        // x 
                        color.push(new THREE.Color(scolor, 0, 0));
                        color.push(new THREE.Color(scolor, 0, 0));
                        // y 
                        color.push(new THREE.Color(0, scolor, 0));
                        color.push(new THREE.Color(0, scolor, 0));
                        break;
                    case 'yz':
                        // y 
                        color.push(new THREE.Color(0, scolor, 0));
                        color.push(new THREE.Color(0, scolor, 0));
                        // z 
                        color.push(new THREE.Color(0, 0, scolor));
                        color.push(new THREE.Color(0, 0, scolor));
                        break;
                }
            }
            else if (i % step0 == 0) {
                color.push(new THREE.Color(bcolor, bcolor, bcolor));
                color.push(new THREE.Color(bcolor, bcolor, bcolor));
                color.push(new THREE.Color(bcolor, bcolor, bcolor));
                color.push(new THREE.Color(bcolor, bcolor, bcolor));
            } else {
                color.push(new THREE.Color(scolor, scolor, scolor));
                color.push(new THREE.Color(scolor, scolor, scolor));
                color.push(new THREE.Color(scolor, scolor, scolor));
                color.push(new THREE.Color(scolor, scolor, scolor));
            }
            indices.push(indices.length);
            indices.push(indices.length);
            indices.push(indices.length);
            indices.push(indices.length);
        }

        let vertices = new Array<number>;
        let colors = new Array<number>;
        for (let i = 0; i < position.length; i++) {
            vertices.push(position[i].x);
            vertices.push(position[i].y);
            vertices.push(position[i].z);
            colors.push(color[i].r);
            colors.push(color[i].g);
            colors.push(color[i].b);
        }
        this.setIndex(indices);
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }


}

export { Grid };