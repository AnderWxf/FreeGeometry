import type { Curve2Data } from "../curve/Curve2Data";
import type { Curve3Data } from "../curve/Curve3Data";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";
/**
 * Lofting surface data struct.
 *
 */
class LoftingSurfaceData extends SurfaceData {
    /**
     * The section curve and t parameter of this Lofting surface.
     *
     * @type {c:Curve2Data,t:number}
     */
    public sections: Array<{ c: Curve2Data, t: number }>;

    /**
     * The path curve of this Lofting surface.
     *
     * @type {Curve3Data}
     */
    public path: Curve3Data;

    /**
     * Constructs a plane surface.
     *
     * @param {Transform3} [transform] - The base transfrom of surface.
     * @param {Array<{ c: Curve2Data, t: number }>} [sections] - The section curve of this Lofting surface.
     * @param {Curve3Data} [path] - The path curve of this Lofting surface.* 
     */
    constructor(transform = new Transform3(), sections: Array<{ c: Curve2Data, t: number }>, path: Curve3Data) {
        super(transform);
        this.sections = sections;
        this.path = path;
    }
}

export { LoftingSurfaceData };