// user-processor.test.ts
import { process } from './processors/Point2AtEdge2SpaceProcessor';
import { ExecuteDescribeBools } from './BaseTtest';

ExecuteDescribeBools('点在edge2的曲线空间中测试', '07_point2AtEdge2Space', process);
