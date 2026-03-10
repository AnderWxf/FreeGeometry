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

    /**
     * Returns a new DataBase with copied values from this instance.
     *
     * @return {DataBase} A clone of this instance.
     */
    clone() {
        return new DataBase();
    }
}
export {
    DataBase
};