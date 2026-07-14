import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import type { CommandExecuter } from "../../CommandExecuter";
import { GeomType } from "../../../../core/Constents";
import { Edge2 } from "../../../../geometry/data/brep/Brep2";
import { Command } from "../../Command";
import { Edge2Algo } from "../../../../geometry/algorithm/brep/Brep2Algo";
import { ActPickObject } from "../../acts/ActPickObject";
import { Vector2 } from "../../../../math/Math";
import type { UserData } from "../../../UserData";


/**
 * Calculate point edge2 relation command class.
 * 
 */
class CalculatePointEdge2AutoCom extends Command {
  public results: Object;
  edge: Edge2;
  algo: Edge2Algo;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
  }
  async exec(): Promise<void> {

    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

    while (!this.edge) {
      let act_pick_obj = new ActPickObject();
      await act_pick_obj.execute(context);
      if (this._isCancel || act_pick_obj.isCancel) { this.cancel(); return; }

      // 只能选择二维边类型
      if (act_pick_obj.result) {
        let geo = act_pick_obj.result;
        if (geo.userData.type >= GeomType.DRAW_CURVE2_L && geo.userData.type < GeomType.DRAW_SURFACE_CI) {
          if (geo.userData.type != GeomType.DRAW_CURVE2_PO
            && geo.userData.type != GeomType.DRAW_CURVE2_RC
          ) {
            if (geo.userData.original instanceof Edge2) {
              let original = geo.userData.original as Edge2;
              this.edge = original;
            }
            if (geo.userData.original instanceof Array) {
              let original = geo.userData.original[0] as Edge2;
              this.edge = original;
            }
          }
        }
      }
    }
    this.algo = new Edge2Algo(this.edge);
    // 遍历场景中的所有孤立点
    let points: Vector2[] = [];

    let objects = Global.scene.objects;
    for (let i = 0; i < objects.length; i++) {
      let o = objects[i];
      let userData = o.userData as UserData;
      if (userData.original instanceof Vector2) {
        points.push(userData.original);
      }
    }

    let as: Object[] = [];
    let ai: Object[] = [];
    let ab: Object[] = [];
    let ao: Object[] = [];

    for (let i = 0; i < points.length; i++) {
      let point = points[i];

      let isAtSpace = this.algo.isSpacePoint(point, 1e-4, 1e-10);
      let isAtInner = this.algo.isPointAtInner(point, 1e-4, 1e-10);
      let isAtBoder = this.algo.isPointAtBoder(point, 1e-4, 1e-10);
      let isAtOn = this.algo.isPointOn(point, 1e-4, 1e-10);

      as.push({ userData: { "original": isAtSpace } });
      ai.push({ userData: { "original": isAtInner } });
      ab.push({ userData: { "original": isAtBoder } });
      ao.push({ userData: { "original": isAtOn } });
    }
    this.results = {
      as: as,
      ai: ai,
      ab: ab,
      ao: ao,
    }
    console.log(' Point edge2 relation: ', this.results);

    // 1. 将数据对象转为格式化的 JSON 字符串
    const jsonString = JSON.stringify(this.results, null, 2);

    // 2. 创建一个 Blob 对象，它就像是文件数据
    const blob = new Blob([jsonString], { type: 'application/json' });
    // 3. 为这个 Blob 创建一个临时的 URL
    const url = URL.createObjectURL(blob);
    // 4. 创建一个隐藏的 <a> 标签，并设置下载属性
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Calculate_' + new Date().toLocaleString() + '.json'; // 指定下载的文件名

    // 5. 模拟点击下载
    document.body.appendChild(link);
    link.click();

    // 6. 清理资源
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.done();
  }
}
export { CalculatePointEdge2AutoCom };