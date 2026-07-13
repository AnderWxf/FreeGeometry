// user-processor.test.ts
import { process } from './processors/Point2AtEdge2BoderProcessor';
import { ExecuteDescribeBools } from './BaseTtest';

ExecuteDescribeBools('点在edge2的边界上测试', '06_point2AtEdge2Boder', process);
