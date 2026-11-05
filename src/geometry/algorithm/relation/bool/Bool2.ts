
import { MathUtils, PI2 } from "../../../..//math/MathUtils";
import { Arc2Data } from "../../../data/base/curve2/Arc2Data";
import { Point2Data } from "../../../data/base/Point2Data";
import { Digraph2, Edge2, Face2, Loop2, Vertice2 } from "../../../data/brep/Brep2";
import { Coedge2Algo, Digraph2Algo, Face2Algo, Face2Algos, Loop2Algo } from "../../brep/Brep2Algo";
import { Brep2Builder } from "../../builder/Brep2Builder";
import { Brep2Inter, type InterOfFace2 } from "../intersection/Brep2Inter";
import { v4 as uuidv4 } from 'uuid';
import type { InterOfCurve2 } from "../intersection/Curve2Inter";

class Bool2 {

  /*
  * 多对多布尔运算，差。
  * a,b都是单面片组,组内不相交，返回单面片组。
  */
  static Differences(a: Face2[], b: Face2[], tol0: number, tol1: number): Face2[] {
    let algorigin = new Face2Algos(a);
    let blgorigin = new Face2Algos(b);
    let a_: Face2[] = [];
    let b_: Face2[] = [];
    for (let i = 0; i < a.length; i++) {
      a_.push(a[i].clone());
    }
    for (let i = 0; i < b.length; i++) {
      b_.push(b[i].clone());
    }
    // 计算面与面的轮廓交点
    let algo = new Face2Algos(a_);
    let blgo = new Face2Algos(b_);
    // 被减的一方轮廓需要翻转
    blgo.loops.forEach((loop) => {
      loop.reverse();
    });
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length) {
      // 根据轮廓交点对面轮廓进行切割
      Bool2.Cutting(algo.loops, blgo.loops, inters, tol0, tol1);
    }
    // let isChanged = false;
    // 删除a中在b的原始形状内部的边。
    algo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (blgorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
          // isChanged = true;
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
          // isChanged = true;
        }
      }
    });
    // 面重构
    // 构建全新的有向图
    let galgo = new Digraph2Algo(new Digraph2());
    let loops: Loop2Algo[] = [];
    loops.push(...algo.loops);
    loops.push(...blgo.loops);
    galgo.addLoops(loops, tol0);
    // if (galgo.removeZeroAreaEdges(tol0)) {
    //   isChanged = true;
    // }
    // if (isChanged) {
    // 面重构
    let result: Face2[] = Bool2.FaceRebuild(galgo, tol0, tol1);
    return result;
    // } else {
    //   // a,b外相切
    //   let result = [...a_, ...b_];
    //   result.sort((fa, fb) => {
    //     if (fa.uuid < fb.uuid) {
    //       return -1;
    //     }
    //     if (fa.uuid > fb.uuid) {
    //       return 1;
    //     }
    //     return 0;
    //   });
    //   return result;
    // }
  }

  /*
  * 多对多布尔运算，交。
  * a,b都是单面片组,组内不相交，返回单面片组。
  */
  static Intersections(a: Face2[], b: Face2[], tol0: number, tol1: number): Face2[] {
    let algorigin = new Face2Algos(a);
    let blgorigin = new Face2Algos(b);
    let a_: Face2[] = [];
    let b_: Face2[] = [];
    for (let i = 0; i < a.length; i++) {
      a_.push(a[i].clone());
    }
    for (let i = 0; i < b.length; i++) {
      b_.push(b[i].clone());
    }
    // 计算面与面的轮廓交点
    let algo = new Face2Algos(a_);
    let blgo = new Face2Algos(b_);
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length) {
      // 根据轮廓交点对面轮廓进行切割
      Bool2.Cutting(algo.loops, blgo.loops, inters, tol0, tol1);
    }
    let isChanged = false;
    // 删除a中不在b的原始形状内部的边。
    algo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (!blgorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
          isChanged = true;
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
          isChanged = true;
        }
      }
    });
    // 面重构
    // 构建全新的有向图
    let galgo = new Digraph2Algo(new Digraph2());
    let loops: Loop2Algo[] = [];
    loops.push(...algo.loops);
    loops.push(...blgo.loops);
    galgo.addLoops(loops, tol0);
    if (galgo.removeZeroAreaEdges(tol0)) {
      isChanged = true;
    }
    if (isChanged) {
      // 面重构
      let result: Face2[] = Bool2.FaceRebuild(galgo, tol0, tol1);
      return result;
    } else {
      // a,b外相切
      let result = [...a_, ...b_];
      result.sort((fa, fb) => {
        if (fa.uuid < fb.uuid) {
          return -1;
        }
        if (fa.uuid > fb.uuid) {
          return 1;
        }
        return 0;
      });
      return result;
    }
  }

  /*
  * 多对多布尔运算，并。
  * a,b都是单面片组,组内不相交，返回单面片组。
  */
  static Unions(a: Face2[], b: Face2[], tol0: number, tol1: number): Face2[] {
    let algorigin = new Face2Algos(a);
    let blgorigin = new Face2Algos(b);
    let a_: Face2[] = [];
    let b_: Face2[] = [];
    for (let i = 0; i < a.length; i++) {
      a_.push(a[i].clone());
    }
    for (let i = 0; i < b.length; i++) {
      b_.push(b[i].clone());
    }
    // 计算面与面的轮廓交点
    let algo = new Face2Algos(a_);
    let blgo = new Face2Algos(b_);
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length == 0) {
      // 剔除相互包含的部分
      let afsa = algo.fsa;
      let afs = algo.fs;
      for (let i = afsa.length - 1; i > -1; i--) {
        let pa = afsa[i].getInnerPoint();
        // a在b内
        if (blgorigin.isPointAtInner(pa, tol0, tol1)) {
          afsa.slice(i, 1);
          afs.slice(i, 1);
        }
      }
      let bfsa = blgo.fsa;
      let bfs = blgo.fs;
      for (let i = bfsa.length - 1; i > -1; i--) {
        let pb = bfsa[i].getInnerPoint();
        // b在a内
        if (algorigin.isPointAtInner(pb, tol0, tol1)) {
          bfsa.slice(i, 1);
          bfs.slice(i, 1);
        }
      }
      // 合并结果
      let result: Face2[] = [];
      result.push(...afs);
      result.push(...bfs);
      result.sort((fa, fb) => {
        if (fa.uuid < fb.uuid) {
          return -1;
        }
        if (fa.uuid > fb.uuid) {
          return 1;
        }
        return 0;
      });
      return result;
    }
    if (inters.length) {
      // 根据轮廓交点对面轮廓进行切割
      Bool2.Cutting(algo.loops, blgo.loops, inters, tol0, tol1);
    }
    let isChanged = false;
    // 删除a中在b的原始形状内部的边。
    algo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (blgorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
          isChanged = true;
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
          isChanged = true;
        }
      }
    });
    // 面重构
    // 构建全新的有向图
    let galgo = new Digraph2Algo(new Digraph2());
    let loops: Loop2Algo[] = [];
    loops.push(...algo.loops);
    loops.push(...blgo.loops);
    galgo.addLoops(loops, tol0);
    if (galgo.removeZeroAreaEdges(tol0)) {
      isChanged = true;
    }
    if (isChanged) {
      // 面重构
      let result: Face2[] = Bool2.FaceRebuild(galgo, tol0, tol1);
      return result;
    } else {
      // a,b外相切
      let result = [...a_, ...b_];
      result.sort((fa, fb) => {
        if (fa.uuid < fb.uuid) {
          return -1;
        }
        if (fa.uuid > fb.uuid) {
          return 1;
        }
        return 0;
      });
      return result;
    }
  }

  /*
  * 一对一布尔运算，差。
  * a,b都是单面片，返回单面片组。
  */
  static Difference(a: Face2, b: Face2, tol0: number, tol1: number): Face2[] {
    let algorigin = new Face2Algo(a);
    let blgorigin = new Face2Algo(b);
    let a_ = a.clone();
    let b_ = b.clone();
    // 计算面与面的轮廓交点
    let algo = new Face2Algo(a_);
    let blgo = new Face2Algo(b_);
    // 被减的一方轮廓需要翻转
    blgo.loops.forEach((loop) => {
      loop.reverse();
    });
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length == 0 /*&& a_.holes.length == 0 && b_.holes.length == 0*/) {
      let pa = algo.getInnerPoint();
      let pb = blgo.getInnerPoint();
      // a在b内
      if (blgo.isPointAtInner(pa, tol0, tol1)) {
        return [];
      }
      // b在a内
      else if (algo.isPointAtInner(pb, tol0, tol1)) {
        // 构建全新的有向图
        let galgo = new Digraph2Algo(new Digraph2());
        let loops: Loop2Algo[] = [];
        loops.push(...algo.loops);
        loops.push(...blgo.loops);
        galgo.addLoops(loops, tol0);
        galgo.removeZeroAreaEdges(tol0);
        let result: Face2[] = Bool2.FaceRebuild(galgo, tol0, tol1);
        return result;
      } else {
        // a,b相离
        return [a_];
      }
    }
    // 根据轮廓交点对面轮廓进行切割
    Bool2.Cutting(algo.loops, blgo.loops, inters, tol0, tol1);
    // let isChanged = false;
    // 删除a中在b的原始形状内部的边。
    algo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (blgorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
          // isChanged = true;
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
          // isChanged = true;
        }
      }
    });
    // 面重构
    // 构建全新的有向图
    let galgo = new Digraph2Algo(new Digraph2());
    let loops: Loop2Algo[] = [];
    loops.push(...algo.loops);
    loops.push(...blgo.loops);
    galgo.addLoops(loops, tol0);
    // if (galgo.removeZeroAreaEdges(tol0)) {
    //   isChanged = true;
    // }
    // if (isChanged) {
    // 面重构
    let result: Face2[] = Bool2.FaceRebuild(galgo, tol0, tol1);
    return result;
    // } else {
    //   // a,b外相切
    //   let result = [a_, b_];
    //   result.sort((fa, fb) => {
    //     if (fa.uuid < fb.uuid) {
    //       return -1;
    //     }
    //     if (fa.uuid > fb.uuid) {
    //       return 1;
    //     }
    //     return 0;
    //   });
    //   return result;
    // }
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
    let a_ = a.clone();
    let b_ = b.clone();
    // 计算面与面的轮廓交点
    let algo = new Face2Algo(a_);
    let blgo = new Face2Algo(b_);
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length == 0 /*&& a_.holes.length == 0 && b_.holes.length == 0*/) {
      let pa = algo.getInnerPoint();
      let pb = blgo.getInnerPoint();
      // a在b内
      if (blgo.isPointAtInner(pa, tol0, tol1)) {
        return [a_];
      }
      // b在a内
      else if (algo.isPointAtInner(pb, tol0, tol1)) {
        return [b_];
      } else {
        // a,b相离
        return [];
      }
    }
    // 根据轮廓交点对面轮廓进行切割
    Bool2.Cutting(algo.loops, blgo.loops, inters, tol0, tol1);
    let isChanged = false;
    // 删除a中在b的原始形状外部的边。
    algo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (blgorigin.isPointAtOuter(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
          isChanged = true;
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
          isChanged = true;
        }
      }
    });
    // 面重构
    // 构建全新的有向图
    let galgo = new Digraph2Algo(new Digraph2());
    let loops: Loop2Algo[] = [];
    loops.push(...algo.loops);
    loops.push(...blgo.loops);
    galgo.addLoops(loops, tol0);
    if (galgo.removeZeroAreaEdges(tol0)) {
      isChanged = true;
    }
    if (isChanged) {
      // 面重构
      let result: Face2[] = Bool2.FaceRebuild(galgo, tol0, tol1);
      return result;
    } else {
      // a,b外相切
      let result = [a_, b_];
      result.sort((fa, fb) => {
        if (fa.uuid < fb.uuid) {
          return -1;
        }
        if (fa.uuid > fb.uuid) {
          return 1;
        }
        return 0;
      });
      return result;
    }
  }

  /*
  * 一对一布尔运算，并。
  * a,b都是单面片，返回单面片组。
  */
  static Union(a: Face2, b: Face2, tol0: number, tol1: number): Face2[] {
    let algorigin = new Face2Algo(a);
    let blgorigin = new Face2Algo(b);
    let a_ = a.clone();
    let b_ = b.clone();
    // 计算面与面的轮廓交点
    let algo = new Face2Algo(a_);
    let blgo = new Face2Algo(b_);
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length == 0 /*&& a_.holes.length == 0 && b_.holes.length == 0*/) {
      let pa = algo.getInnerPoint();
      let pb = blgo.getInnerPoint();
      // a在b内
      if (blgo.isPointAtInner(pa, tol0, tol1)) {
        return [b_];
      }
      // b在a内
      else if (algo.isPointAtInner(pb, tol0, tol1)) {
        return [a_];
      } else {
        // a,b相离
        let result = [a_, b_];
        result.sort((fa, fb) => {
          if (fa.uuid < fb.uuid) {
            return -1;
          }
          if (fa.uuid > fb.uuid) {
            return 1;
          }
          return 0;
        });
        return result;
      }
    }
    // 根据轮廓交点对面轮廓进行切割
    Bool2.Cutting(algo.loops, blgo.loops, inters, tol0, tol1);
    let isChanged = false;
    // 删除a中在b的原始形状内部的边。
    algo.loops.forEach((loop) => {
      let count = loop.coedges.length;
      for (let i = count - 1; i > -1; i--) {
        let coedge = loop.coedges[i];
        let u = coedge.u;
        let mp = coedge.p((u.x + u.y) * 0.5);
        if (blgorigin.isPointAtInner(mp, tol0, tol1)) {
          loop.coedges.splice(i, 1);
          isChanged = true;
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
          isChanged = true;
        }
      }
    });

    // 构建全新的有向图
    let galgo = new Digraph2Algo(new Digraph2());
    let loops: Loop2Algo[] = [];
    loops.push(...algo.loops);
    loops.push(...blgo.loops);
    galgo.addLoops(loops, tol0);
    if (galgo.removeZeroAreaEdges(tol0)) {
      isChanged = true;
    }
    if (isChanged) {
      // 面重构
      let result: Face2[] = Bool2.FaceRebuild(galgo, tol0, tol1);
      return result;
    } else {
      // a,b外相切
      let result = [a_, b_];
      result.sort((fa, fb) => {
        if (fa.uuid < fb.uuid) {
          return -1;
        }
        if (fa.uuid > fb.uuid) {
          return 1;
        }
        return 0;
      });
      return result;
    }
  }

  /*
  * 根据交点对面的边进行切割。
  * 
  */
  static Cutting(a: Loop2Algo[], b: Loop2Algo[], inters: Array<InterOfFace2>, tol0: number, tol1: number) {

    for (let k = 0; k < a.length; k++) {
      let loopAlgo = a[k];
      for (let l = loopAlgo.coedges.length - 1; l > -1; l--) {
        let coedgeAlgo = loopAlgo.coedges[l];
        let cuts: Array<InterOfCurve2> = [];
        // 寻找边上的所有分割点

        for (let i = 0; i < inters.length; i++) {
          let inter = inters[i];
          let c0 = inter.c0;
          let is = inter.is;
          for (let j = 0; j < is.length; j++) {
            let ip = is[j];
            if (coedgeAlgo.curve.dat.uuid == c0.uuid) {
              if (coedgeAlgo.curve.dat instanceof Arc2Data) {
                if (!coedgeAlgo.isOnUBoder(ip.u0, tol1) && coedgeAlgo.isInURangePeriod(ip.u0, PI2, tol1)) {
                  cuts.push(ip);
                }
              } else {
                if (!coedgeAlgo.isOnUBoder(ip.u0, tol1) && coedgeAlgo.isInURange(ip.u0)) {
                  cuts.push(ip);
                }
              }
              cuts.push();
            }
          }
        }
        cuts.sort((a: InterOfCurve2, b: InterOfCurve2) => {
          if (a.u0 < b.u0) {
            return -1;
          }
          if (a.u0 > b.u0) {
            return 1;
          }
          return 0;
        });

        // 根据分割点对面轮廓进行切割
        let off = 0;
        for (let i = 0; i < cuts.length; i++) {
          let ip = cuts[i];
          let ur = coedgeAlgo.ur;
          // 闭环上的第一个分割点只做端点偏移，并记录偏移量
          if (i == 0 && coedgeAlgo.curve.dat instanceof Arc2Data && ur.x == 0 && ur.y == PI2) {
            coedgeAlgo.c.e.umin = ip.u0;
            coedgeAlgo.c.e.umax = PI2 + ip.u0;
            continue;
          }
          // 对coedge进行切割
          let afterCoedge = coedgeAlgo.c.clone();
          afterCoedge.uuid = uuidv4();
          afterCoedge.e.uuid = uuidv4();
          afterCoedge.e.umin = ip.u0;
          coedgeAlgo.c.e.umax = ip.u0;

          let v = new Vertice2();
          afterCoedge.e.v0 = v;
          coedgeAlgo.c.e.v1 = v;

          let afterCoedgeAlgo = new Coedge2Algo(afterCoedge, coedgeAlgo.f);
          loopAlgo.coedges.splice(l + off + 1, 0, afterCoedgeAlgo);
          loopAlgo.loop.coedges.splice(l + off + 1, 0, afterCoedge);
          off++;
          coedgeAlgo = afterCoedgeAlgo;
        }
      }
    }

    // 用c1对b中的所有loop进行切割
    for (let k = 0; k < b.length; k++) {
      let loopAlgo = b[k];
      for (let l = loopAlgo.coedges.length - 1; l > -1; l--) {
        let coedgeAlgo = loopAlgo.coedges[l];
        let cuts: Array<InterOfCurve2> = [];
        // 寻找边上的所有分割点
        for (let i = 0; i < inters.length; i++) {
          let inter = inters[i];
          let c1 = inter.c1;
          let is = inter.is;
          for (let j = 0; j < is.length; j++) {
            let ip = is[j];
            if (coedgeAlgo.curve.dat.uuid == c1.uuid) {
              if (coedgeAlgo.curve.dat instanceof Arc2Data) {
                if (!coedgeAlgo.isOnUBoder(ip.u1, tol1) && coedgeAlgo.isInURangePeriod(ip.u1, PI2, tol1)) {
                  cuts.push(ip);
                }
              } else {
                if (!coedgeAlgo.isOnUBoder(ip.u1, tol1) && coedgeAlgo.isInURange(ip.u1)) {
                  cuts.push(ip);
                }
              }
              cuts.push();
            }
          }
        }
        cuts.sort((a: InterOfCurve2, b: InterOfCurve2) => {
          if (a.u1 < b.u1) {
            return -1;
          }
          if (a.u1 > b.u1) {
            return 1;
          }
          return 0;
        });
        // 根据分割点对面轮廓进行切割
        let off = 0;
        for (let i = 0; i < cuts.length; i++) {
          let ip = cuts[i];
          let ur = coedgeAlgo.ur;
          // 闭环上的第一个分割点只做端点偏移，并记录偏移量
          if (i == 0 && coedgeAlgo.curve.dat instanceof Arc2Data && ur.x == 0 && ur.y == PI2) {
            coedgeAlgo.c.e.umin = ip.u1;
            coedgeAlgo.c.e.umax = PI2 + ip.u1;
            continue;
          }
          // 对coedge进行切割
          let afterCoedge = coedgeAlgo.c.clone();
          afterCoedge.uuid = uuidv4();
          afterCoedge.e.uuid = uuidv4();
          afterCoedge.e.umin = ip.u1;
          coedgeAlgo.c.e.umax = ip.u1;

          let v = new Vertice2();
          afterCoedge.e.v0 = v;
          coedgeAlgo.c.e.v1 = v;

          let afterCoedgeAlgo = new Coedge2Algo(afterCoedge, coedgeAlgo.f);
          loopAlgo.coedges.splice(l + off + 1, 0, afterCoedgeAlgo);
          loopAlgo.loop.coedges.splice(l + off + 1, 0, afterCoedge);
          off++;
          coedgeAlgo = afterCoedgeAlgo;
        }

      }
    }
  }
  static Cutting0(a: Loop2Algo[], b: Loop2Algo[], inters: Array<InterOfFace2>, tol0: number, tol1: number) {
    // 根据轮廓交点对面轮廓进行切割
    for (let i = 0; i < inters.length; i++) {
      let inter = inters[i];
      let c0 = inter.c0;
      let c1 = inter.c1;
      let is = inter.is;

      let offsets = {};
      for (let j = 0; j < is.length; j++) {
        let ip = is[j];
        // 用c0对a中的所有loop进行切割
        for (let k = 0; k < a.length; k++) {
          let loopAlgo = a[k];
          for (let l = loopAlgo.coedges.length - 1; l > -1; l--) {
            let coedgeAlgo = loopAlgo.coedges[l];
            if (coedgeAlgo.curve.dat.uuid == c0.uuid) {
              if (coedgeAlgo.curve.dat instanceof Arc2Data) {
                // // 是唯一原始环,修改端点的参数，不需要分割。
                // if (loopAlgo.coedges.length == 1) {
                //   let ur = coedgeAlgo.ur;
                //   if (ur.x == 0 && ur.y == PI2) {
                //     coedgeAlgo.c.e.umin = ip.u0;
                //     coedgeAlgo.c.e.umax = PI2 + ip.u0;
                //     // // 如果修改端点的参数后依然是初始状态，则加一个微小的偏移。
                //     // if (coedgeAlgo.c.e.umin == 0 && coedgeAlgo.c.e.umax == PI2) {
                //     //   coedgeAlgo.c.e.umin += 1e-14;
                //     //   coedgeAlgo.c.e.umax += 1e-14;
                //     // }                     
                //     continue;
                //   }
                // }

                if (!coedgeAlgo.isOnUBoder(ip.u0, tol1) && coedgeAlgo.isInURangePeriod(ip.u0, PI2, tol1)) {
                  // 对coedge进行切割
                  let afterCoedge = coedgeAlgo.c.clone();
                  afterCoedge.uuid = uuidv4();
                  afterCoedge.e.uuid = uuidv4();
                  afterCoedge.e.umin = ip.u0;
                  coedgeAlgo.c.e.umax = ip.u0;

                  let v = new Vertice2();
                  afterCoedge.e.v0 = v;
                  coedgeAlgo.c.e.v1 = v;

                  let afterCoedgeAlgo = new Coedge2Algo(afterCoedge, coedgeAlgo.f);
                  loopAlgo.coedges.splice(l + 1, 0, afterCoedgeAlgo);
                  loopAlgo.loop.coedges.splice(l + 1, 0, afterCoedge);
                }
              } else {
                if (!coedgeAlgo.isOnUBoder(ip.u0, tol1) && coedgeAlgo.isInURange(ip.u0)) {
                  // 对coedge进行切割
                  let afterCoedge = coedgeAlgo.c.clone();
                  afterCoedge.uuid = uuidv4();
                  afterCoedge.e.uuid = uuidv4();
                  afterCoedge.e.umin = ip.u0;
                  coedgeAlgo.c.e.umax = ip.u0;

                  let v = new Vertice2();
                  afterCoedge.e.v0 = v;
                  coedgeAlgo.c.e.v1 = v;

                  let afterCoedgeAlgo = new Coedge2Algo(afterCoedge, coedgeAlgo.f);
                  loopAlgo.coedges.splice(l + 1, 0, afterCoedgeAlgo);
                  loopAlgo.loop.coedges.splice(l + 1, 0, afterCoedge);
                }
              }
            }
          }
        }

        // 用c1对b中的所有loop进行切割
        for (let k = 0; k < b.length; k++) {
          let loopAlgo = b[k];
          for (let l = loopAlgo.coedges.length - 1; l > -1; l--) {
            let coedgeAlgo = loopAlgo.coedges[l];
            if (coedgeAlgo.curve.dat.uuid == c1.uuid) {
              if (coedgeAlgo.curve.dat instanceof Arc2Data) {
                // // 是唯一原始环,修改端点的参数，不需要分割。
                // if (loopAlgo.coedges.length == 1) {
                //   let ur = coedgeAlgo.ur;
                //   if (ur.x == 0 && ur.y == PI2) {
                //     coedgeAlgo.c.e.umin = ip.u1;
                //     coedgeAlgo.c.e.umax = PI2 + ip.u1;
                //     // // 如果修改端点的参数后依然是初始状态，则加一个微小的偏移。
                //     // if (coedgeAlgo.c.e.umin == 0 && coedgeAlgo.c.e.umax == PI2) {
                //     //   coedgeAlgo.c.e.umin += 1e-14;
                //     //   coedgeAlgo.c.e.umax += 1e-14;
                //     // }                    
                //     continue;
                //   }
                // }
                if (!coedgeAlgo.isOnUBoder(ip.u1, tol1) && coedgeAlgo.isInURangePeriod(ip.u1, PI2, tol1)) {
                  // 对coedge进行切割
                  let afterCoedge = coedgeAlgo.c.clone();
                  afterCoedge.uuid = uuidv4();
                  afterCoedge.e.uuid = uuidv4();
                  afterCoedge.e.umin = ip.u1;
                  coedgeAlgo.c.e.umax = ip.u1;

                  let v = new Vertice2();
                  afterCoedge.e.v0 = v;
                  coedgeAlgo.c.e.v1 = v;

                  let afterCoedgeAlgo = new Coedge2Algo(afterCoedge, coedgeAlgo.f);
                  loopAlgo.coedges.splice(l + 1, 0, afterCoedgeAlgo);
                  loopAlgo.loop.coedges.splice(l + 1, 0, afterCoedge);
                }
              } else {
                if (!coedgeAlgo.isOnUBoder(ip.u1, tol1) && coedgeAlgo.isInURange(ip.u1)) {
                  // 对coedge进行切割
                  let afterCoedge = coedgeAlgo.c.clone();
                  afterCoedge.uuid = uuidv4();
                  afterCoedge.e.uuid = uuidv4();
                  afterCoedge.e.umin = ip.u1;
                  coedgeAlgo.c.e.umax = ip.u1;

                  let v = new Vertice2();
                  afterCoedge.e.v0 = v;
                  coedgeAlgo.c.e.v1 = v;

                  let afterCoedgeAlgo = new Coedge2Algo(afterCoedge, coedgeAlgo.f);
                  loopAlgo.coedges.splice(l + 1, 0, afterCoedgeAlgo);
                  loopAlgo.loop.coedges.splice(l + 1, 0, afterCoedge);
                }
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
  static FaceRebuild(galgo: Digraph2Algo, tol0: number, tol1: number): Face2[] {
    let alloops = galgo.getAllLoops(tol0);
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
          // outside.coedges.forEach(coedge => {
          //   let index = f.curves.indexOf(coedge.curve.dat);
          //   if (index == -1) {
          //     index = f.curves.length;
          //     f.curves.push(coedge.curve.dat);
          //   }
          //   coedge.c.e.curve = null;
          //   coedge.c.e.curvei = index;
          //   if (!f.vertices.includes(coedge.c.e.v0)) {
          //     f.vertices.push(coedge.c.e.v0);
          //   }
          //   if (!f.vertices.includes(coedge.c.e.v1)) {
          //     f.vertices.push(coedge.c.e.v1);
          //   }
          // });
          alloops.splice(i, 1);
          break;
        }
      }
      // 内部的逆向空腔
      if (outside) {
        count = alloops.length;
        for (let i = count - 1; i > -1; i--) {
          let inside = alloops[i];
          let inp = inside.getRandomBorderPoint();
          if (outside.isPointAtInner(inp, tol0, tol1)) {
            f.holes.push(inside.loop);
            // inside.coedges.forEach(coedge => {
            //   let index = f.curves.indexOf(coedge.curve.dat);
            //   if (index == -1) {
            //     index = f.curves.length;
            //     f.curves.push(coedge.curve.dat);
            //   }
            //   coedge.c.e.curve = null;
            //   coedge.c.e.curvei = index;
            //   if (!f.vertices.includes(coedge.c.e.v0)) {
            //     f.vertices.push(coedge.c.e.v0);
            //   }
            //   if (!f.vertices.includes(coedge.c.e.v1)) {
            //     f.vertices.push(coedge.c.e.v1);
            //   }
            // });
            alloops.splice(i, 1);
          }
        }
        result.push(f);
        Bool2.FaceIndexRelation(f);
      } else {
        break;
      }
    }

    return result;
  }


  /*
  * 面构建索引关联
  * 
  */
  static FaceIndexRelation(face: Face2): void {
    face.curves = [];
    face.vertices = [];
    face.edges = [];
    // 根据对象重新建立顶点和边间的索引关系
    // Coedge2.e -- Coedge2.ei -- Face2.edges
    for (let i = 0; i < face.border.coedges.length; i++) {
      let coedge = face.border.coedges[i];
      let index = face.edges.indexOf(coedge.e);
      if (index == -1) {
        for (let j = 0; j < face.edges.length; j++) {
          if (face.edges[j].uuid === coedge.e.uuid) {
            index = j;
            break;
          }
        }
        if (index == -1) {
          index = face.edges.length;
          face.edges.push(coedge.e);
        }
      }
      coedge.ei = index;
    }
    for (let i = 0; i < face.holes.length; i++) {
      let hole = face.holes[i];
      for (let j = 0; j < hole.coedges.length; j++) {
        let coedge = hole.coedges[j];
        let index = face.edges.indexOf(coedge.e);
        if (index == -1) {
          for (let k = 0; k < face.edges.length; k++) {
            if (face.edges[k].uuid === coedge.e.uuid) {
              index = k;
              break;
            }
          }
          if (index == -1) {
            index = face.edges.length;
            face.edges.push(coedge.e);
          }
        }
        coedge.ei = index;
      }
    }

    // Edge2.curve -- Edge2.curvei --Face2.curves
    for (let i = 0; i < face.edges.length; i++) {
      let edge = face.edges[i];
      if (edge.curve) {
        let index = face.curves.indexOf(edge.curve);
        if (index == -1) {
          for (let j = 0; j < face.curves.length; j++) {
            if (face.curves[j].uuid === edge.curve.uuid) {
              index = j;
              break;
            }
          }
          if (index == -1) {
            index = face.curves.length;
            face.curves.push(edge.curve);
          }
          edge.curvei = index;
        }
      }
      // Edge2.v0 -- Edge2.v0i -- Face2.vertices
      if (edge.v0) {
        let index = face.vertices.indexOf(edge.v0);
        if (index == -1) {
          for (let j = 0; j < face.vertices.length; j++) {
            if (face.vertices[j].uuid === edge.v0.uuid) {
              index = j;
              break;
            }
          }
          if (index == -1) {
            index = face.vertices.length;
            face.vertices.push(edge.v0);
          }
        }
        edge.v0i = index;
      }
      // Edge2.v1 -- Edge2.v1i -- Face2.vertices
      if (edge.v1) {
        let index = face.vertices.indexOf(edge.v1);
        if (index == -1) {
          for (let j = 0; j < face.vertices.length; j++) {
            if (face.vertices[j].uuid === edge.v1.uuid) {
              index = j;
              break;
            }
          }
          if (index == -1) {
            index = face.vertices.length;
            face.vertices.push(edge.v1);
          }
        }
        edge.v1i = index;
      }
    }
  }

  /*
  * 面清空索引关联
  * 
  */
  static FaceClearIndexRelation(face: Face2): void {
    // 根据对象重新建立顶点和边间的索引关系
    // Coedge2.e -- Coedge2.ei -- Face2.edges
    for (let i = 0; i < face.border.coedges.length; i++) {
      let coedge = face.border.coedges[i];
      coedge.ei = -1;
      coedge.e.curvei = -1;
    }
    for (let i = 0; i < face.holes.length; i++) {
      let hole = face.holes[i];
      for (let j = 0; j < hole.coedges.length; j++) {
        let coedge = hole.coedges[j];
        coedge.ei = -1;
      }
    }
    // Edge2.curve-- Edge2.curvei--Face2.curves
    // Edge2.v0-- Edge2.v0i-- Face2.vertices
    // Edge2.v1-- Edge2.v1i-- Face2.vertices
    for (let i = 0; i < face.edges.length; i++) {
      let edge = face.edges[i];
      edge.curvei = -1;
      edge.v0i = -1;
      edge.v1i = -1;
    }
    face.curves = [];
    face.vertices = [];
    face.edges = [];
  }

  /*
  * 面构建对象引用
  * 
  */
  static FaceObjectReference(face: Face2): void {
    // 根据索引关系重新引用顶点和边对象
    // Coedge2.e -- Coedge2.ei -- Face2.edges
    for (let i = 0; i < face.border.coedges.length; i++) {
      let coedge = face.border.coedges[i];
      if (coedge.ei != -1) {
        coedge.e = face.edges[coedge.ei];
      }
      if (coedge.e && coedge.e.curvei != -1) {
        coedge.e.curve = face.curves[coedge.e.curvei];
      }
    }
    for (let i = 0; i < face.holes.length; i++) {
      let hole = face.holes[i];
      for (let j = 0; j < hole.coedges.length; j++) {
        let coedge = hole.coedges[j];
        if (coedge.ei != -1) {
          coedge.e = face.edges[coedge.ei];
        }
        if (coedge.e && coedge.e.curvei != -1) {
          coedge.e.curve = face.curves[coedge.e.curvei];
        }
      }
    }
    // Edge2.curve-- Edge2.curvei--Face2.curves
    // Edge2.v0-- Edge2.v0i-- Face2.vertices
    // Edge2.v1-- Edge2.v1i-- Face2.vertices
    for (let i = 0; i < face.edges.length; i++) {
      let edge = face.edges[i];
      if (edge.curvei != -1) {
        edge.curve = face.curves[edge.curvei];
      }
      if (edge.v0i != -1) {
        edge.v0 = face.vertices[edge.v0i];
      }
      if (edge.v1i != -1) {
        edge.v1 = face.vertices[edge.v1i];
      }
    }
  }

  /*
  * 面清空对象引用
  * 
  */
  static FaceClearReference(face: Face2): void {

    // 清空引用
    // Coedge2.e -- Coedge2.ei -- Face2.edges
    for (let i = 0; i < face.border.coedges.length; i++) {
      let coedge = face.border.coedges[i];
      if (coedge.ei != -1) {
        coedge.e = undefined;
      }
    }
    for (let i = 0; i < face.holes.length; i++) {
      let hole = face.holes[i];
      for (let j = 0; j < hole.coedges.length; j++) {
        let coedge = hole.coedges[j];
        if (coedge.ei != -1) {
          coedge.e = undefined;
        }
      }
    }

    // Edge2.curve-- Edge2.curvei--Face2.curves
    // Edge2.v0-- Edge2.v0i-- Face2.vertices
    // Edge2.v1-- Edge2.v1i-- Face2.vertices
    for (let i = 0; i < face.edges.length; i++) {
      let edge = face.edges[i];
      if (edge.curvei != -1) {
        edge.curve = undefined;
      }
      if (edge.v0i != -1) {
        edge.v0 = undefined;
      }
      if (edge.v1i != -1) {
        edge.v1 = undefined;
      }
    }
  }

  /*
  * 面接触
  * 
  */
  static ContactFace(a: Face2Algo, b: Face2Algo, tol0: number, tol1: number): boolean {
    // 计算面与面的轮廓交点
    let algo = a;
    let blgo = b;
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length == 0) {
      let pa = algo.getInnerPoint();
      let pb = blgo.getInnerPoint();
      // a在b内
      if (blgo.isPointAtInner(pa, tol0, tol1)) {
        return true;
      }
      // b在a内
      else if (algo.isPointAtInner(pb, tol0, tol1)) {
        return true;
      } else {
        // a,b相离
        return false;
      }
    }
    return true;
  }

  /*
  * 边接触
  * 
  */
  static ContactEdge(a: Face2, b: Edge2[], tol0: number, tol1: number): boolean {
    let a_ = a;
    let b_ = Brep2Builder.BuildFaceByEdges(b);
    // 计算面与面的轮廓交点
    let algo = new Face2Algo(a_);
    let blgo = new Face2Algo(b_);
    let inters = Brep2Inter.FaceXFace(algo, blgo, tol0, tol1);
    if (inters.length == 0) {
      let pb = blgo.getInnerPoint();
      // b在a内
      if (algo.isPointAtInner(pb, tol0, tol1)) {
        return true;
      } else {
        // a,b相离
        return false;
      }
    }
    return true;
  }
}

export {
  Bool2,
}