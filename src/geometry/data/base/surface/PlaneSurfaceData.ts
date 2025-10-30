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
     * @param {Transform3} [trans] - The base transfrom of plane.
     */
    constructor(trans = new Transform3()) {
        super(trans);
    }
}

export { PlaneSurfaceData };