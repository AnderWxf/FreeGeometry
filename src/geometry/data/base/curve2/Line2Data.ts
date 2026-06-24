import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
import { GeomType } from "../../../../core/Constents";
/**
 * 2D line data struct.
 *
 */
class Line2Data extends Curve2Data {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_CURVE2_LINE2;    
  /**
   * Constructs a new 2D Transfrom.
   *
   * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this line curve.
   */
  constructor(trans = new Transform2()) {
    super(trans);
  }

  /**
   * Returns a new Line2Data with copied values from this instance.
   *
   * @return {Line2Data} A clone of this instance.
   */
  override clone() {
    return new Line2Data(this.trans.clone());
  }
  /**
   * Returns a new Line2Data with unserialize data.
   *
   * @return {Line2Data} a new instance.
   */
  static Unserialize(data: any): Line2Data {
    let ret = new Line2Data(Transform2.Unserialize(data.trans));
    ret.uuid = data.uuid;
    return ret;
  }
}

export { Line2Data };