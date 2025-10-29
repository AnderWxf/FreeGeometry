import { Transform3 } from "./Transform3";

/**
 * surface data struct.
 *
 */
class SurfaceData {
    /**
     * The transform value of this Curve3Data.
     *
     * @type {Transform3}
     */
    public transform: Transform3;

    /**
     * Constructs a surface.
     *
     * @param {Transform3} [transform] - The base transfrom of surface.
     */
    constructor(transform = new Transform3()) {
        this.transform = transform;
    }
}

export { SurfaceData };