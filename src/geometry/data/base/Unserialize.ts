import { GeomType } from "../../../core/Constents";
import { Euler, Matrix2, Matrix3, Matrix4, Quaternion, Vector2, Vector3, Vector4 } from "../../../math/Math";
import { Coedge2, Digraph2, Edge2, Face2, Loop2, Vertice2 } from "../brep/Brep2";
import { Body3, Coedge3, Edge3, Face3, Loop3, Lump3, Shell3, Vertice3 } from "../brep/Brep3";
import type { DataBase } from "../DataBase";
import { Arc2Data } from "./curve2/Arc2Data";
import { Hyperbola2Data } from "./curve2/Hyperbola2Data";
import { Line2Data } from "./curve2/Line2Data";
import { Nurbs2Data } from "./curve2/Nurbs2Data";
import { Parabola2Data } from "./curve2/Parabola2Data";
import { Arc3Data } from "./curve3/Arc3Data";
import { Hyperbola3Data } from "./curve3/Hyperbola3Data";
import { Nurbs3Data } from "./curve3/Nurbs3Data";
import { Parabola3Data } from "./curve3/Parabola3Data";
import { UvCurveData } from "./curve3/UvCurveData";
import { ConicalSurfaceData } from "./surface/ConicalSurfaceData";
import { CylinderSurfaceData } from "./surface/CylinderSurfaceData";
import { EllipsoidSurfaceData } from "./surface/EllipsoidSurfaceData";
import { LoftingSurfaceData } from "./surface/LoftingSurfaceData";
import { NurbsSurfaceData } from "./surface/NurbsSurfaceData";
import { PlaneSurfaceData } from "./surface/PlaneSurfaceData";
import { SphereSurfaceData } from "./surface/SphereSurfaceData";
import { SweepSurfaceData } from "./surface/SweepSurfaceData";

export function unserialize(data: any): any[] {
  switch (data.type) {
    case GeomType.MATH_VECTOR2: return [Vector2.Unserialize(data)];
    case GeomType.MATH_VECTOR3: return [Vector3.Unserialize(data)];
    case GeomType.MATH_VECTOR4: return [Vector4.Unserialize(data)];
    case GeomType.MATH_EULER: return [Euler.Unserialize(data)];
    case GeomType.MATH_QUATERNION: return [Quaternion.Unserialize(data)];
    case GeomType.MATH_MATRIX2: return [Matrix2.Unserialize(data)];
    case GeomType.MATH_MATRIX3: return [Matrix3.Unserialize(data)];
    case GeomType.MATH_MATRIX4: return [Matrix4.Unserialize(data)];

    case GeomType.DATA_TYPE_CURVE2_ARC2: return [Arc2Data.Unserialize(data)];
    case GeomType.DATA_TYPE_CURVE2_ARC2: return [Arc2Data.Unserialize(data)];


    case GeomType.DATA_TYPE_CURVE2_ARC2: return [Arc2Data.Unserialize(data)];
    case GeomType.DATA_TYPE_CURVE2_HYPERBOLA2: return [Hyperbola2Data.Unserialize(data)];
    case GeomType.DATA_TYPE_CURVE2_LINE2: return [Line2Data.Unserialize(data)];
    case GeomType.DATA_TYPE_CURVE2_NURBS2: return [Nurbs2Data.Unserialize(data)];
    case GeomType.DATA_TYPE_CURVE2_PARABOLA2: return [Parabola2Data.Unserialize(data)];

    case GeomType.DATA_TYPE_CURVE3_ARC3: return [Arc3Data.Unserialize(data)];
    case GeomType.DATA_TYPE_CURVE3_HYPERBOLA3: return [Hyperbola3Data.Unserialize(data)];
    case GeomType.DATA_TYPE_CURVE3_LINE3: return [Line2Data.Unserialize(data)];
    case GeomType.DATA_TYPE_CURVE3_NURBS3: return [Nurbs3Data.Unserialize(data)];
    case GeomType.DATA_TYPE_CURVE3_PARABOLA3: return [Parabola3Data.Unserialize(data)];
    case GeomType.DATA_TYPE_CURVE3_UVCURVE: return [UvCurveData.Unserialize(data)];

    case GeomType.DATA_TYPE_SURFACE_CONICALSURFACE: return [ConicalSurfaceData.Unserialize(data)];
    case GeomType.DATA_TYPE_SURFACE_CYLINDERSURFACE: return [CylinderSurfaceData.Unserialize(data)];
    case GeomType.DATA_TYPE_SURFACE_ELLIPSOIDSURFACE: return [EllipsoidSurfaceData.Unserialize(data)];
    case GeomType.DATA_TYPE_SURFACE_LOFTINGSURFACE: return [LoftingSurfaceData.Unserialize(data)];
    case GeomType.DATA_TYPE_SURFACE_NURBSSURFACE: return [NurbsSurfaceData.Unserialize(data)];
    case GeomType.DATA_TYPE_SURFACE_PLANESURFACE: return [PlaneSurfaceData.Unserialize(data)];
    case GeomType.DATA_TYPE_SURFACE_SPHERESURFACE: return [SphereSurfaceData.Unserialize(data)];
    case GeomType.DATA_TYPE_SURFACE_SWEEPSURFACE: return [SweepSurfaceData.Unserialize(data)];

    case GeomType.DATA_TYPE_BREP2_VERTICE2: return [Vertice2.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP2_EDGE2: return [Edge2.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP2_COEDGE2: return [Coedge2.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP2_LOOP2: return [Loop2.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP2_FACE2: return [Face2.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP2_DIGRAPH2: return [Digraph2.Unserialize(data)];

    case GeomType.DATA_TYPE_BREP3_VERTICE3: return [Vertice3.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP3_EDGE3: return [Edge3.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP3_COEDGE3: return [Coedge3.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP3_LOOP3: return [Loop3.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP3_FACE3: return [Face3.Unserialize(data)];
    // case GeomType.DATA_TYPE_BREP3_DIGRAPH3: return [dig.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP3_SHELL3: return [Shell3.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP3_LUMP3: return [Lump3.Unserialize(data)];
    case GeomType.DATA_TYPE_BREP3_BODY3: return [Body3.Unserialize(data)];
  }
  if (data instanceof Array) {
    let rets: DataBase[] = [];
    for (let i = 0; i < data.length; i++) {
      rets.push(...unserialize(data[i]));
    }
    return rets;
  }
  return [];
}