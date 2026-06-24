import { GeomType } from "../../../../core/Constents";
import { Vector2 } from "../../../../math/Math";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";

/**
 * Cylinder surface data struct.
 *
 */
class CylinderSurfaceData extends SurfaceData {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_SURFACE_CYLINDERSURFACE;  
  /**
   * The radius of this Cylinder surface.
   *
   * @type {Vector2}
   */
  public radius: Vector2;

  /**
   * Constructs a plane surface.
   *
   * @param {Transform3} [trans] - The base transfrom of surface.
   * @param {Vector2} [radius = (1,1)] - The radius value of this Cylinder surface.
   */
  constructor(trans = new Transform3(), radius: Vector2 = new Vector2(1, 1)) {
    super(trans);
    this.radius = radius;
  }

  /**
   * Returns a new CylinderSurfaceData with unserialize data.
   *
   * @return {CylinderSurfaceData} a new instance.
   */
  static Unserialize(data: any): CylinderSurfaceData {
    let ret = new CylinderSurfaceData(Transform3.Unserialize(data.trans), Vector2.Unserialize(data.radius));
    ret.uuid = data.uuid;
    return ret;
  }
}

export { CylinderSurfaceData };