import { Command } from "./Command";
import { Stack } from "../../core/Stack";
import { CreateLine2Com } from "./coms/edge/CreateLine2Com";
import { DeleteObjectsCom } from "./coms/DeleteObjectsCom";
import { CreateCircle2Com } from "./coms/edge/CreateCircle2Com";
import { CreateArc2Com } from "./coms/edge/CreateArc2Com";
import { CreateArc2ThreePointCom } from "./coms/edge/CreateArc2ThreePointCom";
import { CreateCircle2ThreePointCom } from "./coms/edge/CreateCircle2ThreePointCom";
import { ModifyLine2Com } from "./coms/edge/ModifyLine2Com";
import { ModifyCircle2Com } from "./coms/edge/ModifyCircle2Com";
import { ModifyCircle2ThreePointCom } from "./coms/edge/ModifyCircle2ThreePointCom";
import { ModifyArc2Com } from "./coms/edge/ModifyArc2Com";
import { ModifyArc2ThreePointCom } from "./coms/edge/ModifyArc2ThreePointCom";
import { ComMove } from "./coms/ComMove";
import { ComRotate } from "./coms/ComRotate";
import { ComOffset } from "./coms/ComOffset";
import { ComScale } from "./coms/ComScale";
import { ComMirror } from "./coms/ComMirror";
import { CreateEllipse2Com } from "./coms/edge/CreateEllipse2Com";
import { CreateEllipseArc2Com } from "./coms/edge/CreateEllipseArc2Com";
import { ModifyEllipse2Com } from "./coms/edge/ModifyEllipse2Com";
import { ModifyEllipseArc2Com } from "./coms/edge/ModifyEllipseArc2Com";
import { Global } from "../../core/Global";
import { Edge2 } from "../../geometry/data/brep/Brep2";
import { Curve2Type } from "../../core/Constents";
import { CreateParabola2Com } from "./coms/edge/CreateParabola2Com";
import { CreateHyperbola2Com } from "./coms/edge/CreateHyperbola2Com";
import { ModifyParabola2Com } from "./coms/edge/ModifyParabola2Com";
import { ModifyHyperbola2Com } from "./coms/edge/ModifyHyperbola2Com";
import { CreatePolyline2Com } from "./coms/edge/CreatePolyline2Com";
import { ModifyPolyline2Com } from "./coms/edge/ModifyPolyline2Com";
import { CreateRectangle2Com } from "./coms/edge/CreateRectangle2Com";
import { ModifyRectangle2Com } from "./coms/edge/ModifyRectangle2Com";
import { ComModify } from "./coms/ComModify";
import * as THREE from "three";
import { ComBatch } from "./coms/ComBatch";
import { CreateNurbs2FitCom } from "./coms/edge/CreateNurbs2FitCom";
import { CreateNurbs2CtrlCom } from "./coms/edge/CreateNurbs2CtrlCom";
import { ModifyNurbs2FitCom } from "./coms/edge/ModifyNurbs2FitCom";
import { ModifyNurbs2CtrlCom } from "./coms/edge/ModifyNurbs2CtrlCom";

/**
 * Command executer base class.
 * 
 */
class CommandExecuter {
    private _history: Stack<Command>;
    private _redos: Stack<Command>;
    private KeyShiftDown: Boolean = false;
    private KeyCtrlDown: Boolean = false;
    private _curr: Command;
    constructor() {
        this._history = new Stack<Command>();
        this._redos = new Stack<Command>();
    }
    GetExecutingObjs(): Array<THREE.Object3D> {
        let array = new Array<THREE.Object3D>();
        if (this._curr instanceof ComModify) {
            if (this._curr.old) {
                array.push(this._curr.old);
            }
        }
        if (this._curr instanceof ComBatch) {
            if (this._curr.olds.length > 0) {
                array.push(...this._curr.olds);
            }
        }
        return array;
    }
    clear() {
        this._curr = null;
    }
    isExecutingMe(curr: Command): boolean {
        return this._curr === curr;
    }
    isExecuting(): boolean {
        return this._curr != null && !this._curr.isDone && !this._curr.isCancel;
    }
    onEidtor() {
        let seleced = Global.select.selectedObjects[0];
        let original = seleced.userData.original;
        if (original instanceof Edge2) {
            let type = seleced.userData.type;
            let com: Command;
            switch (type) {
                case Curve2Type.L:        // 两点直线段
                    com = new ModifyLine2Com(this, 'L');
                    break;
                case Curve2Type.A:        // 圆弧
                    com = new ModifyArc2Com(this, 'A');
                    break;
                case Curve2Type.A3:       // 三点圆弧
                    com = new ModifyArc2ThreePointCom(this, 'A3');
                    break;
                case Curve2Type.C:        // 圆
                    com = new ModifyCircle2Com(this, 'C');
                    break;
                case Curve2Type.C3:       // 三点圆
                    com = new ModifyCircle2ThreePointCom(this, 'C3');
                    break;
                case Curve2Type.E:        // 椭圆
                    com = new ModifyEllipse2Com(this, 'E');
                    break;
                case Curve2Type.EA:       // 椭圆弧
                    com = new ModifyEllipseArc2Com(this, 'EA');
                    break;
                case Curve2Type.HY:       // 双曲线
                    com = new ModifyHyperbola2Com(this, 'HY');
                    break;
                case Curve2Type.PA:       // 抛物线
                    com = new ModifyParabola2Com(this, 'PA');
                    break;
                case Curve2Type.NUF:       // Nurbs fitting
                    com = new ModifyNurbs2FitCom(this, 'NUF');
                    break;
                case Curve2Type.NUC:       // Nurbs control
                    com = new ModifyNurbs2CtrlCom(this, 'NUC');
                    break;
                case Curve2Type.PL:       // 多段线   
                    com = new ModifyPolyline2Com(this, 'PL');
                    break;
                case Curve2Type.REC:       // 矩形   
                    com = new ModifyRectangle2Com(this, 'REC');
                    break;
            }
            if (com) {
                if (this._curr && !this._curr.isDone) {
                    this._curr.cancel();
                }
                this._curr = com;
                this._curr.exec();
            }
        }
        if (original instanceof Array) {
            let type = seleced.userData.type;
            let com: Command;
            switch (type) {
                case Curve2Type.PL:       // 多段线
                    com = new ModifyPolyline2Com(this, 'PL');
                    break;
                case Curve2Type.REC:      // REC：矩形
                    com = new ModifyRectangle2Com(this, 'REC');
                    break;
            }
            if (com) {
                if (this._curr && !this._curr.isDone) {
                    this._curr.cancel();
                }
                this._curr = com;
                this._curr.exec();
            }
        }
    }
    onKeyDown = (event: KeyboardEvent) => {
        let com: Command;
        switch (event.code) {
            case "Enter":
                const comline: HTMLElement = document.getElementById('CommandLine');
                comline.focus();
                break;
            case "Delete":
                com = new DeleteObjectsCom(this, 'Delete');
                break;
            // E：选中后编辑
            case 'KeyE':
                if (Global.select.selectedObjects.length > 0) {
                    this.onEidtor();
                }
                break;
            // I：镜像
            case 'KeyI':
                com = new ComMirror(this, 'I');
                break;
            // M：移动
            case 'KeyM':
                com = new ComMove(this, 'M');
                break;
            // R：旋转
            case 'KeyR':
                com = new ComRotate(this, 'R');
                break;
            // O：偏移
            case 'KeyO':
                com = new ComOffset(this, 'O');
                break;
            // S：拉伸
            case 'KeyS':
                com = new ComScale(this, 'S');
                break;
            // Ctrl+Z Undo Shift+Z Redo
            case "KeyZ":
                if (this.KeyCtrlDown) {
                    this.undo();
                    event.stopPropagation();
                };
                if (this.KeyShiftDown) {
                    this.redo();
                    event.stopPropagation();
                };
                break;
            case "ControlLeft":
                this.KeyCtrlDown = true;
                break;
            case "ShiftLeft":
                this.KeyShiftDown = true;
                break;
        }
        if (com) {
            if (this._curr && !this._curr.isDone) {
                this._curr.cancel();
            }
            this._curr = com;
            this._curr.exec();
        }
    }

    onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case "ControlLeft":
                this.KeyCtrlDown = false;
                break;
            case "ShiftLeft":
                this.KeyShiftDown = false;
                break;
        }
    }

    execute(comstr: string) {
        let s = comstr.split(' ');
        if (s.length) {
            let command = s[0];

            command = command.toUpperCase();
            let com: Command;
            switch (command) {
                // A：绘圆弧
                case 'A':
                    com = new CreateArc2Com(this, comstr);
                    break;
                // A3：三点绘圆弧
                case 'A3':
                    com = new CreateArc2ThreePointCom(this, comstr);
                    break;
                // C：画圆
                case 'C':
                    com = new CreateCircle2Com(this, comstr);
                    break;
                // C3：三点画圆
                case 'C3':
                    com = new CreateCircle2ThreePointCom(this, comstr);
                    break;
                case 'L':
                    com = new CreateLine2Com(this, comstr);
                    break;
                // E：绘椭圆
                case 'E':
                    com = new CreateEllipse2Com(this, comstr);
                    break;
                // EA：绘椭圆弧
                case 'EA':
                    com = new CreateEllipseArc2Com(this, comstr);
                    break;
                // HY：绘双曲线
                case 'HY':
                    com = new CreateHyperbola2Com(this, comstr);
                    break;
                // PA：绘抛物线                  
                case 'PA':
                    com = new CreateParabola2Com(this, comstr);
                    break;
                // PL：绘多段线
                case 'PL':
                    com = new CreatePolyline2Com(this, comstr);
                    break;

                // REC：绘矩形
                case 'REC':
                    com = new CreateRectangle2Com(this, comstr);
                    break;
                // NUF：绘Nurbs曲线
                case 'NUF':
                    com = new CreateNurbs2FitCom(this, comstr);
                    break;
                // NUC：绘Nurbs曲线
                case 'NUC':
                    com = new CreateNurbs2CtrlCom(this, comstr);
                    break;

                // F：倒圆角
                // G：对象组合
                // I：镜像
                case 'I':
                    com = new ComMirror(this, comstr);
                // J：对接
                // S：拉伸
                case 'S':
                    com = new ComScale(this, comstr);
                    break;
                // M：移动
                case 'M':
                    com = new ComMove(this, comstr);
                    break;
                // R：旋转
                case 'R':
                    com = new ComRotate(this, comstr);
                    break;
                // X：分解炸开
                // V：设置当前坐标
                // O：偏移
                case 'O':
                    com = new ComOffset(this, comstr);
                    break;
                // Z：缩放
                // M...: 修改
                // ML：修改直线
                case 'ML':
                    com = new ModifyLine2Com(this, comstr);
                    break;
                // MA：修改圆弧
                case 'MA':
                    com = new ModifyArc2Com(this, comstr);
                    break;
                // MA3：修改三点圆弧
                case 'MA3':
                    com = new ModifyArc2ThreePointCom(this, comstr);
                    break;
                // MC：修改圆
                case 'MC':
                    com = new ModifyCircle2Com(this, comstr);
                    break;
                // MC3：修改三点圆
                case 'MC3':
                    com = new ModifyCircle2ThreePointCom(this, comstr);
                    break;
                // ME：修改椭圆
                case 'ME':
                    com = new ModifyEllipse2Com(this, comstr);
                    break;
                // MEA：修改椭圆弧
                case 'MEA':
                    com = new ModifyEllipseArc2Com(this, comstr);
                    break;
                // MPA：绘抛物线                  
                case 'MPA':
                    com = new ModifyParabola2Com(this, comstr);
                    break;
                // MHY：双曲线
                case 'MHY':
                    com = new ModifyHyperbola2Com(this, comstr);
                    break;
                // MNUF：Nurbs拟合曲线
                case 'MNUF':       // Nurbs fitting
                    com = new ModifyNurbs2FitCom(this, 'NUF');
                    break;
                // MNUC：Nurbs控制点曲线
                case 'MNUC':       // Nurbs control
                    com = new ModifyNurbs2CtrlCom(this, 'NUC');
                    break;
                // MPL：多段线
                case 'MPL':
                    com = new ModifyPolyline2Com(this, comstr);
                    break;
                // MREC：绘矩形
                case 'MREC':
                    com = new ModifyRectangle2Com(this, comstr);
                    break;
            }
            if (com) {
                if (this._curr && !this._curr.isDone) {
                    this._curr.cancel();
                }
                this._curr = com;
                this._curr.exec();
            }
        }
    }

    bind(window: Window) {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }
    unbind(window: Window) {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }

    recored(com: Command) {
        this._history.push(com);
    }

    undo() {
        let com = this._history.pop();
        if (com) {
            com.undo();
            this._redos.push(com);
        }
    }

    redo() {
        let com = this._redos.pop();
        if (com) {
            com.redo();
            this._history.push(com);
        }
    }
}
export { CommandExecuter };