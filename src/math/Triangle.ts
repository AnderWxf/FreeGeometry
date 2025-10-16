import { Point3 } from "./Point3";
export class Triangle {
    public a: Point3;
    public b: Point3;
    public c: Point3;
    public constructor(a: Point3, b: Point3, c: Point3) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
}