import { Vector2 } from "../../../math/Math";
import type { Curve2Data } from "../base/Curve2Data";
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
}

/**
 * Edge.
 *
 */
class Edge2 extends DataBase {
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
   * Curve index of Edge.
   * Used to relate to curve array in Brep2 when index is not -1. 
   */
  curveIndex: number = -1;

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
    result.v0 = this.v0;
    result.v1 = this.v1;
    result.curveIndex = this.curveIndex;
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
   * Returns a new Loop2 with copied values from this instance.
   *
   * @return {Coedge2} A clone of this instance.
   */
  override clone() {
    let result = new Coedge2();
    result.e = this.e.clone();
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
}

/**
 * Loop2.
 *
 */
class Loop2 extends DataBase {
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
   *  vertices of Face.
   */
  vertice2s: Array<Vertice2>;

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
    this.vertice2s = [];
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
    // result.vertice2s = this.vertice2s?.map((v) => v.clone());
    result.border = this.border?.clone();
    result.holes = this.holes?.map((h) => h.clone());
    return result;
  }

  /**
   * Returns all edges from the face.
   *
   * @return {[Edge2]} .
   */
  get edges(): Edge2[] {
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
      else if (coedge.e.curveIndex > -1 && this.curves[coedge.e.curveIndex] == curve) {
        result.push(coedge.e);
      }
    });
    this.holes.forEach(hole => {
      hole.coedges.forEach(coedge => {
        if (coedge.e.curve && coedge.e.curve == curve) {
          result.push(coedge.e);
        }
        else if (coedge.e.curveIndex > -1 && this.curves[coedge.e.curveIndex] == curve) {
          result.push(coedge.e);
        }
      });
    });
    return result;
  }
}

/**
 * directed graph.
 */
class Digraph2 {
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
    this.vertice2s = [];
    this.coedges = [];
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