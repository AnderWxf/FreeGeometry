import { Matrix3, Vector2 } from "../../../math/Math";
import type { CommandExecuter } from "../CommandExecuter";
import { ComTransform } from "./ComTransform";

/**
 * Rotate command class.
 * 
 */
class ComRotate extends ComTransform {
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }

    // 计算变换矩阵
    makeTransfrom(begin: Vector2, end: Vector2): Matrix3 {
        let offset = new Vector2().subVectors(end, begin);
        let rotation = Math.atan2(offset.y, offset.x);
        let ret = new Matrix3();
        ret.translate(-begin.x, -begin.y);
        ret.rotate(rotation);
        ret.translate(begin.x, begin.y);
        return ret;
    }


}
export { ComRotate };