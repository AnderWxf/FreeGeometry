import { CurveData } from "../../data/base/CurveData";

/**
 * curvr algorithm.
 *
 */
class CurveAlgo {
    /**
     * The data struct of this curvr algorithm.
     *
     * @type {CurveData}
     */
    public dat: CurveData;

    /**
     * Constructs a curvr algorithm.
     *
     * @param {CurveData} [dat=CurveData] - The data struct of this curvr algorithm.
     */
    constructor(dat = new CurveData()) {
        this.dat = dat;
        this.dat = dat;
    }
}

export { CurveAlgo };