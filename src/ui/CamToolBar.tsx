import React from 'react';
import * as THREE from 'three';
import ReactDOM from 'react-dom/client';
import { Input, Select, Space } from 'antd';
import { PerspectiveController } from '../helper/camera/PerspectiveController';
import { OrthographicController } from '../helper/camera/OrthographicController';
import { Grid } from '../helper/Grid';

const perspective: PerspectiveController = new PerspectiveController();
const orthographic: OrthographicController = new OrthographicController();
perspective.bind(window);

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
            defaultValue="前"
            style={{ width: 50, position: 'fixed', top: 10, left: 10, zIndex: 1000 }}
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
let CommandBarOnEnter = (value: string) => {

};
const CommandBar: React.FC = () => (
    <Space wrap>
        <Input placeholder="请输入命令"
            style={{ position: 'fixed', width: '100%', bottom: 0 }}
            onPressEnter={(e) => {
                const value = (e.target as HTMLInputElement).value;
                if (CommandBarOnEnter) {
                    CommandBarOnEnter(value);
                }
            }}
        />
    </Space>
);
CamToolBarOnChange('前');
export default { perspective, orthographic, grid_xz, grid_xy, grid_yz, CamToolBarOnChange };

const root = ReactDOM.createRoot(document.getElementById('ui'));
root.render(
    <React.StrictMode>
        <CamToolBar />
        <CommandBar />
    </React.StrictMode>
);

