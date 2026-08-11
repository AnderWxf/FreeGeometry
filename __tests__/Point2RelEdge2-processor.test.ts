// user-processor.test.ts
import { process } from '../src/__tests__/processors/Point2RelEdge2Processor';
import { ExecuteDescribeBools } from '../src/__tests__/BaseTtest';

ExecuteDescribeBools('点与edge2的位置关系测试', '05_point2Redge2', process);
