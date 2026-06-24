import { GeomType } from "../../../../core/Constents";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";

/**
 * Sphere surface data struct.
 *
 */
class SphereSurfaceData extends SurfaceData {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_SURFACE_SPHERESURFACE;
  /**
   * The radius value of this Sphere surface.
   *
   * @type {number}
   */
  public radius: number;

  /**
   * Constructs a plane surface.
   *
   * @param {Transform3} [trans] - The base transfrom of surface.
   * @param {number} [radius = 1] - The radius value of this Sphere surface.
   */
  constructor(trans = new Transform3(), radius: number = 1) {
    super(trans);
    this.radius = radius;
  }

  /**
   * Returns a new SphereSurfaceData with unserialize data.
   *
   * @return {SphereSurfaceData} a new instance.
   */
  static Unserialize(data: any): SphereSurfaceData {
    let ret = new SphereSurfaceData(Transform3.Unserialize(data.trans), data.radius);
    ret.uuid = data.uuid;
    return ret;
  }
}

export { SphereSurfaceData };