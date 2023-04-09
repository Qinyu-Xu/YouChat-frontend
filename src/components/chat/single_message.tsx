import { Button, Input } from "antd";
import styles from "@/styles/chat.module.css"
import store from "@/utils/store";

interface SingleMessageProps {
    session: number;
}

const SingleMessage = (props: SingleMessageProps) => {
    const socket = store.getState().socket;
    const handleClick = (text: any) => {
        socket.emit("send", {
            "sessionId": props.session,
            "message": text
        });
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