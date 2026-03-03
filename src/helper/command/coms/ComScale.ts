import type { Vector2 } from "../../../math/Math";
import { Command } from "../Command";

/**
 * Scale command class.
 * 
 */
class ComScale extends Command {
    private v: Vector2;
    override undo() { }
    override redo() { }
}
export { ComScale };