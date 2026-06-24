import { GeomType } from "../../../../core/Constents";
import { Vector2 } from "../../../../math/Math";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";

/**
 * Conical surface data struct.
 *
 */
class ConicalSurfaceData extends SurfaceData {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_SURFACE_CONICALSURFACE;
  /**
   * The radius at height value 1 of this conical surface.
   *
   * @type {Vector2}
   */
  public radius: Vector2;

  /**
   * Constructs a plane surface.
   *
   * @param {Transform3} [trans] - The base transfrom of surface.
   * @param {Vector2} [radius = (1,1)] - The radius value at height value 1 of this Conical surface.
   */
  constructor(trans = new Transform3(), radius: Vector2 = new Vector2(1, 1)) {
    super(trans);
    this.radius = radius;
  }

  /**
   * Returns a new ConicalSurfaceData with unserialize data.
   *
   * @return {ConicalSurfaceData} a new instance.
   */
  static Unserialize(data: any): ConicalSurfaceData {
    let ret = new ConicalSurfaceData(Transform3.Unserialize(data.trans), Vector2.Unserialize(data.radius));
    ret.uuid = data.uuid;
    return ret;
  }
}

export { ConicalSurfaceData };