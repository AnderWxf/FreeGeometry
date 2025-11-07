import * as THREE from 'three';
import type { Edge2, Face2 } from '../geometry/data/brep/Brep2';
import type { Edge3, Face3 } from '../geometry/data/brep/Brep3';
import { CurveBuilder } from '../geometry/algorithm/builder/CurveBuilder';

/**
 * brep mesh builder.
 *
 */
class BrepMeshBuilder {
    /**
     * build edge2 mesh WireframeGeometry.
     *
     * @param {Edge2} [edge] - The edge2 object.
     */
    static BuildEdge2Mesh(edge: Edge2): THREE.WireframeGeometry {
        let algor = CurveBuilder.BuildCurve2AlgorithmByData(edge.curve);
        let step = (edge.u.y - edge.u.x) / 32.0;
        let vertices = new Array<number>;
        let indices = Array<number>();
        for (let i = edge.u.x, index = 0; i <= edge.u.y; i += step, index++) {
            let p = algor.p(i);
            vertices.push(p.x);
            vertices.push(p.y);
            indices.push(index);
        }
        let ret = new THREE.WireframeGeometry()
        ret.setIndex(indices);
        ret.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 2));
        return ret;
    }

    /**
     * build edge3 mesh WireframeGeometry.
     *
     * @param {Edge3} [edge] - The edge2 object.
     */
    static BuildEdge3Mesh(edge: Edge3): THREE.WireframeGeometry {
        let algor = CurveBuilder.BuildCurve3AlgorithmByData(edge.curve);
        let step = (edge.u.y - edge.u.x) / 32.0;
        let vertices = new Array<number>;
        let indices = Array<number>();
        for (let i = edge.u.x, index = 0; i <= edge.u.y; i += step, index++) {
            let p = algor.p(i);
            vertices.push(p.x);
            vertices.push(p.y);
            indices.push(index);
        }
        let ret = new THREE.WireframeGeometry()
        ret.setIndex(indices);
        ret.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 2));
        return ret;
    }

    /**
     * build face2 mesh BufferGeometry.
     *
     * @param {Face2} [face] - The face2 object.
     */
    static BuildFace2Mesh(face: Face2): THREE.BufferGeometry {
        debugger;
        return null;
    }

    /**
     * build face3 mesh BufferGeometry.
     *
     * @param {Face3} [face] - The face3 object.
     */
    static BuildFace3Mesh(face: Face3): THREE.BufferGeometry {
        debugger;
        return null;
    }

}

export { BrepMeshBuilder };