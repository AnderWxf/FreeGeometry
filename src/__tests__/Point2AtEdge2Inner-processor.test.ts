// user-processor.test.ts
import { process } from './processors/Point2AtEdge2InnerProcessor';
import { ExecuteDescribeBools } from './BaseTtest';

ExecuteDescribeBools('点在edge2的内部测试', '07_point2AtEdge2Inner', process);
