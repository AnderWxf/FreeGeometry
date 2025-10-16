export class Point2 {
    public x: number;
    public y: number;
    public constructor(x?: number, y?: number) {
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
    }
}