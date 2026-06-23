import { Doc } from "../../../Doc";
import { Command } from "../../Command";

class SaveCom extends Command {
  async exec() {
    await Doc.Save();
  }
}
export { SaveCom }