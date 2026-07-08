import { GeomType } from "../../../core/Constents";
import { Vector2, Vector3, Vector4 } from "../../../math/Math";
import type { Curve3Data } from "../base/Curve3Data";
import type { SurfaceData } from "../base/SurfaceData";
import { Transform3 } from "../base/Transform3";
import { unserialize } from "../base/Unserialize";
import { DataBase } from "../DataBase";

/**
 * Brep data on xyz space;
 * lump's border is face.
 * face's border is coedge.
 * edge's border is vertice.
 * 
 */


/**
 * Vertice3.
 *
 */
class Vertice3 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP3_VERTICE3;
  /**
   * point of Vertice.
   *
   */
  p: Vector3;

  /**
   * Constructs a Vertice.
   *
   */
  constructor() {
    super();
  }
  /**
   * Returns a new Vertice3 with copied values from this instance.
   *
   * @return {Vertice3} A clone of this instance.
   */
  override clone() {
    let result = new Vertice3();
    result.p = this.p?.clone();
    return result;
  }
  /**
   * Returns a new Vertice2 with unserialize data.
   *
   * @return {Vertice2} a new instance.
   */
  static Unserialize(data: any): Vertice3 {
    let ret = new Vertice3();
    ret.p = data.p ? Vector3.Unserialize(data.p) : null;
    ret.uuid = data.uuid;
    return ret;
  }
}

/**
 * Edge.
 *
 */
class Edge3 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP3_EDGE3;
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
   * v0 index of Edge.
   * Used to relate to vertice array in Brep3 when index is not -1. 
   */
  v0i: number = -1;

  /**
   * v1 index of Edge.
   * Used to relate to vertice array in Brep3 when index is not -1. 
   */
  v1i: number = -1;

  /**
   * Curve index of Edge.
   * Used to relate to curve array in Brep3 when curveIndex is -1.
   */
  curvei: number = -1;

  /**
   * u parameter interval of curve of Edge.
   * u.x is begin parameter on the curve.
   * u.y is end parameter on the curve.
   * 
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
   * Returns a new Edge3 with copied values from this instance.
   *
   * @return {Edge3} A clone of this instance.
   */
  override clone() {
    let result = new Edge3();
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
   * Returns a new Edge3 with unserialize data.
   *
   * @return {Edge3} a new instance.
   */
  static Unserialize(data: any): Edge3 {
    let ret = new Edge3();
    ret.curve = data.curve ? unserialize(data.curve)[0] as Curve3Data : null;
    ret.u = data.u ? Vector2.Unserialize(data.u) : null;
    ret.v0 = data.v0 ? Vertice3.Unserialize(data.v0) : null;
    ret.v1 = data.v1 ? Vertice3.Unserialize(data.v1) : null;
    ret.curvei = data.curvei > -1 ? data.curvei : -1;
    ret.v0i = data.v0i > -1 ? data.v0i : -1;
    ret.v1i = data.v1i > -1 ? data.v1i : -1;
    ret.uuid = data.uuid;
    return ret;
  }
}

/**
 * Codge.
 *
 */
class Coedge3 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP3_COEDGE3;
  /**
   * Edge of Coedge.
   *
   */
  e: Edge3;

  /**
   * e index of Coedge3.
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
   * Returns a new Coedge3 with copied values from this instance.
   *
   * @return {Coedge3} A clone of this instance.
   */
  override clone() {
    let result = new Coedge3();
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
   * Returns a new Coedge3 with unserialize data.
   *
   * @return {Coedge3} a new instance.
   */
  static Unserialize(data: any): Coedge3 {
    let ret = new Coedge3();
    ret.e = data.e ? Edge3.Unserialize(data.e) : null;
    ret.ei = data.ei > -1 ? data.ei : -1;
    ret.isForward = data.isForward ? true : false;
    ret.uuid = data.uuid;
    return ret;
  }

}

/**
 * Loop3.
 *
 */
class Loop3 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP3_LOOP3;
  /**
   * Coedges of Loop.
   */
  coedges: Array<Coedge3>;

  /**
   * Constructs a Loop.
   *
   */
  constructor() {
    super();
  }

  /**
   * Returns a new Loop3 with copied values from this instance.
   *
   * @return {Loop3} A clone of this instance.
   */
  override clone() {
    let result = new Loop3();
    result.coedges = this.coedges?.map((c) => c.clone());
    return result;
  }

  /**
   * Returns a new Loop3 with unserialize data.
   *
   * @return {Loop3} a new instance.
   */
  static Unserialize(data: any): Loop3 {
    let ret = new Loop3();
    let coedges = data.coedges as [];
    for (let i = 0; i < coedges.length; i++) {
      ret.coedges.push(Coedge3.Unserialize(coedges[i]));
    }
    ret.uuid = data.uuid;
    return ret;
  }
}

/**
 * Face.
 *
 */
class Face3 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP3_FACE3;
  /**
   *  vertices of Face.
   */
  vertices: Array<Vertice3>;

  /**
   * curves of Face.
   */
  curves: Array<Curve3Data>;

  /**
   *  edges of Face.
   */
  edges: Array<Edge3>;  

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
   * surface index of Face.
   * Used to relate to surface array in Brep3 when index is not -1.
   */
  surfaceIndex: number = -1;

  /**
   * u parameter interval of surface of face.
   * u.xy is begin parameter surface the face.
   * u.zw is end parameter surface the face.
   * 
   */
  uv: Vector4;

  /**
   * Constructs a Face.
   *
   */
  constructor() {
    super();
    this.curves = [];
    this.vertices = [];
    this.edges = [];
    this.border = new Loop3();
    this.holes = [];
  }

  /**
   * Returns a new Face3 with copied values from this instance.
   *
   * @return {Face3} A clone of this instance.
   */
  override clone() {
    let result = new Face3();
    result.curves = this.curves?.map((c) => c.clone());
    result.vertices = this.vertices?.map((v) => v.clone());
    result.edges = this.edges?.map((e) => e.clone());
    result.border = this.border?.clone();
    result.holes = this.holes?.map((v) => v.clone());
    result.surface = this.surface?.clone();
    result.surfaceIndex = this.surfaceIndex;
    result.uv = this.uv;
    return result;
  }

  /**
   * Returns a new Face3 with unserialize data.
   *
   * @return {Face3} a new instance.
   */
  static Unserialize(data: any): Face3 {
    let ret = new Face3();
    ret.border = data.border ? Loop3.Unserialize(data.loop) : null;
    let holes = data.holes as [];
    for (let i = 0; i < holes.length; i++) {
      ret.holes.push(Loop3.Unserialize(holes[i]));
    }
    ret.surface = data.surface ? unserialize(data.surface)[0] as SurfaceData : null;
    ret.surfaceIndex = data.surfaceIndex;
    ret.uv = data.uv ? Vector4.Unserialize(data.uv) : null;
    ret.uuid = data.uuid;
    return ret;
  }
}
/**
 * directed graph.
 */
class Digraph3 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP3_DIGRAPH3;
  /**
   *  vertices of Face.
   */
  vertice3s: Array<Vertice3>;

  /**
   * Coedges of Loop.
   */

  coedges: Array<Coedge3>;

  /**
   * Constructs a Digraph3.
   *
   */
  constructor() {
    super();
    this.vertice3s = [];
    this.coedges = [];
  }

  /**
   * Returns a new Digraph3 with unserialize data.
   *
   * @return {Digraph3} a new instance.
   */
  static Unserialize(data: any): Digraph3 {
    let ret = new Digraph3();
    let vertice3s = data.vertice3s as [];
    for (let i = 0; i < vertice3s.length; i++) {
      ret.vertice3s.push(Vertice3.Unserialize(vertice3s[i]));
    }
    let coedges = data.coedges as [];
    for (let i = 0; i < coedges.length; i++) {
      ret.coedges.push(Coedge3.Unserialize(coedges[i]));
    }
    ret.uuid = data.uuid;
    return ret;
  }

}

/**
 * Shell3.
 *
 */
class Shell3 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP3_SHELL3;
  /**
   * faces of Shell.
   */
  faces: Array<Face3>;

  /**
   * Constructs a Face.
   *
   */
  constructor() {
    super();
  }
  /**
   * Returns a new Shell3 with unserialize data.
   *
   * @return {Shell3} a new instance.
   */
  static Unserialize(data: any): Shell3 {
    let ret = new Shell3();
    let faces = data.faces as [];
    for (let i = 0; i < faces.length; i++) {
      ret.faces.push(Face3.Unserialize(faces[i]));
    }
    ret.uuid = data.uuid;
    return ret;
  }
}

/**
 * Lump3.
 *
 */
class Lump3 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP3_LUMP3;
  /**
   * shells of Lump.
   */
  shells: Array<Shell3>;

  /**
   * Constructs a Face.
   *
   */
  constructor() {
    super();
  }
  /**
   * Returns a new Lump3 with unserialize data.
   *
   * @return {Lump3} a new instance.
   */
  static Unserialize(data: any): Lump3 {
    let ret = new Lump3();
    let shells = data.shells as [];
    for (let i = 0; i < shells.length; i++) {
      ret.shells.push(Shell3.Unserialize(shells[i]));
    }
    ret.uuid = data.uuid;
    return ret;
  }
}

/**
 * Body.
 * Base geometry in Body3 is never transformed after construction.
 * Wire and Face relate base geometry by reference.
 * Just Body3 transform is changed to move geometry.
 */
class Body3 extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_BREP3_BODY3;
  /**
   *  vertices of Body.
   */
  vertices: Array<Vertice3>;

  /**
   * curves of Body.
   */
  curves: Array<Curve3Data>;

  /**
   *  edges of Face.
   */
  edges: Array<Edge3>;

  /**
   * surfaces of Body.
   */
  surfaces: Array<SurfaceData>;

  /**
   * transform of Body.
   */
  transform: Transform3;

  /**
   * lumps of Body.
   */
  lumps: Array<Lump3>;

  /**
   * Constructs a Face.
   *
   */
  constructor() {
    super();
  }

  /**
   * Returns a new Body3 with unserialize data.
   *
   * @return {Body3} a new instance.
   */
  static Unserialize(data: any): Body3 {
    let ret = new Body3();
    let vertices = data.vertices as [];
    for (let i = 0; i < vertices.length; i++) {
      ret.vertices.push(Vertice3.Unserialize(vertices[i]));
    }
    let curves = data.curves as [];
    for (let i = 0; i < curves.length; i++) {
      ret.curves.push(unserialize(curves[i])[0] as Curve3Data);
    }

    let edges = data.edges as [];
    for (let i = 0; i < edges.length; i++) {
      ret.edges.push(Edge3.Unserialize(edges[i]));
    }

    let surfaces = data.surfaces as [];
    for (let i = 0; i < surfaces.length; i++) {
      ret.surfaces.push(unserialize(surfaces[i])[0] as SurfaceData);
    }

    ret.transform = data.transform ? Transform3.Unserialize(data.transform) : null;

    let lumps = data.lumps as [];
    for (let i = 0; i < lumps.length; i++) {
      ret.lumps.push(Lump3.Unserialize(lumps[i]));
    }
    ret.uuid = data.uuid;
    return ret;
  }
}

export {
  Vertice3,
  Edge3,
  Coedge3,
  Loop3,
  Face3,
  Digraph3,
  Shell3,
  Lump3,
  Body3
};