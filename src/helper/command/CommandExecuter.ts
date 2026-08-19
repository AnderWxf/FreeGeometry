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
import { ComMove } from "./coms/transform/ComMove";
import { ComRotate } from "./coms/transform/ComRotate";
import { ComOffset } from "./coms/transform/ComOffset";
import { ComScale } from "./coms/transform/ComScale";
import { ComMirror } from "./coms/transform/ComMirror";
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
import { ComDelete } from "./coms/other/ComDelete";
import type { UserData } from "../UserData";
import { EdgeIntersectionCom } from "./coms/operation/EdgeIntersectionCom";
import { EdgeCuttingCom } from "./coms/operation/EdgeCuttingCom";
import { MeasureLoop2LengthCom } from "./coms/measure/MeasureLoop2LengthCom";
import { MeasureBody3VolumeCom } from "./coms/measure/MeasureBody3VolumeCom";
import { MeasureFace3AreaCom } from "./coms/measure/MeasureFace3AreaCom";
import { MeasureFace2AreaCom } from "./coms/measure/MeasureFace2AreaCom";
import { MeasureLoop3LengthCom } from "./coms/measure/MeasureLoop3LengthCom";
import { Bool2IntersectionCom } from "./coms/bool/Bool2IntersectionCom";
import { Bool2UnionCom } from "./coms/bool/Bool2UnionCom";
import { Bool2DifferenceCom } from "./coms/bool/Bool2DifferenceCom";
import { SceneSaveCom } from "./coms/scene/SceneSaveCom";
import { SceneLoadCom } from "./coms/scene/SceneLoadCom";
import { SceneClearCom } from "./coms/scene/SceneClearCom";
import { SceneImportCom } from "./coms/scene/SceneImportCom";
import { CreateCircleAreaCom } from "./coms/face/CreateCircleAreaCom";
import { ModifyEllipseAreaCom } from "./coms/face/ModifyEllipseAreaCom";
import { ModifyPolylineAreaCom } from "./coms/face/ModifyPolylineAreaCom";
import { ModifyRectangleAreaCom } from "./coms/face/ModifyRectangleAreaCom";
import { CreatePolylineAreaCom } from "./coms/face/CreatePolylineAreaCom";
import { CreateRectangleAreaCom } from "./coms/face/CreateRectangleAreaCom";
import { CreateEllipseAreaCom } from "./coms/face/CreateEllipseAreaCom";
import { ModifyCircleAreaCom } from "./coms/face/ModifyCircleAreaCom";
import { CreatePoint2Com } from "./coms/point/CreatePoint2Com";
import { CalculateCurve2UCom } from "./coms/calculate/CalculateCurve2UCom";
import { CalculateCurve2GCom } from "./coms/calculate/CalculateCurve2GCom";
import { CalculatePointEdge2Com } from "./coms/calculate/CalculatePointEdge2Com";
import { CalculatePointFace2Com } from "./coms/calculate/CalculatePointFace2Com";
import { CalculatePointEdge2AutoCom } from "./coms/calculate/CalculatePointEdge2AutoCom";
import { CalculatePointFace2AutoCom } from "./coms/calculate/CalculatePointFace2AutoCom";
import { SceneShowAssistsCom } from "./coms/scene/SceneShowAssistsCom";
import { ModifyPoint2Com } from "./coms/point/ModifyPoint2Com";
import { SceneSaveasCom } from "./coms/scene/SceneSaveasCom";
import { SceneClearPointCom } from "./coms/scene/SceneClearPointCom";
import { ComSelect } from "./coms/other/ComSelect";
import { ComUnDo } from "./coms/other/ComUnDo";
import { ComReDo } from "./coms/other/ComReDo";
import { SceneStricpSaveCom } from "./coms/scene/SceneStricpSaveCom";
import { SceneStricpExecCom } from "./coms/scene/SceneStricpExecCom";
import { ComReverse } from "./coms/ComReverse";

/**
 * Command executer base class.
 * 
 */
class CommandExecuter {
  private _commands = new Map<string, Function>();
  private _history: Stack<Command>;
  private _redos: Stack<Command>;
  private KeyShiftDown: boolean = false;
  private KeyCtrlDown: boolean = false;
  private _curr: Command;
  private _isRecord: boolean = true; //录制标记
  private _records: string[] = [];// 录制的脚本
  constructor() {
    this._history = new Stack<Command>();
    this._redos = new Stack<Command>();
    this.InitCommand();
  }
  private InitCommand() {
    this._commands.set(CommandType.CREATE_POINT2, CreatePoint2Com);

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

    this._commands.set(CommandType.CREATE_CIRCLE_SURFACE, CreateCircleAreaCom);
    this._commands.set(CommandType.CREATE_ELLIPSE_SURFACE, CreateEllipseAreaCom);
    this._commands.set(CommandType.CREATE_POLYGON_SURFACE, CreatePolylineAreaCom);
    this._commands.set(CommandType.CREATE_RECTANGLE_SURFACE, CreateRectangleAreaCom);
    this._commands.set(CommandType.CREATE_SECTION_SURFACE, CreateSectionCom);

    this._commands.set(CommandType.MODIFY_POINT2, ModifyPoint2Com);

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

    this._commands.set(CommandType.MODIFY_CIRCLE_SURFACE, ModifyCircleAreaCom);
    this._commands.set(CommandType.MODIFY_ELLIPSE_SURFACE, ModifyEllipseAreaCom);
    this._commands.set(CommandType.MODIFY_POLYGON_SURFACE, ModifyPolylineAreaCom);
    this._commands.set(CommandType.MODIFY_RECTANGLE_SURFACE, ModifyRectangleAreaCom);

    this._commands.set(CommandType.CALCULATE_CURVE2_U, CalculateCurve2UCom);
    this._commands.set(CommandType.CALCULATE_CURVE2_G, CalculateCurve2GCom);
    this._commands.set(CommandType.CALCULATE_POINT_EDGE2, CalculatePointEdge2Com);
    this._commands.set(CommandType.CALCULATE_POINT_FACE2, CalculatePointFace2Com);

    this._commands.set(CommandType.CALCULATE_POINT_EDGE2_AUTO, CalculatePointEdge2AutoCom);
    this._commands.set(CommandType.CALCULATE_POINT_FACE2_AUTO, CalculatePointFace2AutoCom);

    this._commands.set(CommandType.MEASURE_LENGTH_2, MeasureLoop2LengthCom);
    this._commands.set(CommandType.MEASURE_LENGTH_3, MeasureLoop3LengthCom);
    this._commands.set(CommandType.MEASURE_AREA_2, MeasureFace2AreaCom);
    this._commands.set(CommandType.MEASURE_AREA_3, MeasureFace3AreaCom);
    this._commands.set(CommandType.MEASURE_VOLUME_3, MeasureBody3VolumeCom);

    this._commands.set(CommandType.CALCULATE_EDGE_INTERSECTION, EdgeIntersectionCom);
    this._commands.set(CommandType.CALCULATE_EDGE_CUTTING, EdgeCuttingCom);

    this._commands.set(CommandType.BOOL_2_INTERSECTION, Bool2IntersectionCom);
    this._commands.set(CommandType.BOOL_2_UNION, Bool2UnionCom);
    this._commands.set(CommandType.BOOL_2_DIFFERENCE, Bool2DifferenceCom);

    this._commands.set(CommandType.SCENE_SAVE, SceneSaveCom);
    this._commands.set(CommandType.SCENE_SAVEAS, SceneSaveasCom);
    this._commands.set(CommandType.SCENE_LOAD, SceneLoadCom);
    this._commands.set(CommandType.SCENE_IMPORT, SceneImportCom);
    this._commands.set(CommandType.SCENE_CLEAR, SceneClearCom);
    this._commands.set(CommandType.SCENE_CLEAR_POINT, SceneClearPointCom);
    this._commands.set(CommandType.SCENE_SHOW_ASSISTS, SceneShowAssistsCom);
    this._commands.set(CommandType.SCENE_STRICP_SAVE, SceneStricpSaveCom);
    this._commands.set(CommandType.SCENE_STRICP_EXEC, SceneStricpExecCom);

    this._commands.set(CommandType.OTHER_REVERSE, ComReverse);
    this._commands.set(CommandType.OTHER_SELECT, ComSelect);
    this._commands.set(CommandType.OTHER_DELETE, ComDelete);
    this._commands.set(CommandType.OTHER_UNDO, ComUnDo);
    this._commands.set(CommandType.OTHER_REDO, ComReDo);

    this._commands.set(CommandType.TRANSFORM_MOVE, ComMove);
    this._commands.set(CommandType.TRANSFORM_ROTATE, ComRotate);
    this._commands.set(CommandType.TRANSFORM_SCALE, ComScale);
    this._commands.set(CommandType.TRANSFORM_MIRROR, ComMirror);
    this._commands.set(CommandType.TRANSFORM_OFFSET, ComOffset);

    // this._commands.set(CommandType.OTHER_GROUP_OR_UNGROUP, ComGroup);
  }

  get isRecord(): boolean {
    return this._isRecord;
  }

  set isRecord(isRecord: boolean) {
    this._isRecord = isRecord;
    if (!isRecord) {
      this._records = [];
    }
  }
  get records(): string[] {
    return this._records;
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
    if (type === undefined || type === null) {
      return;
    }
    let typeName = GeomType[type] as string;
    if (type == GeomType.MATH_VECTOR2
      || type == GeomType.DATA_TYPE_POINT2) {
      typeName = CommandType.MODIFY_POINT2;
    } else {
      typeName = typeName.split('_')[2];//DRAW_CURVE2_L = 0, // 两点直线段
    }
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
  * 'Ctrl' + 'G', 解组
  * 'Ctrl' + 'Z', UNDO
  * 'Ctrl' + 'Y', REDO
  * 'Ctrl' + 'S', SAVE 
  * 'Ctrl' + 'Shift' + 'S', SAVEAS  
  * 'Ctrl' + 'O', LOAD 
  * 'Ctrl' + 'I', IMPORT 
  * 'Ctrl' + 'X', CLEAR  
  * 'Ctrl' + 'R', STRICP_SAVE
  * 'Ctrl' + 'Shift' + 'R', STRICP_EXEC  
  */
  onKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
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
        this.execute(CommandType.OTHER_DELETE);
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
        if (this.KeyCtrlDown) {
          this.KeyCtrlDown = false;
          event.preventDefault();
          this.execute(CommandType.SCENE_IMPORT);
          return;
        } else {
          this.execute(CommandType.TRANSFORM_MIRROR);
        }
        break;
      // M：移动
      case 'KeyM':
        this.execute(CommandType.TRANSFORM_MOVE);
        break;
      // R：旋转
      case 'KeyR':
        if (this.KeyCtrlDown && !this.KeyShiftDown) {
          this.KeyCtrlDown = false;
          event.preventDefault();
          this.execute(CommandType.SCENE_STRICP_SAVE);
          return;
        } else if (this.KeyCtrlDown && this.KeyShiftDown) {
          this.KeyCtrlDown = false;
          this.KeyShiftDown = false;
          event.preventDefault();
          this.execute(CommandType.SCENE_STRICP_EXEC);
          return;
        }
        this.execute(CommandType.TRANSFORM_ROTATE);
        break;
      // O：偏移
      case 'KeyO':
        if (this.KeyCtrlDown) {
          this.KeyCtrlDown = false;
          event.preventDefault();
          this.execute(CommandType.SCENE_LOAD);
          return;
        } else {
          this.execute(CommandType.TRANSFORM_OFFSET);
        }
        break;
      // S：拉伸
      case 'KeyS':
        if (this.KeyCtrlDown && !this.KeyShiftDown) {
          this.KeyCtrlDown = false;
          event.preventDefault();
          this.execute(CommandType.SCENE_SAVE);
          return;
        }
        else if (this.KeyCtrlDown && this.KeyShiftDown) {
          this.KeyCtrlDown = false;
          this.KeyShiftDown = false;
          event.preventDefault();
          this.execute(CommandType.SCENE_SAVEAS);
          return;
        }
        else {
          this.execute(CommandType.TRANSFORM_SCALE);
        }
        break;
      // Ctrl+Z Undo
      case "KeyZ":
        if (this.KeyCtrlDown) {
          this.execute(CommandType.OTHER_UNDO);
        };
        break;
      // Ctrl+Y Redo
      case "KeyY":
        if (this.KeyCtrlDown) {
          this.execute(CommandType.OTHER_REDO);
        };
        break;
      // Ctrl+X Clear
      case "KeyX":
        if (this.KeyCtrlDown) {
          event.preventDefault();
          this.execute(CommandType.SCENE_CLEAR);
          return;
        };
        break;
      case "ControlLeft":
      case "ControlRight":
        this.KeyCtrlDown = true;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.KeyShiftDown = true;
        break;
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case "ControlLeft":
      case "ControlRight":
        this.KeyCtrlDown = false;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.KeyShiftDown = false;
        break;
    }
  }

  aotuExecute(comstrs: string[]): Command[] {
    let result: Command[] = [];
    for (let i = 0; i < comstrs.length; i++) {
      result.push(this.execute(comstrs[i]));
    }
    return result;
  }

  execute(comstr: string): Command {
    let s = comstr.split(' ');

    let command = s[0];
    command = command.toUpperCase();

    let c = this._commands.get(command) as Function;
    if (!c) {
      if (Object.prototype.hasOwnProperty.call(CommandType, command)) {
        command = CommandType[command as keyof typeof CommandType];
        c = this._commands.get(command) as Function;
      }
    }
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
    } else {
      console.warn('命令不存在：' + command);
    }
    return this._curr;
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
    if (this._isRecord) {
      this._records.push(com.text + '\n');
    }
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