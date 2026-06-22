
import { Digraph2, Face2, Loop2 } from "../../../data/brep/Brep2";
import { Coedge2Algo, Digraph2Algo, Face2Algo, Loop2Algo } from "../../brep/Brep2Algo";
import { Brep2Inter, type InterOfFace2 } from "../intersection/Brep2Inter";

class Bool2 {

  /*
  * 一对一布尔运算，差。
  * a,b都是单面片组,组内不相交，返回单面片组。
  */
  static Differences(a: Face2[], b: Face2[], tol0: number, tol1: number): Face2[] {
    let result: Face2[] = [];
    for (let i = 0; i < a.length; i++) {
      let fa = a[i];
      let ret: Face2[] = [];
      for (let j = 0; j < b.length; j++) {
        let fb = b[j];
        if (j == 0) {
          ret = Bool2.Difference(fa, fb, tol0, tol1);
          if (ret.length == 0) {
            break;
          }
        } else {
          ret = Bool2.Differences(ret, [fb], tol0, tol1);
          if (ret.length == 0) {
            break;
          }
        }
      }
      result.push(...ret);
    }
    return result;
  }

  /*
  * 一对一布尔运算，交。
  * a,b都是单面片组,组内不相交，返回单面片组。
  */
  static Intersections(a: Face2[], b: Face2[], tol0: number, tol1: number): Face2[] {
    let result: Face2[] = [];
    for (let i = 0; i < a.length; i++) {
      let fa = a[i];
      for (let j = 0; j < b.length; j++) {
        let fb = b[j];
        let ret = Bool2.Intersection(fa, fb, tol0, tol1);
        result.push(...ret);
      }
    }
    return result;
  }

  /*
  * 一对一布尔运算，并。
  * a,b都是单面片组,组内不相交，返回单面片组。
  */
  static Unions(a: Face2[], b: Face2[], tol0: number, tol1: number): Face2[] {
    let result: Face2[] = [];
    for (let i = 0; i < a.length; i++) {
      let fa = a[i];
      let ret: Face2[] = [];
      for (let j = 0; j < b.length; j++) {
        let fb = b[j];
        if (j == 0) {
          ret = Bool2.Difference(fa, fb, tol0, tol1);
        } else {
          ret = Bool2.Differences(ret, [fb], tol0, tol1);
        }
      }
      result.push(...ret);
    }
    return result;
  }

  /*
  * 一对一布尔运算，差。
  * a,b都是单面片，返回单面片组。
  */
  static Difference(a: Face2, b: Face2, tol0: number, tol1: number): Face2[] {
    let algorigin = new Face2Algo(a);
    let blgorigin = new Face2Algo(b);
    a = a.clone();
    b = b.clone();
    // 计算面与面的轮廓交点
    let algo = new Face2Algo(a);
    let blgo = new Face2Algo(b);
    // 被减的一方轮廓需要翻转
    blgo.loops.forEach((loop) => {
      loop.reverse();
    });
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length == 0) {
      let pa = algo.getInnerPoint();
      let pb = blgo.getInnerPoint();
      // a在b内
      if (blgo.isPointAtInner(pa, tol0, tol1)) {
        return [];
      }
      // b在a内
      else if (algo.isPointAtInner(pb, tol0, tol1)) {
        a.holes.push(b.border);
        let ret = [a];
        b.holes.forEach((hole) => {
          let f = new Face2();
          f.border = hole;
          ret.push(f);
        });
        return ret;
      } else {
        // a,b相离
        return [a];
      }
    }
    // 根据轮廓交点对面轮廓进行切割
    Bool2.Cutting(algo.loops, blgo.loops, inters, tol0, tol1);
    // 删除a中在b的原始形状内部的边。
    algo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (blgorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
        }
      }
    });
    // 删除b中不在a的原始形状内部的边。
    blgo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (!algorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
        }
      }
    });
    // 面重构
    let result: Face2[] = Bool2.FaceRebuild(algo, blgo, tol0, tol1);
    return result;
  }

  /*
  * 一对一布尔运算，交。
  * a,b都是单面片，返回单面片组。
  * @param {Face2} [a] - The frist Face2.
  * @param {Face2} [b] - The second Face2.
  * @param {number} [tol0] - The tolerance of geometric.
  * @param {number} [tol1] - The tolerance of algebraic.
  */
  static Intersection(a: Face2, b: Face2, tol0: number, tol1: number): Face2[] {
    let algorigin = new Face2Algo(a);
    let blgorigin = new Face2Algo(b);
    a = a.clone();
    b = b.clone();
    // 计算面与面的轮廓交点
    let algo = new Face2Algo(a);
    let blgo = new Face2Algo(b);
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length == 0) {
      let pa = algo.getInnerPoint();
      let pb = blgo.getInnerPoint();
      // a在b内
      if (blgo.isPointAtInner(pa, tol0, tol1)) {
        return [a];
      }
      // b在a内
      else if (algo.isPointAtInner(pb, tol0, tol1)) {
        return [b];
      } else {
        // a,b相离
        return [];
      }
    }
    // 根据轮廓交点对面轮廓进行切割
    Bool2.Cutting(algo.loops, blgo.loops, inters, tol0, tol1);
    // 删除a中不在b的原始形状内部的边。
    algo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (!blgorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
        }
      }
    });
    // 删除b中不在a的原始形状内部的边。
    blgo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (!algorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
        }
      }
    });
    // 面重构
    let result: Face2[] = Bool2.FaceRebuild(algo, blgo, tol0, tol1);
    return result;
  }

  /*
  * 一对一布尔运算，并。
  * a,b都是单面片，返回单面片组。
  */
  static Union(a: Face2, b: Face2, tol0: number, tol1: number): Face2[] {
    let algorigin = new Face2Algo(a);
    let blgorigin = new Face2Algo(b);
    a = a.clone();
    b = b.clone();
    // 计算面与面的轮廓交点
    let algo = new Face2Algo(a);
    let blgo = new Face2Algo(b);
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length == 0) {
      let pa = algo.getInnerPoint();
      let pb = blgo.getInnerPoint();
      // a在b内
      if (blgo.isPointAtInner(pa, tol0, tol1)) {
        return [b];
      }
      // b在a内
      else if (algo.isPointAtInner(pb, tol0, tol1)) {
        return [a];
      } else {
        // a,b相离
        return [a, b];
      }
    }
    // 根据轮廓交点对面轮廓进行切割
    Bool2.Cutting(algo.loops, blgo.loops, inters, tol0, tol1);
    // 删除a中在b的原始形状内部的边。
    algo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (blgorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
        }
      }
    });
    // 删除b中在a的原始形状内部的边。
    blgo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (algorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
        }
      }
    });
    // 面重构
    let result: Face2[] = Bool2.FaceRebuild(algo, blgo, tol0, tol1);
    return result;
  }

  /*
  * 根据交点对面的边进行切割。
  * 
  */
  static Cutting(a: Loop2Algo[], b: Loop2Algo[], inters: Array<InterOfFace2>, tol0: number, tol1: number) {
    // 根据轮廓交点对面轮廓进行切割
    for (let i = 0; i < inters.length; i++) {
      let inter = inters[i];
      let c0 = inter.c0;
      let c1 = inter.c1;
      let is = inter.is;
      for (let j = 0; j < is.length; j++) {
        let ip = is[j];
        // 用c0对a中的所有loop进行切割
        for (let k = 0; k < a.length; k++) {
          let loopAlgo = a[k];
          for (let l = loopAlgo.coedges.length - 1; l > -1; l--) {
            let coedgeAlgo = loopAlgo.coedges[l];
            if (coedgeAlgo.curve.dat == c0) {
              if (!coedgeAlgo.isOnUBoder(ip.u0, tol1) && coedgeAlgo.isInURange(ip.u0)) {
                // 对coedge进行切割
                let afterCoedge = coedgeAlgo.c.clone();
                afterCoedge.e.umin = ip.u0;
                coedgeAlgo.c.e.umax = ip.u0;
                let afterCoedgeAlgo = new Coedge2Algo(afterCoedge, coedgeAlgo.f);
                loopAlgo.coedges.splice(l + 1, 0, afterCoedgeAlgo);
              }
            }
          }
        }

        // 用c1对b中的所有loop进行切割
        for (let k = 0; k < b.length; k++) {
          let loopAlgo = b[k];
          for (let l = loopAlgo.coedges.length - 1; l > -1; l--) {
            let coedgeAlgo = loopAlgo.coedges[l];
            if (coedgeAlgo.curve.dat == c1) {
              if (!coedgeAlgo.isOnUBoder(ip.u1, tol1) && coedgeAlgo.isInURange(ip.u1)) {
                // 对coedge进行切割
                let afterCoedge = coedgeAlgo.c.clone();
                afterCoedge.e.umin = ip.u1;
                coedgeAlgo.c.e.umax = ip.u1;
                let afterCoedgeAlgo = new Coedge2Algo(afterCoedge, coedgeAlgo.f);
                loopAlgo.coedges.splice(l + 1, 0, afterCoedgeAlgo);
              }
            }
          }
        }
      }
    }
  }

  /*
  * 面重构
  * 
  */
  static FaceRebuild(algo: Face2Algo, blgo: Face2Algo, tol0: number, tol1: number): Face2[] {
    // 构建全新的有向图
    let galgo = new Digraph2Algo(new Digraph2());
    let loops: Loop2Algo[] = [];
    loops.push(...algo.loops);
    loops.push(...blgo.loops);
    galgo.addLoops(loops, tol0);
    let alloops = galgo.getAllLoops();
    // 删除面积为0的环
    let count = alloops.length;
    for (let i = count - 1; i > -1; i--) {
      // 面积为0
      if (Math.abs(alloops[i].area()) <= tol1) {
        alloops.splice(i, 1);
      }
    }
    let result: Face2[] = [];
    while (alloops.length) {
      let f = new Face2();
      let outside: Loop2Algo;
      // 获得一个外层loop
      let count = alloops.length;
      for (let i = count - 1; i > -1; i--) {
        // 正向的外轮廓
        if (alloops[i].isPositive()) {
          outside = alloops[i];
          f.border = outside.loop;
          outside.coedges.forEach(coedge => {
            let index = f.curves.indexOf(coedge.curve.dat);
            if (index == -1) {
              index = f.curves.length;
              f.curves.push(coedge.curve.dat);
            }
            coedge.c.e.curve = null;
            coedge.c.e.curveIndex = index;
            if (!f.vertice2s.includes(coedge.c.e.v0)) {
              f.vertice2s.push(coedge.c.e.v0);
            }
            if (!f.vertice2s.includes(coedge.c.e.v1)) {
              f.vertice2s.push(coedge.c.e.v1);
            }
          });
          alloops.splice(i, 1);
          break;
        }
      }
      // 内部的逆向空腔
      if (outside) {
        count = alloops.length;
        for (let i = 0; i < count; i++) {
          let inside = alloops[i];
          let inp = inside.getRandomBorderPoint();
          if (outside.isPointAtInner(inp, tol0, tol1)) {
            f.holes.push(inside.loop);
            inside.coedges.forEach(coedge => {
              let index = f.curves.indexOf(coedge.curve.dat);
              if (index == -1) {
                index = f.curves.length;
                f.curves.push(coedge.curve.dat);
              }
              coedge.c.e.curve = null;
              coedge.c.e.curveIndex = index;
              if (!f.vertice2s.includes(coedge.c.e.v0)) {
                f.vertice2s.push(coedge.c.e.v0);
              }
              if (!f.vertice2s.includes(coedge.c.e.v1)) {
                f.vertice2s.push(coedge.c.e.v1);
              }
            });
            alloops.splice(i, 1);
          }
        }
        result.push(f);
      } else {
        break;
      }
    }
    return result;
  }
}

export {
  Bool2,
}