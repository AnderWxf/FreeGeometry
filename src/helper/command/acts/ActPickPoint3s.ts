import type { Vector3 } from "../../../math/Math";
import { Active } from "../Active";

/**
 * ActPickPoint3s base class.
 * 
 */
class ActPickPoint3s extends Active {
    results: Array<Vector3>;
}
export { ActPickPoint3s };