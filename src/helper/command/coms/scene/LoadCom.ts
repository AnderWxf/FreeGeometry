import { Doc } from "../../../Doc";
import { Command } from "../../Command";

class LoadCom extends Command {
  async exec() {
    await Doc.Load();
  }
}
export { LoadCom }