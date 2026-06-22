import { GeomType } from "../../../../core/Constents";
import { Global } from "../../../../core/Global";
import { Brep2Algo, Edge2Algo, Face2Algo } from "../../../../geometry/algorithm/brep/Brep2Algo";
import { Bool2 } from "../../../../geometry/algorithm/relation/bool/Bool2";
import { Brep2Inter, type InterOfFace2 } from "../../../../geometry/algorithm/relation/intersection/Brep2Inter";
import type { InterOfCurve2 } from "../../../../geometry/algorithm/relation/intersection/Curve2Inter";
import type { Edge2, Face2 } from "../../../../geometry/data/brep/Brep2";
import { BrepMeshBuilder } from "../../../BrepMeshBuilder";
import { CloneUserData, CreateGeomUserData, type AssisPoint, type UserData } from "../../../UserData";
import { ActionContext3D } from "../../Active";
import { ActPickObject } from "../../acts/ActPickObject";
import { ActPickObjects } from "../../acts/ActPickObjects";
import { Command } from "../../Command";
import type { CommandExecuter } from "../../CommandExecuter";
import * as THREE from "three";

/**
 * Bool command class.
 * 
 */
class BoolCom extends Command {
  protected olds: THREE.Object3D[];
  public results: THREE.Object3D[];


  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.results = [];
    this.olds = [];
  }

  async exec(): Promise<void> {

  }

  onMouseMoveExec(event: MouseEvent) {
  };

  override cancel() {
    super.cancel();
    this.unbind(window);

    this.results = null;
  }

  override done() {
    super.done();
    this.unbind(window);
    Global.scene.remove(...this.olds);
    Global.scene.add(...this.results);
    Global.select.clear();
  }
  override bind(window: Window) {
    super.bind(window);
    window.addEventListener("mousemove", this.onMouseMove);
  }
  override unbind(window: Window) {
    super.unbind(window);
    window.removeEventListener("mousemove", this.onMouseMove);
  }
  override undo() {
    if (this._isDone) {
      if (this.olds.length > 0) Global.scene.add(...this.olds);
      if (this.results.length > 0) Global.scene.remove(...this.results);
    }
  }
  override redo() {
    if (this._isDone) {
      if (this.olds.length > 0) Global.scene.remove(...this.olds);
      if (this.results.length > 0) Global.scene.add(...this.results);
    }
  }
}
export { BoolCom };