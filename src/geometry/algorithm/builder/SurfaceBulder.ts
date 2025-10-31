import { ConicalSurfaceData } from "../../data/base/surface/ConicalSurfaceData";
import { CylinderSurfaceData } from "../../data/base/surface/CylinderSurfaceData";
import { EllipsoidSurfaceData } from "../../data/base/surface/EllipsoidSurfaceData";
import { LoftingSurfaceData } from "../../data/base/surface/LoftingSurfaceData";
import { NurbsSurfaceData } from "../../data/base/surface/NurbsSurfaceData";
import { PlaneSurfaceData } from "../../data/base/surface/PlaneSurfaceData";
import { SphereSurfaceData } from "../../data/base/surface/SphereSurfaceData";
import { SweepSurfaceData } from "../../data/base/surface/SweepSurfaceData";
import type { SurfaceData } from "../../data/base/SurfaceData";
import { ConicalSurfaceAlgo } from "../base/surface/ConicalSurfaceAlgo";
import { CylinderSurfaceAlgo } from "../base/surface/CylinderSurfaceAlgo";
import { EllipsoidSurfaceAlgo } from "../base/surface/EllipsoidSurfaceAlgo";
import { LoftingSurfaceAlgo } from "../base/surface/LoftingSurfaceAlgo";
import { NurbsSurfaceAlgo } from "../base/surface/NurbsSurfaceAlgo";
import { PlaneSurfaceAlgo } from "../base/surface/PlaneSurfaceAlgo";
import { SphereSurfaceAlgo } from "../base/surface/SphereSurfaceAlgo";
import { SweepSurfaceAlgo } from "../base/surface/SweepSurfaceAlgo";
import type { SurfaceAlgo } from "../base/SurfaceAlgo";

/**
 * surface builder.
 *
 */
class SurfaceBulder {

    static BuildSurfaceAlgorithmByData(dat: SurfaceData): SurfaceAlgo {
        if (dat instanceof ConicalSurfaceData) {
            return new ConicalSurfaceAlgo(dat);
        }
        else if (dat instanceof CylinderSurfaceData) {
            return new CylinderSurfaceAlgo(dat);
        }
        else if (dat instanceof EllipsoidSurfaceData) {
            return new EllipsoidSurfaceAlgo(dat);
        }
        else if (dat instanceof LoftingSurfaceData) {
            return new LoftingSurfaceAlgo(dat);
        }
        else if (dat instanceof NurbsSurfaceData) {
            return new NurbsSurfaceAlgo(dat);
        }
        else if (dat instanceof PlaneSurfaceData) {
            return new PlaneSurfaceAlgo(dat);
        }
        else if (dat instanceof SphereSurfaceData) {
            return new SphereSurfaceAlgo(dat);
        }
        else if (dat instanceof SweepSurfaceData) {
            return new SweepSurfaceAlgo(dat);
        }
        debugger;
        return null;
    }
}

export { SurfaceBulder };