import { Point2 } from "./Point2";

export class Box2 {
    public min: Point2;
    public max: Point2;
    public constructor(min: Point2, max: Point2) {
        this.min = min;
        this.max = max;
    }
}