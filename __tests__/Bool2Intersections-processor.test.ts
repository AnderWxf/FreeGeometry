// user-processor.test.ts
import { process } from '../src/__tests__/processors/Bool2IntersectionsProcessor';
import { ExecuteDescribeBool2 } from "../src/__tests__/BaseTtest";

ExecuteDescribeBool2('2D布尔交运算', '32_bool2Intersections', process);
