import React from 'react';
import * as THREE from 'three';
import ReactDOM from 'react-dom/client';
import { Input, Select, Space, Checkbox, Menu, ConfigProvider } from 'antd';
import { PerspectiveController } from '../helper/camera/PerspectiveController';
import { OrthographicController } from '../helper/camera/OrthographicController';
import { Grid } from '../helper/Grid';
import { Global } from '../core/Global';
import { CommandType } from '../core/Constents';
import { SaveFilled, EditTwoTone, BuildFilled, AppstoreFilled, CalculatorOutlined, LineChartOutlined, AreaChartOutlined, GlobalOutlined, RubyOutlined, BlockOutlined } from '@ant-design/icons';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useState } from 'react';


const perspective: PerspectiveController = new PerspectiveController();
const orthographic: OrthographicController = new OrthographicController();

const grid_xz = new THREE.LineSegments(new Grid(100, 5, 1, "xz"));
grid_xz.name = "Grid_xz";
grid_xz.visible = true;
grid_xz.renderOrder = -Infinity;
(grid_xz.material as THREE.LineBasicMaterial).vertexColors = true;
const grid_xy = new THREE.LineSegments(new Grid(100, 5, 1, "xy"));
grid_xy.name = "Grid_xy";
grid_xy.visible = false;
grid_xy.renderOrder = -Infinity;
(grid_xy.material as THREE.LineBasicMaterial).vertexColors = true;
const grid_yz = new THREE.LineSegments(new Grid(100, 5, 1, "yz"));
grid_yz.name = "Grid_yz";
grid_yz.visible = false;
grid_yz.renderOrder = -Infinity;
(grid_yz.material as THREE.LineBasicMaterial).vertexColors = true;

let CamToolBarOnChange = (value: string) => {
  if (value == '透') {
    perspective.bind(window);
    orthographic.unbind(window);
    grid_xz.visible = true;
    grid_xy.visible = false;
    grid_yz.visible = false;
  } else {
    perspective.unbind(window);
    orthographic.bind(window);
    grid_xz.visible = false;
    grid_xy.visible = false;
    grid_yz.visible = false;
  }
  switch (value) {
    case '前':
      orthographic.up.set(0, 1, 0);
      orthographic.right.set(1, 0, 0);
      orthographic.back.set(0, 0, 1);
      orthographic.pos.set(0, 0, 100);
      orthographic.yaw = 0;
      orthographic.pitch = 0;
      grid_xy.visible = true;
      break;
    case '后':
      orthographic.up.set(0, 1, 0);
      orthographic.right.set(-1, 0, 0);
      orthographic.back.set(0, 0, -1);
      orthographic.pos.set(0, 0, -100);
      orthographic.yaw = 180;
      orthographic.pitch = 0;
      grid_xy.visible = true;
      break;
    case '左':
      orthographic.up.set(0, 1, 0);
      orthographic.right.set(0, 0, 1);
      orthographic.back.set(-1, 0, 0);
      orthographic.pos.set(-100, 0, 0);
      orthographic.yaw = 90;
      orthographic.pitch = 0;
      grid_yz.visible = true;
      break;
    case '右':
      orthographic.up.set(0, 1, 0);
      orthographic.right.set(0, 0, -1);
      orthographic.back.set(1, 0, 0);
      orthographic.pos.set(100, 0, 0);
      orthographic.yaw = -90;
      orthographic.pitch = 0;
      grid_yz.visible = true;
      break;
    case '顶':
      orthographic.up.set(0, 0, -1);
      orthographic.right.set(1, 0, 0);
      orthographic.back.set(0, 1, 0);
      orthographic.pos.set(0, 100, 0);
      orthographic.yaw = 0;
      orthographic.pitch = -90;
      grid_xz.visible = true;
      break;
    case '仰':
      orthographic.up.set(0, 0, 1);
      orthographic.right.set(1, 0, 0);
      orthographic.back.set(0, -1, 0);
      orthographic.pos.set(0, -100, 0);
      orthographic.yaw = 0;
      orthographic.pitch = 90;
      grid_xz.visible = true;
      break;
  }

};
const CamToolBar: React.FC = () => (
  <Space wrap>
    <Select
      value="前"
      style={{ width: 50, position: 'fixed', top: 10, right: 10, zIndex: 1000 }}
      onChange={(value: string) => {
        if (CamToolBarOnChange) {
          CamToolBarOnChange(value);
        }
      }}
      options={[
        { value: '前', label: '前' },
        { value: '后', label: '后' },
        { value: '左', label: '左' },
        { value: '右', label: '右' },
        { value: '顶', label: '顶' },
        { value: '仰', label: '仰' },
        { value: '透', label: '透' },
      ]}
    />
  </Space>
);


const ComOptionBar: React.FC = () => (
  <Space wrap>
    <Checkbox
      style={{ width: 100, position: 'fixed', top: 10, right: 70, zIndex: 1000, color: '#00A000', accentColor: '#00A000' }}
      onChange={(e) => {
        Global.select.isSnap = e.target.checked;
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >捕捉</Checkbox>
    <Checkbox
      style={{ width: 100, position: 'fixed', top: 10, right: 180, zIndex: 1000, color: '#00A000' }}
      onChange={(e) => {
        Global.select.isSnapInter = e.target.checked;
      }}
    >捕捉交点</Checkbox>
    <Checkbox
      style={{ width: 100, position: 'fixed', top: 10, right: 300, zIndex: 1000, color: '#00A000' }}
      onChange={(e) => {
        Global.select.isEditor = e.target.checked;
      }}
    >编辑</Checkbox>
    {/* <Checkbox
            style={{ width: 100, position:'fixed', top: 10, left: 75, zIndex: 1000, color:'#00A000' }}
            onChange={(e) => {
                Global.isShowAssists = e.target.checked;
            }}
        >控制</Checkbox> */}
  </Space>
);

let inputs = new Array<string>();
let pos = 0;
let CommandBarOnEnter = (value: string) => {
  Global.gpu.focus();
  Global.comExector.execute(value.toUpperCase());
};


const CommandBar: React.FC = () => (
  <Space wrap>
    <Input id='CommandLine' placeholder="请输入命令"
      style={{ position: 'fixed', width: '100%', bottom: 0, right: 0, background: 'transparent' }}
      onPressEnter={(e) => {
        e.stopPropagation();
        let element = (e.target as HTMLInputElement);
        element.disabled = true;
        const value = element.value;
        inputs.push(value);
        pos = inputs.length - 1;
        CommandBarOnEnter(value);
      }}
      onBlur={(e) => {
        let element = (e.target as HTMLInputElement);
        element.disabled = true;
      }}
      onKeyUp={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        switch (e.key) {
          case 'ArrowUp':
            if (pos > 0) {
              pos--;
              (e.target as HTMLInputElement).value = inputs[pos];
            }
            break;
          case 'ArrowDown':
            if (pos < inputs.length - 1) {
              pos++;
              (e.target as HTMLInputElement).value = inputs[pos];
            }
            break;
        };
        e.stopPropagation();
      }}
    />
  </Space>
);

const MenuItems = [
  {
    key: 'file',
    icon: <SaveFilled />,
    label: '文件',
    children: [
      { key: CommandType.SCENE_SAVE, label: '保存' + ' ' + CommandType.SCENE_SAVE },
      { key: CommandType.SCENE_LOAD, label: '加载' + ' ' + CommandType.SCENE_LOAD },
      { key: CommandType.SCENE_IMPORT, label: '导入' + ' ' + CommandType.SCENE_IMPORT },
      { key: CommandType.SCENE_CLEAR, label: '清空' + ' ' + CommandType.SCENE_CLEAR },
    ],
  },
  {
    key: 'create',
    icon: <BuildFilled />,
    label: '创建',
    children: [
      {
        // 基本创建命令
        key: 'curve',
        icon: <LineChartOutlined />,
        label: '曲线',
        children: [
          // 二维曲线类型
          { key: CommandType.CREATE_LINE, label: '两点直线段' + ' ' + CommandType.CREATE_LINE },
          { key: CommandType.CREATE_ARC, label: '圆弧' + ' ' + CommandType.CREATE_ARC },
          { key: CommandType.CREATE_ARC_THREE_POINT, label: '三点圆弧' + ' ' + CommandType.CREATE_ARC_THREE_POINT },
          { key: CommandType.CREATE_CIRCLE, label: '圆' + ' ' + CommandType.CREATE_CIRCLE },
          { key: CommandType.CREATE_CIRCLE_THREE_POINT, label: '三点圆' + ' ' + CommandType.CREATE_CIRCLE_THREE_POINT },
          { key: CommandType.CREATE_ELLIPSE, label: '椭圆' + ' ' + CommandType.CREATE_ELLIPSE },
          { key: CommandType.CREATE_ELLIPSE_ARC, label: '椭圆弧' + ' ' + CommandType.CREATE_ELLIPSE_ARC },
          { key: CommandType.CREATE_HYPERBOLA, label: '双曲线' + ' ' + CommandType.CREATE_HYPERBOLA },
          { key: CommandType.CREATE_PARABOLA, label: '抛物线' + ' ' + CommandType.CREATE_PARABOLA },
          { key: CommandType.CREATE_POLYLINE, label: '多段线' + ' ' + CommandType.CREATE_POLYLINE },
          { key: CommandType.CREATE_NURBS_FITTING, label: 'Nurbs拟合' + ' ' + CommandType.CREATE_NURBS_FITTING },
          { key: CommandType.CREATE_NURBS_CONTROL, label: 'Nurbs控制点' + ' ' + CommandType.CREATE_NURBS_CONTROL },
          { key: CommandType.CREATE_RECTANGLE, label: '矩形' + ' ' + CommandType.CREATE_RECTANGLE },
        ]
      },
      {
        key: 'plane',
        icon: <AreaChartOutlined />,
        label: '平面域',
        children: [
          //二维平面类型},
          { key: CommandType.CREATE_CIRCLE_SURFACE, label: '圆面' + ' ' + CommandType.CREATE_CIRCLE_SURFACE },
          { key: CommandType.CREATE_ELLIPSE_SURFACE, label: '椭圆面' + ' ' + CommandType.CREATE_ELLIPSE_SURFACE },
          { key: CommandType.CREATE_POLYGON_SURFACE, label: '多边形面' + ' ' + CommandType.CREATE_POLYGON_SURFACE },
          { key: CommandType.CREATE_RECTANGLE_SURFACE, label: '矩形面' + ' ' + CommandType.CREATE_RECTANGLE_SURFACE },
          { key: CommandType.CREATE_SECTION, label: '剖面' + ' ' + CommandType.CREATE_SECTION },
        ]
      },
      {
        key: 'surface3',
        icon: <GlobalOutlined />,
        label: '曲面域',
        children: [
          //三维曲面类型},
          { key: CommandType.CREATE_SPHERE_SURFACE, label: '球面' + ' ' + CommandType.CREATE_SPHERE_SURFACE },
          { key: CommandType.CREATE_ELLIPSOID_SURFACE, label: '椭球面' + ' ' + CommandType.CREATE_ELLIPSOID_SURFACE },
          { key: CommandType.CREATE_CYLINDER_SURFACE, label: '圆柱面' + ' ' + CommandType.CREATE_CYLINDER_SURFACE },
          { key: CommandType.CREATE_CONE_SURFACE, label: '圆锥面' + ' ' + CommandType.CREATE_CONE_SURFACE },
          { key: CommandType.CREATE_PLANE_SURFACE, label: '空间平面' + ' ' + CommandType.CREATE_PLANE_SURFACE },
          { key: CommandType.CREATE_NURBS_SURFACE, label: 'Nurbs面' + ' ' + CommandType.CREATE_NURBS_SURFACE },
          { key: CommandType.CREATE_STRETCH_SURFACE, label: '拉伸面' + ' ' + CommandType.CREATE_STRETCH_SURFACE },
          { key: CommandType.CREATE_ROTATE_SURFACE, label: '旋转面' + ' ' + CommandType.CREATE_ROTATE_SURFACE },
          { key: CommandType.CREATE_SWEEP_SURFACE, label: '扫掠面' + ' ' + CommandType.CREATE_SWEEP_SURFACE },
          { key: CommandType.CREATE_LOFT_SURFACE, label: '放样曲面' + ' ' + CommandType.CREATE_LOFT_SURFACE },
        ]
      },
      {
        key: 'solid',
        icon: <RubyOutlined />,
        label: '实体',
        children: [
          //三维实体类型
          { key: CommandType.CREATE_HEXAHEDRON, label: '六面体' + ' ' + CommandType.CREATE_HEXAHEDRON },
          { key: CommandType.CREATE_TETRAHEDRON, label: '四面体' + ' ' + CommandType.CREATE_TETRAHEDRON },
          { key: CommandType.CREATE_PRISM, label: '棱柱体' + ' ' + CommandType.CREATE_PRISM },
          { key: CommandType.CREATE_PYRAMID, label: '金字塔体' + ' ' + CommandType.CREATE_PYRAMID },
          { key: CommandType.CREATE_CYLINDER, label: '圆柱体' + ' ' + CommandType.CREATE_CYLINDER },
          { key: CommandType.CREATE_CONE, label: '圆锥体' + ' ' + CommandType.CREATE_CONE },
          { key: CommandType.CREATE_TORUS, label: '圆环' + ' ' + CommandType.CREATE_TORUS },
          { key: CommandType.CREATE_ELLIPTICAL_CYLINDER, label: '椭圆柱' + ' ' + CommandType.CREATE_ELLIPTICAL_CYLINDER },
          { key: CommandType.CREATE_ELLIPTICAL_CONE, label: '椭圆锥' + ' ' + CommandType.CREATE_ELLIPTICAL_CONE },
          { key: CommandType.CREATE_ELLIPTICAL_TORUS, label: '椭圆环' + ' ' + CommandType.CREATE_ELLIPTICAL_TORUS },
          { key: CommandType.CREATE_STRETCH_BODY, label: '拉伸体' + ' ' + CommandType.CREATE_STRETCH_BODY },
          { key: CommandType.CREATE_ROTATE_BODY, label: '旋转体' + ' ' + CommandType.CREATE_ROTATE_BODY },
          { key: CommandType.CREATE_SWEEP_BODY, label: '扫掠体' + ' ' + CommandType.CREATE_SWEEP_BODY },
          { key: CommandType.CREATE_LOFT_BODY, label: '放样体' + ' ' + CommandType.CREATE_LOFT_BODY },
        ]
      },
    ],
  },
  {
    key: 'editer',
    icon: <EditTwoTone />,
    label: '编辑',
    children: [
      //基本修改命令
      {
        key: 'curve',
        icon: <LineChartOutlined />,
        label: '曲线',
        children: [
          //二维曲线类型
          { key: CommandType.MODIFY_LINE, label: '两点直线段' + ' ' + CommandType.MODIFY_LINE },
          { key: CommandType.MODIFY_ARC, label: '圆弧' + ' ' + CommandType.MODIFY_ARC },
          { key: CommandType.MODIFY_ARC_THREE_POINT, label: '三点圆弧' + ' ' + CommandType.MODIFY_ARC_THREE_POINT },
          { key: CommandType.MODIFY_CIRCLE, label: '圆' + ' ' + CommandType.MODIFY_CIRCLE },
          { key: CommandType.MODIFY_CIRCLE_THREE_POINT, label: '三点圆' + ' ' + CommandType.MODIFY_CIRCLE_THREE_POINT },
          { key: CommandType.MODIFY_ELLIPSE, label: '椭圆' + ' ' + CommandType.MODIFY_ELLIPSE },
          { key: CommandType.MODIFY_ELLIPSE_ARC, label: '椭圆弧' + ' ' + CommandType.MODIFY_ELLIPSE_ARC },
          { key: CommandType.MODIFY_HYPERBOLA, label: '双曲线' + ' ' + CommandType.MODIFY_HYPERBOLA },
          { key: CommandType.MODIFY_PARABOLA, label: '抛物线' + ' ' + CommandType.MODIFY_PARABOLA },
          { key: CommandType.MODIFY_POLYLINE, label: '多段线' + ' ' + CommandType.MODIFY_POLYLINE },
          { key: CommandType.MODIFY_NURBS_FITTING, label: 'Nurbs' + ' ' + CommandType.MODIFY_NURBS_FITTING },
          { key: CommandType.MODIFY_NURBS_CONTROL, label: 'Nurbs' + ' ' + CommandType.MODIFY_NURBS_CONTROL },
          { key: CommandType.MODIFY_RECTANGLE, label: '矩形' + ' ' + CommandType.MODIFY_RECTANGLE },
        ]
      },
      {
        key: 'plane',
        icon: <AreaChartOutlined />,
        label: '平面域',
        children: [
          //二维平面类型
          { key: CommandType.MODIFY_CIRCLE_SURFACE, label: '圆面' + ' ' + CommandType.MODIFY_CIRCLE_SURFACE },
          { key: CommandType.MODIFY_ELLIPSE_SURFACE, label: '椭圆面' + ' ' + CommandType.MODIFY_ELLIPSE_SURFACE },
          { key: CommandType.MODIFY_POLYGON_SURFACE, label: '多边形面' + ' ' + CommandType.MODIFY_POLYGON_SURFACE },
          { key: CommandType.MODIFY_RECTANGLE_SURFACE, label: '矩形面' + ' ' + CommandType.MODIFY_RECTANGLE_SURFACE },
          { key: CommandType.MODIFY_SECTION, label: '剖面' + ' ' + CommandType.MODIFY_SECTION },
        ]
      },
      {
        key: 'surface3',
        icon: <GlobalOutlined />,
        label: '曲面域',
        children: [
          //三维曲面类型
          { key: CommandType.MODIFY_SPHERE_SURFACE, label: '球面' + ' ' + CommandType.MODIFY_SPHERE_SURFACE },
          { key: CommandType.MODIFY_ELLIPSOID_SURFACE, label: '椭球面' + ' ' + CommandType.MODIFY_ELLIPSOID_SURFACE },
          { key: CommandType.MODIFY_CYLINDER_SURFACE, label: '圆柱面' + ' ' + CommandType.MODIFY_CYLINDER_SURFACE },
          { key: CommandType.MODIFY_CONE_SURFACE, label: '圆锥面' + ' ' + CommandType.MODIFY_CONE_SURFACE },
          { key: CommandType.MODIFY_PLANE_SURFACE, label: '空间平面' + ' ' + CommandType.MODIFY_PLANE_SURFACE },
          { key: CommandType.MODIFY_NURBS_SURFACE, label: 'Nurbs面' + ' ' + CommandType.MODIFY_NURBS_SURFACE },
          { key: CommandType.MODIFY_STRETCH_SURFACE, label: '拉伸面' + ' ' + CommandType.MODIFY_STRETCH_SURFACE },
          { key: CommandType.MODIFY_ROTATE_SURFACE, label: '旋转面' + ' ' + CommandType.MODIFY_ROTATE_SURFACE },
          { key: CommandType.MODIFY_SWEEP_SURFACE, label: '扫掠面' + ' ' + CommandType.MODIFY_SWEEP_SURFACE },
          { key: CommandType.MODIFY_LOFT_SURFACE, label: '放样曲面' + ' ' + CommandType.MODIFY_LOFT_SURFACE },
        ]
      },
      {
        key: 'solid',
        icon: <RubyOutlined />,
        label: '实体',
        children: [
          //三维实体类型
          { key: CommandType.MODIFY_HEXAHEDRON, label: '六面体' + ' ' + CommandType.MODIFY_HEXAHEDRON },
          { key: CommandType.MODIFY_TETRAHEDRON, label: '四面体' + ' ' + CommandType.MODIFY_TETRAHEDRON },
          { key: CommandType.MODIFY_PRISM, label: '棱柱体' + ' ' + CommandType.MODIFY_PRISM },
          { key: CommandType.MODIFY_PYRAMID, label: '金字塔体' + ' ' + CommandType.MODIFY_PYRAMID },
          { key: CommandType.MODIFY_CYLINDER, label: '圆柱体' + ' ' + CommandType.MODIFY_CYLINDER },
          { key: CommandType.MODIFY_CONE, label: '圆锥体' + ' ' + CommandType.MODIFY_CONE },
          { key: CommandType.MODIFY_TORUS, label: '圆环' + ' ' + CommandType.MODIFY_TORUS },
          { key: CommandType.MODIFY_ELLIPTICAL_CYLINDER, label: '椭圆柱' + ' ' + CommandType.MODIFY_ELLIPTICAL_CYLINDER },
          { key: CommandType.MODIFY_ELLIPTICAL_CONE, label: '椭圆锥' + ' ' + CommandType.MODIFY_ELLIPTICAL_CONE },
          { key: CommandType.MODIFY_ELLIPTICAL_TORUS, label: '椭圆环' + ' ' + CommandType.MODIFY_ELLIPTICAL_TORUS },
          { key: CommandType.MODIFY_STRETCH_BODY, label: '拉伸体' + ' ' + CommandType.MODIFY_STRETCH_BODY },
          { key: CommandType.MODIFY_ROTATE_BODY, label: '旋转体' + ' ' + CommandType.MODIFY_ROTATE_BODY },
          { key: CommandType.MODIFY_SWEEP_BODY, label: '扫掠体' + ' ' + CommandType.MODIFY_SWEEP_BODY },
          { key: CommandType.MODIFY_LOFT_BODY, label: '放样体' + ' ' + CommandType.MODIFY_LOFT_BODY },
        ]
      },
    ]
  },
  {
    key: 'option',
    icon: <AppstoreFilled />,
    label: '操作',
    children: [
      //其他
      { key: CommandType.OTHER_DELETE, label: '删除' + ' ' + CommandType.OTHER_DELETE },
      { key: CommandType.OTHER_UNDO, label: '撤销' + ' ' + CommandType.OTHER_UNDO },
      { key: CommandType.OTHER_REDO, label: '重做' + ' ' + CommandType.OTHER_REDO },
      { key: CommandType.OTHER_MOVE, label: '移动' + ' ' + CommandType.OTHER_MOVE },
      { key: CommandType.OTHER_ROTATE, label: '旋转' + ' ' + CommandType.OTHER_ROTATE },
      { key: CommandType.OTHER_SCALE, label: '缩放' + ' ' + CommandType.OTHER_SCALE },
      { key: CommandType.OTHER_OFFSET, label: '偏移' + ' ' + CommandType.OTHER_OFFSET },
      { key: CommandType.OTHER_MIRROR, label: '镜像' + ' ' + CommandType.OTHER_MIRROR },
      { key: CommandType.OTHER_GROUP_OR_UNGROUP, label: '组合/取消组合' + ' ' + CommandType.OTHER_GROUP_OR_UNGROUP },
    ]
  },
  {
    key: 'calculator',
    icon: <CalculatorOutlined />,
    label: '计算',
    children: [
      //计算
      { key: CommandType.CALCULATE_LENGTH_2, label: '计算长度' + ' ' + CommandType.CALCULATE_LENGTH_2 },
      { key: CommandType.CALCULATE_AREA_2, label: '计算面积' + ' ' + CommandType.CALCULATE_AREA_2 },
      { key: CommandType.CALCULATE_LENGTH_3, label: '计算长度' + ' ' + CommandType.CALCULATE_LENGTH_3 },
      { key: CommandType.CALCULATE_AREA_3, label: '计算面积' + ' ' + CommandType.CALCULATE_AREA_3 },
      { key: CommandType.CALCULATE_VOLUME_3, label: '计算体积' + ' ' + CommandType.CALCULATE_VOLUME_3 },

      //基础操作
      { key: CommandType.OPERATION_EDGE_INTERSECTION, label: '边交点' + ' ' + CommandType.OPERATION_EDGE_INTERSECTION },
      { key: CommandType.OPERATION_EDGE_CUTTING, label: '边切分' + ' ' + CommandType.OPERATION_EDGE_CUTTING },
    ]
  },
  {
    key: 'bool',
    icon: <BlockOutlined />,
    label: '布尔',
    children: [
      //布尔运算
      { key: CommandType.BOOL_2_INTERSECTION, label: '2D布尔交(单)' + ' ' + CommandType.BOOL_2_INTERSECTION },
      { key: CommandType.BOOL_2_UNION, label: '2D布尔并(单)' + ' ' + CommandType.BOOL_2_UNION },
      { key: CommandType.BOOL_2_DIFFERENCE, label: '2D布尔差(单)' + ' ' + CommandType.BOOL_2_DIFFERENCE },
      { key: CommandType.BOOL_3_INTERSECTION, label: '3D布尔交(单)' + ' ' + CommandType.BOOL_3_INTERSECTION },
      { key: CommandType.BOOL_3_UNION, label: '3D布尔并(单)' + ' ' + CommandType.BOOL_3_UNION },
      { key: CommandType.BOOL_3_DIFFERENCE, label: '3D布尔差(单)' + ' ' + CommandType.BOOL_3_DIFFERENCE },
      { key: CommandType.BOOL_2_INTERSECTION_MULTIPLE, label: '2D布尔交(多)' + ' ' + CommandType.BOOL_2_INTERSECTION_MULTIPLE },
      { key: CommandType.BOOL_2_UNION_MULTIPLE, label: '2D布尔并(多)' + ' ' + CommandType.BOOL_2_UNION_MULTIPLE },
      { key: CommandType.BOOL_2_DIFFERENCE_MULTIPLE, label: '2D布尔差(多)' + ' ' + CommandType.BOOL_2_DIFFERENCE_MULTIPLE },
      { key: CommandType.BOOL_3_INTERSECTION_MULTIPLE, label: '3D布尔交(多)' + ' ' + CommandType.BOOL_3_INTERSECTION_MULTIPLE },
      { key: CommandType.BOOL_3_UNION_MULTIPLE, label: '3D布尔并(多)' + ' ' + CommandType.BOOL_3_UNION_MULTIPLE },
      { key: CommandType.BOOL_3_DIFFERENCE_MULTIPLE, label: '3D布尔差(多)' + ' ' + CommandType.BOOL_3_DIFFERENCE_MULTIPLE },
    ]
  },
];
// let selectedKeys: string[] = [];
const MenuBarOnChange = (info: MenuInfo): void => {
  Global.gpu.focus();
  let command = info.key.toUpperCase();
  Global.comExector.execute(command);
  // let [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // setSelectedKeys([]);
};
const MenuBar: React.FC = () => (
  <Space wrap>
    <input type="file" id="fileInput" accept=".json,application/json" hidden></input>
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: 'transparent',          // 菜单项背景色
            itemColor: '#00A000',         // 菜单项文字颜色
            itemSelectedBg: 'transparent',  // 选中态背景色
            popupBg: 'transparent',
            colorSubItemBg: 'transparent',
            horizontalItemHoverBg: 'transparent',
            itemHoverColor: '#FFFFFF',
          },
        },
      }}
    >
      <Menu
        style={{ width: '30%', height: 40, position: 'fixed', top: -5, left: 0 }}
        mode="horizontal"
        // selectedKeys={selectedKeys}
        onClick={(e) => {
          MenuBarOnChange(e);
        }}
        onBlur={(e) => {
          (e.target as any).selectedKeys = [];
        }}
        items={MenuItems}
      />
    </ConfigProvider>


    <Input id='CommandLine' placeholder="请输入命令"
      style={{ position: 'fixed', width: '100%', bottom: 0, right: 0 }}
      onPressEnter={(e) => {
        e.stopPropagation();
        let element = (e.target as HTMLInputElement);
        element.disabled = true;
        const value = element.value;
        inputs.push(value);
        pos = inputs.length - 1;
        CommandBarOnEnter(value);
      }}
      onBlur={(e) => {
        let element = (e.target as HTMLInputElement);
        element.disabled = true;
      }}
      onKeyUp={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        switch (e.key) {
          case 'ArrowUp':
            if (pos > 0) {
              pos--;
              (e.target as HTMLInputElement).value = inputs[pos];
            }
            break;
          case 'ArrowDown':
            if (pos < inputs.length - 1) {
              pos++;
              (e.target as HTMLInputElement).value = inputs[pos];
            }
            break;
        };
        e.stopPropagation();
      }}
    />
  </Space>
);
export default { perspective, orthographic, grid_xz, grid_xy, grid_yz, CamToolBarOnChange };

const root = ReactDOM.createRoot(document.getElementById('ui'));
root.render(
  <React.StrictMode>
    <CamToolBar />
    <ComOptionBar />
    <CommandBar />
    <MenuBar />
  </React.StrictMode>
);


