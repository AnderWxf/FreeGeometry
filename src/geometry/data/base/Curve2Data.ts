import { DataBase } from "../DataBase";
import { Transform2 } from "./Transform2";

/**
 * 2D curvr data struct.
 * curvr has not endpoint.
 * 
 */
class Curve2Data extends DataBase {
    /**
     * The transfrom value of this Curve2Data.
     *
     * @type {Transform2}
     */
    public trans: Transform2;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Vector2} [position=(0,0)] - The position value of this Transfrom.
     * @param {number} [rotation=(0)] - The rotation value of this Transfrom.
     * @param {number} [scale=1] - The rotation value of this Transfrom.
     */
    constructor(trans = new Transform2()) {
        super();
        this.trans = trans;
    }
    /**
     * Returns a new Curve2Data with copied values from this instance.
     *
     * @return {Curve2Data} A clone of this instance.
     */
    override clone() {
        return new Curve2Data(this.trans.clone());
    }
}

export { Curve2Data };