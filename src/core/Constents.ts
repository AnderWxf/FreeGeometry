enum DisplayLayers {
    Point,
    Curve,
    Face,
    Sloid,
}

// 二维曲线类型
enum Curve2Type {
    L = 'L',        // 两点直线段
    A = 'A',        // 圆弧
    A3 = 'A3',      // 三点圆弧
    C = 'C',        // 圆
    C3 = 'C3',      // 三点圆
    E = 'E',        // 椭圆
    EA = 'EA',      // 椭圆弧
    HY = 'HY',      // 双曲线
    PA = 'PA',      // 抛物线
    PL = 'PL',      // 多段线
    NU = 'NU',      // Nurbs    
    REC = 'REC',    // REC：矩形
}

export {
    DisplayLayers,
    Curve2Type
}
