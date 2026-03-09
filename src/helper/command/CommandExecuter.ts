import { Command } from "./Command";
import { Stack } from "../../core/Stack";
import { CreateLine2Com } from "./coms/CreateLine2Com";
import { DeleteObjectsCom } from "./coms/DeleteObjectsCom";
import { CreateCircle2Com } from "./coms/CreateCircle2Com";
import { CreateArc2Com } from "./coms/CreateArc2Com";
import { CreateArc2ThreePointCom } from "./coms/CreateArc2ThreePointCom";
import { CreateCircle2ThreePointCom } from "./coms/CreateCircle2ThreePointCom";
import { ModifyLine2Com } from "./coms/ModifyLine2Com";
import { ModifyCircle2Com } from "./coms/ModifyCircle2Com";
import { ModifyCircle2ThreePointCom } from "./coms/ModifyCircle2ThreePointCom";

/**
 * Command executer base class.
 * 
 */
class CommandExecuter {
    private _history: Stack<Command>;
    private _redos: Stack<Command>;
    private KeyShiftDown: Boolean = false;
    private KeyCtrlDown: Boolean = false;
    constructor() {
        this._history = new Stack<Command>();
        this._redos = new Stack<Command>();
    }

    onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case "Enter":
                const comline: HTMLElement = document.getElementById('CommandLine');
                comline.focus();
                break;
            case "Delete":
                this.execute('E');
                break;
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
                // PL：多段线

                // REC：矩形
                // B：定义块                
                // D：尺寸资源管理器
                // E：删除
                case 'E':
                    com = new DeleteObjectsCom(this, comstr);
                    break;
                // F：倒圆角
                // G：对象组合
                // H：填充
                // I：插入
                // J：对接
                // S：拉伸
                // T：多行文本输入
                // W：定义块并保存到硬盘中


                // M：移动
                // X：分解炸开
                // V：设置当前坐标
                // U：恢复上一次操作
                // O：偏移
                // P：移动
                // Z：缩放
                // M...: 修改
                // ML：修改直线
                case 'ML':
                    com = new ModifyLine2Com(this, comstr);
                    break;
                // MA：修改圆弧
                case 'MA':
                    com = new ModifyCircle2Com(this, comstr);
                    break;
                // MA3：修改三点圆弧
                case 'MA3':
                    com = new CreateArc2ThreePointCom(this, comstr);
                    break;
                // MC：修改圆
                case 'MC':
                    com = new ModifyCircle2Com(this, comstr);
                    break;
                // MC3：修改三点圆
                case 'MC3':
                    com = new ModifyCircle2ThreePointCom(this, comstr);
                    break;
            }
            if (com) {
                com.exec();
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