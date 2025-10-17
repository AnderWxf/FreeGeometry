import { Matrix3, Vector2 } from "../../../math/Math";
/**
 * 2D translation transform class.
 *
 */
class Transform2 {
    /**
     * The position value of this Transfrom2.
     *
     * @type {Vector2}
     */
    public position: Vector2;

    /**
     * The rotation value of this Transfrom2.
     *
     * @type {number}
     */
    public rotation: number;

    /**
     * The parent transfrom of this Transfrom2.
     *
     * @type {Transform2}
     */
    public parent: Transform2;

    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Vector2} [position=(0,0)] - The position value of this Transfrom.
     * @param {number} [rotation=0] - The rotation value of this Transfrom.
     * @param {Transform2} [parent=null] - The parent transfrom of this Transfrom.
     */
    constructor(position = new Vector2(), rotation = 0, parent?: Transform2) {
        /**
         * The position value of this Transfrom2.
         *
         * @type {Vector2}
         */
        this.position = position;

        /**
         * The rotation value of this Transfrom2.
         *
         * @type {number}
         */
        this.rotation = rotation;

        /**
         * The parent transfrom of this Transfrom2.
         *
         * @type {Transform2}
         */
        this.parent = parent;
    }
    /**
     * comput local matrix as a 2D translation transform.
     *
     * @return {Matrix3} A reference to this matrix.
     */
    makeLocalMatrix() {
        let ret = new Matrix3();
        const c = Math.cos(this.rotation);
        const s = Math.sin(this.rotation);
        const n = -s;
        const x = this.position.x;
        const y = this.position.y;
        ret.set(
            c, n, x,
            s, c, y,
            0, 0, 1
        );
        return ret;
    }
    /**
     * comput world matrix as a 2D translation transform.
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
export { Transform2 };