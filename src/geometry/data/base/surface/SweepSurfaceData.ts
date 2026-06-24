import { GeomType } from "../../../../core/Constents";
import type { Curve2Data } from "../Curve2Data";
import type { Curve3Data } from "../Curve3Data";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";
import { unserialize } from "../Unserialize";

/**
 * Sweep surface data struct.
 *
 */
class SweepSurfaceData extends SurfaceData {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_SURFACE_SWEEPSURFACE;
  /**
   * The section curve of this Sweep surface.
   *
   * @type {Curve2Data}
   */
  public section: Curve2Data;

  /**
   * The path curve of this Sweep surface.
   *
   * @type {Curve3Data}
   */
  public path: Curve3Data;

  /**
   * Constructs a plane surface.
   *
   * @param {Transform3} [trans] - The base transfrom of surface.
   * @param {Curve2Data} [section] - The ection curve of this Sweep surface.
   * @param {Curve3Data} [path] - The path curve of this Sweep surface. 
   */
  constructor(trans = new Transform3(), section: Curve2Data, path: Curve3Data) {
    super(trans);
    this.section = section;
    this.path = path;
  }

  /**
   * Returns a new SweepSurfaceData with unserialize data.
   *
   * @return {SweepSurfaceData} a new instance.
   */
  static Unserialize(data: any): SweepSurfaceData {
    let ret = new SweepSurfaceData(Transform3.Unserialize(data.trans), unserialize(data.section) as Curve2Data, unserialize(data.path) as Curve3Data);
    ret.uuid = data.uuid;
    return ret;
  }
}

export { SweepSurfaceData };