import { Button, Input } from "antd";
import styles from "@/styles/chat.module.css"
import {isBrowser} from "@/utils/store";
import {store} from "@/utils/store"

interface SingleMessageProps {
    session: number;
}

const SingleMessage = (props: SingleMessageProps) => {
    const socket: any = store.getState().webSocket;
    const handleClick = (text: any) => {
        if(isBrowser)
            socket?.send(JSON.stringify({
            type: "send",
            "sessionId": props.session,
            "message": text
        }));
    }
    return (
        <div className={styles.input_box}>
            <div className={styles.function_bar}>
                🥰 ｜ 🏞️ ｜ 🎙️ ｜ 📄
            </div>
            <textarea className={styles.writing}/>
            {/* <Button onClick={handleClick} /> */}
        </div>
    );
}

export default SingleMessage;