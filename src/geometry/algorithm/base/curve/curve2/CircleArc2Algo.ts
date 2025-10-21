import { Vector2 } from "../../../../../math/Math";
import { CircleArc2Data } from "../../../../data/base/curve/curve2/CircleArc2Data";
import { Curve2Algo } from "../Curve2Algo";
/**
 * 2D circle arc algorithm.
 *
 */
class CircleArc2Algo extends Curve2Algo {
    /**
     * The data struct of this 2D circle arc algorithm.
     *
     * @type {CircleArc2Data}
     */
    public override dat: CircleArc2Data;

    /**
     * Constructs a 2D circle arc algorithm.
     *
     * @param {Curve2Data} [dat=CircleArc2Data] - The data struct of this 2D circle arc algorithm.
     */
    constructor(dat = new CircleArc2Data()) {
        super(dat);
        this.dat = dat;
    }

    /**
     * get r-order derivative at t of curve.
     *
     * @retun {Vector2}
     */
    override derivative(t: number, r: number = 0): Vector2 {
        switch (r % 4) {
            case 0:
                {
                    let m = this.dat.transform.makeLocalMatrix();
                    let u = t * Math.PI * 2;
                    let ret = new Vector2(this.dat.radius * Math.cos(u), this.dat.radius * Math.sin(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 1:
                {
                    let m = this.dat.transform.makeLocalMatrix();
                    let u = t * Math.PI * 2;
                    let ret = new Vector2(-this.dat.radius * Math.sin(u), this.dat.radius * Math.cos(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 2:
                {
                    let m = this.dat.transform.makeLocalMatrix();
                    let u = t * Math.PI * 2;
                    let ret = new Vector2(-this.dat.radius * Math.cos(u), -this.dat.radius * Math.sin(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 3:
                {
                    let m = this.dat.transform.makeLocalMatrix();
                    let u = t * Math.PI * 2;
                    let ret = new Vector2(this.dat.radius * Math.sin(u), -this.dat.radius * Math.cos(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
        }
    }
}

export { CircleArc2Algo };