import { Vector2 } from "../../../../math/Math";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";

/**
 * Cylinder surface data struct.
 *
 */
class CylinderSurfaceData extends SurfaceData {
    /**
     * The radius of this Cylinder surface.
     *
     * @type {Vector2}
     */
    public radius: Vector2;

    /**
     * Constructs a plane surface.
     *
     * @param {Transform3} [trans] - The base transfrom of surface.
     * @param {Vector2} [radius = (1,1)] - The radius value of this Cylinder surface.
     */
    constructor(trans = new Transform3(), radius: Vector2 = new Vector2(1, 1)) {
        super(trans);
        this.radius = radius;
    }
}

export { CylinderSurfaceData };