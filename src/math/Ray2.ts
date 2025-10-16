import { Point2 } from "./Point2";
import { Vector2 } from "./Vector2";
export class Ray2 {
    public origin: Point2;
    public direction: Vector2;
    public constructor(origin: Point2, direction: Vector2) {
        this.origin = origin;
        this.direction = direction;
    }
}