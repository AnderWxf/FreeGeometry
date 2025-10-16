export class Euler {
    public x: number;
    public y: number;
    public z: number;
    public constructor(x?: number, y?: number, z?: number) {
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
    }
}