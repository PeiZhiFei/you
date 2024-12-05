import './devices.css';
// @ts-ignore
import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Button, Modal} from "antd";
// @ts-ignore
import ScanCode2 from "./ScanCode2.tsx";


const Screen3  = React.forwardRef((props: { size: number; }, ref,) => {
    const [device, setDevice] = useState([]);

    function generateUniqueId() {
        return 'xxx'.replace(/[x]/g, function () {
            return (Math.random() * 10 | 0).toString();
        });
    }

    const addScanCode = () => {
        console.warn("开始投屏")
        const s = generateUniqueId();
        setDevice((prevSelectedIds) => [...prevSelectedIds, s]);
    };

    const close = (id) => {
        setDevice(device.filter(session => session !== id));
    };

    const [previewOpen, setPreviewOpen] = useState(false);

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#ffffff'
        }}>
            <div>
                <Modal open={previewOpen} footer={null} onCancel={() => {
                    setPreviewOpen(false)
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <p style={{margin: '10px', fontWeight: '500', fontSize: 24}}>接收投屏</p>
                        <p style={{margin: '1px', color: '#848484', fontSize: 16}}>通过同一局域网投屏到此</p>
                        <p style={{marginTop: '30px', marginBottom: '20px', fontWeight: '500', fontSize: 20}}>使用 Xbot
                            App扫码</p>
                    </div>
                </Modal>
            </div>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                backgroundColor: '#ffffff',
                justifyContent:'center'
            }}>
                <Button style={{width: 80, height: 30, fontSize: 14, margin: '20px 20px',alignSelf:"center"}}
                        onClick={()=>addScanCode()}>开始投屏
                </Button>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
                // gap: '10px'
            }}>
                {/*{device.map((id, index) => (*/}
                    <ScanCode2
                        // onClose={close(id)}
                    />
                {/*))}*/}
            </div>
        </div>
    );
    },
);

export default Screen3;
