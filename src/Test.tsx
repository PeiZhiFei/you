import './devices.css';
// @ts-ignore
import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Button, Modal} from "antd";
// @ts-ignore
// import ScanCode2 from "./ScanCode2.tsx";


const Test  = React.forwardRef((props: { size: number; }, ref,) => {
    const [device, setDevice] = useState([]);

    function generateUniqueId() {
        return 'xxx'.replace(/[x]/g, function () {
            return (Math.random() * 10 | 0).toString();
        });
    }

    const addScanCode = () => {
            const s = generateUniqueId();
            setDevice((prevSelectedIds) => [...prevSelectedIds, s]);
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
                {/*<Modal open={previewOpen} footer={null} onCancel={() => {*/}
                {/*    setPreviewOpen(false)*/}
                {/*}}>*/}
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
                {/*</Modal>*/}
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
                {/*    <ScanCode2*/}
                {/*        key={id}*/}
                {/*    />*/}
                {/*))}*/}
            </div>
        </div>
    );
    },
);

export default Test;
