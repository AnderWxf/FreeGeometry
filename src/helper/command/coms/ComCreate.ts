import { Command } from "../Command";
import type { CommandExecuter } from "../CommandExecuter";

/**
 * Create command class.
 * 
 */
class ComCreate extends Command {
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
}
export { ComCreate };