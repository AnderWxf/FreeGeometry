import { DataBase } from "../DataBase";
import { Transform3 } from "./Transform3";

/**
 * 3D curvr data struct.
 * curvr has not endpoint.
 * 
 */
class Curve3Data extends DataBase {
    /**
     * The transfrom value of this Curve3Data.
     *
     * @type {Transform3}
     */
    public trans: Transform3;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Vector3} [position=(0,0,0)] - The position value of this Transfrom.
     * @param {rotation} [rotation=(0,0,0)] - The rotation value of this Transfrom.
     * @param {number} [scale=1] - The rotation value of this Transfrom.
     */
    constructor(trans = new Transform3()) {
        super();
        this.trans = trans;
    }
}

export { Curve3Data };