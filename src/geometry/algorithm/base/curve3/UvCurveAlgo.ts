import { Vector3 } from "../../../../math/Math";
import { UvCurveData } from "../../../data/base/curve3/UvCurveData";
import { CurveBuilder } from "../../builder/CurveBuilder";
import { SurfaceBulder } from "../../builder/SurfaceBulder";
import { Curve2Algo } from "../Curve2Algo";
import { Curve3Algo } from "../Curve3Algo";
import { SurfaceAlgo } from "../SurfaceAlgo";
/**
 * uv curve algorithm.
 *
 */
class UvCurveAlgo extends Curve3Algo {
  /**
   * The data struct of this 3D ellipse arc algorithm.
   *
   * @type {UvCurveData}
   */
  protected _dat: UvCurveData;
  public get dat(): UvCurveData {
    return this._dat;
  }

  /**
 * The 2d curve algorithm of this UvCurveData.
 * 2D curve in uv space of surface1.
 *
 * @type {Curve2Data}
 */
  protected cAlgo: Curve2Algo;

  /**
   * The surface algorithm of this UvCurveData.
   * this is base surface in xyz space.
   *
   * @type {SurfaceAlgo}
   */
  protected s1Algo: SurfaceAlgo;

  /**
   * The surface algorithm of this UvCurveData.
   * this is base surface in xyz space.
   *
   * @type {SurfaceAlgo}
   */
  protected s2Algo: SurfaceAlgo;

  /**
   * Constructs a 3D ellipse arc algorithm.
   *
   * @param {Curve3Data} [dat=UvCurveData] - The data struct of this 3D ellipse arc algorithm.
   */
  constructor(dat: UvCurveData) {
    super(dat);
    this._dat = dat;
    this.cAlgo = CurveBuilder.Algorithm2ByData(dat.c);
    this.s1Algo = SurfaceBulder.AlgorithmByData(dat.s1);
    this.s2Algo = SurfaceBulder.AlgorithmByData(dat.s2);
  }

  /**
   * the D(derivative) function return r-order derivative vector at u parameter.
   * @param {number} [u ∈ [0,a]] - the u parameter of curve.
   * @param {number} [r ∈ [0,1,3...]] - r-order.
   * @retun {Vector3}
   */
  override d(u: number, r: number = 0): Vector3 {
    debugger;
    return null;
  }
}

export { UvCurveAlgo };