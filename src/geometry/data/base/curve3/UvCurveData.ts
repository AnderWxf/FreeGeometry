import { Curve3Data } from "../Curve3Data";
import { Curve2Data } from "../Curve2Data";
import { SurfaceData } from "../SurfaceData";
import { unserialize } from "../Unserialize";
import { GeomType } from "../../../../core/Constents";

/**
 * 3D curve generated with 2D curve in uv space of surface data struct.
 *
 */
class UvCurveData extends Curve3Data {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_CURVE3_UVCURVE;
  /**
   * The 2d curve of this UvCurveData.
   * 2D curve in uv space of s1.
   *
   * @type {Curve2Data}
   */
  public c: Curve2Data;

  /**
   * The surface1 of this UvCurveData.
   * this is base surface in xyz space.
   *
   * @type {SurfaceData}
   */
  public s1: SurfaceData;

  /**
   * The surface2 of this UvCurveData.
   * this is base surface in xyz space.
   *
   * @type {SurfaceData}
   */
  public s2: SurfaceData;

  /**
   * Constructs a new 3D Transfrom.
   *
   * @param {Curve2Data} [curve] - The curve of this UvCurveData.
   * @param {SurfaceData} [surface1] - The surface1 of this UvCurveData.
   * @param {SurfaceData} [surface2] - The surface2 of this UvCurveData.
   */
  constructor(curve: Curve2Data, surface1: SurfaceData, surface2: SurfaceData) {
    super(surface1.trans);
    this.c = curve;
    this.s1 = surface1;
    this.s2 = surface2;
  }

  /**
   * Returns a new UvCurveData with copied values from this instance.
   *
   * @return {UvCurveData} A clone of this instance.
   */
  override clone() {
    return new UvCurveData(this.c.clone(), this.s1.clone(), this.s2.clone());
  }

  /**
   * Returns a new UvCurveData with unserialize data.
   *
   * @return {UvCurveData} a new instance.
   */
  static Unserialize(data: any): UvCurveData {
    let ret = new UvCurveData(unserialize(data.c)[0] as Curve2Data, unserialize(data.s1)[0] as SurfaceData, unserialize(data.s2)[0] as SurfaceData);
    ret.uuid = data.uuid;
    return ret;
  }
}

export { UvCurveData };