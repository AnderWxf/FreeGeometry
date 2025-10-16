import { Point3 } from "./Point3";
import { Vector3 } from "./Vector3";
export class Ray2 {
    public origin: Point3;
    public direction: Vector3;
    public constructor(origin: Point3, direction: Vector3) {
        this.origin = origin;
        this.direction = direction;
    }
}