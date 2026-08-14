import { Vector3 } from "../../../math/Math";
import { DataBase } from "../DataBase";
import { GeomType } from "../../../core/Constents";
/**
 * 3D point data struct.
 *
 */
class Point3Data extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_POINT3;

  /**
   * The positon of this Point3Data.
   *
   * @type {Vector3}
   */
  public pos: Vector3;

  /**
   * Constructs a new 3D Point3Data.
   *
   * @param {Vector3} [pos=(0,0)] - The radius value of this arc.
   */
  constructor(pos = new Vector3(0, 0)) {
    super();
    this.pos = pos;
  }
  /**
   * Returns a new Point3Data with copied values from this instance.
   *
   * @return {Point3Data} A clone of this instance.
   */
  override clone() {
    return new Point3Data(this.pos.clone());
  }

  /**
   * Returns a new Point3Data with unserialize data.
   *
   * @return {Point3Data} a new instance.
   */
  static Unserialize(data: any): Point3Data {
    let ret = new Point3Data(Vector3.Unserialize(data.pos));
    ret.uuid = data.uuid;
    return ret;
  }
}

export { Point3Data };