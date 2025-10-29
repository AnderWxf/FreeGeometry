import { Vector2 } from "../../../../../math/Math";
import { Arc2Data } from "../../../../data/base/curve/curve2/Arc2Data";
import { Curve2Algo } from "../Curve2Algo";
/**
 * 2D arc algorithm.
 *
 */
class Arc2Algo extends Curve2Algo {
    /**
     * The data struct of this 2D ellipse arc algorithm.
     *
     * @type {Arc2Data}
     */
    public override dat: Arc2Data;

    /**
     * Constructs a 2D ellipse arc algorithm.
     *
     * @param {Curve2Data} [dat=Arc2Data] - The data struct of this 2D ellipse arc algorithm.
     */
    constructor(dat = new Arc2Data()) {
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
                    let ret = new Vector2(this.dat.radius.x * Math.cos(u), this.dat.radius.y * Math.sin(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 1:
                {
                    let m = this.dat.transform.makeLocalMatrix();
                    let u = t * Math.PI * 2;
                    let ret = new Vector2(-this.dat.radius.x * Math.sin(u), this.dat.radius.y * Math.cos(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 2:
                {
                    let m = this.dat.transform.makeLocalMatrix();
                    let u = t * Math.PI * 2;
                    let ret = new Vector2(-this.dat.radius.x * Math.cos(u), -this.dat.radius.y * Math.sin(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 3:
                {
                    let m = this.dat.transform.makeLocalMatrix();
                    let u = t * Math.PI * 2;
                    let ret = new Vector2(this.dat.radius.x * Math.sin(u), -this.dat.radius.y * Math.cos(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
        }
    }
}

export { Arc2Algo as EllipseArc2Algo };