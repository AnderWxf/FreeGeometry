import type { Vector2, Vector3 } from "../../../math/Math";
import type { Curve2Data } from "../../data/base/curve/Curve2Data";
import type { Face2 } from "../../data/brep/Brep2";

/**
 * brep builder.
 *
 */
class Brep2Builder {
    /**
     * build rectangle face from size vector.
     *
     * @param {Vector2} [size] - The size of rectangle.
     */
    static BuildRectangleFace(size: Vector2): Face2 {
        debugger;
        return null;
    }

    /**
     * build polygon face from points.
     *
     * @param {Vector2} [points] - The points of polygon.
     */
    static BuildPolygonFace(points: Array<Vector2>): Face2 {
        debugger;
        return null;
    }

    /**
     * build circle face from center and radius.
     *
     * @param {Vector2} [centor] - The points of polygon.
     * @param {number} [radius] - The radius of circle.
     */
    static BuildCircleFace(center: Vector2, radius: number): Face2 {
        debugger;
        return null;
    }

    /**
     * build circle face from center and radius.
     *
     * @param {Vector2} [centor] - The points of polygon.
     * @param {Vector2} [radius] - The radius of circle.
     */
    static BuildEllipseFace(center: Vector2, radius: Vector2): Face2 {
        debugger;
        return null;
    }

    /**
     * build face from centers that one by one closed.
     *
     * @param {Array<Curve2Data>} [cures] - The cures of face.
     */
    static BuildFace(cures: Array<Curve2Data>): Face2 {
        debugger;
        return null;
    }
}

export { Brep2Builder };