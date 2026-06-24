import { Vector4 } from "../../../../math/Math";
import { Transform3 } from "../Transform3";
import { Curve3Data } from "../Curve3Data";
import { GeomType } from "../../../../core/Constents";
/**
 * 3D nurbs data struct.
 *
 */
class Nurbs3Data extends Curve3Data {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_CURVE3_NURBS3;
  /**
   * The contrls points of this Nurbs3Data.
   * use Vector4 to include weight info (w is weight)
   * @type {Array<Vector4>}
   */
  public controls: Array<Vector4>;

  /**
   * The knots of this Nurbs3Data.
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
   * Constructs a new 3D Transfrom.
   *
   * @param {Transform3} [trans={position=(0,0,0),rotation=(0,0,0)}]- The transfrom value of this nurbs.
   * @param {Array<Vector3>} [controls=null] - The controls points of this nurbs.
   * @param {Array<number>} [knots=null] - The knots of this nurbs.
   * @param {number} [degree=3] - The degree of this nurbs.
   */
  constructor(trans = new Transform3(), controls = new Array<Vector4>(), knots = new Array<number>(), degree = 3) {
    super(trans);
    this.controls = controls;
    this.knots = knots;
    this.degree = degree;
  }

  /**
   * Returns a new Nurbs3Data with copied values from this instance.
   *
   * @return {Nurbs3Data} A clone of this instance.
   */
  override clone() {
    let controls = new Array<Vector4>();
    let knots = new Array<number>();
    for (let i = 0; i < this.controls.length; i++) {
      controls.push(this.controls[i].clone());
    }
    knots.push(...this.knots);
    return new Nurbs3Data(this.trans.clone(), controls, knots, this.degree);
  }

  /**
   * Returns a new Nurbs3Data with unserialize data.
   *
   * @return {Nurbs3Data} a new instance.
   */
  static Unserialize(data: any): Nurbs3Data {
    let controls = data.controls as [any];
    let vs: Vector4[] = [];
    for (let i = 0; i < controls.length; i++) {
      let v = new Vector4(controls[i].x, controls[i].y, controls[i].z, controls[i].w);
      vs.push(v);
    }
    let ret = new Nurbs3Data(Transform3.Unserialize(data.trans), vs, data.knots, data.degree);
    ret.uuid = data.uuid;
    return ret;
  }
}

export { Nurbs3Data };