import { Vector3 } from "../../../../math/Math";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";
/**
 * Ellipsoid surface data struct.
 *
 */
class EllipsoidSurfaceData extends SurfaceData {
    /**
     * The radius size of this Ellipsoid surface.
     *
     * @type {Vector3}
     */
    public size: Vector3;

    /**
     * Constructs a plane surface.
     *
     * @param {Transform3} [transform] - The base transfrom of surface.
     * @param {Vector3} [size = (1,1,1)] - The radius size of this Ellipsoid surface.
     */
    constructor(transform = new Transform3(), size: Vector3 = new Vector3(1, 1, 1)) {
        super(transform);
        this.size = size;
    }
}

export { EllipsoidSurfaceData };