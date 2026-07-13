// user-processor.test.ts
import { process } from './processors/Point2AtFace2InnerProcessor';
import { ExecuteDescribeBools } from './BaseTtest';

ExecuteDescribeBools('点在face2的内部测试', '10_point2AtFace2Inner', process);
