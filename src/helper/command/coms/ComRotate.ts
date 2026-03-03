import type { Vector2 } from "../../../math/Math";
import { Command } from "../Command";

/**
 * Rotate command class.
 * 
 */
class ComRotate extends Command {
    private v: Vector2;
    override undo() { }
    override redo() { }
}
export { ComRotate };