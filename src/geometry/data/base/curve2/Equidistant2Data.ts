import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
import { GeomType } from "../../../../core/Constents";
import { unserialize } from "../Unserialize";
/**
 * 2D equidistant curve data struct.
 */
class Equidistant2Data extends Curve2Data {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private readonly type = GeomType.DATA_TYPE_CURVE2_Equidistant2;
  private readonly typename = GeomType[GeomType.DATA_TYPE_CURVE2_Equidistant2];

  /**
   * The c curve of this Equidistant2Data.
   *
   * @type {Curve2Data}
   */
  public c: Curve2Data;

  /**
   * The d value of this Equidistant2Data.
   *
   * @type {number}
   */
  public d: number;

  /**
   * Constructs a new 2D Transfrom.
   *
   * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this arc.
   * @param {Curve2Data} [c] - The r curve of this Equidistant2Data.
   * @param {Vector2} [d=1] - The d value of this Equidistant2Data.
   */
  constructor(trans = new Transform2(), c = new Curve2Data(), d = 1) {
    super(trans);
    this.c = c;
    this.d = d;
  }
  /**
   * Returns a new Equidistant2Data with clone values from this instance.
   *
   * @return {Equidistant2Data} A clone of this instance.
   */
  override clone() {
    let result = super.clone() as Equidistant2Data;
    result.trans = this.trans.clone();
    result.c = this.c.clone();
    result.d = this.d;
    return result;
  }

  /**
   * Returns a new Equidistant2Data with copied values from this instance.
   *
   * @return {Equidistant2Data} A copy of this instance.
   */
  override copy() {
    return new Equidistant2Data(this.trans.clone(), this.c.clone(), this.d);
  }

  /**
   * Returns a new Equidistant2Data with unserialize data.
   *
   * @return {Equidistant2Data} a new instance.
   */
  static Unserialize(data: any): Equidistant2Data {
    let ret = new Equidistant2Data(Transform2.Unserialize(data.trans), unserialize(data)[0] as Curve2Data, data.d);
    ret.uuid = data.uuid;
    return ret;
  }
}

export { Equidistant2Data };