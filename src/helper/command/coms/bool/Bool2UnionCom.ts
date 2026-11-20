import type { Digraph2Algo } from "../../../../geometry/algorithm/brep/Brep2Algo";
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

  // 测试用，执行到有向图后，构件面之前终止，并返回。
  executeDigraph2(): Digraph2Algo {
    if (this.src.length === 1 && this.des.length === 1) {
      return Bool2.UnionGraph(this.src[0], this.des[0], 1e-4, 1e-10);
    } else {
      return Bool2.UnionsGraph(this.src, this.des, 1e-4, 1e-10);
    }
  }

}
export { Bool2UnionCom };