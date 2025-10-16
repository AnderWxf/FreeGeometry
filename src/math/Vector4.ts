export class Vector4 {
    public x: number;
    public y: number;
    public z: number;
    public w: number;
    public constructor(x?: number, y?: number, z?: number, w?: number) {
        if (x != undefined) {
            this.x = x;
        } else {
            this.x = 0;
        }
        if (y != undefined) {
            this.y = y;
        } else {
            this.y = 0;
        }
        if (z != undefined) {
            this.z = z;
        } else {
            this.z = 0;
        }
        if (w != undefined) {
            this.w = w;
        } else {
            this.w = 0;
        }
    }
}