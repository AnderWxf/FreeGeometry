import type { DataBase } from "../../../geometry/data/DataBase";
import { Active } from "../Active";

/**
 * ActPickObjects base class.
 * 
 */
class ActPickObjects extends Active {
    results: Array<DataBase>;
}
export { ActPickObjects };