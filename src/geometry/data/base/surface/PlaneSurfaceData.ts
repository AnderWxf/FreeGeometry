import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";
/**
 * Plane surfacedata struct.
 *
 */
class PlaneSurfaceData extends SurfaceData {

    /**
     * Constructs a plane surface.
     *
     * @param {Transform3} [transform] - The base transfrom of plane.
     */
    constructor(transform = new Transform3()) {
        super(transform);
    }
}

export { PlaneSurfaceData };