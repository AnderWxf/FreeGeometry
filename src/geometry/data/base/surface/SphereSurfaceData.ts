import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";

/**
 * Sweep surface data struct.
 *
 */
class SweepSurfaceData extends SurfaceData {
    /**
     * The radius value of this Sweep surface.
     *
     * @type {number}
     */
    public radius: number;

    /**
     * Constructs a plane surface.
     *
     * @param {Transform3} [trans] - The base transfrom of surface.
     * @param {number} [radius = 1] - The radius value of this Sweep surface.
     */
    constructor(trans = new Transform3(), radius: number = 1) {
        super(trans);
        this.radius = radius;
    }
}

export { SweepSurfaceData };