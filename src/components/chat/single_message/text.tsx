import {isBrowser, store} from "@/utils/store";
import CircularJson from "circular-json";
import styles from "@/styles/chat.module.css";
import {Button} from "antd";


const TextBoard = (props: any) => {
    const socket: any = store.getState().webSocket;
    // 发送文本信息
    const handleClick = (e: any) => {
        if(isBrowser && socket !== null && socket.readyState===1) {
            if(props.text !== "") {
                const message = {
                    type: "send",
                    id: store.getState().userId,
                    sessionId: props.sessionId,
                    timestamp: Date.now(),
                    message: props.text,
                    messageType: "text"
                };
                const addM = {
                    "senderId": store.getState().userId,
                    "timestamp": Date.now(),
                    "messageId": -1,
                    "message": props.text,
                    "messageType": "text"
                }
                socket.send(CircularJson.stringify(message));
                props.setMessages((message: any) => [...message, addM]);
            }
        }
        props.setText("");
    };

    return (
        <div className={styles.writing_box}>
            <textarea
                className={styles.writing}
                onChange={(e: any) => props.setText(e.target.value)}
                value={props.text}/>
            <div className={styles.send}>
                <Button onClick={handleClick} >发送</Button>
            </div>
        </div>
    )
};

export default TextBoard;