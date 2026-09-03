import { Vector2 } from "../../../math/Math";
import { GeomType } from "../../../core/Constents";
import { DataBase } from "../DataBase";
/**
 * 2D point data struct.
 *
 */
class Point2Data extends DataBase {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private readonly type = GeomType.DATA_TYPE_POINT2;
  private readonly typename = GeomType[GeomType.DATA_TYPE_POINT2];

  /**
   * The positon of this Point2Data.
   *
   * @type {Vector2}
   */
  public pos: Vector2;

  /**
   * Constructs a new 2D Point2Data.
   *
   * @param {Vector2} [pos=(0,0)] - The radius value of this arc.
   */
  constructor(pos = new Vector2(0, 0)) {
    super();
    this.pos = pos;
  }
  /**
   * Returns a new Point2Data with clone values from this instance.
   *
   * @return {Point2Data} A clone of this instance.
   */
  override clone() {
    let result = super.clone() as Point2Data;
    result.pos = this.pos.clone();
    return result;
  }

  /**
   * Returns a new Point2Data with copied values from this instance.
   *
   * @return {Point2Data} A copy of this instance.
   */
  override copy() {
    return new Point2Data(this.pos.clone());
  }

  /**
   * Returns a new Point2Data with unserialize data.
   *
   * @return {Point2Data} a new instance.
   */
  static Unserialize(data: any): Point2Data {
    let ret = new Point2Data(Vector2.Unserialize(data.pos));
    ret.uuid = data.uuid;
    return ret;
  }
}

export { Point2Data };