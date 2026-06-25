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
   * 2D curve in uv space of surface.
   *
   * @type {Curve2Data}
   */
  public curve: Curve2Data;

  /**
   * The surface of this UvCurveData.
   * this is base surface in xyz space.
   *
   * @type {SurfaceData}
   */
  public surface: SurfaceData;

  /**
   * Constructs a new 3D Transfrom.
   *
   * @param {Curve2Data} [curve] - The curve of this UvCurveData.
   * @param {SurfaceData} [surface] - The surface of this UvCurveData.
   */
  constructor(curve: Curve2Data, surface: SurfaceData) {
    super(surface.trans);
    this.curve = curve;
    this.surface = surface;
  }

  /**
   * Returns a new UvCurveData with copied values from this instance.
   *
   * @return {UvCurveData} A clone of this instance.
   */
  override clone() {
    return new UvCurveData(this.curve.clone(), this.surface.clone());
  }

  /**
   * Returns a new UvCurveData with unserialize data.
   *
   * @return {UvCurveData} a new instance.
   */
  static Unserialize(data: any): UvCurveData {
    let ret = new UvCurveData(unserialize(data.curve)[0] as Curve2Data, unserialize(data.surface)[0] as SurfaceData);
    ret.uuid = data.uuid;
    return ret;
  }
}

export { UvCurveData };