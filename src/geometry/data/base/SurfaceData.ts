import { Transform3 } from "./Transform3";

/**
 * surface data struct.
 *
 */
class SurfaceData {
    /**
     * The transfrom value of this Curve3Data.
     *
     * @type {Transform3}
     */
    public trans: Transform3;

    /**
     * Constructs a surface.
     *
     * @param {Transform3} [trans] - The base transfrom of surface.
     */
    constructor(trans = new Transform3()) {
        this.trans = trans;
    }
}

export { SurfaceData };