import type { Vector3 } from "../../../math/Math";
import type { Curve3Data } from "../base/Curve3Data";
import type { SurfaceData } from "../base/SurfaceData";

/**
 * Brep data on xyz space;
 *
 */


/**
 * Vertice3.
 *
 */
class Vertice3 {
    /**
     * Constructs a Vertice.
     *
     */
    constructor() {
    }

    /**
     * Position of Vertice.
     *
     * @type {Vector3}
     */
    get pos(): Vector3 {
        return null;
    }

    /**
     * Edges of vertice.
     */
    edges: Array<Edge3>;
}

/**
 * Edge.
 *
 */
class Edge3 {
    /**
     * v0: begin vertice of Edge.
     *
     */
    v0: Vertice3;
    /**
     * v1: end vertice of Edge.
     *
     */
    v1: Vertice3;

    /**
     * Curve of Edge.
     *
     */
    curve: Curve3Data;

    /**
     * Forward coedge of Edge.
     *
     */
    c0: Coedge3;
    /**
     * Back coedge of Edge.
     *
     */
    c1: Coedge3;

    /**
     * Constructs a Edge.
     *
     */
    constructor() {
    }
}

/**
 * Codge.
 *
 */
class Coedge3 {
    /**
     * Edge of Coedge.
     *
     */
    e: Edge3;

    /**
     * Constructs a Coedge.
     *
     */
    constructor() {
    }
}

/**
 * Loop3.
 *
 */
class Loop3 {
    /**
     * Coedges of Loop.
     */
    coedges: Array<Coedge3>;

    /**
     * Constructs a Loop.
     *
     */
    constructor() {
    }
}

/**
 * Face.
 *
 */
class Face3 {
    /**
     * border of Face.
     */
    border: Loop3;

    /**
     * holes of Face.
     */
    holes: Array<Loop3>;

    /**
     * surface of Face.
     */
    surface: SurfaceData;

    /**
     * Constructs a Face.
     *
     */
    constructor() {
    }
}

/**
 * Shell3.
 *
 */
class Shell3 {
    /**
     * faces of Shell.
     */
    faces: Array<Face3>;

    /**
     * Constructs a Face.
     *
     */
    constructor() {
    }
}

/**
 * Lump3.
 *
 */
class Lump3 {
    /**
     * shells of Lump.
     */
    shells: Array<Shell3>;

    /**
     * Constructs a Face.
     *
     */
    constructor() {
    }
}

/**
 * Body.
 *
 */
class Body3 {
    /**
     * lumps of Body.
     */
    lumps: Array<Lump3>;

    /**
     * Constructs a Face.
     *
     */
    constructor() {
    }
}

export {
    Vertice3,
    Edge3,
    Coedge3,
    Loop3,
    Face3,
    Lump3,
    Body3
};