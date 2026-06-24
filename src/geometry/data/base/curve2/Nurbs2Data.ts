import { Vector3, type Vector2 } from "../../../../math/Math";
import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
import { GeomType } from "../../../../core/Constents";
/**
 * 2D nurbs data struct.
 *
 */
class Nurbs2Data extends Curve2Data {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_CURVE2_NURBS2;
  /**
   * The contrls points of this Nurbs2Data.
   * use Vector3 to include weight info (z is weight)
   * @type {Array<Vector3>}
   */
  public controls: Array<Vector3>;

  /**
   * The knots of this Nurbs2Data.
   *
   * @type {Array<number>}
   */
  public knots: Array<number>;


  /**
   * The degree of this Nurbs2Data.
   *
   * @type {number}
   */
  public degree: number;

  /**
   * Constructs a new 2D Transfrom.
   *
   * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this nurbs.
   * @param {Array<Vector3>} [controls=null] - The controls points of this nurbs.
   * @param {Array<number>} [knots=null] - The knots of this nurbs.
   * @param {number} [degree=3] - The degree of this nurbs.
   */
  constructor(trans = new Transform2(), controls = new Array<Vector3>(), knots = new Array<number>(), degree = 3) {
    super(trans);
    this.controls = controls;
    this.knots = knots;
    this.degree = degree;
  }

  /**
   * Returns a new Nurbs2Data with copied values from this instance.
   *
   * @return {Nurbs2Data} A clone of this instance.
   */
  override clone() {
    let controls = new Array<Vector3>();
    let knots = new Array<number>();
    for (let i = 0; i < this.controls.length; i++) {
      controls.push(this.controls[i].clone());
    }
    knots.push(...this.knots);
    return new Nurbs2Data(this.trans.clone(), controls, knots, this.degree);
  }

  /**
   * Returns a new Nurbs2Data with unserialize data.
   *
   * @return {Nurbs2Data} a new instance.
   */
  static Unserialize(data: any): Nurbs2Data {
    let controls = data.controls as [any];
    let vs: Vector3[] = [];
    for (let i = 0; i < controls.length; i++) {
      let v = new Vector3(controls[i].x, controls[i].y, controls[i].z);
      vs.push(v);
    }
    let ret = new Nurbs2Data(Transform2.Unserialize(data.trans), vs, data.knots, data.degree);
    ret.uuid = data.uuid;
    return ret;
  }
}

export { Nurbs2Data };