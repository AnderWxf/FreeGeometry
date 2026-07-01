import { ComCreate } from "../ComCreate";
import type { CommandExecuter } from "../../CommandExecuter";


/**
 * Create face command class.
 * 
 */
class CreateFaceCom extends ComCreate {
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
  }
}
export { CreateFaceCom };