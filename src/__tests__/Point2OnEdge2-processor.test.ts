// user-processor.test.ts
import { process } from './processors/Point2AtEdge2OnProcessor';
import { ExecuteDescribeBools } from './BaseTtest';

ExecuteDescribeBools('点在edge2上测试', '07_point2AtEdge2Space', process);
