import { Transform3 } from "../Transform3";
import { Curve3Data } from "../Curve3Data";
import { GeomType } from "../../../../core/Constents";
/**
 * 3D line data struct.
 *
 */
class Line3Data extends Curve3Data {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_CURVE3_LINE3;
  /**
   * Constructs a new 3D Transfrom.
   *
   * @param {Transform3} [trans={position=(0,0,0),rotation=(0,0,0)}]- The transfrom value of this line curve.
   */
  constructor(trans = new Transform3()) {
    super(trans);
  }

  /**
   * Returns a new Line3Data with copied values from this instance.
   *
   * @return {Line3Data} A clone of this instance.
   */
  override clone() {
    return new Line3Data(this.trans.clone());
  }

  /**
   * Returns a new Line3Data with unserialize data.
   *
   * @return {Line3Data} a new instance.
   */
  static Unserialize(data: any): Line3Data {
    let ret = new Line3Data(Transform3.Unserialize(data.trans));
    ret.uuid = data.uuid;
    return ret;
  }
}

export { Line3Data };