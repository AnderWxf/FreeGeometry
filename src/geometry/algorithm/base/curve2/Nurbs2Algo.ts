import { Vector2, Vector3, Vector4 } from "../../../../math/Math";
import { Nurbs2Data } from "../../../data/base/curve2/Nurbs2Data";
import { Transform2 } from "../../../data/base/Transform2";
import { Curve2Algo } from "../Curve2Algo";
import verb from 'verb-nurbs';
// import * as verb from 'verb-nurbs';

/**
 * nurbs algorithm.
 *
 */
class Nurbs2Algo extends Curve2Algo {
    /**
     * The data struct of this nurbs algorithm.
     *
     * @type {Nurbs2Data}
     */
    protected override dat_: Nurbs2Data;
    private curve_: any;

    public override get dat(): Nurbs2Data {
        return this.dat_;
    }

    public override set dat(dat: Nurbs2Data) {
        this.dat_ = dat;
        let controls: number[][] = [];
        for (let i = 0; i < dat.controls.length; i++) {
            controls.push([dat.controls[i].x, dat.controls[i].y, dat.controls[i].z]);
        }
        this.curve_ = new verb.geom.NurbsCurve({
            degree: dat.degree, // 维度
            knots: dat.knots, // 节点向量
            controlPoints: controls
        }
        );
    }
    /**
     * Constructs a nurbs algorithm.
     *
     * @param {Curve2Data} [dat=Nurbs2Data] - The data struct of this nurbs algorithm.
     */
    constructor(dat: Nurbs2Data) {
        super(dat);
        this.dat = dat;
    }

    /**
     * the U function return u parameter at a position .
     * @param {Vector2} [point] - the point on curve.
     * @retun {number}
     */
    u(point: Vector2): number {
        let v = point.clone();
        v.applyMatrix3(this.dat.trans.makeWorldMatrix().invert());
        let u = verb.eval.Analyze.rationalCurveClosestParam(this.curve_._data, [v.x, v.y]) as number;
        return u;
    }

    /**
     * the D(derivative) function return r-order derivative vector at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @param {number} [r ∈ [0,1,2...]] - r-order.
     * @retun {Vector2}
     */
    override d(u: number, r: number = 0): Vector2 {
        if (r === 0) {
            let points = verb.eval.Eval.curvePoint(this.curve_._data, u) as number[];
            return new Vector2(points[0], points[1]);
        } else {
            let points = verb.eval.Eval.rationalCurveDerivatives(this.curve_._data, u, r) as number[][];
            return new Vector2(points[1][0], points[1][1]);
        }
    }

    /**
     * the G(general) function return the value of the general equation for the curve.
     * if point on curve then the return value is zero.
     * @param {Vector2} [point] - the point baout curve. 
     * @retun {number}
     */
    g(point: Vector2): number {
        let v = point.clone();
        v.applyMatrix3(this.dat.trans.makeWorldMatrix().invert());
        let u = verb.eval.Analyze.rationalCurveClosestParam(this.curve_._data, [v.x, v.y]) as number;
        let d_ = verb.eval.Eval.rationalCurveDerivatives(this.curve_._data, u, 1) as number[][];
        let p = new Vector2(d_[0][0], d_[0][1]);
        let v0 = new Vector2(d_[1][0], d_[1][1]); // 切向量
        let v1 = v.sub(p);          // 投影点到目标点方向
        let ret = v1.length();
        let d = v1.cross(v0);
        // 叉乘>0,则v1在v0右侧，返回值取负数，反之取正数。
        if (d > 0) {
            ret = -ret;
        }
        return ret;
    }

    /**
     * 曲线弧长
     */
    public length(): number {
        return verb.eval.Analyze.rationalCurveArcLength(this.curve_._data, 1);
        // return this.curve_.length();
    }
    /**
     * 使用正则化最小二乘法拟合 NURBS 曲线
     */
    public static Fit(
        points: Vector2[],  // [[x1,y1], [x2,y2], ...]
        degree: number,
        // numControlPoints: number,
        // lambda: number = 0.1  // 正则化参数
    ): Nurbs2Data {
        let pts: number[][] = [];
        for (let i = 0; i < points.length; i++) {
            pts.push([points[i].x, points[i].y]);
        }

        // const curveData = verb.eval.Make.rational_interp_curve(pts, degree, false, null, null);
        const curveData = verb.eval.Make.rationalInterpCurve(pts, degree, false, null, null);
        const controlPoints = curveData.controlPoints.map((point: any) => new Vector3(point[0], point[1], point[2]));
        return new Nurbs2Data(new Transform2(), controlPoints, curveData.knots, degree);
    }
}

/**
 * 
1. 几何创建模块 (geom)
曲线创建
javascript
// 基础曲线
new geom.NurbsCurve(dim, knots, controlPoints)
new geom.BezierCurve(controlPoints)

// 基本几何形状
geom.Line(start, end)                     // 直线
geom.Polyline(points)                     // 折线
geom.Arc(center, xaxis, yaxis, radius, startAngle, endAngle) // 圆弧
geom.Circle(center, xaxis, yaxis, radius) // 圆
geom.Ellipse(center, xaxis, yaxis, majorRadius, minorRadius) // 椭圆

// 插值曲线
geom.InterpolateCurve(points, degree)     // 插值曲线 
曲面创建
javascript
// 基础曲面
new geom.NurbsSurface(dim, knotsU, knotsV, controlPoints)

// 基本几何曲面
geom.Plane(origin, xaxis, yaxis)          // 平面
geom.Cylinder(center, axis, height, radius) // 圆柱
geom.Cone(center, axis, height, radius)    // 圆锥
geom.Sphere(center, radius)               // 球体
geom.Torus(center, axis, majorRadius, minorRadius) // 圆环

// 旋转/拉伸曲面
geom.SurfaceOfRevolution(curve, point, axis, startAngle, endAngle) // 旋转曲面
geom.ExtrudeSurface(curve, direction)     // 拉伸曲面
geom.LoftSurface(curves)                  // 放样曲面
geom.RuledSurface(curve1, curve2)         // 直纹曲面


2. 求值模块 (eval)
曲线求值
javascript
// 基础求值
eval.Eval.rational_curve_point(curve, u)           // 曲线上点
eval.Eval.rational_curve_derivatives(curve, u, numDerivs) // 导数
eval.Eval.curve_tangent(curve, u)                  // 切向量
eval.Eval.curve_normal(curve, u)                   // 法向量
eval.Eval.curve_curvature(curve, u)                // 曲率
eval.Eval.curve_frame(curve, u)                    // Frenet 标架

// 分割/裁剪
eval.Clip.curve_segment(curve, u0, u1)            // 曲线段
eval.Split.curve_split(curve, u)                  // 分割曲线
曲面求值
javascript
// 基础求值
eval.Eval.rational_surface_point(surface, u, v)    // 曲面上点
eval.Eval.rational_surface_derivatives(surface, u, v, numDerivs) // 偏导数
eval.Eval.surface_normal(surface, u, v)            // 法向量
eval.Eval.surface_curvature(surface, u, v)         // 曲率
eval.Eval.surface_frame(surface, u, v)             // 曲面标架

// 分割/裁剪
eval.Clip.surface_rectangle(surface, u0, u1, v0, v1) // 曲面矩形区域
eval.Split.surface_split(surface, u, v)            // 分割曲面
曲线/曲面特性

javascript
// 长度/面积计算
eval.Analyze.curve_length(curve)                   // 曲线长度
eval.Analyze.surface_area(surface)                 // 曲面面积
eval.Analyze.curve_curvature_bounds(curve)         // 曲率范围
eval.Analyze.surface_curvature_bounds(surface)     // 曲面曲率范围

// 最近点/交点
eval.Intersect.curve_curve(curve1, curve2)         // 曲线-曲线交点
eval.Intersect.curve_surface(curve, surface)       // 曲线-曲面交点
eval.Intersect.surface_surface(surface1, surface2) // 曲面-曲面交线
eval.Intersect.project_point_to_curve(point, curve) // 点到曲线投影
eval.Intersect.project_point_to_surface(point, surface) // 点到曲面投影

3. 网格化模块 (eval/Tess)
曲线离散化
javascript
// 采样方法
eval.Tess.adaptive_sample_curve(curve, tolerance)  // 自适应采样
eval.Tess.uniform_sample_curve(curve, numSamples)  // 均匀采样
eval.Tess.chord_length_param_curve(points)         // 弦长参数化
eval.Tell.curve_tessellation(curve, options)       // 曲线网格化
曲面离散化
javascript
// 三角化
eval.Tess.adaptive_sample_surface(surface, tolerance) // 自适应采样
eval.Tess.uniform_sample_surface(surface, samplesU, samplesV) // 均匀采样
eval.Tess.surface_to_triangles(surface, options)   // 曲面三角化
eval.Tess.surface_to_quads(surface, options)       // 曲面四边形化

4. 核心计算模块 (core)
数学工具
javascript
// 向量/矩阵运算
core.Vec.add(a, b)                                // 向量加法
core.Vec.sub(a, b)                                // 向量减法
core.Vec.dot(a, b)                                // 点积
core.Vec.cross(a, b)                              // 叉积
core.Vec.normalize(v)                             // 归一化
core.Vec.length(v)                                // 向量长度
core.Mat.identity(n)                              // 单位矩阵
core.Mat.multiply(a, b)                           // 矩阵乘法

// 数值方法
core.Numerics.solve_linear_system(A, b)           // 解线性方程组
core.Numerics.solve_nonlinear(f, x0)              // 非线性方程求解
core.Numerics.integrate(f, a, b)                  // 数值积分
core.Numerics.differentiate(f, x)                 // 数值微分
NURBS 核心算法
javascript
// 基函数计算
core.BasisFunction.evaluate(knots, degree, u)     // 基函数值
core.BasisFunction.evaluate_all(knots, degree, u) // 所有基函数
core.BasisFunction.derivatives(knots, degree, u, numDerivs) // 基函数导数

// 节点操作
core.Knots.insert(knots, newKnot, multiplicity)   // 插入节点
core.Knots.remove(knots, knot, multiplicity)      // 移除节点
core.Knots.refine(knots, newKnots)                // 细化节点
core.Knots.merge(knots1, knots2)                  // 合并节点

// 曲线/曲面操作
core.Modify.degree_elevate(curve, newDegree)      // 升阶
core.Modify.degree_reduce(curve, tolerance)       // 降阶
core.Modify.knot_insert(curve, knots)             // 插入节点
core.Modify.knot_remove(curve, tolerance)         // 移除节点
core.Modify.reparameterize(curve, newDomain)      // 重新参数化

5. 拟合模块 (core/Fitting)
javascript
// 曲线拟合
core.Fitting.interpolate_curve(points, degree)    // 插值拟合
core.Fitting.approximate_curve(points, degree, numCtrlPts) // 逼近拟合
core.Fitting.fit_curve_with_constraints(points, constraints) // 约束拟合
core.Fitting.smooth_curve(curve, lambda)          // 平滑曲线

// 曲面拟合
core.Fitting.interpolate_surface(points, degreeU, degreeV) // 插值曲面
core.Fitting.approximate_surface(points, degreeU, degreeV, numCtrlU, numCtrlV) // 逼近曲面
core.Fitting.fit_surface_with_constraints(points, constraints) // 约束曲面拟合

// 参数化方法
core.Fitting.chord_length_param(points)           // 弦长参数化
core.Fitting.centripetal_param(points)            // 向心参数化
core.Fitting.uniform_param(points)                // 均匀参数化

6. 布尔运算模块 (eval/Boolean)
javascript
// 曲线布尔运算
eval.Boolean.curve_union(curve1, curve2)          // 曲线并集
eval.Boolean.curve_intersection(curve1, curve2)   // 曲线交集
eval.Boolean.curve_difference(curve1, curve2)     // 曲线差集

// 曲面布尔运算
eval.Boolean.surface_union(surface1, surface2)    // 曲面并集
eval.Boolean.surface_intersection(surface1, surface2) // 曲面交集
eval.Boolean.surface_difference(surface1, surface2) // 曲面差集
eval.Boolean.surface_trim(surface, curve)         // 曲面裁剪

7. 转换模块 (core/Convert)
javascript
// 格式转换
core.Convert.curve_to_bezier(curve)               // NURBS 转贝塞尔
core.Convert.bezier_to_nurbs(bezier)              // 贝塞尔转 NURBS
core.Convert.polyline_to_nurbs(polyline)          // 折线转 NURBS
core.Convert.nurbs_to_polyline(curve, tolerance)  // NURBS 转折线

// 维度转换
core.Convert.to_2d(curve)                         // 转换为 2D
core.Convert.to_3d(curve)                         // 转换为 3D
core.Convert.homogenize(points)                   // 齐次坐标化
core.Convert.dehomogenize(points)                 // 非齐次坐标化
 * 
 */
export { Nurbs2Algo };