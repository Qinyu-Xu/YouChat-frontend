import {useEffect, useRef, useState} from "react";
import {Avatar, message} from "antd";
import styles from "@/styles/chat.module.css";
import {AudioFilled, AudioOutlined, CaretRightOutlined} from "@ant-design/icons";
import {fileToBase64} from "@/utils/utilities";
import {store} from "@/utils/store";
import CircularJson from "circular-json";
import Recorder from "js-audio-recorder";

export const AudioPlayer = ({ base64Audio }: any) => {
    const audioRef = useRef<any>(null);
    const [audioUrl, setAudioUrl] = useState<any>();

    const handlePlay = async () => {
        audioRef.current.play();
    };

    useEffect(() => {
        fetch(base64Audio).then(res => res.blob()).then((blob) => {
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        });
    },[]);

    return (
        <div onClick={handlePlay}>
            <CaretRightOutlined /> 播放
            <audio ref={audioRef} src={audioUrl} style={{display: "none"}} />
        </div>
    );
};

const AudioInput = (props: any) => {


    const [recording, setRecording] = useState(false);
    const [audioRecorder, setAudioRecorder] = useState<any>(null);
    /*
    const [chunks, setChunks] = useState<any>([]);
    const [refresh, setRefresh] = useState(false);
     */

    useEffect(() => {initMediaRecorder();}, []);

    const initMediaRecorder = async () => {
        try {
            /*
            const stream: any = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder: any = new MediaRecorder(stream);
            recorder.audioChannels = 1;
            recorder.audioBitrate = 128000;
            recorder.mimeType = 'audio/wav'
            setMediaRecorder(recorder);
            recorder.start();
             */
            if(typeof(navigator.mediaDevices.getUserMedia) == "undefined") {
                message.error("当前没有语音权限");
                return;
            }
            if(navigator.mediaDevices.getUserMedia) {
                const constraints = { audio: true };
                navigator.mediaDevices.getUserMedia(constraints).then(
                    () => {
                        console.log("授权成功!");
                    },
                    () => {
                        console.log("授权失败!");
                });
            } else {
                console.log("浏览器不支持 getUserMedia");
            }
            const recorder = new Recorder({
                sampleBits: 16,
                sampleRate: 16000,
                numChannels: 1,
            });
            setAudioRecorder(recorder);
        } catch (error: any) {
            message.error('Error initializing MediaRecorder:', error);
        }
    };

    // 录音喊话
    const onSpeak = () => {
        setRecording(true);
        audioRecorder.start().then(function() {
            message.success('speaking...')
        });
    };

    const sendSpeak = () => {
        setRecording(false);
        // 结束录音
        audioRecorder.stop();
        // 获取 WAV 数据(Blob)
        let blob = audioRecorder.getWAVBlob();
        // 将WAV转化，获取 MP3 数据(Blob)，函数wavToMp3、blobToBase64见下两个代码块
        fileToBase64(blob).then((base: any) => {
            const socket: any = store.getState().webSocket;
            const message = {
                type: "send",
                id: store.getState().userId,
                sessionId: props.sessionId,
                timestamp: Date.now(),
                message: base,
                messageType: "audio"
            }
            const addM = {
                "senderId": store.getState().userId,
                "timestamp": Date.now(),
                "messageId": -1,
                "message": base,
                "messageType": "audio"
            };
            socket.send(CircularJson.stringify(message));
            props.setMessages((message: any) => [...message, addM]);
        });
    };


    /*
    useEffect(() => {
        if(recording) {
            initMediaRecorder();
        } else {
            if (mediaRecorder) {
                mediaRecorder.stop();
                mediaRecorder.stream.getTracks().forEach((track: any) => track.stop());
                setMediaRecorder(null);
            }
        }
    }, [recording]);

    useEffect(() => {
        if ( mediaRecorder ) {
            mediaRecorder.ondataavailable = (e: any) => {
                if (e.data.size > 0) setChunks([e.data]);
            };
            mediaRecorder.onstop = async () => {
                setRefresh(true);
            }
        }
    }, [mediaRecorder]);

    useEffect(() => {
        if(refresh) {
            const audioBlob = new Blob(chunks);
            const base64Audio = fileToBase64(audioBlob).then((base: any) => {
                const socket: any = store.getState().webSocket;
                const message = {
                    type: "send",
                    id: store.getState().userId,
                    sessionId: props.sessionId,
                    timestamp: Date.now(),
                    message: base,
                    messageType: "audio"
                }
                const addM = {
                    "senderId": store.getState().userId,
                    "timestamp": Date.now(),
                    "messageId": -1,
                    "message": base,
                    "messageType": "audio"
                };
                socket.send(CircularJson.stringify(message));
                props.setMessages((message: any) => [...message, addM]);
            });
            setRefresh(false);
            setChunks([]);
        }
    }, [chunks]);

    const startSpeechRecognition = () => {
        if(!recording) {
            setRecording(true);
        } else {
            setRecording(false);
            mediaRecorder.stop();
        }
    }

     */

    return (
        <div className={styles.audio}>
            <Avatar icon={recording ? <AudioFilled /> : <AudioOutlined />}
                    size={"large"} onClick={recording ? sendSpeak : onSpeak}/>
        </div>
    )
}

export const AudioIcon = (props: any) => {
    const handleSpeech = () => {props.setAudio((audio: any) => !audio);}
    return (
        <div className={styles.function_button} onClick={handleSpeech}>
            <img src="ui/microphone.svg"/>
        </div>
    )
}



export default AudioInput;