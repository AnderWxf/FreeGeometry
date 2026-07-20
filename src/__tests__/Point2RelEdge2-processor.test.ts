// user-processor.test.ts
import { process } from './processors/Point2RelEdge2Processor';
import { ExecuteDescribeBools } from './BaseTtest';

ExecuteDescribeBools('点与edge2的位置关系测试', '05_point2Redge2', process);
