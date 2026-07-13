// user-processor.test.ts
import { process } from './processors/Point2AtFace2BoderProcessor';
import { ExecuteDescribeBools } from './BaseTtest';

ExecuteDescribeBools('点在face2的边界上测试', '09_point2AFace2Boder', process);
