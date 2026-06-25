import * as THREE from 'three';
// import * as polyDecomp from 'poly-decomp'
import type { Edge2, Face2 } from '../geometry/data/brep/Brep2';
import type { Edge3, Face3 } from '../geometry/data/brep/Brep3';
import { CurveBuilder } from '../geometry/algorithm/builder/CurveBuilder';
import { MathUtils } from '../math/MathUtils';
import { Brep2Builder } from '../geometry/algorithm/builder/Brep2Builder';
import { Line2Data } from '../geometry/data/base/curve2/Line2Data';
import { Line3Data } from '../geometry/data/base/curve3/Line3Data';
import { Brep3Builder } from '../geometry/algorithm/builder/Brep3Builder';

/**
 * brep mesh builder.
 *
 */
class BrepMeshBuilder {

  /**
   * build edge2 mesh WireframeGeometry.
   *
   * @param {Edge2} [edge] - The edge2 object.
   * @param {number} [color] - The color of edge2 object.
   * @param {number} [segment] - The segment of edge2 object.
   * @param {number} [sub] - The sub type of edge2 object.
   */
  static BuildEdge2sMesh(edges: Edge2[], color: number, segment?: number, sub: number = 0): THREE.Line {
    let vertices = new Array<number>;
    for (let i = 0; i < edges.length; i++) {
      let edge = edges[i];
      if (segment == undefined) {
        if (edge.curve instanceof Line2Data) {
          segment = 1;
        } else {
          segment = Math.ceil(MathUtils.clamp(Brep2Builder.Length(edge.curve, edge.u, 1, 512), 64, 512));
        }
      }

      let algor = CurveBuilder.Algorithm2ByData(edge.curve, sub);
      let step = (edge.u.y - edge.u.x) / segment;

      // let indices = Array<number>();
      for (let u = edge.u.x, i = 0; i <= segment; u += step, i++) {
        let p = algor.p(u);
        vertices.push(p.x);
        vertices.push(p.y);
        vertices.push(0);
        // indices.push(i);
      }
    }

    let buff = new THREE.BufferGeometry()
    // buff.setIndex(indices);
    buff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const materialline = new THREE.MeshBasicMaterial({ color: color });
    let ret = new THREE.Line(buff, materialline);
    ret.frustumCulled = false;
    return ret;
  }
  /**
   * build edge2 mesh WireframeGeometry.
   *
   * @param {Edge2} [edge] - The edge2 object.
   * @param {number} [color] - The color of edge2 object.
   * @param {number} [segment] - The segment of edge2 object.
   * @param {number} [sub] - The sub type of edge2 object.
   */
  static BuildEdge2Mesh(edge: Edge2, color: number, segment?: number, sub: number = 0): THREE.Line {
    if (segment == undefined) {
      if (edge.curve instanceof Line2Data) {
        segment = 1;
      } else {
        let l = Brep2Builder.Length(edge.curve, edge.u, 1, 1024);
        segment = Math.ceil(MathUtils.clamp(l, 64, 1024));
      }
    }

    let algor = CurveBuilder.Algorithm2ByData(edge.curve, sub);
    let step = (edge.u.y - edge.u.x) / segment;
    let vertices = new Array<number>;
    // let indices = Array<number>();
    for (let u = edge.u.x, i = 0; i <= segment; u += step, i++) {
      let p = algor.p(u);
      vertices.push(p.x);
      vertices.push(p.y);
      vertices.push(0);
      // indices.push(i);
    }
    let buff = new THREE.BufferGeometry()
    // buff.setIndex(indices);
    buff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const materialline = new THREE.MeshBasicMaterial({ color: color });
    let ret = new THREE.Line(buff, materialline);
    ret.frustumCulled = false;
    return ret;
  }

  /**
   * build edge2 tangent WireframeGeometry.
   *
   * @param {Edge2} [edge] - The edge2 object.
   */
  static BuildEdge2Tangents(edge: Edge2, color: number, segment?: number): THREE.LineSegments {
    if (segment == undefined) {
      if (edge.curve instanceof Line2Data) {
        segment = 1;
      } else {
        segment = Math.ceil(MathUtils.clamp(Brep2Builder.Length(edge.curve, edge.u, 1, 512), 32, 512));
      }
    }

    let algor = CurveBuilder.Algorithm2ByData(edge.curve);
    let step = (edge.u.y - edge.u.x) / segment;
    let vertices = new Array<number>;
    // let indices = Array<number>();
    for (let i = edge.u.x, index = 0; index <= segment; i += step, index++) {
      let p = algor.p(i);
      let t = algor.t(i);
      vertices.push(p.x);
      vertices.push(p.y);
      vertices.push(0);
      vertices.push(p.x + t.x);
      vertices.push(p.y + t.y);
      vertices.push(0);
      // indices.push(index);
      // indices.push(index++);
    }
    let buff = new THREE.BufferGeometry()
    // buff.setIndex(indices);
    buff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const materialline = new THREE.MeshBasicMaterial({ color: color });
    let ret = new THREE.LineSegments(buff, materialline);
    ret.frustumCulled = false;
    return ret;
  }

  /**
   * build edge2 derivative WireframeGeometry.
   *
   * @param {Edge2} [edge] - The edge2 object.
   */
  static BuildEdge2Derivatives(edge: Edge2, color: number, segment?: number): THREE.LineSegments {
    if (segment == undefined) {
      if (edge.curve instanceof Line2Data) {
        segment = 1;
      } else {
        segment = Math.ceil(MathUtils.clamp(Brep2Builder.Length(edge.curve, edge.u, 1, 512), 32, 512));
      }
    }

    let algor = CurveBuilder.Algorithm2ByData(edge.curve);
    let step = (edge.u.y - edge.u.x) / segment;
    let vertices = new Array<number>;
    // let indices = Array<number>();
    for (let i = edge.u.x, index = 0; index <= segment; i += step, index++) {
      let p = algor.p(i);
      let t = algor.d(i, 1);
      if (index == segment) {
        t.multiplyScalar(-1);
      }
      vertices.push(p.x);
      vertices.push(p.y);
      vertices.push(0);
      vertices.push(p.x + t.x);
      vertices.push(p.y + t.y);
      vertices.push(0);
      // indices.push(index);
      // indices.push(index++);
    }
    let buff = new THREE.BufferGeometry()
    // buff.setIndex(indices);
    buff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const materialline = new THREE.MeshBasicMaterial({ color: color });
    let ret = new THREE.LineSegments(buff, materialline);
    ret.frustumCulled = false;
    return ret;
  }

  /**
   * build edge3 mesh WireframeGeometry.
   *
   * @param {Edge3} [edge] - The edge2 object.
   */
  static BuildEdge3Mesh(edge: Edge3, color: number, segment?: number): THREE.Line {
    if (segment == undefined) {
      if (edge.curve instanceof Line2Data) {
        segment = 1;
      } else {
        segment = Math.ceil(MathUtils.clamp(Brep3Builder.Length(edge, 1), 32, 512));
      }
    }

    let algor = CurveBuilder.Algorithm3ByData(edge.curve);
    let step = (edge.u.y - edge.u.x) / segment;
    let vertices = new Array<number>;
    let indices = Array<number>();
    for (let i = edge.u.x, index = 0; index <= segment; i += step, index++) {
      let p = algor.p(i);
      vertices.push(p.x);
      vertices.push(p.y);
      vertices.push(0);
      indices.push(index);
    }
    let buff = new THREE.BufferGeometry()
    buff.setIndex(indices);
    buff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const materialline = new THREE.MeshBasicMaterial({ color: color });
    let ret = new THREE.Line(buff, materialline);
    ret.frustumCulled = false;
    return ret;
  }

  /**
   * build edge3 tangent WireframeGeometry.
   *
   * @param {Edge2} [edge] - The edge3 object.
   */
  static BuildEdge3Tangents(edge: Edge3, color: number, segment?: number): THREE.LineSegments {
    if (segment == undefined) {
      if (edge.curve instanceof Line3Data) {
        segment = 1;
      } else {
        segment = Math.ceil(MathUtils.clamp(Brep3Builder.Length(edge, 1), 32, 512));
      }
    }

    let algor = CurveBuilder.Algorithm3ByData(edge.curve);
    let step = (edge.u.y - edge.u.x) / segment;
    let vertices = new Array<number>;
    // let indices = Array<number>();
    for (let i = edge.u.x, index = 0; index <= segment; i += step, index++) {
      let p = algor.p(i);
      let t = algor.t(i);
      vertices.push(p.x);
      vertices.push(p.y);
      vertices.push(p.z);
      vertices.push(p.x + t.x);
      vertices.push(p.y + t.y);
      vertices.push(p.z + t.z);
      // indices.push(index);
      // indices.push(index++);
    }
    let buff = new THREE.BufferGeometry()
    // buff.setIndex(indices);
    buff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const materialline = new THREE.MeshBasicMaterial({ color: color });
    let ret = new THREE.LineSegments(buff, materialline);
    ret.frustumCulled = false;
    return ret;
  }
  /**
   * build edge3 derivative WireframeGeometry.
   *
   * @param {Edge3} [edge] - The edge3 object.
   */
  static BuildEdge3Derivatives(edge: Edge3, color: number, segment?: number): THREE.LineSegments {
    if (segment == undefined) {
      if (edge.curve instanceof Line3Data) {
        segment = 1;
      } else {
        segment = Math.ceil(MathUtils.clamp(Brep3Builder.Length(edge, 1), 32, 512));
      }
    }

    let algor = CurveBuilder.Algorithm3ByData(edge.curve);
    let step = (edge.u.y - edge.u.x) / segment;
    let vertices = new Array<number>;
    // let indices = Array<number>();
    for (let i = edge.u.x, index = 0; index <= segment; i += step, index++) {
      let p = algor.p(i);
      let t = algor.d(i, 1);
      if (index == segment) {
        t.multiplyScalar(-1);
      }
      vertices.push(p.x);
      vertices.push(p.y);
      vertices.push(0);
      vertices.push(p.x + t.x);
      vertices.push(p.y + t.y);
      vertices.push(0);
      // indices.push(index);
      // indices.push(index++);
    }
    let buff = new THREE.BufferGeometry()
    // buff.setIndex(indices);
    buff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const materialline = new THREE.MeshBasicMaterial({ color: color });
    let ret = new THREE.LineSegments(buff, materialline);
    ret.userData.original = edge;
    ret.frustumCulled = false;
    return ret;
  }
  /**
   * build face2 mesh BufferGeometry.
   *
   * @param {Face2} [face] - The face2 object.
   */
  static BuildFace2Mesh(face: Face2, color: number, segment?: number, drawOutLine: boolean = true): THREE.Mesh {
    let points = new Array<THREE.Vector2>();
    let holes = new Array<THREE.Path>();
    face.border.coedges.forEach(coedge => {
      let edge = coedge.e;
      let curve = edge.curve;
      if (curve == null) {
        curve = face.curves[edge.curvei];
      }
      let edgeSegment = segment;
      if (edgeSegment == undefined) {
        if (curve instanceof Line2Data) {
          edgeSegment = 1;
        } else {
          edgeSegment = Math.ceil(MathUtils.clamp(Brep2Builder.Length(curve, edge.u, 1, 512), 64, 512));
        }
      }

      let algor = CurveBuilder.Algorithm2ByData(curve);
      let ub = edge.u.x;
      let ue = edge.u.y;
      if (!coedge.isForward) {
        [ub, ue] = [ue, ub];
      }
      let step = (ue - ub) / edgeSegment;
      for (let u = ub, i = 0; i <= edgeSegment; u += step, i++) {
        let p = algor.p(u);
        points.push(new THREE.Vector2(p.x, p.y));
      }
    });
    face.holes.forEach(hole => {
      let holePoints = new Array<THREE.Vector2>();
      hole.coedges.forEach(coedge => {
        let edge = coedge.e;
        let curve = edge.curve;
        if (curve == null) {
          curve = face.curves[edge.curvei];
        }
        let edgeSegment = segment;
        if (edgeSegment == undefined) {
          if (curve instanceof Line2Data) {
            edgeSegment = 1;
          } else {
            edgeSegment = Math.ceil(MathUtils.clamp(Brep2Builder.Length(curve, edge.u, 1, 512), 64, 512));
          }
        }
        let algor = CurveBuilder.Algorithm2ByData(curve);
        let ub = edge.u.x;
        let ue = edge.u.y;
        if (!coedge.isForward) {
          [ub, ue] = [ue, ub];
        }
        let step = (ue - ub) / edgeSegment;
        for (let u = ub, i = 0; i <= edgeSegment; u += step, i++) {
          let p = algor.p(u);
          holePoints.push(new THREE.Vector2(p.x, p.y));
        }
      });
      holes.push(new THREE.Path(holePoints));
    });
    let shape = new THREE.Shape(points);
    shape.holes = holes;
    const material = new THREE.MeshBasicMaterial({ color: color, opacity: 0.25, transparent: true });
    let buff = new THREE.ShapeGeometry(shape);
    let ret = new THREE.Mesh(buff, material);
    ret.frustumCulled = false;

    // 绘制边界线
    if (drawOutLine) {
      let vertices = new Array<number>;
      for (let i = 0; i < points.length; i++) {
        let p = points[i];
        vertices.push(p.x);
        vertices.push(p.y);
        vertices.push(0);
      }
      let p = points[0];
      vertices.push(p.x);
      vertices.push(p.y);
      vertices.push(0);
      let borderbuff = new THREE.BufferGeometry()
      borderbuff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      const materialline = new THREE.MeshBasicMaterial({ color: color });
      let borderMesh = new THREE.Line(borderbuff, materialline);
      borderMesh.frustumCulled = false;
      ret.children.push(borderMesh);
      holes.forEach(hole => {
        let vertices = new Array<number>;
        hole.getPoints().forEach(p => {
          vertices.push(p.x);
          vertices.push(p.y);
          vertices.push(0);
        });
        let p = points[0];
        vertices.push(p.x);
        vertices.push(p.y);
        vertices.push(0);
        let holeBuff = new THREE.BufferGeometry()
        holeBuff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        let holeMesh = new THREE.Line(holeBuff, materialline);
        holeMesh.frustumCulled = false;
        ret.children.push(holeMesh);
      });
    }
    return ret;
  }

  /**
   * build face2 mesh BufferGeometry.
   *
   * @param {Face2} [face] - The face2 object.
   */
  static BuildFace2sMesh(faces: Face2[], color: number, segment?: number, drawOutLine: boolean = true): THREE.Mesh {
    let pointss = new Array<Array<THREE.Vector2>>();
    let holess = new Array<Array<THREE.Path>>();
    let shapes: THREE.Shape[] = [];
    for (let i = 0; i < faces.length; i++) {
      let points = new Array<THREE.Vector2>();
      let holes = new Array<THREE.Path>();
      let face = faces[i];
      face.border.coedges.forEach(coedge => {
        let edge = coedge.e;
        let curve = edge.curve;
        if (curve == null) {
          curve = face.curves[edge.curvei];
        }
        let edgeSegment = segment;
        if (edgeSegment == undefined) {
          if (curve instanceof Line2Data) {
            edgeSegment = 1;
          } else {
            edgeSegment = Math.ceil(MathUtils.clamp(Brep2Builder.Length(curve, edge.u, 1, 512), 64, 512));
          }
        }

        let algor = CurveBuilder.Algorithm2ByData(curve);
        let ub = edge.u.x;
        let ue = edge.u.y;
        if (!coedge.isForward) {
          [ub, ue] = [ue, ub];
        }
        let step = (ue - ub) / edgeSegment;
        for (let u = ub, i = 0; i <= edgeSegment; u += step, i++) {
          let p = algor.p(u);
          points.push(new THREE.Vector2(p.x, p.y));
        }
      });
      face.holes.forEach(hole => {
        let holePoints = new Array<THREE.Vector2>();
        hole.coedges.forEach(coedge => {
          let edge = coedge.e;
          let curve = edge.curve;
          if (curve == null) {
            curve = face.curves[edge.curvei];
          }
          let edgeSegment = segment;
          if (edgeSegment == undefined) {
            if (curve instanceof Line2Data) {
              edgeSegment = 1;
            } else {
              edgeSegment = Math.ceil(MathUtils.clamp(Brep2Builder.Length(curve, edge.u, 1, 512), 64, 512));
            }
          }
          let algor = CurveBuilder.Algorithm2ByData(curve);
          let ub = edge.u.x;
          let ue = edge.u.y;
          if (!coedge.isForward) {
            [ub, ue] = [ue, ub];
          }
          let step = (ue - ub) / edgeSegment;
          for (let u = ub, i = 0; i <= edgeSegment; u += step, i++) {
            let p = algor.p(u);
            holePoints.push(new THREE.Vector2(p.x, p.y));
          }
        });
        holes.push(new THREE.Path(holePoints));
      });
      pointss.push(points);
      holess.push(holes);
      let shape = new THREE.Shape(points);
      shape.holes = holes;
      shapes.push(shape)
    }

    const material = new THREE.MeshBasicMaterial({ color: color, opacity: 0.25, transparent: true });
    let buff = new THREE.ShapeGeometry(shapes);
    let ret = new THREE.Mesh(buff, material);
    ret.frustumCulled = false;

    // 绘制边界线
    if (drawOutLine) {
      for (let i = 0; i < faces.length; i++) {
        let points = pointss[i];
        let holes = holess[i];
        let vertices = new Array<number>;
        for (let j = 0; j < points.length; j++) {
          let p = points[j];
          vertices.push(p.x);
          vertices.push(p.y);
          vertices.push(0);
        }
        let p = points[0];
        vertices.push(p.x);
        vertices.push(p.y);
        vertices.push(0);
        let borderbuff = new THREE.BufferGeometry()
        borderbuff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const materialline = new THREE.MeshBasicMaterial({ color: color });
        let borderMesh = new THREE.Line(borderbuff, materialline);
        borderMesh.frustumCulled = false;
        ret.children.push(borderMesh);
        holes.forEach(hole => {
          let vertices = new Array<number>;
          hole.getPoints().forEach(p => {
            vertices.push(p.x);
            vertices.push(p.y);
            vertices.push(0);
          });
          let p = points[0];
          vertices.push(p.x);
          vertices.push(p.y);
          vertices.push(0);
          let holeBuff = new THREE.BufferGeometry()
          holeBuff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
          let holeMesh = new THREE.Line(holeBuff, materialline);
          holeMesh.frustumCulled = false;
          ret.children.push(holeMesh);
        });
      }

    }
    return ret;
  }

  /**
   * build face3 mesh BufferGeometry.
   *
   * @param {Face3} [face] - The face3 object.
   */
  static BuildFace3Mesh(face: Face3): THREE.BufferGeometry {
    debugger;
    return null;
  }

}

export { BrepMeshBuilder };