import type { Vector2 } from "../../../math/Math";
import { Command } from "../Command";

/**
 * Move command class.
 * 
 */
class ComMove extends Command {
    private v: Vector2;
    override undo() { }
    override redo() { }
}
export { ComMove };