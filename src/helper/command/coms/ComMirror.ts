import { Global } from "../../../core/Global";
import { Matrix3, Vector2 } from "../../../math/Math";
import type { CommandExecuter } from "../CommandExecuter";
import { ComTransform } from "./ComTransform";

/**
 * Mirror command class.
 * 
 */
class ComMirror extends ComTransform {
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
        this.isDeleteOld = false;
    }

    // 计算变换矩阵
    override makeTransfrom(begin: Vector2, end: Vector2): Matrix3 {
        let o = begin;
        let yAxis = new Vector2().subVectors(end, begin);
        yAxis.normalize();
        let xAxis = yAxis.clone();
        xAxis.rotateAround(new Vector2(), -Math.PI * 0.5);
        let t = new Matrix3();
        t.set(
            xAxis.x, yAxis.x, o.x,
            xAxis.y, yAxis.y, o.y,
            0, 0, 1,
        );
        let ti = t.clone().invert();

        let result = new Matrix3();
        result.premultiply(ti);
        result.scale(-1, 1);
        result.premultiply(t);
        return result;
    }
}
export { ComMirror };