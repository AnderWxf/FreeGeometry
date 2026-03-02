import { Command } from "./Command";
import { Stack } from "../../core/Stack";
import { CreateLine2Com } from "./coms/CreateLine2Com";
import { DeleteObjectsCom } from "./coms/DeleteObjectsCom";

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
            let com: Command;
            switch (command) {
                // REC：矩形
                // A：绘圆弧
                // B：定义块
                // C：画圆
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
                // L：直线
                case 'L':
                case 'l':
                    com = new CreateLine2Com(this, comstr);
                    break;
                // PL：画多段线。先PL在根据下面的提示W设置线宽再A就可以画线型较粗的圆了
                // M：移动
                // X：分解炸开
                // V：设置当前坐标
                // U：恢复上一次操作
                // O：偏移
                // P：移动
                // Z：缩放
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