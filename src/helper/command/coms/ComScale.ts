import type { Transform2 } from "../../../geometry/data/base/Transform2";
import { Matrix3, Vector2 } from "../../../math/Math";
import type { CommandExecuter } from "../CommandExecuter";
import { ComTransform } from "./ComTransform";

/**
 * Scale command class.
 * 
 */
class ComScale extends ComTransform {
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    // 计算变换矩阵
    override makeTransfrom(begin: Vector2, end: Vector2): Matrix3 {
        let offset = new Vector2().subVectors(end, begin).multiplyScalar(0.2);
        let ret = new Matrix3();
        ret.translate(-begin.x, -begin.y);
        ret.scale(offset.x, offset.y);
        ret.translate(begin.x, begin.y);
        return ret;
    }
}
export { ComScale };