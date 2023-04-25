import {Button, message} from "antd";
import styles from "@/styles/chat.module.css"
import {isBrowser} from "@/utils/store";
import {store} from "@/utils/store"
import CircularJson from 'circular-json';
import {useState} from "react";
import {fileToBase64} from "@/utils/utilities";

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

    const handleClick = (e: any) => {
        if(isBrowser && socket !== null && socket.readyState===1) {
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
        setText("");
    };

    const handleImageClick = () => {
        const imgInput = document.getElementById("imgInput");
        imgInput.click();
    };

    const handleFileSelect = (e: any) => {
        const file = e.target.files[0];
        if(file) {
            if (!file.type.startsWith("image/")) {
                message.error("请上传图片！");
            } else {
                fileToBase64(file).then((res) => {
                    const socket: any = store.getState().webSocket;
                    socket.send(CircularJson.stringify({
                        type: "send",
                        id: store.getState().userId,
                        sessionId: props.sessionId,
                        timestamp: Date.now(),
                        message: res,
                        messageType: "photo"
                    }));
                    const addM = {
                        "senderId": store.getState().userId,
                        "timestamp": Date.now(),
                        "messageId": Date.now(),
                        "message": res,
                        "messageType": "photo"
                    };
                    props.setMessages((message: any) => [...message, addM]);
                })
            }
        }
        const imgInput = document.getElementById("imgInput");
        imgInput.value = "";
    }

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
                    <input type="file" id="imgInput" style={{display: "none"}} onChange={handleFileSelect} />
                    <img src="ui/pic.svg"/>
                </div>
                <div className={styles.function_button}>
                    <img src="ui/microphone.svg"/>
                </div>
                <div className={styles.function_button}>
                    <img src="ui/file-addition.svg"/>
                </div>
                <div className={styles.function_button}>
                    <img src="ui/phone-video-call.svg"/>
                </div>
            </div>
            <textarea 
                className={styles.writing}
                onChange={(e: any) => setText(e.target.value)} 
                value={text}
            />
            <Button onClick={handleClick} >发送</Button>
        </div>
    );
}

export default SingleMessage;