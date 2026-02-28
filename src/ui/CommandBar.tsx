import React from 'react';
import ReactDOM from 'react-dom/client';
import { Input, Space } from 'antd';

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
export default { CommandBarOnEnter };

