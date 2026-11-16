import { process as interprocess } from './Bool2IntersectionsProcessor';
import { process as unionprocess } from './Bool2UnionsProcessor';
import { process as diffeprocess } from './Bool2DifferencesProcessor';
import { Bool2DataCreate } from "../BaseTtest";
// 需要拖动到 fg/__tests__/下才能单独运行
let isForce = false;// 是否强制覆盖已有的结果文件
Bool2DataCreate('2D布尔交运算数据生成', '32_bool2Intersections', interprocess, false, isForce);
Bool2DataCreate('2D布尔并运算数据生成', '33_bool2Unions', unionprocess, false, isForce);
Bool2DataCreate('2D布尔差运算数据生成', '34_bool2Differences', diffeprocess, true, isForce);