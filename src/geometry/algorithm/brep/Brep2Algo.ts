import { Vector2 } from "../../../math/Math";
import { Line2Data } from "../../data/base/curve2/Line2Data";
import type { Coedge2, Edge2, Face2, Loop2 } from "../../data/brep/Brep2";
import type { Curve2Algo } from "../base/Curve2Algo";
import { CurveBuilder } from "../builder/CurveBuilder";
import { Curve2Inter } from "../relation/intersection/Curve2Inter";

class Coedge2Algo {
  private _c: Coedge2;
  private _algo: Curve2Algo;
  constructor(c: Coedge2) {
    this._c = c;
    this._algo = CurveBuilder.Algorithm2ByData(c.e.curve);
  }
  GetBeginPoint(): Vector2 {
    if (this._c.isForward) {
      return this._algo.p(this._c.e.u.x);
    } else {
      return this._algo.p(this._c.e.u.y);
    }
  }
  GetEndPoint(): Vector2 {
    if (this._c.isForward) {
      return this._algo.p(this._c.e.u.y);
    } else {
      return this._algo.p(this._c.e.u.x);
    }
  }
  GetBeginTangent(): Vector2 {
    if (this._c.isForward) {
      return this._algo.t(this._c.e.u.x);
    } else {
      return this._algo.t(this._c.e.u.y);
    }
  }
  GetEndTangent(): Vector2 {
    if (this._c.isForward) {
      return this._algo.t(this._c.e.u.y);
    } else {
      return this._algo.t(this._c.e.u.x);
    }
  }
  t(u: number): Vector2 {
    if (this._c.isForward) {
      return this._algo.t(u);
    } else {
      return this._algo.t(u).negate();
    }
  }
}
class Brep2Algo {
  /**
   * compute edge to edge intersection point.
   *
   * @param {Edge2} [c0] - The frist curve , binary search curve.
   * @param {Edge2} [c1] - The second curve , general equation curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static GetEdgeBeginEndPoint(e: Edge2): Vector2[] {
    let algo = CurveBuilder.Algorithm2ByData(e.curve);
    return [algo.p(e.u.x), algo.p(e.u.y)];
  }
  /**
   * compute edge to edge intersection point.
   *
   * @param {Edge2} [c0] - The frist curve , binary search curve.
   * @param {Edge2} [c1] - The second curve , general equation curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static GetCoedgeBeginEndPoint(c: Coedge2): Vector2[] {
    let algo = CurveBuilder.Algorithm2ByData(c.e.curve);
    if (c.isForward) {
      return [algo.p(c.e.u.x), algo.p(c.e.u.y)];
    } else {
      return [algo.p(c.e.u.y), algo.p(c.e.u.x)];
    }
  }

  /**
   * point at edge boder?
   *
   * @param {Edge2} [e] - The edge.
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static IsPointAtEdgeBoder(e: Edge2, p: Vector2, tol0: number, tol1: number): boolean {
    let algo = CurveBuilder.Algorithm2ByData(e.curve);
    let begin = algo.p(e.u.x);
    if (p.distanceTo(begin) <= tol0) {
      return true;
    }

    let end = algo.p(e.u.y);
    if (p.distanceTo(end) <= tol0) {
      return true;
    }
    return false;
  }

  /**
   * point at edge inder?
   *
   * @param {Edge2} [e] - The edge.
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static IsPointAtEdgeInder(e: Edge2, p: Vector2, tol0: number, tol1: number): boolean {
    if (Brep2Algo.IsPointAtEdgeBoder(e, p, tol0, tol1)) {
      return false;
    }
    let algo = CurveBuilder.Algorithm2ByData(e.curve);
    let u = algo.u(p);
    if (u) {
      return u > e.u.x && u < e.u.y;
    } else {
      return false;
    }
  }

  /**
   * point on edge? (at boder or at inner)
   *
   * @param {Edge2} [e] - The edge.
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static IsPointOnEdge(e: Edge2, p: Vector2, tol0: number, tol1: number): boolean {
    if (Brep2Algo.IsPointAtEdgeBoder(e, p, tol0, tol1)) {
      return false;
    }
    let algo = CurveBuilder.Algorithm2ByData(e.curve);

    let begin = algo.p(e.u.x);
    if (p.distanceTo(begin) <= tol0) {
      return true;
    }

    let end = algo.p(e.u.y);
    if (p.distanceTo(end) <= tol0) {
      return true;
    }

    let u = algo.u(p);
    return (u >= e.u.x && u <= e.u.y)
      || Math.abs(u - e.u.x) <= tol1
      || Math.abs(u - e.u.y) <= tol1;
  }


  /**
   * point at face boder?
   *
   * @param {Face2} [f] - The face.
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static IsPointAtFaceBoder(f: Face2, p: Vector2, tol0: number, tol1: number): boolean {
    let edges = f.edges;
    edges.forEach((e) => {
      if (Brep2Algo.IsPointOnEdge(e, p, tol0, tol1)) {
        return true;
      }
    });
    return false;
  }

  /**
   * point at loop inner?
   *
   * @param {Loop2} [l] - The loop.
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static IsPointAtLoopInner(l: Loop2, p: Vector2, tol0: number, tol1: number): boolean {
    // 获得一条水平射线
    let ray = new Line2Data(); ray.trans.pos = p;
    let rayAlgo = CurveBuilder.Algorithm2ByData(ray);
    // 计算射线与所有边的交点->判断交点是否穿透点->穿有点是奇数在轮廓内部，反之在轮廓外部。
    let boder = l.coedges;
    let algos: Coedge2Algo[] = [];
    let count = boder.length;
    for (let i = 0; i < count; i++) {
      let curr = boder[i];
      algos.push(new Coedge2Algo(curr));
    }
    // 穿透点数组
    let cross: Vector2[] = [];
    for (let i = 0; i < count; i++) {
      let curr = boder[i];
      let curve = curr.e.curve;
      let inters = Curve2Inter.X(ray, curve, tol0, tol1);
      let precAlgo = algos[(i - 1) % count];
      let currAlgo = algos[i];
      let nextAlgo = algos[(i + 1) % count];
      for (let j = 0; j < inters.length; j++) {
        let inter = inters[j];
        // 是否为穿透点判定：
        // A 如果交点在曲线内部，取曲线在交点上的切线，若射线与切线重合，则是切点，不认为是穿透点。
        if (inter.u1 > curr.e.u.x && inter.u1 < curr.e.u.y) {
          let d = currAlgo.t(inter.u1);//切线方向
          // 如果是水平切线，就是切点
          if (Math.abs(d.y) <= tol1) {
            //不认为是穿透点。
            continue;
          }
          cross.push(inter.p);
          continue;
        }
        // B 如果交点在曲线两端，取交点在射线前后很小范围内的两个点，检查两个点是否同在前后两段边的左侧或者右侧。
        //   如果同在前后两段边的左侧或者右侧，则是切点，不认为是穿透点。
        //取交点在射线前后很小范围内的两个点
        let frontPoint = rayAlgo.p(inter.u0 - 1e-4);
        let backPoint = rayAlgo.p(inter.u0 + 1e-4);
        let frontTangent: Vector2 = null;
        let backTangent: Vector2 = null;
        // 交点是当前段的起点
        if (curr.isForward && Math.abs(inter.u1 - curr.e.u.x) <= tol1
          || !curr.isForward && Math.abs(inter.u1 - curr.e.u.y) <= tol1) {
          // 取前一段的终点切线和当前段起点切线
          frontTangent = precAlgo.GetBeginTangent();
          backTangent = currAlgo.GetBeginTangent();
        }
        // 交点是当前段的终点
        if (curr.isForward && Math.abs(inter.u1 - curr.e.u.y) <= tol1
          || !curr.isForward && Math.abs(inter.u1 - curr.e.u.x) <= tol1) {
          // 取前一段的终点切线和当前段起点切线
          frontTangent = currAlgo.GetBeginTangent();
          backTangent = nextAlgo.GetBeginTangent();
        }

        if (frontTangent && backTangent) {
          let frontVector = frontPoint.clone().sub(inter.p);
          let backVector = backPoint.clone().sub(inter.p);
          let frontCross = frontVector.cross(frontTangent);
          let backCross = backVector.cross(backTangent);
          // 叉乘结果同号，说明两个点分处在曲线的不同侧，是穿透点。
          if (frontCross * backCross < 0) {
            cross.push(inter.p);
          }
        }
      }
    }

    // 去掉重复点
    for (let i = cross.length - 1; i > 0; i--) {
      let curr = cross[i];
      for (let j = 0; j < i; j++) {
        let befor = cross[j];
        if (curr.distanceTo(befor) <= tol0) {
          cross.slice(i, 1);
          break;
        }
      }
    }
    // 根据剩余交点个数的奇数/偶数，判断点的位置。
    return cross.length % 2 == 1;
  }

  /**
   * point at face inner?
   *
   * @param {Face2} [e] - The face.
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static IsPointAtFaceInner(f: Face2, p: Vector2, tol0: number, tol1: number): boolean {
    // 不能在face轮廓线上，在face的外轮看内部，并且在空腔的外部。
    if (Brep2Algo.IsPointAtFaceBoder(f, p, tol0, tol1)) {
      return false;
    }
    if (!Brep2Algo.IsPointAtLoopInner(f.border, p, tol0, tol1)) {
      return false;
    }
    let holes = f.holes;
    let count = holes.length;
    for (let i = 0; i < count; i++) {
      if (Brep2Algo.IsPointAtLoopInner(holes[i], p, tol0, tol1)) {
        return false;
      }
    }
    return true;
  }

  /**
   * point on face? (at boder or at inner)
   *
   * @param {Face2} [e] - The face.
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static IsPointOnFace(f: Face2, p: Vector2, tol0: number, tol1: number): boolean {
    // 在face轮廓线上 或者 在face的外轮看内部，并且在空腔的外部。
    if (Brep2Algo.IsPointAtFaceBoder(f, p, tol0, tol1)) {
      return true;
    }
    if (!Brep2Algo.IsPointAtLoopInner(f.border, p, tol0, tol1)) {
      return false;
    }
    let holes = f.holes;
    let count = holes.length;
    for (let i = 0; i < count; i++) {
      if (Brep2Algo.IsPointAtLoopInner(holes[i], p, tol0, tol1)) {
        return false;
      }
    }
    return true;
  }

}
export {
  Brep2Algo
}