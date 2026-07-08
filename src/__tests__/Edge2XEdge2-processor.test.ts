// user-processor.test.ts
import { process } from './processors/Edge2XEdge2Processor';
import { ExecuteDescribe } from './BaseTtest';

ExecuteDescribe('curve2求交测试', '00_curve2Xcurve2', process);
