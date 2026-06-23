import * as THREE from "three";
import { Command } from "./Command";
import { Stack } from "../../core/Stack";
import { CreateLine2Com } from "./coms/edge/CreateLine2Com";
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
import { CommandType, GeomType } from "../../core/Constents";
import { CreateParabola2Com } from "./coms/edge/CreateParabola2Com";
import { CreateHyperbola2Com } from "./coms/edge/CreateHyperbola2Com";
import { ModifyParabola2Com } from "./coms/edge/ModifyParabola2Com";
import { ModifyHyperbola2Com } from "./coms/edge/ModifyHyperbola2Com";
import { CreatePolyline2Com } from "./coms/edge/CreatePolyline2Com";
import { ModifyPolyline2Com } from "./coms/edge/ModifyPolyline2Com";
import { CreateRectangle2Com } from "./coms/edge/CreateRectangle2Com";
import { ModifyRectangle2Com } from "./coms/edge/ModifyRectangle2Com";
import { ComModify } from "./coms/ComModify";
import { ComBatch } from "./coms/ComBatch";
import { CreateNurbs2FitCom } from "./coms/edge/CreateNurbs2FitCom";
import { CreateNurbs2CtrlCom } from "./coms/edge/CreateNurbs2CtrlCom";
import { ModifyNurbs2FitCom } from "./coms/edge/ModifyNurbs2FitCom";
import { ModifyNurbs2CtrlCom } from "./coms/edge/ModifyNurbs2CtrlCom";
import { CreateSectionCom } from "./coms/face/CreateSectionCom";
import { ComDelete } from "./coms/ComDelete";
import type { UserData } from "../UserData";
import { EdgeIntersectionCom } from "./coms/operation/EdgeIntersectionCom";
import { EdgeCuttingCom } from "./coms/operation/EdgeCuttingCom";
import { CalculateLoop2LengthCom } from "./coms/calculate/CalculateLoop2LengthCom";
import { CalculateBody3VolumeCom } from "./coms/calculate/CalculateBody3VolumeCom";
import { CalculateFace3AreaCom } from "./coms/calculate/CalculateFace3AreaCom";
import { CalculateFace2AreaCom } from "./coms/calculate/CalculateFace2AreaCom";
import { CalculateLoop3LengthCom } from "./coms/calculate/CalculateLoop3LengthCom";
import { Bool2IntersectionCom } from "./coms/bool/Bool2IntersectionCom";
import { Bool2UnionCom } from "./coms/bool/Bool2UnionCom";
import { Bool2DifferenceCom } from "./coms/bool/Bool2DifferenceCom";
import { Doc } from "../Doc";
import { SaveCom } from "./coms/scene/SaveCom";
import { LoadCom } from "./coms/scene/LoadCom";

/**
 * Command executer base class.
 * 
 */
class CommandExecuter {
  private _commands = new Map<string, Function>();
  private _history: Stack<Command>;
  private _redos: Stack<Command>;
  private KeyShiftDown: Boolean = false;
  private KeyCtrlDown: Boolean = false;
  private _curr: Command;
  constructor() {
    this._history = new Stack<Command>();
    this._redos = new Stack<Command>();
    this.InitCommand();
  }
  private InitCommand() {
    this._commands.set(CommandType.CREATE_LINE, CreateLine2Com);
    this._commands.set(CommandType.CREATE_CIRCLE, CreateCircle2Com);
    this._commands.set(CommandType.CREATE_ARC, CreateArc2Com);
    this._commands.set(CommandType.CREATE_ARC_THREE_POINT, CreateArc2ThreePointCom);
    this._commands.set(CommandType.CREATE_CIRCLE_THREE_POINT, CreateCircle2ThreePointCom);
    this._commands.set(CommandType.CREATE_ELLIPSE, CreateEllipse2Com);
    this._commands.set(CommandType.CREATE_ELLIPSE_ARC, CreateEllipseArc2Com);
    this._commands.set(CommandType.CREATE_PARABOLA, CreateParabola2Com);
    this._commands.set(CommandType.CREATE_HYPERBOLA, CreateHyperbola2Com);
    this._commands.set(CommandType.CREATE_POLYLINE, CreatePolyline2Com);
    this._commands.set(CommandType.CREATE_RECTANGLE, CreateRectangle2Com);
    this._commands.set(CommandType.CREATE_NURBS_FITTING, CreateNurbs2FitCom);
    this._commands.set(CommandType.CREATE_NURBS_CONTROL, CreateNurbs2CtrlCom);
    this._commands.set(CommandType.CREATE_SECTION, CreateSectionCom);

    this._commands.set(CommandType.MODIFY_LINE, ModifyLine2Com);
    this._commands.set(CommandType.MODIFY_CIRCLE, ModifyCircle2Com);
    this._commands.set(CommandType.MODIFY_ARC, ModifyArc2Com);
    this._commands.set(CommandType.MODIFY_ARC_THREE_POINT, ModifyArc2ThreePointCom);
    this._commands.set(CommandType.MODIFY_CIRCLE_THREE_POINT, ModifyCircle2ThreePointCom);
    this._commands.set(CommandType.MODIFY_ELLIPSE, ModifyEllipse2Com);
    this._commands.set(CommandType.MODIFY_ELLIPSE_ARC, ModifyEllipseArc2Com);
    this._commands.set(CommandType.MODIFY_PARABOLA, ModifyParabola2Com);
    this._commands.set(CommandType.MODIFY_HYPERBOLA, ModifyHyperbola2Com);
    this._commands.set(CommandType.MODIFY_POLYLINE, ModifyPolyline2Com);
    this._commands.set(CommandType.MODIFY_NURBS_FITTING, ModifyNurbs2FitCom);
    this._commands.set(CommandType.MODIFY_NURBS_CONTROL, ModifyNurbs2CtrlCom);
    this._commands.set(CommandType.MODIFY_RECTANGLE, ModifyRectangle2Com);

    this._commands.set(CommandType.CALCULATE_LENGTH_2, CalculateLoop2LengthCom);
    this._commands.set(CommandType.CALCULATE_LENGTH_3, CalculateLoop3LengthCom);
    this._commands.set(CommandType.CALCULATE_AREA_2, CalculateFace2AreaCom);
    this._commands.set(CommandType.CALCULATE_AREA_3, CalculateFace3AreaCom);
    this._commands.set(CommandType.CALCULATE_VOLUME_3, CalculateBody3VolumeCom);

    this._commands.set(CommandType.OPERATION_EDGE_INTERSECTION, EdgeIntersectionCom);
    this._commands.set(CommandType.OPERATION_EDGE_CUTTING, EdgeCuttingCom);

    this._commands.set(CommandType.BOOL_2_INTERSECTION, Bool2IntersectionCom);
    this._commands.set(CommandType.BOOL_2_UNION, Bool2UnionCom);
    this._commands.set(CommandType.BOOL_2_DIFFERENCE, Bool2DifferenceCom);

    this._commands.set(CommandType.SCENE_SAVE, SaveCom);
    this._commands.set(CommandType.SCENE_LOAD, LoadCom);

    this._commands.set(CommandType.OTHER_DELETE, ComDelete);
    this._commands.set(CommandType.OTHER_MOVE, ComMove);
    this._commands.set(CommandType.OTHER_ROTATE, ComRotate);
    this._commands.set(CommandType.OTHER_SCALE, ComScale);
    this._commands.set(CommandType.OTHER_MIRROR, ComMirror);
    this._commands.set(CommandType.OTHER_OFFSET, ComOffset);
    // this._commands.set(CommandType.OTHER_GROUP_OR_UNGROUP, ComGroup);
  }

  RegisterCommand(type: string, com: Function) {
    this._commands.set(type, com);
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
    let userData = seleced.userData as UserData;
    let type = userData.type;
    let typeName = GeomType[type] as string;
    if (typeName) {
      let command = 'M' + typeName;
      let c = this._commands.get(command) as Function;
      if (c) {
        let com: Command = new (<any>c)(this, command);
        if (this._curr && !this._curr.isDone) {
          this._curr.cancel();
        }
        this._curr = com;
        try {
          this._curr.exec();
        } catch (e: any) {
          console.error(e);
          this._curr.cancel();
        }
      }
    }
  }
  /*
  ********快捷键********
  * 'Esc'                命令取消
  * 'Enter','NumpadEnter'进入命令行,命令执行。选择结果确认。
  * 'M',                 平移
  * 'R',                 旋转
  * 'S',                 缩放
  * 'I',                 镜像，产生新对象
  * 'O',                 偏移，产生新对象
  * 'DELETE',            删除
  * 'G',                 组合
  * 'ControlLeft' + 'G', 解组
  * 'ControlLeft' + 'Z', UNDO
  * 'ControlLeft' + 'Y', REDO
  */
  onKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
    let com: Command;
    switch (event.code) {
      case "Enter":
      case "NumpadEnter":
        if (!this.isExecuting()) {
          const comline: HTMLInputElement = document.getElementById('CommandLine') as HTMLInputElement;
          comline.disabled = false;
          comline.focus();
          return;
        }
        break;
      case "Delete":
        com = new ComDelete(this, 'Delete');
        break;
      // E：选中后编辑
      case 'KeyE':
        if (Global.select.selectedObjects.length > 0) {
          this.onEidtor();
          return;
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
      // Ctrl+Z Undo
      case "KeyZ":
        if (this.KeyCtrlDown) {
          this.undo();
          return;
        };
        break;
      // Ctrl+Y Redo
      case "KeyY":
        if (this.KeyCtrlDown) {
          this.redo();
          return;
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
      try {
        this._curr.exec();
      } catch (e: any) {
        console.error(e);
        this._curr.cancel();
      }
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
      switch (command) {
        // case CommandType.SCENE_SAVE:
        //   Doc.Save();
        //   break;
        // case CommandType.SCENE_LOAD:
        //   Doc.Load();
        //   break;
        case CommandType.OTHER_UNDO:
          this.undo();
          break;
        case CommandType.OTHER_REDO:
          this.redo();
          break;
        default:
          let c = this._commands.get(command) as Function;
          if (c) {
            let com: Command = new (<any>c)(this, comstr);
            if (this._curr && !this._curr.isDone) {
              this._curr.cancel();
            }
            this._curr = com;
            try {
              this._curr.exec();
            } catch (e: any) {
              console.error(e);
              this._curr.cancel();
            }
          }
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