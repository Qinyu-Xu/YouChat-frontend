import { Button, Input } from "antd";
import chat_styles from "@/styles/chat.module.css"
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
        <div className={chat_styles.input_box}>
            <div className={chat_styles.function_bar}>
                🥰 ｜ 🏞️ ｜ 🎙️ ｜ 📄
            </div>
            <textarea className={chat_styles.writing}/>
            {/* <Button onClick={handleClick} /> */}
        </div>
    );
}

export default SingleMessage;