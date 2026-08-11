// user-processor.test.ts
import { process } from '../src/__tests__/processors/Point2RelFace2Processor';
import { ExecuteDescribeBools } from '../src/__tests__/BaseTtest';

ExecuteDescribeBools('点与Face2的位置关系测试', '06_point2Rface2', process);
