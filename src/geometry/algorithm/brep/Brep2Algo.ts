import type { Vector2 } from "../../../math/Math";
import type { Edge2 } from "../../data/brep/Brep2";
import { CurveBuilder } from "../builder/CurveBuilder";

class Brep2Algo {
    static GetEdgeBeginEndPoint(e: Edge2): Vector2[] {
        let algo = CurveBuilder.Algorithm2ByData(e.curve);
        return [algo.p(e.u.x), algo.p(e.u.y)];
    }
}
export {
    Brep2Algo
}