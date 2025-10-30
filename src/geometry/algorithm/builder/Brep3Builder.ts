import { Vector2, Vector3 } from "../../../math/Math";
import { Curve2Data } from "../../data/base/Curve2Data";
import { Curve3Data } from "../../data/base/Curve3Data";
import { Transform3 } from "../../data/base/Transform3";
import { Body3, Face3 } from "../../data/brep/Brep3";

/**
 * brep builder.
 *
 */
class Brep3Builder {
    /**
     * build rectangle face from size vector.
     * @param {Transform3} [trans] - - The base transfrom of face.
     * @param {Vector2} [size] - The size of rectangle.
     */
    static BuildRectangleFace(trans = new Transform3(), size: Vector2): Face3 {
        debugger;
        return null;
    }

    /**
     * build polygon face from points.
     * @param {Transform3} [trans] - - The base transfrom of face.
     * @param {Vector2} [points] - The points of polygon.
     */
    static BuildPolygonFace(trans = new Transform3(), points: Array<Vector2>): Face3 {
        debugger;
        return null;
    }

    /**
     * build circle face from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of face.
     * @param {number} [radius] - The radius of circle.
     */
    static BuildCircleFace(trans = new Transform3(), radius: number): Face3 {
        debugger;
        return null;
    }

    /**
     * build circle face from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of face.
     * @param {Vector2} [radius] - The radius of circle.
     */
    static BuildEllipseFace(trans = new Transform3(), radius: Vector2): Face3 {
        debugger;
        return null;
    }

    /**
     * build generaled face from cures that one by one closed.
     *
     * @param {Transform3} [trans] - - The base transfrom of face.
     * @param {Array<Curve2Data>} [cures] - The cures of face.
     */
    static BuildGeneraledFace(trans = new Transform3(), cures: Array<Curve2Data>): Face3 {
        debugger;
        return null;
    }


    /**
     * build box solid from size vector.
     *
     * @param {Transform3} [trans] - - The base transfrom of box.
     * @param {Vector3} [size] - The size of solid.
     */
    static BuildBoxBody(trans = new Transform3(), size: Vector3): Body3 {
        debugger;
        return null;
    }

    /**
     * build sphere face from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of sphere.
     * @param {number} [radius] - The radius of sphere.
     */
    static BuildSphereBody(trans = new Transform3(), radius: number): Body3 {
        debugger;
        return null;
    }

    /**
     * build ellipsoid from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of ellipsoid.
     * @param {Vector3} [radius] - The radius of circle.
     */
    static BuildEllipsoidBody(trans = new Transform3(), radius: Vector3): Body3 {
        debugger;
        return null;
    }

    /**
     * build cylinder from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of cylinder.
     * @param {number} [radius] - The radius of cylinder.
     */
    static BuildCylinderBody(trans = new Transform3(), radius: number, height: number): Body3 {
        debugger;
        return null;
    }

    /**
     * build elliptic cylinder from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of cylinder.
     * @param {Vector2} [radius] - The radius of cylinder.
     */
    static BuildEllipticCylinderBody(trans = new Transform3(), radius: Vector2, height: number): Body3 {
        debugger;
        return null;
    }

    /**
     * build prism from face and height.
     * @param {Transform3} [trans] - - The base transfrom of prism.
     * @param {Array<Vector2>} [points] - The bottom points of prism.
     * @param {number} [height] - The number of prism.
     */
    static BuildPrismBody(trans = new Transform3(), points: Array<Vector2>, height: number): Body3 {
        debugger;
        return null;
    }

    /**
     * build stretch from face and height.
     *
     * @param {Transform3} [trans] - - The base transfrom of stretch.
     * @param {Array<Curve2Data>} [cures] - The cures of stretch.
     * @param {number} [height] - The number of stretch.
     */
    static BuildStretchBody(trans = new Transform3(), section: Array<Curve2Data>, height: number): Body3 {
        debugger;
        return null;
    }

    /**
     * build sweep from face and height.
     *
     * @param {Transform3} [trans] - - The base transfrom of sweep.
     * @param {Array<Curve2Data>} [section] - The cures of sweep.
     * @param {Curve3Data} [path] - The path curve of sweep. 
     */
    static BuildSweepBody(trans = new Transform3(), section: Array<Curve2Data>, path: Curve3Data): Body3 {
        debugger;
        return null;
    }

    /**
     * build lofting from face and height.
     *
     * @param {Transform3} [trans] - - The base transfrom of lofting.
     * @param {Array<{ c: Curve2Data, t: number }>} [sections] - The sections of lofting.
     * @param {Curve3Data} [path] - The path curve of lofting. 
     */
    static BuildLoftingBody(trans = new Transform3(), sections: Array<{ c: Curve2Data, t: number }>, path: Curve3Data): Body3 {
        debugger;
        return null;
    }

}

export { Brep3Builder };