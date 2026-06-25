enum DisplayLayers {
  Point,
  Curve,
  Surface,
  Solid,
}
// 几何类型,名字也是创建命令
enum GeomType {
  // 二维曲线绘制类型
  DRAW_CURVE2_L = 0,       // 两点直线段
  DRAW_CURVE2_A = 1,       // 圆弧
  DRAW_CURVE2_A3 = 2,      // 三点圆弧
  DRAW_CURVE2_C = 3,       // 圆
  DRAW_CURVE2_C3 = 4,      // 三点圆
  DRAW_CURVE2_E = 5,       // 椭圆
  DRAW_CURVE2_EA = 6,      // 椭圆弧
  DRAW_CURVE2_HY = 7,      // 双曲线
  DRAW_CURVE2_PA = 8,      // 抛物线
  DRAW_CURVE2_PO = 9,      // 多段线
  DRAW_CURVE2_NF = 10,     // Nurbs fitting
  DRAW_CURVE2_NC = 11,     // Nurbs control
  DRAW_CURVE2_RC = 12,     // REC：矩形

  // 三维曲线绘制类型

  // 二维平面绘制类型
  DRAW_SURFACE_CI = 30,     // 圆面
  DRAW_SURFACE_EL = 31,     // 椭圆面
  DRAW_SURFACE_POL = 32,    // 多边形面
  DRAW_SURFACE_RCT = 33,    // 矩形面
  DRAW_SURFACE_SEC = 34,    // 剖面

  // 三维曲面绘制类型
  DRAW_SURFACE_PLA = 41,     // 空间平面
  DRAW_SURFACE_SHP = 42,     // 球面
  DRAW_SURFACE_ELL = 43,     // 椭球面
  DRAW_SURFACE_CYL = 44,     // 圆柱面
  DRAW_SURFACE_CON = 45,     // 圆锥面
  DRAW_SURFACE_NUR = 46,     // Nurbs面
  DRAW_SURFACE_STR = 47,     // 拉伸面
  DRAW_SURFACE_ROT = 48,     // 旋转面
  DRAW_SURFACE_SWE = 49,     // 扫掠面
  DRAW_SURFACE_LOF = 50,     // 放样曲面

  // 三维实体绘制类型
  DRAW_SOLID_HEXA = 60,    // 六面体
  DRAW_SOLID_TETR = 61,    // 四面体
  DRAW_SOLID_PRIS = 62,    // 棱柱体
  DRAW_SOLID_PYRA = 63,    // 金字塔体
  DRAW_SOLID_CYLI = 65,    // 圆柱体
  DRAW_SOLID_CONE = 66,    // 圆锥体
  DRAW_SOLID_TORU = 67,    // 圆环
  DRAW_SOLID_ECYL = 69,    // 椭圆柱
  DRAW_SOLID_ECON = 70,    // 椭圆锥
  DRAW_SOLID_ETOR = 71,    // 椭圆环
  DRAW_SOLID_STRE = 72,    // 拉伸体
  DRAW_SOLID_ROTA = 73,    // 旋转体
  DRAW_SOLID_SWEP = 74,    // 扫掠体
  DRAW_SOLID_LOFT = 75,     // 放样体

  // 二维曲线数据类型
  DATA_TYPE_CURVE2_ARC2 = 0 + 255,
  DATA_TYPE_CURVE2_HYPERBOLA2 = 1 + 255,
  DATA_TYPE_CURVE2_LINE2 = 2 + 255,
  DATA_TYPE_CURVE2_NURBS2 = 3 + 255,
  DATA_TYPE_CURVE2_PARABOLA2 = 4 + 255,

  // 三维曲线数据类型
  DATA_TYPE_CURVE3_ARC3 = 10 + 255,
  DATA_TYPE_CURVE3_HYPERBOLA3 = 11 + 255,
  DATA_TYPE_CURVE3_LINE3 = 12 + 255,
  DATA_TYPE_CURVE3_NURBS3 = 13 + 255,
  DATA_TYPE_CURVE3_PARABOLA3 = 14 + 255,
  DATA_TYPE_CURVE3_UVCURVE = 14 + 255,

  // 三维曲面数据类型
  DATA_TYPE_SURFACE_CONICALSURFACE = 20 + 255,
  DATA_TYPE_SURFACE_CYLINDERSURFACE = 21 + 255,
  DATA_TYPE_SURFACE_ELLIPSOIDSURFACE = 22 + 255,
  DATA_TYPE_SURFACE_LOFTINGSURFACE = 23 + 255,
  DATA_TYPE_SURFACE_NURBSSURFACE = 24 + 255,
  DATA_TYPE_SURFACE_PLANESURFACE = 25 + 255,
  DATA_TYPE_SURFACE_SPHERESURFACE = 26 + 255,
  DATA_TYPE_SURFACE_SWEEPSURFACE = 27 + 255,

  // 二维Brep数据类型
  DATA_TYPE_BREP2_VERTICE2 = 40 + 255,
  DATA_TYPE_BREP2_EDGE2 = 41 + 255,
  DATA_TYPE_BREP2_COEDGE2 = 42 + 255,
  DATA_TYPE_BREP2_LOOP2 = 43 + 255,
  DATA_TYPE_BREP2_FACE2 = 44 + 255,
  DATA_TYPE_BREP2_DIGRAPH2 = 45 + 255,

  // 三维Brep数据类型
  DATA_TYPE_BREP3_VERTICE3 = 50 + 255,
  DATA_TYPE_BREP3_EDGE3 = 51 + 255,
  DATA_TYPE_BREP3_COEDGE3 = 52 + 255,
  DATA_TYPE_BREP3_LOOP3 = 53 + 255,
  DATA_TYPE_BREP3_FACE3 = 54 + 255,
  DATA_TYPE_BREP3_DIGRAPH3 = 55 + 255,
  DATA_TYPE_BREP3_SHELL3 = 56 + 255,
  DATA_TYPE_BREP3_LUMP3 = 57 + 255,
  DATA_TYPE_BREP3_BODY3 = 58 + 255,
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
  CREATE_HYPERBOLA = 'H',             // 双曲线
  CREATE_PARABOLA = 'P',              // 抛物线
  CREATE_POLYLINE = 'PO',             // 多段线
  CREATE_NURBS_FITTING = 'N',         // Nurbs fitting
  CREATE_NURBS_CONTROL = 'NC',        // Nurbs control
  CREATE_RECTANGLE = 'RE',             // REC：矩形

  // 二维平面类型
  CREATE_CIRCLE_SURFACE = 'CI',       // 圆面
  CREATE_ELLIPSE_SURFACE = 'EL',      // 椭圆面
  CREATE_POLYGON_SURFACE = 'PL',      // 多边形面
  CREATE_RECTANGLE_SURFACE = 'RC',    // 矩形面
  CREATE_SECTION = 'SE',              // 剖面

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

  //计算
  CALCULATE_LENGTH_2 = 'CL2',          // 计算长度
  CALCULATE_AREA_2 = 'CA2',            // 计算面积
  CALCULATE_LENGTH_3 = 'CL3',          // 计算长度
  CALCULATE_AREA_3 = 'CA3',            // 计算面积
  CALCULATE_VOLUME_3 = 'CV3',          // 计算体积

  //基础操作
  OPERATION_EDGE_INTERSECTION = 'OEI', // 边交点(多选对象组中的第一个与后面所有对象间的交点)
  OPERATION_EDGE_CUTTING = 'OEC',      // 边切分(多选对象组中的第一个分割后面所有对象)

  //布尔运算
  BOOL_2_INTERSECTION_MULTIPLE = 'BIM', // 2D布尔交(多对多)
  BOOL_2_UNION_MULTIPLE = 'BUM',        // 2D布尔并(多对多)
  BOOL_2_DIFFERENCE_MULTIPLE = 'BDM',   // 2D布尔差(多对多)
  BOOL_2_INTERSECTION = 'BI',           // 2D布尔交(单对单)
  BOOL_2_UNION = 'BU',                  // 2D布尔并(单对单)
  BOOL_2_DIFFERENCE = 'BD',             // 2D布尔差(单对单)
  BOOL_3_INTERSECTION_MULTIPLE = 'B3IM',// 3D布尔交(多对多)
  BOOL_3_UNION_MULTIPLE = 'B3UM',       // 3D布尔并(多对多)
  BOOL_3_DIFFERENCE_MULTIPLE = 'B3DM',  // 3D布尔差(多对多)
  BOOL_3_INTERSECTION = 'B3I',          // 3D布尔交(单对单)
  BOOL_3_UNION = 'B3U',                 // 3D布尔并(单对单)
  BOOL_3_DIFFERENCE = 'B3D',            // 3D布尔差(单对单)

  // 场景
  SCENE_SAVE = 'SAVE',                  // 保存
  SCENE_SAVEAS = 'SAVEAS',              // 另存为
  SCENE_LOAD = 'LOAD',                  // 加载
  SCENE_IMPORT = 'IMPORT',              // 导入
  SCENE_EXPORT = 'EXPORT',              // 导出
  SCENE_CLEAR = 'CLEAR',                // 清空

  // 其他
  OTHER_DELETE = 'D',                   // 删除
  OTHER_UNDO = 'UD',                    // 撤销
  OTHER_REDO = 'RD',                    // 重做
  OTHER_MOVE = 'M',                     // 移动
  OTHER_ROTATE = 'R',                   // 旋转
  OTHER_SCALE = 'S',                    // 缩放
  OTHER_OFFSET = 'O',                   // 偏移，产生新对象
  OTHER_MIRROR = 'I',                   // 镜像，产生新对象   
  OTHER_GROUP_OR_UNGROUP = 'G',         // 组合/取消组合
}


export {
  DisplayLayers,
  GeomType,
  CommandType
};
