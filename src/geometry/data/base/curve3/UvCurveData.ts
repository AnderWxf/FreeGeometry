import { Curve3Data } from "../Curve3Data";
import { Curve2Data } from "../Curve2Data";
import { SurfaceData } from "../SurfaceData";

/**
 * 3D curve generated with 2D curve in uv space of surface data struct.
 *
 */
class UvCurveData extends Curve3Data {
    /**
     * The 2d curve of this UvCurveData.
     *
     * @type {Curve2Data}
     */
    public curve: Curve2Data;

    /**
     * The surface of this UvCurveData.
     *
     * @type {SurfaceData}
     */
    public surface: SurfaceData;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Curve2Data} [curve] - The curve of this UvCurveData.
     * @param {SurfaceData} [surface] - The surface of this UvCurveData.
     */
    constructor(curve: Curve2Data, surface: SurfaceData) {
        super(surface.trans);
        this.curve = curve;
        this.surface = surface;
    }
}

export { UvCurveData };