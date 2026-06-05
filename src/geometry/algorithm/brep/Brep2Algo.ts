import { Vector2 } from "../../../math/Math";
import { Line2Data } from "../../data/base/curve2/Line2Data";
import type { Curve2Data } from "../../data/base/Curve2Data";
import { Loop2, Vertice2, type Coedge2, type Digraph2, type Edge2, type Face2 } from "../../data/brep/Brep2";
import type { Curve2Algo } from "../base/Curve2Algo";
import { CurveBuilder } from "../builder/CurveBuilder";
import { Curve2Inter } from "../relation/intersection/Curve2Inter";

class Edge2Algo {
  private _e: Edge2;
  private _algo: Curve2Algo;
  constructor(e: Edge2) {
    this._e = e;
    this._algo = CurveBuilder.Algorithm2ByData(e.curve);
  }

  /**
   * point on ? (at boder or at inner)
   *
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointOn(p: Vector2, tol0: number, tol1: number): boolean {
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
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isSpacePoint(p: Vector2, tol0: number, tol1: number): boolean {
    let u = this._algo.u(p);
    let p_ = this._algo.p(u);

    return p.distanceTo(p_) <= tol0;
  }

  /**
   * point on ? (at boder or at inner)
   *
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtInner(p: Vector2, tol0: number, tol1: number): boolean {
    let u = this._algo.u(p);
    let umin = Math.min(this._e.u.x, this._e.u.y);
    let umax = Math.max(this._e.u.x, this._e.u.y);
    return (u > umin && u < umax);
  }

  /**
   * point at boder?
   *
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   */
  isPointAtBoder(p: Vector2, tol0: number, tol1: number): boolean {
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
  getBeginPoint(): Vector2 {
    return this.p(this.u.y);
  }
  getEndPoint(): Vector2 {
    return this.p(this.u.x);
  }
  getBeginTangent(): Vector2 {
    return this.t(this.u.x);
  }
  getEndTangent(): Vector2 {
    return this.t(this.u.y);
  }
  p(u: number): Vector2 {
    return this._algo.p(u);
  }
  t(u: number): Vector2 {
    return this._e.isPositive() ? this._algo.t(u) : this._algo.t(u).negate();
  }
  d(u: number): Vector2 {
    return this._e.isPositive() ? this._algo.d(u) : this._algo.d(u).negate();
  }
  get e(): Edge2 {
    return this._e;
  }
  /**
   * v0 of Coedge. being.
   *
   */
  get v0(): Vertice2 {
    return this._e.v0;
  }

  /**
   * v1 of Coedge. end.
   *
   */
  get v1(): Vertice2 {
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
class Coedge2Algo {
  private _c: Coedge2;
  private _algo: Curve2Algo;
  private _ins: Coedge2Algo[];
  private _outs: Coedge2Algo[];
  constructor(c: Coedge2, face?: Face2) {
    this._c = c;
    let curveData: Curve2Data | undefined;
    if (face && c.e.curveIndex != -1) {
      // Use the curve data from the face if available
      curveData = face.curves[c.e.curveIndex];
    }
    this._algo = CurveBuilder.Algorithm2ByData(curveData || c.e.curve);
  }
  // Get the next coedge in the loop, return null if no next coedge or all next coedges have been visited.
  GetNext(visited: Coedge2Algo[] = []): Coedge2Algo {
    let ret: Coedge2Algo = null;
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
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointOn(p: Vector2, tol0: number, tol1: number): boolean {
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
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isSpacePoint(p: Vector2, tol0: number, tol1: number): boolean {
    let u = this._algo.u(p);
    let p_ = this._algo.p(u);

    return p.distanceTo(p_) <= tol0;
  }

  /**
   * point on ? (at boder or at inner)
   *
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtInner(p: Vector2, tol0: number, tol1: number): boolean {
    let u = this._algo.u(p);
    let umin = Math.min(this._c.e.u.x, this._c.e.u.y);
    let umax = Math.max(this._c.e.u.x, this._c.e.u.y);
    return (u > umin && u < umax);
  }

  /**
   * point at boder?
   *
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   */
  isPointAtBoder(p: Vector2, tol0: number, tol1: number): boolean {
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
  addIn(coedgeAlgo: Coedge2Algo) {
    if (!this._ins.includes(coedgeAlgo)) {
      this._ins.push(coedgeAlgo);
    }
  }
  addOut(coedgeAlgo: Coedge2Algo) {
    if (!this._outs.includes(coedgeAlgo)) {
      this._outs.push(coedgeAlgo);
    }
  }
  getBeginPoint(): Vector2 {
    return this.p(this.u.x);
  }
  getEndPoint(): Vector2 {
    return this.p(this.u.y);
  }
  getBeginTangent(): Vector2 {
    return this.t(this.u.x);
  }
  getEndTangent(): Vector2 {
    return this.t(this.u.y);
  }
  p(u: number): Vector2 {
    return this._algo.p(u);
  }
  t(u: number): Vector2 {
    return this._c.isPositive() ? this._algo.t(u) : this._algo.t(u).negate();
  }
  d(u: number): Vector2 {
    return this._c.isPositive() ? this._algo.d(u) : this._algo.d(u).negate();
  }
  get c(): Coedge2 {
    return this._c;
  }
  /**
   * v0 of Coedge. being.
   *
   */
  get v0(): Vertice2 {
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
  set v0(v: Vertice2) {
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
  get v1(): Vertice2 {
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
  set v1(v: Vertice2) {
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
  /**
   * Use Green's theorem to calculate the area of the curve between u0 and u1.
   * @retun {number} 
   */
  da(): number {
    let u = this.u;
    return this._algo.da(u.x, u.y);
  }


  isPositive() {
    return this._c.isPositive();
  }

  reverse() {
    this._c.isForward = !this._c.isForward;
  }
}
class Loop2Algo {
  private _l: Loop2;
  private _algos: Coedge2Algo[];
  constructor(l: Loop2, face?: Face2) {
    this._l = l;
    this._algos = [];
    for (let i = 0; i < l.coedges.length; i++) {
      this._algos.push(new Coedge2Algo(l.coedges[i], face));
    }
  }

  /**
   * Use Green's theorem to calculate the directed area of the curve loop.
   * S = 1/2∮C(xdy − ydx)
   * Area = 1/2 segments∑​ ∫ t0​ t1​ (x(t)dy/dt​ − y(t)dx/dt)dt
   * @retun {number} 
   */
  area(): number {
    let area = 0;
    let algos = this._algos;
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
    this._algos = this._algos.reverse();
    this._algos.forEach((algo) => {
      algo.reverse();
    });
  }

  /**
   * get a random point on the border of the loop.
   */
  getRandomBorderPoint(): Vector2 {
    let random = Math.floor(Math.random() * this._algos.length);
    let u = this._algos[random].u;
    let t = u.x + (u.y - u.x) * Math.random();
    return this._algos[random].p(t);
  }

  /**
   * get a random point inside the loop.
   */
  getRandomInsidePoint(): Vector2 {
    let index = Math.floor(Math.random() * this._algos.length);
    let algo = this._algos[index];
    let u = algo.u.x + (algo.u.y - algo.u.x) * Math.random();
    let d = algo.p(u).normalize().multiplyScalar(0.01);
    let p = algo.p(u).add(d);
    return p;
  }

  /**
   * point on coedge ? (at boder)
   *
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointOnBoder(p: Vector2, tol0: number, tol1: number): boolean {
    this._algos.forEach((algo) => {
      if (algo.isPointOn(p, tol0, tol1)) {
        return true;
      }
    })
    return false;
  }
  /**
   * point at loop inner?
   *
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtInner(p: Vector2, tol0: number, tol1: number): boolean {
    // 获得一条水平射线
    let ray = new Line2Data(); ray.trans.pos = p;
    let rayAlgo = CurveBuilder.Algorithm2ByData(ray);
    // 计算射线与所有边的交点->判断交点是否穿透点->穿有点是奇数在轮廓内部，反之在轮廓外部。
    let algos = this._algos;
    // 穿透点数组
    let cross: Vector2[] = [];
    let count = algos.length;
    for (let i = 0; i < algos.length; i++) {
      let currAlgo = algos[i];
      let curve = currAlgo.c.e.curve;
      let inters = Curve2Inter.X(ray, curve, tol0, tol1);
      let precAlgo = algos[(i - 1) % count];
      let nextAlgo = algos[(i + 1) % count];
      for (let j = 0; j < inters.length; j++) {
        let inter = inters[j];
        // 是否为穿透点判定：
        // A 如果交点在曲线内部，取曲线在交点上的切线，若射线与切线重合，则是切点，不认为是穿透点。
        let u = currAlgo.u;
        if (inter.u1 > u.x && inter.u1 < u.y) {
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
        if (Math.abs(inter.u1 - u.x) <= tol1) {
          // 取前一段的终点切线和当前段起点切线
          frontTangent = precAlgo.getBeginTangent();
          backTangent = currAlgo.getBeginTangent();
        }
        // 交点是当前段的终点
        if (Math.abs(inter.u1 - u.y) <= tol1) {
          // 取前一段的终点切线和当前段起点切线
          frontTangent = currAlgo.getBeginTangent();
          backTangent = nextAlgo.getBeginTangent();
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

  get algos(): Coedge2Algo[] {
    return this._algos;
  }

  get loop(): Loop2 {
    return this._l;
  }
}

class Face2Algo {
  private _f: Face2;
  private _balgo: Loop2Algo;
  private _halgos: Loop2Algo[];
  constructor(f: Face2) {
    this._f = f;
    this._balgo = new Loop2Algo(f.border, f);
    this._halgos = [];
    for (let i = 0; i < f.holes.length; i++) {
      this._halgos.push(new Loop2Algo(f.holes[i], f));
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
   * @retun {Vector2} 
   */
  getInnerPoint(): Vector2 {
    while (true) {
      let randomInsidePoint = this._balgo.getRandomInsidePoint();
      if (this._halgos.length > 0) {
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
  }

  /** 
   * get a point on the border of the face.
   * @retun {Vector2} 
   */
  getRandomBorderPoint(): Vector2 {
    return this._balgo.getRandomBorderPoint();
  }

  /**
   * point at face boder?
   *
   * @param {Face2} [f] - The face.
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtBoder(p: Vector2, tol0: number, tol1: number): boolean {
    if (this._balgo.isPointOnBoder(p, tol0, tol1)) {
      return true;
    }
    this._halgos.forEach((halgo) => {
      if (halgo.isPointOnBoder(p, tol0, tol1)) {
        return true;
      }
    });
    return false;
  }

  /**
   * point at face inner?(inner boder and not inner holes)
   *
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointAtInner(p: Vector2, tol0: number, tol1: number): boolean {
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
   * @param {Face2} [e] - The face.
   * @param {Vector2} [p] - The eoint.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  isPointOn(p: Vector2, tol0: number, tol1: number): boolean {
    // 在face轮廓线上 或者 在face的外轮看内部，并且在空腔的外部。
    if (this.isPointAtBoder(p, tol0, tol1)) {
      return true;
    }

    if (this.isPointAtInner(p, tol0, tol1)) {
      return true;
    }
    return false;
  }

  /**
   * Returns all Loop algo from the face.
   *
   * @return {[Loop2Algo]} .
   */
  get loops(): Loop2Algo[] {
    let result: Loop2Algo[] = [];
    result.push(this._balgo);
    result.push(...this._halgos);
    return result;
  }
}

class Brep2Algo {

}

class Digraph2Algo {
  private _g: Digraph2;
  private _algos: Coedge2Algo[];
  constructor(g: Digraph2) {
    this._g = g;
    this._algos = [];
    let algos = this._algos;
    for (let i = 0; i < g.coedges.length; i++) {
      algos.push(new Coedge2Algo(g.coedges[i]));
    }
    this.reflush();
  }
  // reflush ins and outs of Coedge2Algo;
  reflush() {
    let g = this._g;
    let algos = this._algos;
    for (let i = 0; i < g.vertice2s.length; i++) {
      let curr = algos[i];
      algos.forEach(algo => {
        if (algo.v0 == curr.v1) {
          curr.addIn(algo);
        }
        if (algo.v1 == curr.v0) {
          curr.addOut(algo);
        }
      });
    }
  }

  getAllLoops(): Loop2Algo[] {
    let loops: Loop2Algo[] = [];
    let algos = this._algos;
    let visited: Coedge2Algo[] = [];

    for (let i = 0; i < algos.length; i++) {
      let curr = algos[i];
      if (visited.includes(curr)) {
        continue;
      }
      let loop = new Loop2();
      let loopAlgo = new Loop2Algo(loop);
      loop.coedges.push(curr.c);
      loopAlgo.algos.push(curr);
      visited.push(curr);
      let next = curr.GetNext(visited);
      while (next) {
        curr = next;
        loop.coedges.push(curr.c);
        loopAlgo.algos.push(curr);
        visited.push(curr);
        next = curr.GetNext(visited);
      }
      loops.push(loopAlgo);
    }
    return loops;
  }

  findVerticeByPoint(p: Vector2, tol0: number): Vertice2 {
    this._g.vertice2s.forEach((v) => {
      if (v.p.distanceTo(p) <= tol0) {
        return v;
      }
    });
    return null;
  }

  addLoops(loops: Loop2Algo[], tol0: number) {
    loops.forEach((l: Loop2Algo) => {
      l.algos.forEach((coedge: Coedge2Algo) => {
        this._algos.push(coedge);
        let v0p = coedge.getBeginPoint();
        let v0 = this.findVerticeByPoint(v0p, tol0);
        if (!v0) {
          v0 = new Vertice2();
          v0.p = v0p;
          this._g.vertice2s.push(v0);
        }
        coedge.v0 = v0;

        let v1p = coedge.getEndPoint();
        let v1 = this.findVerticeByPoint(v0p, tol0);
        if (!v1) {
          v1 = new Vertice2();
          v1.p = v1p;
          this._g.vertice2s.push(v1);
        }
        coedge.v1 = v1;
      });
    });
    this.reflush();
  }
}
export {
  Brep2Algo,
  Digraph2Algo,
  Loop2Algo,
  Coedge2Algo,
  Edge2Algo,
  Face2Algo
}