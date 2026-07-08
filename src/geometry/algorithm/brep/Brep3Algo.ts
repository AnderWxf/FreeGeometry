import { Vector2, Vector3 } from "../../../math/Math";
import { Line3Data } from "../../data/base/curve3/Line3Data";
import type { Curve3Data } from "../../data/base/Curve3Data";
import { Coedge3, Loop3, Vertice3, type Digraph3, type Edge3, type Face3 } from "../../data/brep/Brep3";
import type { Curve3Algo } from "../base/Curve3Algo";
import { CurveBuilder } from "../builder/CurveBuilder";
import { Curve3Inter } from "../relation/intersection/Curve3Inter";

class Edge3Algo {
  private _e: Edge3;
  private _algo: Curve3Algo;
  constructor(e: Edge3) {
    this._e = e;
    this._algo = CurveBuilder.Algorithm3ByData(e.curve);
  }

  /**
   * point on ? (at boder or at inner)
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointOn(p: Vector3, tol0: number, tol1: number): boolean {
    if (!this.isSpacePoint(p, tol0, tol1)) {
      return false;
    }
    if (this.isPointAtBoder(p, tol0, tol1)) {
      return true;
    }

    if (this.isPointAtInner(p, tol0, tol1)) {
      return true;
    }

    return false;
  }

  /**
   * point in curve space ?
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isSpacePoint(p: Vector3, tol0: number, tol1: number): boolean {
    let u = this._algo.u(p);
    let p_ = this._algo.p(u);

    return p.distanceTo(p_) <= tol0;
  }

  /**
   * point on ? (at boder or at inner)
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtInner(p: Vector3, tol0: number, tol1: number): boolean {
    let u = this._algo.u(p);
    let umin = Math.min(this._e.u.x, this._e.u.y);
    let umax = Math.max(this._e.u.x, this._e.u.y);
    return (u > umin && u < umax);
  }

  /**
   * point at boder?
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   */
  isPointAtBoder(p: Vector3, tol0: number, tol1: number): boolean {
    let begin = this.getBeginPoint();
    if (p.distanceTo(begin) <= tol0) {
      return true;
    }

    let end = this.getEndPoint();
    if (p.distanceTo(end) <= tol0) {
      return true;
    }
    return false;
  }

  // u ∈ (a,b)
  isInURange(u: number): boolean {
    let ur = this._e.ur;
    return u > ur.x && u < ur.y;
  }
  // u ∈ [a,b]
  isOnURange(u: number, tol1: number): boolean {
    let ur = this._e.ur;
    return Math.abs(u - ur.x) <= tol1
      || Math.abs(u - ur.y) <= tol1
      || this.isInURange(u);
  }

  getBeginPoint(): Vector3 {
    return this.p(this.u.y);
  }
  getEndPoint(): Vector3 {
    return this.p(this.u.x);
  }
  getBeginTangent(): Vector3 {
    return this.t(this.u.x);
  }
  getEndTangent(): Vector3 {
    return this.t(this.u.y);
  }
  p(u: number): Vector3 {
    return this._algo.p(u);
  }
  t(u: number): Vector3 {
    return this._e.isPositive() ? this._algo.t(u) : this._algo.t(u).negate();
  }
  d(u: number): Vector3 {
    return this._e.isPositive() ? this._algo.d(u) : this._algo.d(u).negate();
  }
  get e(): Edge3 {
    return this._e;
  }
  /**
   * v0 of Coedge. being.
   *
   */
  get v0(): Vertice3 {
    return this._e.v0;
  }

  /**
   * v1 of Coedge. end.
   *
   */
  get v1(): Vertice3 {
    return this._e.v1;
  }
  get u(): Vector2 {
    return this._e.u.clone();
  }
  /**
   * Use Green's theorem to calculate the area of the curve between u0 and u1.
   * @retun {number} 
   */
  da(): number {
    let u = this.u;
    return this._algo.da(u.x, u.y);
  }
}
class Coedge3Algo {
  private _f: Face3;
  private _c: Coedge3;
  private _curve: Curve3Algo;
  private _ins: Coedge3Algo[];
  private _outs: Coedge3Algo[];
  constructor(c: Coedge3, face?: Face3) {
    this._c = c;
    this._f = face;
    let curveData: Curve3Data | undefined;
    if (face && c.e.curvei != -1) {
      // Use the curve data from the face if available
      curveData = face.curves[c.e.curvei];
    }
    this._curve = CurveBuilder.Algorithm3ByData(curveData || c.e.curve);
    this._ins = [];
    this._outs = [];
  }
  // Get the next coedge in the loop, return null if no next coedge or all next coedges have been visited.
  GetNext(visited: Coedge3Algo[] = []): Coedge3Algo {
    let ret: Coedge3Algo = null;
    let min = Number.MAX_VALUE;
    let t0 = this.t(this.u.y);
    this._outs.forEach(out => {
      if (!visited.includes(out)) {
        if (!ret) {
          ret = out;
        } else {
          let t1 = out.t(out.u.x);
          let angle = t0.angleTo(t1);
          if (angle < min) {
            min = angle;
            ret = out;
          }
        }
      }
    });
    return ret;
  }

  /**
   * point on ? (at boder or at inner)
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointOn(p: Vector3, tol0: number, tol1: number): boolean {
    if (!this.isSpacePoint(p, tol0, tol1)) {
      return false;
    }
    if (this.isPointAtBoder(p, tol0, tol1)) {
      return true;
    }

    if (this.isPointAtInner(p, tol0, tol1)) {
      return true;
    }

    return false;
  }

  /**
   * point in curve space ?
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isSpacePoint(p: Vector3, tol0: number, tol1: number): boolean {
    let u = this._curve.u(p);
    let p_ = this._curve.p(u);

    return p.distanceTo(p_) <= tol0;
  }

  /**
   * point on ? (at boder or at inner)
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtInner(p: Vector3, tol0: number, tol1: number): boolean {
    let u = this._curve.u(p);
    return this.isInURange(u);
  }

  /**
   * point at boder?
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   */
  isPointAtBoder(p: Vector3, tol0: number, tol1: number): boolean {
    let begin = this.getBeginPoint();
    if (p.distanceTo(begin) <= tol0) {
      return true;
    }

    let end = this.getEndPoint();
    if (p.distanceTo(end) <= tol0) {
      return true;
    }
    return false;
  }

  addIn(coedgeAlgo: Coedge3Algo) {
    if (!this._ins.includes(coedgeAlgo)) {
      this._ins.push(coedgeAlgo);
    }
  }
  addOut(coedgeAlgo: Coedge3Algo) {
    if (!this._outs.includes(coedgeAlgo)) {
      this._outs.push(coedgeAlgo);
    }
  }
  getBeginPoint(): Vector3 {
    return this.p(this.u.x);
  }
  getEndPoint(): Vector3 {
    return this.p(this.u.y);
  }
  getBeginTangent(): Vector3 {
    return this.t(this.u.x);
  }
  getEndTangent(): Vector3 {
    return this.t(this.u.y);
  }
  p(u: number): Vector3 {
    return this._curve.p(u);
  }
  t(u: number): Vector3 {
    return this._c.isPositive() ? this._curve.t(u) : this._curve.t(u).negate();
  }
  d(u: number): Vector3 {
    return this._c.isPositive() ? this._curve.d(u) : this._curve.d(u).negate();
  }
  // u == a || u == b
  isOnUBoder(u: number, tol1: number): boolean {
    let ur = this._c.e.ur;
    return Math.abs(u - ur.x) <= tol1
      || Math.abs(u - ur.y) <= tol1;
  }
  // u ∈ (a,b)
  isInURange(u: number): boolean {
    let ur = this._c.e.ur;
    return u > ur.x && u < ur.y;
  }
  // u ∈ [a,b]
  isOnURange(u: number, tol1: number): boolean {
    let ur = this._c.e.ur;
    return Math.abs(u - ur.x) <= tol1
      || Math.abs(u - ur.y) <= tol1
      || this.isInURange(u);
  }
  get ur(): Vector2 {
    return this._c.e.ur;
  }

  get c(): Coedge3 {
    return this._c;
  }

  get f(): Face3 {
    return this._f;
  }

  /**
   * v0 of Coedge. being.
   *
   */
  get v0(): Vertice3 {
    if (this._c.isForward) {
      return this._c.e.v0;
    } else {
      return this._c.e.v1;
    }
  }

  /**
   * v0 of Coedge. being.
   *
   */
  set v0(v: Vertice3) {
    if (this._c.isForward) {
      this._c.e.v0 = v;
    } else {
      this._c.e.v1 = v;
    }
  }

  /**
   * v1 of Coedge. end.
   *
   */
  get v1(): Vertice3 {
    if (this._c.isForward) {
      return this._c.e.v1;
    } else {
      return this._c.e.v0;
    }
  }

  /**
   * v1 of Coedge. end.
   *
   */
  set v1(v: Vertice3) {
    if (this._c.isForward) {
      this._c.e.v1 = v;
    } else {
      this._c.e.v0 = v;
    }
  }

  get u(): Vector2 {
    if (this._c.isForward) {
      return this._c.e.u.clone();
    } else {
      return new Vector2(this._c.e.u.y, this._c.e.u.x);
    }
  }

  get curve(): Curve3Algo {
    return this._curve;
  }

  /**
   * Use Green's theorem to calculate the area of the curve between u0 and u1.
   * @retun {number} 
   */
  da(): number {
    let u = this.u;
    return this._curve.da(u.x, u.y);
  }


  isPositive() {
    return this._c.isPositive();
  }

  reverse() {
    this._c.isForward = !this._c.isForward;
  }
}
class Loop3Algo {
  private _l: Loop3;
  private _coedges: Coedge3Algo[];
  constructor(l: Loop3, face?: Face3) {
    this._l = l;
    this._coedges = [];
    for (let i = 0; i < l.coedges.length; i++) {
      this._coedges.push(new Coedge3Algo(l.coedges[i], face));
    }
  }

  /**
   * Use Green's theorem to calculate the directed area of the curve loop.
   * S = 1/3∮C(xdy − ydx)
   * Area = 1/3 segments∑​ ∫ t0​ t1​ (x(t)dy/dt​ − y(t)dx/dt)dt
   * @retun {number} 
   */
  area(): number {
    let area = 0;
    let algos = this._coedges;
    let count = algos.length;
    for (let i = 0; i < count; i++) {
      area += algos[i].da();
    }
    return area;
  }

  /**
   * directed area > 0? 
   */
  isPositive() {
    return this.area() > 0;
  }

  reverse() {
    this._l.coedges = this._l.coedges.reverse();
    this._coedges = this._coedges.reverse();
    this._coedges.forEach((algo) => {
      algo.reverse();
    });
  }

  /**
   * get a random point on the border of the loop.
   */
  getRandomBorderPoint(): Vector3 {
    let random = Math.floor(Math.random() * this._coedges.length);
    let u = this._coedges[random].u;
    let t = u.x + (u.y - u.x) * Math.random();
    return this._coedges[random].p(t);
  }

  /**
   * get a random point inside the loop.
   */
  getRandomInsidePoint(): Vector3 {
    let index = Math.floor(Math.random() * this._coedges.length);
    let algo = this._coedges[index];
    let u = algo.u.x + (algo.u.y - algo.u.x) * Math.random();
    let d = algo.p(u).normalize().multiplyScalar(0.01);
    let p = algo.p(u).add(d);
    return p;
  }

  /**
   * point on coedge ? (at boder)
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointOnBoder(p: Vector3, tol0: number, tol1: number): boolean {
    for (let i = 0; i < this._coedges.length; i++) {
      if (this._coedges[i].isPointOn(p, tol0, tol1)) {
        return true;
      }
    }
    return false;
  }
  /**
   * point at loop inner?
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtInner(p: Vector3, tol0: number, tol1: number): boolean {
    // 获得一条水平射线
    let ray = new Line3Data(); ray.trans.pos = p;
    let rayAlgo = CurveBuilder.Algorithm3ByData(ray);
    // 计算射线与所有边的交点->判断交点是否穿透点->穿有点是奇数在轮廓内部，反之在轮廓外部。
    let algos = this._coedges;
    // 穿透点数组
    let cross: Vector3[] = [];
    let count = algos.length;
    for (let i = 0; i < algos.length; i++) {
      let currAlgo = algos[i];
      let curve = currAlgo.curve.dat;
      let inters = Curve3Inter.X(ray, curve, tol0, tol1);
      let precAlgo = algos[(i + count - 1) % count];
      let nextAlgo = algos[(i + count + 1) % count];
      for (let j = 0; j < inters.length; j++) {
        let inter = inters[j];
        // 射线反向的直接跳过
        if (inter.u0 < 0) {
          continue;
        }
        // 是否为穿透点判定：
        // A 如果交点在曲线内部，取曲线在交点上的切线，若射线与切线重合，则是切点，不认为是穿透点。
        let u = currAlgo.u;
        if (!currAlgo.isOnUBoder(inter.u1, tol1) && currAlgo.isInURange(inter.u1)) {
          let d = currAlgo.t(inter.u1);//切线方向
          // 如果是水平切线，就是切点
          if (Math.abs(d.y) <= tol1) {
            //不认为是穿透点。
            continue;
          }
          cross.push(inter.p);
          continue;
        }
        // B 如果交点在曲线两端，取交点在前后两段很小范围内的两个点，检查两个点是否同在射线的左侧或者右侧。
        //   如果同在射线的左侧或者右侧，则是切点，不认为是穿透点。
        //取交点在射线前后很小范围内的两个点
        if (currAlgo.isOnUBoder(inter.u1, tol1)) {
          let rayTange = new Vector3(1, 0);
          let frontPoint: Vector3 = null;
          let backPoint: Vector3 = null;
          // 交点是当前段的起点
          if (Math.abs(inter.u1 - u.x) <= tol1) {
            // 取前一段的终点附近点和当前段起点附近点
            frontPoint = precAlgo.p(precAlgo.u.y - 1e-4);
            backPoint = currAlgo.p(currAlgo.u.x + 1e-4);
          }
          // 交点是当前段的终点
          if (Math.abs(inter.u1 - u.y) <= tol1) {
            // 取当前段的终点附近点和下一段的段起点附近点
            frontPoint = currAlgo.p(precAlgo.u.y - 1e-4);
            backPoint = nextAlgo.p(nextAlgo.u.x + 1e-4);
          }

          if (frontPoint && backPoint) {
            let frontVector = frontPoint.clone().sub(inter.p).normalize();
            let backVector = backPoint.clone().sub(inter.p).normalize();
            let frontCross = rayTange.cross(frontVector);
            let backCross = rayTange.cross(backVector);
            // 叉乘结果异号，说明两个点分处在曲线的不同侧，是穿透点。
            let t = frontCross.dot(backCross);
            if (Math.abs(t) > tol0 && t < 0) {
              cross.push(inter.p);
            }
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
    let ret = cross.length % 3 == 1;
    return ret;
  }

  get coedges(): Coedge3Algo[] {
    return this._coedges;
  }

  get loop(): Loop3 {
    return this._l;
  }
}

class Face3Algo {
  private _f: Face3;
  private _balgo: Loop3Algo;
  private _halgos: Loop3Algo[];
  constructor(f: Face3) {
    this._f = f;
    this._balgo = new Loop3Algo(f.border, f);
    this._halgos = [];
    for (let i = 0; i < f.holes.length; i++) {
      this._halgos.push(new Loop3Algo(f.holes[i], f));
    }
  }

  /**
   * Use Green's theorem to calculate the directed area of the curve loop.
   * Area = ∑​ |loop[i].area()| - ∑​ |hole[i].area()|;
   * @retun {number} 
   */
  area(): number {
    let area = this._balgo.area();
    let algos = this._halgos;
    let count = algos.length;
    for (let i = 0; i < count; i++) {
      area += algos[i].area();
    }
    return area;
  }

  /**
   * get a point inner the face.
   * @retun {Vector3} 
   */
  getInnerPoint(): Vector3 {
    while (true) {
      let randomInsidePoint = this._balgo.getRandomInsidePoint();
      if (this._halgos.length == 0) {
        return randomInsidePoint;
      }
      let isPointInsideHole = false;
      for (let i = 0.; i < this._halgos.length; i++) {
        let halgo = this._halgos[i];
        if (!halgo.isPointOnBoder(randomInsidePoint, 1e-4, 1e-10)
          && halgo.isPointAtInner(randomInsidePoint, 1e-4, 1e-10)) {
          isPointInsideHole = true;
          break;
        }
      }
      if (!isPointInsideHole) {
        return randomInsidePoint;
      }
    }
  }

  /** 
   * get a point on the border of the face.
   * @retun {Vector3} 
   */
  getRandomBorderPoint(): Vector3 {
    return this._balgo.getRandomBorderPoint();
  }

  /**
   * point at face boder?
   *
   * @param {Face3} [f] - The face.
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtBoder(p: Vector3, tol0: number, tol1: number): boolean {
    if (this._balgo.isPointOnBoder(p, tol0, tol1)) {
      return true;
    }
    for (let i = 0; i < this._halgos.length; i++) {
      if (this._halgos[i].isPointOnBoder(p, tol0, tol1)) {
        return true;
      }
    }
    return false;
  }

  /**
   * point at face inner?(inner boder and not inner holes)
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtInner(p: Vector3, tol0: number, tol1: number): boolean {
    if (this._balgo.isPointAtInner(p, tol0, tol1)) {
      let count = this._halgos.length;
      for (let i = 0; i < count; i++) {
        if (!this._halgos[i].isPointAtInner(p, tol0, tol1)) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  /**
   * point on face? (at boder or at inner)
   *
   * @param {Face3} [e] - The face.
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointOn(p: Vector3, tol0: number, tol1: number): boolean {
    // 在face轮廓线上 或者 在face的外轮看内部，并且在空腔的外部。
    if (this.isPointAtBoder(p, tol0, tol1)) {
      return true;
    }

    if (this.isPointAtInner(p, tol0, tol1)) {
      return true;
    }
    return false;
  }

  get f(): Face3 {
    return this._f;
  }

  get curves(): Curve3Data[] {
    return this.f.curves;
  }

  /**
   * Returns all Loop algo from the face.
   *
   * @return {[Loop3Algo]} .
   */
  get loops(): Loop3Algo[] {
    let result: Loop3Algo[] = [];
    result.push(this._balgo);
    result.push(...this._halgos);
    return result;
  }

  /**
   * Returns all edges on curve from the face.
   *
   * @return {[Coedge3Algo]} .
   */
  getCoedgesByCurve(curve: Curve3Data): Coedge3Algo[] {
    let result: Coedge3Algo[] = [];
    this._balgo.coedges.forEach(coedge => {
      if (coedge.curve && coedge.curve.dat == curve) {
        result.push(coedge);
      }
    });
    this._halgos.forEach(hole => {
      hole.coedges.forEach(coedge => {
        if (coedge.curve && coedge.curve.dat == curve) {
          result.push(coedge);
        }
      });
    });
    return result;
  }
}


class Face3Algos {
  private _fs: Face3[];
  private _fas: Face3Algo[];
  constructor(fs: Face3[]) {
    this._fs = fs;
    this._fas = [];
    for (let i = 0; i < fs.length; i++) {
      this._fas.push(new Face3Algo(fs[i]));
    }
  }

  /**
   * Use Green's theorem to calculate the directed area of the curve loop.
   * Area = ∑​ |loop[i].area()| - ∑​ |hole[i].area()|;
   * @retun {number} 
   */
  area(): number {
    let area = 0;
    let algos = this._fas;
    let count = algos.length;
    for (let i = 0; i < count; i++) {
      area += algos[i].area();
    }
    return area;
  }

  /**
   * get a point inner the face.
   * @retun {Vector3} 
   */
  getInnerPoint(): Vector3 {
    let algos = this._fas;
    return algos[Math.floor(Math.random() * algos.length)].getInnerPoint();
  }

  /** 
   * get a point on the border of the face.
   * @retun {Vector3} 
   */
  getRandomBorderPoint(): Vector3 {
    let algos = this._fas;
    return algos[Math.floor(Math.random() * algos.length)].getRandomBorderPoint();
  }

  /**
   * point at face boder?
   *
   * @param {Face3} [f] - The face.
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtBoder(p: Vector3, tol0: number, tol1: number): boolean {
    let algos = this._fas;
    let count = algos.length;
    for (let i = 0; i < count; i++) {
      if (algos[i].isPointAtBoder(p, tol0, tol1)) {
        return true;
      }
    }
    return false;
  }

  /**
   * point at face inner?(inner boder and not inner holes)
   *
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtInner(p: Vector3, tol0: number, tol1: number): boolean {
    let algos = this._fas;
    let count = algos.length;
    for (let i = 0; i < count; i++) {
      if (algos[i].isPointAtInner(p, tol0, tol1)) {
        return true;
      }
    }
    return false;
  }

  /**
   * point on face? (at boder or at inner)
   *
   * @param {Face3} [e] - The face.
   * @param {Vector3} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointOn(p: Vector3, tol0: number, tol1: number): boolean {
    let algos = this._fas;
    let count = algos.length;
    for (let i = 0; i < count; i++) {
      if (algos[i].isPointOn(p, tol0, tol1)) {
        return true;
      }
    }
    return false;
  }

  get fs(): Face3[] {
    return this._fs;
  }

  get curves(): Curve3Data[] {
    let result: Curve3Data[] = [];
    let algos = this._fas;
    let count = algos.length;
    for (let i = 0; i < count; i++) {
      result.push(...algos[i].f.curves);
    }
    return result;
  }

  /**
   * Returns all Loop algo from the face.
   *
   * @return {[Loop3Algo]} .
   */
  get loops(): Loop3Algo[] {
    let result: Loop3Algo[] = [];
    let algos = this._fas;
    let count = algos.length;
    for (let i = 0; i < count; i++) {
      result.push(...algos[i].loops);
    }
    return result;
  }

  /**
   * Returns all edges on curve from the face.
   *
   * @return {[Coedge3Algo]} .
   */
  getCoedgesByCurve(curve: Curve3Data): Coedge3Algo[] {
    let result: Coedge3Algo[] = [];
    let algos = this._fas;
    let count = algos.length;
    for (let i = 0; i < count; i++) {
      result.push(...algos[i].getCoedgesByCurve(curve));
    }
    return result;
  }
}
class Brep3Algo {
}

class Digraph3Algo {
  private _g: Digraph3;
  private _algos: Coedge3Algo[];
  constructor(g: Digraph3) {
    this._g = g;
    this._algos = [];
    let algos = this._algos;
    for (let i = 0; g.coedges && i < g.coedges.length; i++) {
      algos.push(new Coedge3Algo(g.coedges[i]));
    }
    this.reflush();
  }
  // reflush ins and outs of Coedge3Algo;
  reflush() {
    let g = this._g;
    let algos = this._algos;
    for (let i = 0; i < algos.length; i++) {
      let curr = algos[i];
      if (curr.c.e) {
        algos.forEach(algo => {
          // 不能自己和自己的兄弟构成循环
          if (curr.c.e != algo.c.e) {
            if (algo.v0 == curr.v1) {
              curr.addOut(algo);
            }
            if (algo.v1 == curr.v0) {
              curr.addIn(algo);
            }
          }
        });
      }
      else if (curr.c.ei > -1) {
        algos.forEach(algo => {
          // 不能自己和自己的兄弟构成循环
          if (curr.c.ei != algo.c.ei) {
            if (algo.v0 == curr.v1) {
              curr.addOut(algo);
            }
            if (algo.v1 == curr.v0) {
              curr.addIn(algo);
            }
          }
        });
      }
    }
  }

  getAllLoops(): Loop3Algo[] {
    let loops: Loop3Algo[] = [];
    let algos = this._algos;
    let visited: Coedge3Algo[] = [];

    for (let i = 0; i < algos.length; i++) {
      let curr = algos[i];
      if (visited.includes(curr)) {
        continue;
      }
      let loop = new Loop3();
      let loopAlgo = new Loop3Algo(loop);
      loop.coedges.push(curr.c);
      loopAlgo.coedges.push(curr);
      visited.push(curr);
      let next = curr.GetNext(visited);
      while (next) {
        curr = next;
        loop.coedges.push(curr.c);
        loopAlgo.coedges.push(curr);
        visited.push(curr);
        next = curr.GetNext(visited);
      }
      loops.push(loopAlgo);
    }
    return loops;
  }

  findVerticeByPoint(p: Vector3, tol0: number): Vertice3 {
    for (let i = 0; i < this._g.vertice3s.length; i++) {
      if (this._g.vertice3s[i].p.distanceTo(p) <= tol0) {
        return this._g.vertice3s[i];
      }
    }
    return null;
  }

  addLoops(loops: Loop3Algo[], tol0: number) {
    loops.forEach((l: Loop3Algo) => {
      l.coedges.forEach((coedge: Coedge3Algo) => {
        this._algos.push(coedge);
        let v0p = coedge.getBeginPoint();
        let v0 = this.findVerticeByPoint(v0p, tol0);
        if (!v0) {
          v0 = new Vertice3();
          v0.p = v0p;
          this._g.vertice3s.push(v0);
        }
        coedge.v0 = v0;

        let v1p = coedge.getEndPoint();
        let v1 = this.findVerticeByPoint(v1p, tol0);
        if (!v1) {
          v1 = new Vertice3();
          v1.p = v1p;
          this._g.vertice3s.push(v1);
        }
        coedge.v1 = v1;
      });
    });
    this.reflush();
  }

  addEdges(edges: Edge3[], tol0: number) {
    edges.forEach((edge: Edge3) => {
      let cf = new Coedge3(); cf.e = edge; cf.isForward = true;
      let cb = new Coedge3(); cb.e = edge; cb.isForward = false;
      let cfalgo = new Coedge3Algo(cf);
      let cbalgo = new Coedge3Algo(cb);

      this._algos.push(cfalgo);
      this._algos.push(cbalgo);

      let v0pf = cfalgo.getBeginPoint();
      let v0f = this.findVerticeByPoint(v0pf, tol0);
      if (!v0f) {
        v0f = new Vertice3();
        v0f.p = v0pf;
        this._g.vertice3s.push(v0f);
      }
      cfalgo.v0 = v0f;

      let v1pf = cfalgo.getEndPoint();
      let v1f = this.findVerticeByPoint(v1pf, tol0);
      if (!v1f) {
        v1f = new Vertice3();
        v1f.p = v1pf;
        this._g.vertice3s.push(v1f);
      }
      cfalgo.v1 = v1f;


      let v0pb = cbalgo.getBeginPoint();
      let v0b = this.findVerticeByPoint(v0pb, tol0);
      if (!v0b) {
        v0b = new Vertice3();
        v0b.p = v0pb;
        this._g.vertice3s.push(v0b);
      }
      cbalgo.v0 = v0b;

      let v1pb = cbalgo.getEndPoint();
      let v1b = this.findVerticeByPoint(v1pb, tol0);
      if (!v1b) {
        v1b = new Vertice3();
        v1b.p = v1pb;
        this._g.vertice3s.push(v1b);
      }
      cbalgo.v1 = v1b;

    });
    this.reflush();
  }
}
export {
  Brep3Algo,
  Digraph3Algo,
  Loop3Algo,
  Coedge3Algo,
  Edge3Algo,
  Face3Algo,
  Face3Algos
}