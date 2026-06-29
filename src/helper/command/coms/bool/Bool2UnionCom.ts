import { Bool2 } from "../../../../geometry/algorithm/relation/bool/Bool2";
import { Face2 } from "../../../../geometry/data/brep/Brep2";
import type { CommandExecuter } from "../../CommandExecuter";
import { Bool2Com } from "./Bool2Com";

/**
 * Bool 2 union command class.
 * 
 */
class Bool2UnionCom extends Bool2Com {
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
  }
  override execute(): Face2[] {
    if (this.src.length === 1 && this.des.length === 1) {
      return Bool2.Union(this.src[0], this.des[0], 1e-4, 1e-10);
    } else {
      return Bool2.Unions(this.src, this.des, 1e-4, 1e-10);
    }
  }
}
export { Bool2UnionCom };