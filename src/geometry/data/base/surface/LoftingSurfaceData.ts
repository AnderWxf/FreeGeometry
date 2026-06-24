import { GeomType } from "../../../../core/Constents";
import type { Curve2Data } from "../Curve2Data";
import type { Curve3Data } from "../Curve3Data";
import { SurfaceData } from "../SurfaceData";
import { Transform3 } from "../Transform3";
import { unserialize } from "../Unserialize";

/**
 * Lofting surface data struct.
 * At sections.t of path use sections.c.
 * sections.t ∈ [0,1]
 */
class LoftingSurfaceData extends SurfaceData {
  /**
   * The type of data for unserialize.
   *
   * @type {number}
   */
  private type = GeomType.DATA_TYPE_SURFACE_LOFTINGSURFACE;
  /**
   * The section curve and t parameter of this Lofting surface.
   *
   * @type {t:number,c:Curve2Data}
   */
  public sections: Array<{ t: number, c: Curve2Data }>;

  /**
   * The path curve of this Lofting surface.
   *
   * @type {Curve3Data}
   */
  public path: Curve3Data;

  /**
   * Constructs a plane surface.
   *
   * @param {Transform3} [trans] - The base transfrom of surface.
   * @param {Array<{ t:number,c:Curve2Data }>} [sections] - The section curve of this Lofting surface.
   * @param {Curve3Data} [path] - The path curve of this Lofting surface.* 
   */
  constructor(trans = new Transform3(), sections: Array<{ t: number, c: Curve2Data }>, path: Curve3Data) {
    super(trans);
    this.sections = sections;
    this.path = path;
  }

  /**
   * Returns a new LoftingSurfaceData with unserialize data.
   *
   * @return {LoftingSurfaceData} a new instance.
   */
  static Unserialize(data: any): LoftingSurfaceData {
    let sections = data.sections as [any];
    let secs = new Array<{ t: number, c: Curve2Data }>;
    for (let i = 0; i < sections.length; i++) {
      secs.push({ t: sections[i].t, c: unserialize(sections[i].c) as Curve2Data });
    }
    let ret = new LoftingSurfaceData(Transform3.Unserialize(data.trans), secs, unserialize(data.path) as Curve3Data);
    ret.uuid = data.uuid;
    return ret;
  }
}

export { LoftingSurfaceData };