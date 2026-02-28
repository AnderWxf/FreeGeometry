import { v4 as uuidv4 } from 'uuid';

class DataBase {
    uuid = "";
    /**
     * Constructs a Vertice.
     *
     */
    constructor() {
        this.uuid = uuidv4();
    }
}
export {
    DataBase
};