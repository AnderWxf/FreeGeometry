import { Vector3 } from "../../../../math/Math";
import { Transform3 } from "../Transform3";
import { SurfaceData } from "../SurfaceData";
import { GeomType } from "../../../../core/Constents";
/**
 * 3D nurbs surface data struct.
 *
 */
class NurbsSurfaceData extends SurfaceData {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_SURFACE_NURBSSURFACE;
  /**
   * The contrls points ( m x n )of this nurbs surface.
   *
   * @type {Array<Array<Vector3>>}
   */
  public controls: Array<Vector3>;

  /**
   * The u knots ( m ) of this nurbs surface.
   *
   * @type {Array<number>}
   */
  public uknots: Array<number>;

  /**
   * The v knots ( n ) of this nurbs surface.
   *
   * @type {Array<number>}
   */
  public vknots: Array<number>;

  /**
   * The weights ( m x n ) of this nurbs surface.
   *
   * @type {Array<Array<number>>}
   */
  public weights: Array<Array<number>>;

  /**
   * The u degree of this nurbs surface.
   *
   * @type {number}
   */
  public p: number;

  /**
   * The v degree of this nurbs surface.
   *
   * @type {number}
   */
  public q: number;

  /**
   * Constructs a new 3D nurbs surface.
   *
   * @param {Transform3} [trans={position=(0,0,0),rotation=(0,0,0)}]- The transfrom value of this nurbs surface.
   * @param {Array<Array<Vector3>>} [controls=null] - The controls points of this nurbs surface.
   * @param {Array<number>} [uknots=null] - The u knots of this nurbs surface.
   * @param {Array<number>} [vknots=null] - The v knots of this nurbs surface.
   * @param {Array<Array<number>>} [weights=null] - The weights of this nurbs surface.
   * @param {number} [p=3] - The u degree of this nurbs surface.
   * @param {number} [q=3] - The v degree of this nurbs surface.
   */
  constructor(trans = new Transform3(), controls = new Array<Vector3>(), uknots = new Array<number>(), vknots = new Array<number>(), weights = new Array<Array<number>>(), p = 3, q = 3) {
    super(trans);
    this.controls = controls;
    this.uknots = uknots;
    this.vknots = vknots;
    this.weights = weights;
    this.p = p;
    this.q = q;
  }

  /**
   * Returns a new NurbsSurfaceData with unserialize data.
   *
   * @return {NurbsSurfaceData} a new instance.
   */
  static Unserialize(data: any): NurbsSurfaceData {
    let controls = data.controls as [any];
    let vs: Vector3[] = [];
    for (let i = 0; i < controls.length; i++) {
      let v = new Vector3(controls[i].x, controls[i].y, controls[i].z);
      vs.push(v);
    }
    let ret = new NurbsSurfaceData(Transform3.Unserialize(data.trans), vs, data.uknots, data.vknots, data.weights, data.p, data.q);
    ret.uuid = data.uuid;
    return ret;
  }
}

export { NurbsSurfaceData };