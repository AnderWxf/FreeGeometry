import type { Vector2 } from "../../../math/Math";
import type { Curve2Data } from "../base/Curve2Data";
import type { Transform2 } from "../base/Transform2";
import { DataBase } from "../DataBase";
/**
 * Brep data on xy space;
 * face's border is loop.
 * edge's border is vertice.
 *
 */


/**
 * Vertice2.
 *
 */
class Vertice2 extends DataBase {
    /**
     * Constructs a Vertice.
     *
     */
    constructor() {
        super();
    }

    /**
     * Edges of Vertice.
     */
    edges: Array<Edge2>;
}

/**
 * Edge.
 *
 */
class Edge2 extends DataBase {
    /**
     * v0 of Edge.
     *
     */
    v0: Vertice2;
    /**
     * v1 of Edge.
     *
     */
    v1: Vertice2;

    /**
     * Curve of Edge.
     *
     */
    curve: Curve2Data;

    /**
     * Curve index of Edge.
     * Used to relate to curve array in Brep2 when index is not -1. 
     */
    curveIndex: number = -1;

    /**
     * u parameter interval of curve of Edge.
     * u.x is begin parameter on the curve.
     * u.y is end parameter on the curve.
     * 
     */
    u: Vector2;

    /**
     * Forward coedge of Edge.
     *
     */
    c0: Coedge2;

    /**
     * Back coedge of Edge.
     *
     */
    c1: Coedge2;

    /**
     * Constructs a Edge.
     *
     */
    constructor() {
        super();
    }
}

/**
 * Codge2.
 *
 */
class Coedge2 extends DataBase {
    /**
     * Edge of Coedge.
     *
     */
    e: Edge2;

    /**
     * Constructs a Coedge.
     *
     */
    constructor() {
        super();
    }
}

/**
 * Loop2.
 *
 */
class Loop2 extends DataBase {
    /**
     * Coedges of Loop.
     */
    coedges: Array<Edge2>;

    /**
     * Constructs a Loop.
     *
     */
    constructor() {
        super();
    }
}

/**
 * Face2.
 * Base geometry in Brep Face2 is never transformed after construction.
 * Wire relate base geometry by reference.
 * Just Face2 transform is changed to move geometry.
 */
class Face2 extends DataBase {
    /**
     * curves of Face.
     */
    curves: Array<Curve2Data>;

    /**
     * transform of Body.
     */
    transform: Transform2;

    /**
     * border of Face.
     */
    border: Loop2;

    /**
     * holes of Face.
     */
    holes: Array<Loop2>;

    /**
     * Constructs a Face.
     *
     */
    constructor() {
        super();
    }
}

export {
    Vertice2,
    Edge2,
    Coedge2,
    Loop2,
    Face2
};