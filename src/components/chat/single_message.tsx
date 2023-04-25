import {Avatar, Button, message} from "antd";
import styles from "@/styles/chat.module.css"
import {isBrowser} from "@/utils/store";
import {store} from "@/utils/store"
import CircularJson from 'circular-json';
import {useEffect, useState} from "react";
import {fileToBase64} from "@/utils/utilities";
import {AudioFilled, AudioOutlined} from "@ant-design/icons";

const emoji_list = [
    '😀', '😂', '🤣', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '🥰', '😘',
    '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😶', '🙄', '😏', '😣', '😥', '🤐',
    '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔',
    '🙃', '😲', '🙁', '😖', '😟', '😤', '😢', '😭', '😧', '😨', '🤯', '😬',
    '😰', '😱', '😳', '🤪', '😵', '😡', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
    '😇', '🤡', '🤫', '🤭', '🧐', '🤓', '👻', '🤖', '💩', '🙌', '👏', '🤝', 
    '👍', '👎', '👊', '🤟', '👌', '👈', '👉', '👆', '👇', '👋', '💪', '🙏'
];

const SingleMessage = (props: any) => {
    const socket: any = store.getState().webSocket;
    const [text, setText] = useState("");
    const [emoji, setEmoji] = useState(false);
    const [audio, setAudio] = useState(false);
    const [recording, setRecording] = useState(false);

    // 发送文本信息
    const handleClick = (e: any) => {
        if(isBrowser && socket !== null && socket.readyState===1) {
            if(text !== "") {
                const message = {
                    type: "send",
                    id: store.getState().userId,
                    sessionId: props.sessionId,
                    timestamp: Date.now(),
                    message: text,
                    messageType: "text"
                };
                const addM = {
                    "senderId": store.getState().userId,
                    "timestamp": Date.now(),
                    "messageId": Date.now(),
                    "message": text,
                    "messageType": "text"
                }
                socket.send(CircularJson.stringify(message));
                props.setMessages((message: any) => [...message, addM]);
            }
        }
        setText("");
    };

    // 发送表情
    const handleEmoji = (e: any) => {
        setText(text + e.target.id);
    };

    const emojiList: any[] = [];
    emoji_list.map(emoji => {
        emojiList.push(
            <button className={styles.emoji_item} id={emoji} onClick={handleEmoji}>
                {emoji}
            </button>
        );
    });

    // 发送图片
    const handleImageClick = () => {
        const imgInput: any = document.getElementById("imgInput");
        imgInput.click();
    };

    const handleImgSelect = (e: any) => {
        const file = e.target.files[0];
        if(file) {
            if (!file.type.startsWith("image/")) {
                message.error("请上传图片！");
            } else {
                fileToBase64(file).then((res) => {
                    const socket: any = store.getState().webSocket;
                    const message = {
                        type: "send",
                        id: store.getState().userId,
                        sessionId: props.sessionId,
                        timestamp: Date.now(),
                        message: res,
                        messageType: "photo"
                    }
                    console.log(message);
                    const addM = {
                        "senderId": store.getState().userId,
                        "timestamp": Date.now(),
                        "messageId": Date.now(),
                        "message": res,
                        "messageType": "photo"
                    };
                    socket.send(CircularJson.stringify(message));
                    props.setMessages((message: any) => [...message, addM]);
                })
            }
        }
        const imgInput: any = document.getElementById("imgInput");
        imgInput.value = "";
    }

    // 发送语音
    const [mediaRecorder, setMediaRecorder] = useState<any>(null);
    const [mediaStream, setMediaStream] = useState<any>(null);
    let chuncks = [];

    const handleSpeech = () => setAudio(audio => !audio);
    useEffect(() => {
        // initMediaRecorder();
        return () => {
            setRecording(false);
            setMediaRecorder(null);
            setMediaStream(null);
        }
    }, [props.sessionId]);

    const initMediaRecorder = async () => {
        try {
            const stream: any = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder: any = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            setMediaStream(stream);
        } catch (error: any) {
            message.error('Error initializing MediaRecorder:', error);
        }
    };

    useEffect(() => {
        /*
        if (mediaRecorder) {
            mediaRecorder.ondataavailable = (e: any) => {
                if (e.data.size > 0)
                    chuncks.push(e.data);
            };
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chuncks);
                const base64Audio = await fileToBase64(audioBlob);
                console.log('Base64 Audio:', base64Audio);
                mediaStream.getAudioTracks().forEach((track) => {track.stop();})
            }
        }
        */

    }, [mediaRecorder]);

    const startSpeechRecognition = () => {
        /* if(!recording) {
            if(mediaRecorder) {
                if (mediaStream)
                    mediaStream.getAudioTracks().forEach((track) => {track.enabled = true});
                chuncks = [];
                setRecording(true);
                mediaRecorder.start();
            }
        } else {
            setRecording(false);
            mediaRecorder.stop();
        }
        */
    }


    return (
        <div className={styles.input_box}>
            { 
                emoji ? 
                <div className={styles.emoji_board}>
                    { emojiList }
                </div> : <div/> 
            }
            <div className={styles.function_bar}>
                <div className={styles.function_button} onClick={() => {
                    setEmoji(!emoji);
                }}>
                    <img src="ui/emoji.svg"/>
                </div>
                <div className={styles.function_button} onClick={handleImageClick}>
                    <input type="file" id="imgInput" style={{display: "none"}} onChange={handleImgSelect} />
                    <img src="ui/pic.svg"/>
                </div>
                <div className={styles.function_button} onClick={handleSpeech}>
                    <img src="ui/microphone.svg"/>
                </div>
                <div className={styles.function_button}>
                    <img src="ui/file-addition.svg"/>
                </div>
                <div className={styles.function_button}>
                    <img src="ui/phone-video-call.svg"/>
                </div>
            </div>
            {
                audio
                ?
                    <div className={styles.audio}>
                        <Avatar icon={recording ? <AudioFilled /> : <AudioOutlined />} size={"large"} onClick={startSpeechRecognition}/>
                    </div>
                :
                    <div>
                        <textarea
                            className={styles.writing}
                            onChange={(e: any) => setText(e.target.value)}
                            value={text} />
                        <div className={styles.send}>
                            <Button onClick={handleClick} >发送</Button>
                        </div>
                    </div>
            }
        </div>
    );
}

export default SingleMessage;