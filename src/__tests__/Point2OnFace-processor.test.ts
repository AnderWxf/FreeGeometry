// user-processor.test.ts
import { process } from './processors/Point2AtFace2OnProcessor';
import { ExecuteDescribeBools } from './BaseTtest';

ExecuteDescribeBools('点在face2上测试', '11_point2OnFace2', process);
