import './devices.css';
// @ts-ignore
import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Tooltip} from "antd";

const ScanCode2 = React.forwardRef(
    (
        props: {
        },
        ref,
    ) => {

        const [sessionId, setSessionId] = useState(null);

        function generateUniqueId() {
            return 'xxx'.replace(/[x]/g, function () {
                return (Math.random() * 10 | 0).toString();
            });
        }

        const signalingServerUrl = 'wss://turn.meituan.com/ws';
        const signalingSocket = new WebSocket(signalingServerUrl);

        const remoteVideoRef = useRef(null);
        const parentRef = useRef(null);
        const leftRef = useRef(null);
        const rightRef = useRef(null);
        const topRef = useRef(null);
        const butRef = useRef(null);
        const butRef2 = useRef(null);
        const butRef3 = useRef(null);
        let w2 = 300;
        let h2 = 600;
        let peerConnection;

        const configuration = {
            iceServers: [
                {urls: 'turn:turnserver.meituan.com:3478', username: 'rpa_emulator', credential: 'turn_rpa'},
            ],
            iceTransportPolicy: 'all',
            bundlePolicy: 'max-bundle',
            rtcpMuxPolicy: 'require',
            iceCandidatePoolSize: 0
        };
        let startX3;
        let startY3;
        let isDragging = false;
        const threshold = 10; // 设定移动距离的阈值
        const clickTime = 200; // 设定点击事件的最大时间，单位毫秒
        let mouseDownTime;

        function initialSocket(s) {
            signalingSocket.onopen = () => {
                console.warn('Connected to signaling server');
                sendMessage({type: 'init', sessionId: s, role: 'web'});
                console.warn(s);
            };

            signalingSocket.onmessage = async (message) => {
                try {
                    console.warn(message);
                    const data2 = await message.data; // Convert Blob to text
                    // const data2 = await message.data.text();  // Convert Blob to text
                    if (typeof data2 === 'string') {
                        // if (true) {
                        const data = JSON.parse(data2);
                        try {
                            processData(data);
                        } catch (error) {
                            console.error('Failed to parse JSON message', error, message);
                        }
                    } else {
                        // 如果消息不是字符串（例如 Blob），先转换为文本
                        const reader = new FileReader();
                        reader.onload = () => {
                            const text = reader.result;
                            try {
                                // @ts-ignore
                                const json = JSON.parse(text);
                                // const json = JSON.parse(data);
                                processData(json);
                            } catch (error) {
                                console.error('Failed to parse WebSocket message', error, text);
                            }
                        };
                        reader.readAsText(data2);
                    }
                } catch (error) {
                    console.error('Error parsing message data:', error);
                }
            };

            signalingSocket.onclose = () => {
                console.warn('Disconnected from signaling server retry');
                // initialSocket();
            };

            signalingSocket.onerror = (e) => {
                console.error('newWebsocket error:', e);
            };
        }

        function hiddenUI() {
            console.warn('hiddenUI');
            if (parentRef.current){
                parentRef.current.style.width = "0";
                parentRef.current.style.height = "0";
                parentRef.current.style.margin = "0";
            }
            if (remoteVideoRef.current){
                remoteVideoRef.current.style.width = "0";
                remoteVideoRef.current.style.height = "0";
                remoteVideoRef.current.style.border = "0 solid #ebf0f8";
            }
            if (topRef.current){
                topRef.current.style.width = "0";
                topRef.current.style.height = "0";
            }
        }

        function processData(json) {
            console.warn('processData');
            console.warn(json);
            switch (json.type) {
                case 'offer':
                    console.warn('Received offer');
                    handleOffer(json.offer);
                    break;
                case 'candidate':
                    console.warn('Received candidate');
                    handleCandidate2(json);
                    break;
                case 'SessionDescription':
                    handleSessionDescription(json.payload);
                    break;
                case 'IceCandidate':
                    handleCandidate(json.payload);
                    break;
                case 'start':
                    console.warn('Received start');
                    // props.onStart();
                    // @ts-ignore
                    remoteVideoRef.current.addEventListener('mousedown', handleMouseDown);
                    // @ts-ignore
                    remoteVideoRef.current.addEventListener('mousemove', handleMouseMove);
                    // @ts-ignore
                    remoteVideoRef.current.addEventListener('mouseup', handleMouseUp);
                    w2 = (h2 * (json.w)) / (json.h);
                    butRef.current.addEventListener('click', back);
                    butRef2.current.addEventListener('click', home);
                    butRef3.current.addEventListener('click', opt);
                    break;
                case 'stop':
                    console.warn('Received stop');
                    if (remoteVideoRef.current) {
                        // @ts-ignore
                        remoteVideoRef.current.srcObject = null;
                    }
                    hiddenUI();
                    break;
                default:
                    break;
            }
        }

        async function handleOffer(offer) {
            if (!peerConnection) {
                createPeerConnection();
            }
            const sessionDescription = new RTCSessionDescription({type: 'offer', sdp: offer});
            // const sessionDescription = new RTCSessionDescription(offer);
            await peerConnection.setRemoteDescription(sessionDescription);
            if (sessionDescription.type === 'offer') {
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                sendMessage({
                    type: 'answer',
                    answer: answer.sdp,
                });
                console.warn('sendMessage sdp');
            }
        }

        async function handleSessionDescription(sdp) {
            if (!peerConnection) {
                createPeerConnection();
            }
            const sessionDescription = new RTCSessionDescription(sdp);
            await peerConnection.setRemoteDescription(sessionDescription);
            if (sessionDescription.type === 'offer') {
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                sendMessage({
                    type: 'SessionDescription',
                    payload: {
                        type: answer.type,
                        sdp: answer.sdp,
                    },
                });
                console.warn('sendMessage sdp');
            }
        }

        async function handleCandidate2(candidate) {
            if (peerConnection && candidate && candidate.candidate && candidate.sdpMid !== null && candidate.sdpMLineIndex !== null) {
                const iceCandidate = new RTCIceCandidate({
                    candidate: candidate.candidate,
                    sdpMid: candidate.sdpMid,
                    sdpMLineIndex: candidate.sdpMLineIndex,
                });
                await peerConnection.addIceCandidate(iceCandidate);
                console.warn('Added ICE candidate:', candidate);
            }
        }

        async function handleCandidate(candidate) {
            if (peerConnection) {
                const iceCandidate = new RTCIceCandidate(candidate);
                await peerConnection.addIceCandidate(iceCandidate);
                console.warn('Added ICE candidate:', candidate);
            }
        }

        function createPeerConnection() {
            console.warn("createPeerConnection")
            // @ts-ignore
            peerConnection = new RTCPeerConnection(configuration);

            // 监听track事件来接收远程媒体流
            peerConnection.addEventListener(
                'track',
                (event) => {
                    console.warn(event);
                    const [remoteStream] = event.streams;
                    console.warn(remoteStream);
                    if (remoteVideoRef.current) {
                        // remoteVideoRef.current.style.width=`${w}px`;
                        // remoteVideoRef.current.style.height=`${h}px`;
                        // console.warn();
                        remoteVideoRef.current.style.width = `${w2}px`;
                        remoteVideoRef.current.style.height = `${h2}px`;
                        // remoteVideoRef.current.style.border = '1px solid #ebf0f8';
                        // headRef.current.style.width=`${w2}px`;
                        // headRef.current.style.height=`20px`;

                        // @ts-ignore
                        remoteVideoRef.current.srcObject = remoteStream;
                        console.warn('remoteVideoRef.current.srcObject');
                    }
                },
                false,
            );

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    const candidate = {
                        sdp: event.candidate.candidate,
                        sdpMid: event.candidate.sdpMid,
                        sdpMLineIndex: event.candidate.sdpMLineIndex,
                        usernameFragment: event.candidate.usernameFragment,
                    };

                    sendMessage({
                        // type: 'IceCandidate',
                        type: 'candidate',
                        candidate,
                        // payload: candidate,
                    });
                    console.warn('Generated ICE candidate:', event.candidate);
                }
            };

            peerConnection.oniceconnectionstatechange = () => {
                console.warn('ICE connection state changed to:', peerConnection.iceConnectionState);
            };

            peerConnection.onconnectionstatechange = () => {
                console.warn('Connection state changed to:', peerConnection.connectionState);
                // if (peerConnection.connectionState === 'connected'){
                //   setLoading(false);
                // }
                // else
                if (peerConnection.connectionState === 'disconnected') {
                    console.warn('Received stop');
                    if (remoteVideoRef.current) {
                        // @ts-ignore
                        remoteVideoRef.current.srcObject = null;
                    }
                    // @ts-ignore
                    // parentRef.current.removeEventListener('mousedown', handleMouseDown);
                    // @ts-ignore
                    // parentRef.current.removeEventListener('mousemove', handleMouseMove);
                    // @ts-ignore
                    // parentRef.current.removeEventListener('mouseup', handleMouseUp);
                    hiddenUI()
                    // todo 这里要全部隐藏
                    // sendMessage({ type: 'close'});
                }
            };

            peerConnection.onicegatheringstatechange = () => {
                console.warn('ICE gathering state changed to:', peerConnection.iceGatheringState);
            };

            peerConnection.onsignalingstatechange = () => {
                console.warn('Signaling state changed to:', peerConnection.signalingState);
            };
        }

        // 点击事件
        const handleClick = (event) => {
            // @ts-ignore
            const rect = remoteVideoRef.current.getBoundingClientRect();
            const x2 = event.clientX - rect.left;
            const y2 = event.clientY - rect.top;
            const x = (x2 / rect.width).toFixed(3);
            const y = (y2 / rect.height).toFixed(3);
            console.warn(`Click position: (${x}, ${y})`);
            sendMessage({type: 'click', x, y});
        };

        // 鼠标按下事件
        const handleMouseDown = (e) => {
            e.stopPropagation();
            // @ts-ignore
            const rect = remoteVideoRef.current.getBoundingClientRect();
            startX3 = e.clientX - rect.left;
            startY3 = e.clientY - rect.top;
            isDragging = false;
            mouseDownTime = Date.now();
        };

        // 鼠标移动事件
        const handleMouseMove = (e) => {
            e.stopPropagation();
            if (mouseDownTime) {
                // @ts-ignore
                const rect = remoteVideoRef.current.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                if (Math.abs(currentX - startX3) > threshold || Math.abs(currentY - startY3) > threshold) {
                    isDragging = true;
                    // 可以在这里处理拖动的实际逻辑
                }
            }
        };

        // 鼠标释放事件
        const handleMouseUp = (e) => {
            e.stopPropagation();
            const mouseUpTime = Date.now();
            const duration = mouseUpTime - mouseDownTime;
            if (!isDragging && duration < clickTime) {
                handleClick(e);
            } else {
                // @ts-ignore
                const rect = remoteVideoRef.current.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;
                console.warn(`Drag from (${startX3}, ${startY3}) to (${endX}, ${endY})`);
                // 可以在这里处理拖动结束的结果
                const startX2 = (startX3 / rect.width).toFixed(3);
                const startY2 = (startY3 / rect.height).toFixed(3);
                const endX2 = (endX / rect.height).toFixed(3);
                const endY2 = (endY / rect.height).toFixed(3);

                console.warn('startX2:' + (startX3 / rect.width).toFixed(3));
                console.warn('startY2:' + (startY3 / rect.height).toFixed(3));
                console.warn('endX2:' + (endX / rect.height).toFixed(3));
                console.warn('endY2:' + (endY / rect.height).toFixed(3));
                console.warn('duration:' + duration);

                sendMessage({type: 'mousemove', startX2, startY2, endX2, endY2, duration});
            }
            mouseDownTime = null;
        };

        function back(event) {
            event.stopPropagation();
            sendMessage({type: 'back'});
            console.warn('back');
        }

        function home(event) {
            event.stopPropagation();
            sendMessage({type: 'home'});
        }

        function opt(event) {
            event.stopPropagation();
            sendMessage({type: 'opt'});
        }

        function sendMessage(message) {
            const jsonString = JSON.stringify(message);
            const buffer = new TextEncoder().encode(jsonString); // Convert JSON string to ArrayBuffer
            console.warn(signalingSocket);
            signalingSocket.send(buffer);
        }

        useEffect(() => {
            const s = generateUniqueId();
            setSessionId(s);
            console.warn(s);
            initialSocket(s);
            // rightRef.current.addEventListener('click', high);
        }, []);

        useImperativeHandle(ref, () => ({
            resetHighlight() {
            },
        }));

        return (
            <div style={{height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',backgroundColor:'white',padding:10}}>
                <div style={{overflow:'hidden'}} ref={topRef}>
                    <span style={{color:'black',fontSize:20,fontWeight:500}}>请输入投屏码  </span>
                    <span style={{color:'red',fontSize:20,fontWeight:600}}>{sessionId}</span>
                </div>

            <div ref={parentRef} style={{
                display: 'flex',
                flexDirection: 'row',
                padding: 0,
                margin: 20,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }} className=''>
                <div className='rightFlowStyleNew' ref={rightRef}>
                    <video ref={remoteVideoRef} autoPlay playsInline
                           poster="https://img.zcool.cn/community/01e82a5bf825a4a80121ab5d987410.gif"
                           style={{
                               width: `${w2}px`,
                               height: `${h2}px`,
                               border:'1px solid #000000',
                               borderRadius:'10px',
                           }}/>
                </div>
                {/*<div className='leftFlowStyleNew' ref={leftRef}>*/}
                {/*    <Tooltip placement='left' title={'返回'}>*/}
                {/*        <img className='iconStyle' style={{width: 15, height: 15}}*/}
                {/*            // src={require('./assets/img/back.png')}*/}
                {/*             ref={butRef}/>*/}
                {/*    </Tooltip>*/}

                {/*    <Tooltip placement='left' title={'首页'}>*/}
                {/*        <img className='iconStyle' style={{width: 15, height: 15}}*/}
                {/*            // src={require('./assets/img/home.png')}*/}
                {/*             ref={butRef2}/>*/}
                {/*    </Tooltip>*/}

                {/*    <Tooltip placement='left' title={'多任务'}>*/}
                {/*        <img className='iconStyle' style={{width: 15, height: 15}}*/}
                {/*            // src={require('./assets/img/opt.png')}*/}
                {/*             ref={butRef3}/>*/}
                {/*    </Tooltip>*/}
                {/*</div>*/}
            </div>
            </div>
        );
    },
);

export default ScanCode2;
