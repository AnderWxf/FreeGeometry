// user-processor.test.ts
import { process } from './processors/Edge2XEdge2Processor';
import { ExecuteDescribe } from './BaseTtest';

ExecuteDescribe('curve3求交测试', '02_curve3Xcurve3', process);
