import { Global } from "../../../../core/Global";
import { Command } from "../../Command";
import * as THREE from "three";
import type { CommandExecuter } from "../../CommandExecuter";
import { useState } from "react";

class SceneClearCom extends Command {
  public olds: THREE.Object3D[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.olds = [];
  }
  async exec() {
    let scene = Global.scene;
    this.olds.push(...scene.objects);
    scene.clear();
    Global.filename = '';
    // 触发 React 组件更新（通过自定义事件）
    window.dispatchEvent(new CustomEvent('filenameChanged', { detail: Global.filename }));
    this.done();
  }
  override undo() {
    if (this._isDone) {
      Global.scene.add(...this.olds);
    }
  }
  override redo() {
    if (this._isDone) {
      Global.scene.remove(...this.olds);
    }
  }
}
export { SceneClearCom }