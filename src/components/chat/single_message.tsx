import { Button, Input } from "antd";
import styles from "@/styles/chat.module.css"
import {isBrowser} from "@/utils/store";
import {store} from "@/utils/store"
import CircularJson from 'circular-json';
import {useState} from "react";

const SingleMessage = (props: any) => {
    const socket: any = store.getState().webSocket;
    const [text, setText] = useState("");
    const handleClick = (e: any) => {
        if(isBrowser && socket !== null && socket.readyState===1) {
            socket.send(CircularJson.stringify({
                type: "send",
                sessionId: props.sessionId,
                timestamp: Date.now(),
                message: text,
            }));
        }
    }
    socket.addEventListener("close", (e) => console.log(e));
    return (
        <div className={styles.input_box}>
            <div className={styles.function_bar}>
                <div className={styles.function_button}>
                    <img src="ui/emoji.svg"/>
                </div>
                <div className={styles.function_button}>
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
            <textarea className={styles.writing} onChange={(e: any) => setText(e.target.value)}/>
            <Button onClick={handleClick} >发送</Button>
        </div>
    );
}

export default SingleMessage;