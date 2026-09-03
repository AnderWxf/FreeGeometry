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
   * Returns a new DataBase with clone values from this instance.
   *
   * @return {DataBase} A clone of this instance.
   */
  clone(): DataBase {
    // 使用 Object.assign 或手动复制属性
    let ret = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    ret.uuid = this.uuid;
    return ret;
  }

  /**
   * Returns a new DataBase with copied values from this instance.
   *
   * @return {DataBase} A copy of this instance.
   */
  copy() {
    return new DataBase();
  }

}
export {
  DataBase
};