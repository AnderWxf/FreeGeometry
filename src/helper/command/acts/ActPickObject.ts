import type { DataBase } from "../../../geometry/data/DataBase";
import { Active } from "../Active";

/**
 * ActPickObject base class.
 * 
 */
class ActPickObject extends Active {
    result: DataBase;
}
export { ActPickObject };