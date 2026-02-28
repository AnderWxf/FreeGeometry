import type { Matrix3, Matrix4 } from "../../../math/Math";
import { Command } from "../Command";

/**
 * Transform command class.
 * 
 */
class ComTransform extends Command {
    private m: Matrix3 | Matrix4;
    override undo() { }
    override redo() { }
}
export { ComTransform };