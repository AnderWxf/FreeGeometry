import { Point3 } from "./Point3";

export class Box3 {
    public min: Point3;
    public max: Point3;
    public constructor(min: Point3, max: Point3) {
        this.min = min;
        this.max = max;
    }
}