import {useState, useRef, useEffect} from "react";
import {Button, message, Modal} from "antd";
import {store} from "@/utils/store";
import CircularJson from "circular-json";

export const SenderBoard = (props: any) => {

    const [ok, setOk] = useState(false);

    const handleClick = () => {
        const socket: any = store.getState().webSocket;
        socket.send(JSON.stringify({
            type: "notice_video",
            from: store.getState().userId,
            to: props.to,
            sessionId: props.sessionId,
            status: 'query'
        }));
        message.success("已经发送请求！");
    }

    const handleCancel = () => {
        props.setOpen(false);
    }

    useEffect(() => {
        const handleOffer = (res: any) => {
            res = JSON.parse(res.data);
            if(res.type === "notice_video" && res.sessionId === props.sessionId) {
                if(res.status === "agree" && res.from !== store.getState().userId) {
                    message.success("对方已经同意！");
                    setOk(true);
                }
            }
        }
        const socket: any = store.getState().webSocket;
        socket.addEventListener("message", handleOffer);
        return () => {socket.removeEventListener("message", handleOffer);}
    }, [props.to]);

    return (
        <Modal open={props.open} width={750} onCancel={handleCancel}>
            <div>
                是否邀请对方进行视频通话
                <br /><br />
                <Button onClick={handleClick}>
                确定邀请
            </Button>
            <Button onClick={handleCancel}>
                取消邀请
            </Button>
                <br />
            </div>
            <Sender sessionId={props.sessionId} to={props.to} ok={ok} />
        </Modal>
    )
}

export const ReceiverBoard = (props: any) => {

    const [res, setRes] = useState<any>();
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        const socket: any = store.getState().webSocket;
        socket.send(JSON.stringify({
            type: "notice_video",
            from: res.to,
            to: res.from,
            status: "agree",
            sessionId: res.sessionId,
        }));
    }

    const handleCancel = () => {
        setOpen(false);
    }

    useEffect(() => {
        const socket: any = store.getState().webSocket;
        const handleNotice = (res: any) => {
            res = JSON.parse(res.data);
            if(res.type === "notice_video" && res.status === "query" && res.from !== store.getState().userId) {
                setRes(res);
                setOpen(true);
            }
        }

        socket.addEventListener("message", handleNotice);
        return () => {socket.removeEventListener("message", handleNotice);}
    }, [props.sessionId]);


    return (
        <Modal open={open} width={750} onCancel={handleCancel}>
            <div>
                是否邀请同意进行视频通话
                <br /><br />
                <Button onClick={handleClick}>
                    同意邀请
                </Button>
                <br/> <br />
            </div>
            <Receiver to={props.to} />
        </Modal>
    )
}

export const Sender = (props: any) => {
    const local_video = useRef<any>();
    const remote_video = useRef<any>();
    const [stream, setStream] = useState<any>(null);
    const [peer, setPeer] = useState<any>(null);
    const socket: any = store.getState().webSocket;

    useEffect(() => {getMedia();}, []);

    const getMedia = async() => {
        let ori_stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setStream(ori_stream);
        if (local_video.current) {
            local_video.current.srcObject = ori_stream;
        }
        const turnConf = {
            iceServers: [
                {
                    urls: 'turn:101.200.84.122:3478',
                    username: 'st',
                    credential: 'swimtogether',
                },
            ],
        };
        const Peer = new RTCPeerConnection(turnConf);
        setPeer(Peer);
    };

    const peerInit = async () => {
        let offer = await peer.createOffer();
        peer.setLocalDescription(offer);
        socket.send(CircularJson.stringify({
            type: "offer",
            to: props.to,
            from: store.getState().userId,
            sessionId: props.sessionId,
            data: offer,
        }));
    }

    useEffect(() => {
        if(peer !== null && props.ok) {
            peerInit();
            peer.onicecandidate = (event: any) => {
                if (event.candidate) {
                    socket.send(CircularJson.stringify({
                        type: 'candid',
                        from: store.getState().userId,
                        to: props.to,
                        sessionId: props.sessionId,
                        data: event.candidate,
                    }));
                }
            };
            stream.getTracks().forEach((track: MediaStreamTrack) => {
                peer.addTrack(track, stream);
            });
            peer.ontrack = async (event: any) => {
                let [remoteStream] = event.streams;
                console.log(remoteStream);
                remote_video.current.srcObject = remoteStream;
            };
        }}, [peer, props.ok]);

    const handleCandid = (data: any) => {
        data = JSON.parse(data.data);
        if(data.type === "candid" && data.from !== store.getState().userId) {
            let candid = new RTCIceCandidate(data.data);
            peer.addIceCandidate(candid);
        }
    };

    const handleAnswer = async (data: any) => {
        data = JSON.parse(data.data);
        if(data.type === "answer" && data.from != store.getState().userId) {
            let answer = new RTCSessionDescription(data.data);
            peer.setRemoteDescription(answer);
        }
    }

    useEffect(() => {
        if(peer != null) {
            socket.addEventListener("message", handleCandid);
            socket.addEventListener("message", handleAnswer);
            return () => {
                socket.removeEventListener("message", handleCandid);
                socket.removeEventListener("message", handleAnswer);
            }
        }
    },[peer]);

    return  (
        <div>
            <div>
                LOCAL
                <br />
                <video ref={local_video} autoPlay muted />
                <br />
                REMOTE
                <br />
                <video ref={remote_video} autoPlay muted />
            </div>
        </div>
    )

};

export const Receiver = (props: any) => {

    const local_video = useRef<any>();
    const remote_video = useRef<any>();
    const [stream, setStream] = useState<any>(null);
    const [peer, setPeer] = useState<any>(null);
    const [sessionId, setSessionId] = useState<any>(0);
    const socket: any = store.getState().webSocket;

    const getMedia = async() => {
        let ori_stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setStream(ori_stream);
        if (local_video.current) {
            local_video.current.srcObject = ori_stream;
        }

        const turnConf = {
            iceServers: [
                {
                    urls: 'turn:101.200.84.122:3478',
                    username: 'st',
                    credential: 'swimtogether',
                },
            ],
        };

        const Peer = new RTCPeerConnection(turnConf);
        setPeer(Peer);
    };

    useEffect(() => {
        getMedia();
    },[]);

    useEffect(() => {
        if(peer !== null) {
            peer.onicecandidate = (event: any) => {
                if (event.candidate) {
                    socket.send(CircularJson.stringify({
                        type: 'candid',
                        from: store.getState().userId,
                        to: props.to,
                        sessionId: sessionId,
                        data: event.candidate,
                    }));
                }
            };

            stream.getTracks().forEach((track: MediaStreamTrack) => {
                peer.addTrack(track, stream);
            });

            peer.ontrack = async (event: any) => {
                let [remoteStream] = event.streams;
                console.log(remoteStream);
                remote_video.current.srcObject = remoteStream;
            };

        }
    }, [peer]);

    const handleCandid = (data: any) => {
        data = JSON.parse(data.data);
        if(data.type === "candid" && data.from !== store.getState().userId) {
            let candid = new RTCIceCandidate(data.data);
            peer.addIceCandidate(candid);
        }
    };

    const handleOffer = async (data: any) => {
        data = JSON.parse(data.data);
        if(data.type === "offer" && data.from !== store.getState().userId) {
            setSessionId(data.sessionId);
            let offer = new RTCSessionDescription(data.data);
            await peer.setRemoteDescription(offer);
            let answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.send(CircularJson.stringify({
                type: 'answer',
                from: data.to,
                to: data.from,
                sessionId: data.sessionId,
                data: answer,
            }));
        }
    }

    useEffect(() => {
        if(peer != null) {
            socket.addEventListener("message", handleOffer);
            socket.addEventListener("message", handleCandid);
            return () => {
                socket.removeEventListener("message", handleCandid);
                socket.removeEventListener("message", handleOffer);
            };
        }
    }, [peer]);

    return  (
        <div>
            <div>
                LOCAL <br />
                <video ref={local_video} autoPlay muted />
                <br />
                REMOTE <br />
                <video ref={remote_video} autoPlay muted />
                <br/>
            </div>
        </div>
    )

};