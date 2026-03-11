import { Global } from "../../../core/Global";
import { Matrix3, Vector2 } from "../../../math/Math";
import type { CommandExecuter } from "../CommandExecuter";
import { ComTransform } from "./ComTransform";

/**
 * Offset command class.
 * 
 */
class ComOffset extends ComTransform {
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
        this.isDeleteOld = false;
    }

    // 计算变换矩阵
    makeTransfrom(begin: Vector2, end: Vector2): Matrix3 {
        let ret = new Matrix3();
        ret.makeTranslation(end.clone().sub(begin), null)
        return ret;
    }
}
export { ComOffset };