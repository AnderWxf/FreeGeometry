enum DisplayLayers {
    Point,
    Curve,
    Surface,
    Solid,
}


enum GeomType {
    // 二维曲线类型
    L = 0,       // 两点直线段
    A = 1,       // 圆弧
    A3 = 2,      // 三点圆弧
    C = 3,       // 圆
    C3 = 4,      // 三点圆
    E = 5,       // 椭圆
    EA = 6,      // 椭圆弧
    HY = 7,      // 双曲线
    PA = 8,      // 抛物线
    PL = 9,      // 多段线
    NUF = 10,    // Nurbs fitting
    NUC = 11,    // Nurbs control
    REC = 12,    // REC：矩形

    // 二维曲面类型
    PLA = 20,     // 二维平面
    SEC = 21,     // 二维剖面
}



export {
    DisplayLayers,
    GeomType,
    // Surface2Type
};
