import type { Curve3Data } from "../../../data/base/curve/Curve3Data";
import type { PlaneSurfaceData } from "../../../data/base/surface/PlaneSurfaceData";

class SurfaceInter {

    /**
     * compute plane to plane intersection curve.
     *
     * @param {PlaneSurfaceData} [s0] - The frist plane.
     * @param {PlaneSurfaceData} [s0] - The second plane.
     * @param {number} [tol] - The tolerance of distance.
     */
    static PlaneXPlane(c0: PlaneSurfaceData, c1: PlaneSurfaceData, tol: number): Array<Curve3Data> {
        return null;
    }

}

export { SurfaceInter };