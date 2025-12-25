import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D Parabola curve data struct. TODO
 * 
 */
class Parabola2Data extends Curve2Data {
    /**
     * The focus distance of this Parabola curve.
     *
     * @type {number}
     */
    public f: number;

    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this Parabola curve.
     * @param {number} [f=(1)] - The focus distance of this Parabola curve.
     */
    constructor(trans = new Transform2(), f: number = 1) {
        super(trans);
        this.f = f;
    }
}

export { Parabola2Data };