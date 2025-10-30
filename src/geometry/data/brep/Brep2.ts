import type { Vector2 } from "../../../math/Math";
import type { Curve2Data } from "../base/Curve2Data";
/**
 * Brep data on xy space;
 *
 */


/**
 * Vertice2.
 *
 */
class Vertice2 {
    /**
     * Constructs a Vertice.
     *
     */
    constructor() {
    }

    /**
     * Position of Vertice.
     *
     * @type {Vector2}
     */
    get pos(): Vector2 {
        return null;
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
class Edge2 {
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
    }
}

/**
 * Codge2.
 *
 */
class Coedge2 {
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
    }
}

/**
 * Loop2.
 *
 */
class Loop2 {
    /**
     * Coedges of Loop.
     */
    coedges: Array<Coedge2>;

    /**
     * Constructs a Loop.
     *
     */
    constructor() {
    }
}

/**
 * Face2.
 *
 */
class Face2 {
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
    }
}

export {
    Vertice2,
    Edge2,
    Coedge2,
    Loop2,
    Face2
};