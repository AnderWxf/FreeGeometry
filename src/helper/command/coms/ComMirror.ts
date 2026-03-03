import type { Vector2 } from "../../../math/Math";
import { Command } from "../Command";

/**
 * Mirror command class.
 * 
 */
class ComMirror extends Command {
    private v: Vector2;
    override undo() { }
    override redo() { }
}
export { ComMirror };