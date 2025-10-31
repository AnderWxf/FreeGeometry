import { Transform2 } from "./Transform2";

/**
 * 2D curvr data struct.
 * curvr has not endpoint.
 * 
 */
class Curve2Data {
    /**
     * The transfrom value of this Curve2Data.
     *
     * @type {Transform2}
     */
    public trans: Transform2;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Vector3} [position=(0,0,0)] - The position value of this Transfrom.
     * @param {rotation} [rotation=(0,0,0)] - The rotation value of this Transfrom.
     * @param {number} [scale=1] - The rotation value of this Transfrom.
     */
    constructor(trans = new Transform2()) {
        this.trans = trans;
    }
}

export { Curve2Data };