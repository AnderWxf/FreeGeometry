import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Slider, Row, Col, Space, Divider, Button } from 'antd';
import ArrowsAlt from "@ant-design/icons"
import RotateRight from "@ant-design/icons"
import ZoomInOut from "@ant-design/icons"
import { Transform2 } from '../geometry/data/base/Transform2';

/**
 * Transform 属性对话框组件
 * 
 * 允许用户通过滑块和数字输入框来调整位移 (translate)、旋转 (rotate) 和缩放 (scale)，
 * 并实时生成对应的 CSS transform 字符串。
 */
const Transform2Dialog = ({ trans = new Transform2() }) => {
    const [form] = Form.useForm();
    const [transformString, setTransformString] = useState('');

    // 监听表单值变化，实时更新 transform 字符串
    const onValuesChange = (changedValues: any, allValues: any) => {
        const { translateX = 0, translateY = 0, rotate = 0, scaleX = 1, scaleY = 1 } = allValues;

        // 构建 transform 属性，仅当值非默认值时添加，保持输出简洁
        const transforms = [];
        if (translateX !== 0 || translateY !== 0) {
            transforms.push(`translate(${translateX}px, ${translateY}px)`);
        }
        if (rotate !== 0) {
            transforms.push(`rotate(${rotate}deg)`);
        }
        if (scaleX !== 1 || scaleY !== 1) {
            transforms.push(`scale(${scaleX}, ${scaleY})`);
        }

        const newTransformString = transforms.join(' ') || 'none'; // 如果没有变换，显示 'none'
        setTransformString(newTransformString);
    };

    // 当对话框打开或 initialTransform 变化时，重置表单
    useEffect(() => {
        if (trans) {
            form.setFieldsValue({
                translateX: trans.pos.x ?? 0,
                translateY: trans.pos.y ?? 0,
                rotate: trans.rot ?? 0,
                scaleX: trans.scale.x ?? 1,
                scaleY: trans.scale.y ?? 1,
            });
        }
    }, [trans, form]);

    return (
        <Modal
            title="变换设置 (Transform)"
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                onValuesChange={onValuesChange}
                initialValues={{
                    translateX: 0,
                    translateY: 0,
                    rotate: 0,
                    scaleX: 1,
                    scaleY: 1,
                }}
            >
                {/* 位移部分 */}
                <Divider orientation="left" orientationMargin="0">
                    <Space><ArrowsAlt />位移 (Translate)</Space>
                </Divider>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="X 轴 (px)" name="translateX">
                            <InputNumber min={-500} max={500} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Y 轴 (px)" name="translateY">
                            <InputNumber min={-500} max={500} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* 旋转部分 */}
                <Divider orientation="left" orientationMargin="0">
                    <Space><RotateRight />旋转 (Rotate)</Space>
                </Divider>
                <Form.Item label="角度 (deg)" name="rotate">
                    <Row gutter={16}>
                        <Col span={16}>
                            <Slider min={-180} max={180} step={1} />
                        </Col>
                        <Col span={4}>
                            <InputNumber min={-180} max={180} step={1} style={{ width: '100%' }} />
                        </Col>
                    </Row>
                </Form.Item>

                {/* 缩放部分 */}
                <Divider orientation="left" orientationMargin="0">
                    <Space><ZoomInOut />缩放 (Scale)</Space>
                </Divider>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="X 轴" name="scaleX">
                            <InputNumber min={0} max={3} step={0.1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Y 轴" name="scaleY">
                            <InputNumber min={0} max={3} step={0.1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* 实时预览区域 */}
                <Divider orientation="left" orientationMargin="0">实时预览</Divider>
                <div style={{
                    padding: '16px',
                    background: '#f5f5f5',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    minHeight: '60px'
                }}>
                    <code>{transformString || 'none'}</code>
                </div>
            </Form>
        </Modal>
    );
};

// 使用示例
const App = () => {
    // const [dialogVisible, setDialogVisible] = useState(false);
    // const [currentTransform, setCurrentTransform] = useState(Transform2);
    // const [previewStyle, setPreviewStyle] = useState({});

    // const handleOk = (values: any) => {
    //     // Assuming values contains translateX, translateY, rotate, scaleX, scaleY
    //     const updatedTransform = new Transform2();
    //     updatedTransform.pos.x = values.translateX ?? 0;
    //     updatedTransform.pos.y = values.translateY ?? 0;
    //     updatedTransform.rot = values.rotate ?? 0;
    //     updatedTransform.scale.x = values.scaleX ?? 1;
    //     updatedTransform.scale.y = values.scaleY ?? 1;
    //     setCurrentTransform(updatedTransform);
    //     // setPreviewStyle({ transform: `translate(${updatedTransform.pos.x}px, ${updatedTransform.pos.y}px) rotate(${updatedTransform.rot}deg) scale(${updatedTransform.scale.x}, ${updatedTransform.scale.y})` });
    //     // setDialogVisible(false);
    //     console.log('应用 transform:', updatedTransform);
    // };

    return (
        <div style={{ padding: 24 }}>
            {/* <Button type="primary" onClick={() => setDialogVisible(true)}>
                打开 Transform 设置
            </Button> */}

            {/* 预览元素 */}
            <div style={{ marginTop: 40, perspective: 400 }}>
                <div style={{
                    width: 120,
                    height: 120,
                    background: '#1677ff',
                    borderRadius: 8,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s',
                    // ...previewStyle,
                }}>
                    预览元素
                </div>
            </div>

            <Transform2Dialog
                // trans={currentTransform}
                trans={new Transform2}
            />
        </div>
    );
};

export default App;