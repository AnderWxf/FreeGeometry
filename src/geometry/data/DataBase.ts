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
   * clone() 方法保持uuid不变，可以保证序列化后的json内容一致。
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
   * copy() 方法产生新的uuid，不保证序列化后的json内容一致。
   * @return {DataBase} A copy of this instance.
   */
  copy() {
    return new DataBase();
  }
}
export {
  DataBase
};