import { GeomType } from "../../../../core/Constents";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";

/**
 * Plane surfacedata struct.
 *
 */
class PlaneSurfaceData extends SurfaceData {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_SURFACE_PLANESURFACE;
  /**
   * Constructs a plane surface.
   *
   * @param {Transform3} [trans] - The base transfrom of plane.
   */
  constructor(trans = new Transform3()) {
    super(trans);
  }

  /**
   * Returns a new PlaneSurfaceData with unserialize data.
   *
   * @return {PlaneSurfaceData} a new instance.
   */
  static Unserialize(data: any): PlaneSurfaceData {
    let ret = new PlaneSurfaceData(Transform3.Unserialize(data.trans));
    ret.uuid = data.uuid;
    return ret;
  }
}

export { PlaneSurfaceData };