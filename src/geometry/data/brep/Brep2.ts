import { GeomType } from "../../../core/Constents";
import { Vector2 } from "../../../math/Math";
import type { Curve2Data } from "../base/Curve2Data";
import { unserialize } from "../base/Unserialize";
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
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP2_VERTICE2;
  /**
   * point of Vertice.
   *
   */
  p: Vector2;

  /**
   * Constructs a Vertice.
   *
   */
  constructor() {
    super();
  }
  /**
   * Returns a new Vertice2 with copied values from this instance.
   *
   * @return {Vertice2} A clone of this instance.
   */
  override clone() {
    let result = new Vertice2();
    result.p = this.p?.clone();
    return result;
  }
  /**
   * Returns a new Vertice2 with unserialize data.
   *
   * @return {Vertice2} a new instance.
   */
  static Unserialize(data: any): Vertice2 {
    let ret = new Vertice2();
    ret.p = data.p ? Vector2.Unserialize(data.p) : null;
    ret.uuid = data.uuid;
    return ret;
  }
}

/**
 * Edge.
 *
 */
class Edge2 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP2_EDGE2;
  /**
   * v0 of Edge. being.
   *
   */
  v0: Vertice2;

  /**
   * v1 of Edge. end.
   *
   */
  v1: Vertice2;

  /**
   * Curve of Edge.
   *
   */
  curve: Curve2Data;

  /**
   * v0 index of Edge.
   * Used to relate to vertice array in Brep2 when index is not -1. 
   */
  v0i: number = -1;

  /**
   * v1 index of Edge.
   * Used to relate to vertice array in Brep2 when index is not -1. 
   */
  v1i: number = -1;

  /**
   * Curve index of Edge.
   * Used to relate to curve array in Brep2 when index is not -1. 
   */
  curvei: number = -1;

  /**
   * u parameter interval of curve of Edge.
   * u.x is begin parameter on the curve.
   * u.y is end parameter on the curve.
   * u.x < u.y or u.x > u.y. 
   */
  u: Vector2;

  /**
   * Constructs a Edge.
   *
   */
  constructor() {
    super();
  }

  /**
   * is positive? (u.y > u.x)
   *
   */
  isPositive() {
    return this.u.y > this.u.x;
  }

  /**
   * Returns a new Edge2 with copied values from this instance.
   *
   * @return {Edge2} A clone of this instance.
   */
  override clone() {
    let result = new Edge2();
    result.curve = this.curve?.clone();
    result.u = this.u?.clone();
    result.v0 = this.v0?.clone();
    result.v1 = this.v1?.clone();
    result.v0i = this.v0i;
    result.v1i = this.v1i;
    result.curvei = this.curvei;
    return result;
  }

  get umin(): number {
    return Math.min(this.u.x, this.u.y);
  }

  get umax(): number {
    return Math.max(this.u.x, this.u.y);
  }

  set umin(u: number) {
    if (this.isPositive()) {
      this.u.x = u;
    } else {
      this.u.y = u;
    }
  }

  set umax(u: number) {
    if (this.isPositive()) {
      this.u.y = u;
    } else {
      this.u.x = u;
    }
  }

  /**
   * u parameter range of curve of Edge.
   * [a,b]. 
   */
  get ur(): Vector2 {
    let min = Math.min(this.u.x, this.u.y);
    let max = Math.max(this.u.x, this.u.y);
    return new Vector2(min, max);
  }

  // u ∈ (a,b)
  isInURange(u: number): boolean {
    let ur = this.ur;
    return u > ur.x && u < ur.y;
  }
  // u ∈ [a,b]
  isOnURange(u: number, tol1: number): boolean {
    let ur = this.ur;
    return Math.abs(u - ur.x) <= tol1
      || Math.abs(u - ur.y) <= tol1
      || this.isInURange(u);
  }

  /**
   * Returns a new Edge2 with unserialize data.
   *
   * @return {Edge2} a new instance.
   */
  static Unserialize(data: any): Edge2 {
    let ret = new Edge2();
    ret.curve = data.curve ? unserialize(data.curve)[0] as Curve2Data : null;
    ret.u = data.u ? Vector2.Unserialize(data.u) : null;
    ret.v0 = data.v0 ? Vertice2.Unserialize(data.v0) : null;
    ret.v1 = data.v1 ? Vertice2.Unserialize(data.v1) : null;
    ret.curvei = data.curvei > -1 ? data.curvei : -1;
    ret.v0i = data.v0i > -1 ? data.v0i : -1;
    ret.v1i = data.v1i > -1 ? data.v1i : -1;
    ret.uuid = data.uuid;
    return ret;
  }
}

/**
 * Codge2.
 *
 */
class Coedge2 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP2_COEDGE2;
  /**
   * Edge of Coedge.
   *
   */
  e: Edge2;

  /**
   * e index of Coedge2.
   * Used to relate to Edge array in Brep2 when index is not -1. 
   */
  ei: number = -1;

  /**
   * Direction of Coedge.
   *
   */
  isForward: boolean = true;

  /**
   * Constructs a Coedge.
   *
   */
  constructor() {
    super();
  }
  /**
   * Returns a new Coedge2 with copied values from this instance.
   *
   * @return {Coedge2} A clone of this instance.
   */
  override clone() {
    let result = new Coedge2();
    result.e = this.e?.clone();
    result.ei = this.ei;
    result.isForward = this.isForward;
    return result;
  }

  /**
   * is positive? (u.y > u.x)
   *
   */
  isPositive() {
    return this.isForward ? this.e.isPositive() : !this.e.isPositive();
  }

  /**
   * u parameter range of curve of Edge.
   * [a,b]. 
   */
  get ur(): Vector2 {
    let min = Math.min(this.e.u.x, this.e.u.y);
    let max = Math.max(this.e.u.x, this.e.u.y);
    return new Vector2(min, max);
  }

  // u ∈ (a,b)
  isInURange(u: number): boolean {
    let ur = this.ur;
    return u > ur.x && u < ur.y;
  }

  // u ∈ [a,b]
  isOnURange(u: number, tol1: number): boolean {
    let ur = this.ur;
    return Math.abs(u - ur.x) <= tol1
      || Math.abs(u - ur.y) <= tol1
      || this.isInURange(u);
  }

  /**
   * Returns a new Coedge2 with unserialize data.
   *
   * @return {Coedge2} a new instance.
   */
  static Unserialize(data: any): Coedge2 {
    let ret = new Coedge2();
    ret.e = data.e ? Edge2.Unserialize(data.e) : null;
    ret.ei = data.ei > -1 ? data.ei : -1;
    ret.isForward = data.isForward ? true : false;
    ret.uuid = data.uuid;
    return ret;
  }
}

/**
 * Loop2.
 *
 */
class Loop2 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP2_LOOP2;
  /**
   * Coedges of Loop.
   */
  coedges: Array<Coedge2>;

  /**
   * Constructs a Loop.
   *
   */
  constructor() {
    super();
    this.coedges = [];
  }

  /**
   * Returns a new Loop2 with copied values from this instance.
   *
   * @return {Loop2} A clone of this instance.
   */
  override clone() {
    let result = new Loop2();
    result.coedges = this.coedges?.map((c) => c.clone());
    return result;
  }

  /**
   * Returns a new Loop2 with unserialize data.
   *
   * @return {Loop2} a new instance.
   */
  static Unserialize(data: any): Loop2 {
    let ret = new Loop2();
    let coedges = data.coedges as [];
    for (let i = 0; i < coedges.length; i++) {
      ret.coedges.push(Coedge2.Unserialize(coedges[i]));
    }
    ret.uuid = data.uuid;
    return ret;
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
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP2_FACE2;
  /**
   *  vertices of Face.
   */
  vertices: Array<Vertice2>;

  /**
   * curves of Face.
   */
  curves: Array<Curve2Data>;

  /**
   *  edges of Face.
   */
  edges: Array<Edge2>;

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
    this.curves = [];
    this.vertices = [];
    this.edges = [];
    this.border = new Loop2();
    this.holes = [];
  }
  /**
   * Returns a new Face2 with copied values from this instance.
   *
   * @return {Face2} A clone of this instance.
   */
  override clone() {
    let result = new Face2();
    result.curves = this.curves?.map((c) => c.clone());
    result.vertices = this.vertices?.map((v) => v.clone());
    result.edges = this.edges?.map((e) => e.clone());
    result.border = this.border?.clone();
    result.holes = this.holes?.map((h) => h.clone());
    return result;
  }

  /**
   * Returns all edges from the face.
   *
   * @return {[Edge2]} .
   */
  get allEdges(): Edge2[] {
    if (this.edges.length > 0) {
      return this.allEdges;
    }
    let result: Edge2[] = [];
    this.border.coedges.forEach(coedge => {
      result.push(coedge.e);
    });
    this.holes.forEach(hole => {
      hole.coedges.forEach(coedge => {
        result.push(coedge.e);
      });
    });
    return result;
  }

  /**
   * Returns all Loop from the face.
   *
   * @return {[Loop2]} .
   */
  get loops(): Loop2[] {
    let result: Loop2[] = [];
    result.push(this.border);
    result.push(...this.holes);
    return result;
  }

  /**
   * Returns all edges on curve from the face.
   *
   * @return {[Edge2]} .
   */
  getEdgesByCurve(curve: Curve2Data): Edge2[] {
    let result: Edge2[] = [];
    this.border.coedges.forEach(coedge => {
      if (coedge.e.curve && coedge.e.curve == curve) {
        result.push(coedge.e);
      }
      else if (coedge.e.curvei > -1 && this.curves[coedge.e.curvei] == curve) {
        result.push(coedge.e);
      }
    });
    this.holes.forEach(hole => {
      hole.coedges.forEach(coedge => {
        if (coedge.e.curve && coedge.e.curve == curve) {
          result.push(coedge.e);
        }
        else if (coedge.e.curvei > -1 && this.curves[coedge.e.curvei] == curve) {
          result.push(coedge.e);
        }
      });
    });
    return result;
  }

  /**
   * Returns a new Face2 with unserialize data.
   *
   * @return {Face2} a new instance.
   */
  static Unserialize(data: any): Face2 {
    let ret = new Face2();
    let vertices = data.vertices as [];
    for (let i = 0; i < vertices.length; i++) {
      ret.vertices.push(Vertice2.Unserialize(vertices[i]));
    }
    let curves = data.curves as [];
    for (let i = 0; i < curves.length; i++) {
      ret.curves.push(unserialize(curves[i])[0] as Curve2Data);
    }
    let edges = data.edges as [];
    for (let i = 0; i < edges.length; i++) {
      ret.edges.push(Edge2.Unserialize(edges[i]));
    }
    ret.border = data.border ? Loop2.Unserialize(data.border) : null;
    let holes = data.holes as [];
    for (let i = 0; i < holes.length; i++) {
      ret.holes.push(Loop2.Unserialize(holes[i]));
    }
    ret.uuid = data.uuid;
    return ret;
  }
}

/**
 * directed graph.
 */
class Digraph2 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP2_DIGRAPH2;
  /**
   *  vertices of Face.
   */
  vertice2s: Array<Vertice2>;

  /**
   * Coedges of Loop.
   */

  coedges: Array<Coedge2>;

  /**
   * Constructs a Digraph2.
   *
   */
  constructor() {
    super();
    this.vertice2s = [];
    this.coedges = [];
  }

  /**
   * Returns a new Digraph2 with unserialize data.
   *
   * @return {Digraph2} a new instance.
   */
  static Unserialize(data: any): Digraph2 {
    let ret = new Digraph2();
    let vertice2s = data.vertice2s as [];
    for (let i = 0; i < vertice2s.length; i++) {
      ret.vertice2s.push(Vertice2.Unserialize(vertice2s[i]));
    }
    let coedges = data.coedges as [];
    for (let i = 0; i < coedges.length; i++) {
      ret.coedges.push(Coedge2.Unserialize(coedges[i]));
    }
    ret.uuid = data.uuid;
    return ret;
  }

}

export {
  Vertice2,
  Edge2,
  Coedge2,
  Loop2,
  Face2,
  Digraph2
};