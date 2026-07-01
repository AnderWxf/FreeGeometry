import type { CommandExecuter } from "../../CommandExecuter";
import { Coedge2, Edge2, Face2, Vertice2 } from "../../../../geometry/data/brep/Brep2";
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