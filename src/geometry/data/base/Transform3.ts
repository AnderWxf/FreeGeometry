import { Euler, Matrix4, Vector3 } from "../../../math/Math";

/**
 * 3D translation transfrom =.
 *
 */
class Transform3 {
    /**
     * The position value of this Transform3.
     *
     * @type {Vector3}
     */
    public pos: Vector3;

    /**
     * The rotation value of this Transform3.
     *
     * @type {Euler}
     */
    public rot: Euler;

    /**
     * The parent transfrom of this Transform3.
     *
     * @type {Transform3}
     */
    public parent: Transform3;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Vector3} [position=(0,0,0)] - The position value of this Transfrom.
     * @param {rotation} [rotation=(0,0,0)] - The rotation value of this Transfrom.
     * @param {Transform3} [parent=null] - The parent transfrom of this Transfrom.
     */
    constructor(position = new Vector3(), rotation = new Euler(), parent?: Transform3) {
        /**
         * The position value of this Transform3.
         *
         * @type {Vector3}
         */
        this.pos = position;

        /**
         * The rotation value of this Transform3.
         *
         * @type {Euler}
         */
        this.rot = rotation;

        /**
         * The parent transfrom of this Transform3.
         *
         * @type {Transform3}
         */
        this.parent = parent;
    }
    /**
     * Sets matrix as a 3D translation trans.
     *
     * @return {Matrix4} A reference to this matrix.
     */
    makeLocalMatrix() {
        let ret = new Matrix4();
        ret.makeRotationFromEuler(this.rot);
        ret.elements[3] = this.pos.x;
        ret.elements[7] = this.pos.y;
        ret.elements[11] = this.pos.z;
        return ret;
    }

    /**
     * comput world matrix as a 3D translation trans.
     *
     * @return {Matrix3} A reference to this matrix.
     */
    makeWorldMatrix() {
        let matrix = this.makeLocalMatrix();
        if (this.parent) {
            let world = this.parent.makeLocalMatrix();
            matrix.multiply(world);
        }
        return matrix;
    }
}
export { Transform3 };