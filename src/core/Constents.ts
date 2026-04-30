enum DisplayLayers {
    Point,
    Curve,
    Surface,
    Solid,
}
// 几何类型,名字也是创建命令
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
    PO = 9,      // 多段线
    NF = 10,     // Nurbs fitting
    NC = 11,     // Nurbs control
    RC = 12,     // REC：矩形

    // 二维平面类型
    CI = 20,     // 圆面
    EL = 21,     // 椭圆面
    POL = 22,    // 多边形面
    RCT = 23,    // 矩形面
    SEC = 24,    // 剖面

    // 三维曲面类型
    SHP = 41,     // 球面
    ELL = 42,     // 椭球面
    CYL = 42,     // 圆柱面
    CON = 43,     // 圆锥面
    PLA = 44,     // 空间平面
    NUR = 45,     // Nurbs面
    STR = 46,     // 拉伸面
    ROT = 47,     // 旋转面
    SWE = 48,     // 扫掠面
    LOF = 49,     // 放样曲面

    // 三维实体类型
    HEXA = 60,    // 六面体
    TETR = 61,    // 四面体
    PRIS = 62,    // 棱柱体
    PYRA = 63,    // 金字塔体
    CYLI = 65,    // 圆柱体
    CONE = 66,    // 圆锥体
    TORU = 67,    // 圆环
    ECYL = 69,    // 椭圆柱
    ECON = 70,    // 椭圆锥
    ETOR = 71,    // 椭圆环
    STRE = 72,    // 拉伸体
    ROTA = 73,    // 旋转体
    SWEP = 74,    // 扫掠体
    LOFT = 75     // 放样体
}

// 命令类型
enum CommandType {
    /********基本创建命令**********/
    // 二维曲线类型
    CREATE_LINE = 'L',                  // 两点直线段
    CREATE_ARC = 'A',                   // 圆弧
    CREATE_ARC_THREE_POINT = 'A3',      // 三点圆弧
    CREATE_CIRCLE = 'C',                // 圆
    CREATE_CIRCLE_THREE_POINT = 'C3',   // 三点圆
    CREATE_ELLIPSE = 'E',               // 椭圆
    CREATE_ELLIPSE_ARC = 'EA',          // 椭圆弧
    CREATE_HYPERBOLA = 'HY',            // 双曲线
    CREATE_PARABOLA = 'PA',             // 抛物线
    CREATE_POLYLINE = 'PO',             // 多段线
    CREATE_NURBS_FITTING = 'NF',        // Nurbs fitting
    CREATE_NURBS_CONTROL = 'NC',        // Nurbs control
    CREATE_RECTANGLE = 'RC',            // REC：矩形

    // 二维平面类型
    CREATE_CIRCLE_SURFACE = 'CI',       // 圆面
    CREATE_ELLIPSE_SURFACE = 'EL',      // 椭圆面
    CREATE_POLYGON_SURFACE = 'POL',     // 多边形面
    CREATE_RECTANGLE_SURFACE = 'RCT',   // 矩形面
    CREATE_SECTION = 'SEC',             // 剖面

    // 三维曲面类型
    CREATE_SPHERE_SURFACE = 'SHP',      // 球面
    CREATE_ELLIPSOID_SURFACE = 'ELL',   // 椭球面
    CREATE_CYLINDER_SURFACE = 'CYL',    // 圆柱面
    CREATE_CONE_SURFACE = 'CON',        // 圆锥面
    CREATE_PLANE_SURFACE = 'PLA',       // 空间平面
    CREATE_NURBS_SURFACE = 'NUR',       // Nurbs面
    CREATE_STRETCH_SURFACE = 'STR',     // 拉伸面
    CREATE_ROTATE_SURFACE = 'ROT',      // 旋转面
    CREATE_SWEEP_SURFACE = 'SWE',       // 扫掠面
    CREATE_LOFT_SURFACE = 'LOF',        // 放样曲面

    // 三维实体类型
    CREATE_HEXAHEDRON = 'HEXA',         // 六面体
    CREATE_TETRAHEDRON = 'TETR',        // 四面体
    CREATE_PRISM = 'PRIS',              // 棱柱体
    CREATE_PYRAMID = 'PYRA',            // 金字塔体
    CREATE_CYLINDER = 'CYLI',           // 圆柱体
    CREATE_CONE = 'CONE',               // 圆锥体
    CREATE_TORUS = 'TORU',              // 圆环
    CREATE_ELLIPTICAL_CYLINDER = 'ECYL',// 椭圆柱
    CREATE_ELLIPTICAL_CONE = 'ECON',    // 椭圆锥
    CREATE_ELLIPTICAL_TORUS = 'ETOR',    // 椭圆环
    CREATE_STRETCH_BODY = 'STRE',       // 拉伸体
    CREATE_ROTATE_BODY = 'ROTA',        // 旋转体
    CREATE_SWEEP_BODY = 'SWEP',         // 扫掠体
    CREATE_LOFT_BODY = 'LOFT',           // 放样体

    /*******基本修改命令 = 'M' + 基本创建命令 *********/
    // 二维曲线类型
    MODIFY_LINE = 'ML',                  // 两点直线段
    MODIFY_ARC = 'MA',                   // 圆弧
    MODIFY_ARC_THREE_POINT = 'MA3',      // 三点圆弧
    MODIFY_CIRCLE = 'MC',                // 圆
    MODIFY_CIRCLE_THREE_POINT = 'MC3',      // 三点圆
    MODIFY_ELLIPSE = 'ME',               // 椭圆
    MODIFY_ELLIPSE_ARC = 'MEA',          // 椭圆弧
    MODIFY_HYPERBOLA = 'MHY',            // 双曲线
    MODIFY_PARABOLA = 'MPA',             // 抛物线
    MODIFY_POLYLINE = 'MPO',             // 多段线
    MODIFY_NURBS_FITTING = 'MNF',        // Nurbs fitting
    MODIFY_NURBS_CONTROL = 'MNC',        // Nurbs control
    MODIFY_RECTANGLE = 'MRC',            // REC：矩形

    // 二维平面类型
    MODIFY_CIRCLE_SURFACE = 'MCI',       // 圆面
    MODIFY_ELLIPSE_SURFACE = 'MEL',      // 椭圆面
    MODIFY_POLYGON_SURFACE = 'MPOL',     // 多边形面
    MODIFY_RECTANGLE_SURFACE = 'MRCT',   // 矩形面
    MODIFY_SECTION = 'MSEC',             // 剖面

    // 三维曲面类型
    MODIFY_SPHERE_SURFACE = 'MSHP',      // 球面
    MODIFY_ELLIPSOID_SURFACE = 'MELL',   // 椭球面
    MODIFY_CYLINDER_SURFACE = 'MCYL',    // 圆柱面
    MODIFY_CONE_SURFACE = 'MCON',        // 圆锥面
    MODIFY_PLANE_SURFACE = 'MPLA',       // 空间平面
    MODIFY_NURBS_SURFACE = 'MNUR',       // Nurbs面
    MODIFY_STRETCH_SURFACE = 'MSTR',     // 拉伸面
    MODIFY_ROTATE_SURFACE = 'MROT',      // 旋转面
    MODIFY_SWEEP_SURFACE = 'MSWE',       // 扫掠面
    MODIFY_LOFT_SURFACE = 'MLOF',        // 放样曲面

    // 三维实体类型
    MODIFY_HEXAHEDRON = 'MHEXA',         // 六面体
    MODIFY_TETRAHEDRON = 'MTETR',        // 四面体
    MODIFY_PRISM = 'MPRIS',              // 棱柱体
    MODIFY_PYRAMID = 'MPYRA',            // 金字塔体
    MODIFY_CYLINDER = 'MCYLI',           // 圆柱体
    MODIFY_CONE = 'MCONE',               // 圆锥体
    MODIFY_TORUS = 'MTOR',               // 圆环
    MODIFY_ELLIPTICAL_CYLINDER = 'MECYL',// 椭圆柱
    MODIFY_ELLIPTICAL_CONE = 'MECON',    // 椭圆锥
    MODIFY_ELLIPTICAL_TORUS = 'METOR',   // 椭圆环
    MODIFY_STRETCH_BODY = 'MSTRE',       // 拉伸体
    MODIFY_ROTATE_BODY = 'MROTA',        // 旋转体
    MODIFY_SWEEP_BODY = 'MSWEP',         // 扫掠体
    MODIFY_LOFT_BODY = 'MLOFT',          // 放样体

    // 其他
    OTHER_DELETE = 'D',                   // 删除
    OTHER_UNDO = 'U',                     // 撤销
    OTHER_REDO = 'R',                     // 重做
    OTHER_MOVE = 'M',                     // 移动
    OTHER_ROTATE = 'R',                   // 旋转
    OTHER_SCALE = 'S',                    // 缩放
    OTHER_OFFSET = 'O',                   // 偏移，产生新对象
    OTHER_MIRROR = 'I',                   // 镜像，产生新对象   
    OTHER_GROUP = 'G',                    // 组合
    OTHER_UNGROUP = 'UG',                 // 取消组合
}


export {
    DisplayLayers,
    GeomType,
    CommandType
};
