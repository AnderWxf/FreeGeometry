import type { Curve2Data } from "../curve/Curve2Data";
import type { Curve3Data } from "../curve/Curve3Data";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";
/**
 * Sweep surface data struct.
 *
 */
class SweepSurfaceData extends SurfaceData {
    /**
     * The section curve of this Sweep surface.
     *
     * @type {Curve2Data}
     */
    public section: Curve2Data;

    /**
     * The path curve of this Sweep surface.
     *
     * @type {Curve3Data}
     */
    public path: Curve3Data;

    /**
     * Constructs a plane surface.
     *
     * @param {Transform3} [transform] - The base transfrom of surface.
     * @param {Curve2Data} [section] - The ection curve of this Sweep surface.
     * @param {Curve3Data} [path] - The path curve of this Sweep surface.* 
     */
    constructor(transform = new Transform3(), section: Curve2Data, path: Curve3Data) {
        super(transform);
        this.section = section;
        this.path = path;
    }
}

export { SweepSurfaceData };