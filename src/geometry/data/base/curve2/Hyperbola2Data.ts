import { Vector2 } from "../../../../math/Math";
import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
import { GeomType } from "../../../../core/Constents";
/**
 * 2D hyperbola data struct. 
 *
 */
class Hyperbola2Data extends Curve2Data {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_CURVE2_HYPERBOLA2;  
  /**
   * The radius value of this Hyperbola2Data.
   *
   * @type {Vector2}
   */
  public radius: Vector2;

  /**
   * Constructs a new 2D Transfrom.
   *
   * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this Hyperbola.
   * @param {Vector2} [radius=(1,1)] - The radius value of this Hyperbola.
   */
  constructor(trans = new Transform2(), radius = new Vector2(1, 1)) {
    super(trans);
    this.radius = radius;
  }

  /**
   * Returns a new Hyperbola2Data with copied values from this instance.
   *
   * @return {Hyperbola2Data} A clone of this instance.
   */
  override clone() {
    return new Hyperbola2Data(this.trans.clone(), this.radius.clone());
  }

  /**
   * Returns a new Hyperbola2Data with unserialize data.
   *
   * @return {Hyperbola2Data} a new instance.
   */
  static Unserialize(data: any): Hyperbola2Data {
    let ret = new Hyperbola2Data(Transform2.Unserialize(data.trans), Vector2.Unserialize(data.radius));
    ret.uuid = data.uuid;
    return ret;
  }
}

export { Hyperbola2Data };