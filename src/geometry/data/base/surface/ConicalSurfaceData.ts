import { Vector2 } from "../../../../math/Math";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";
/**
 * Conical surface data struct.
 *
 */
class ConicalSurfaceData extends SurfaceData {
    /**
     * The radius at height value 1 of this conical surface.
     *
     * @type {Vector2}
     */
    public radius: Vector2;

    /**
     * Constructs a plane surface.
     *
     * @param {Transform3} [transform] - The base transfrom of surface.
     * @param {Vector2} [radius = (1,1)] - The radius value at height value 1 of this Conical surface.
     */
    constructor(transform = new Transform3(), radius: Vector2 = new Vector2(1, 1)) {
        super(transform);
        this.radius = radius;
    }
}

export { ConicalSurfaceData };