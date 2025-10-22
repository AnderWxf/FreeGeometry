import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Flex } from 'antd';

const ToolBar: React.FC = () => (
    <Flex gap="small" wrap>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
    </Flex>
);

const element = (
    <div>
        <h1>Hello, world!</h1>
        <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
);
export default ToolBar;
const root = ReactDOM.createRoot(document.getElementById('ui'));
root.render(
    <React.StrictMode>
        <ToolBar />
    </React.StrictMode>
);

