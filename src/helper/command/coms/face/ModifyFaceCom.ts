import type { CommandExecuter } from "../../CommandExecuter";
import { ComModify } from "../ComModify";


/**
 * Modify face command class.
 * 
 */
class ModifyFaceCom extends ComModify {
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
  }
}
export { ModifyFaceCom };