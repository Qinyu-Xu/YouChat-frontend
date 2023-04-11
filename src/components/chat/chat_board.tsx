import {useState} from "react";
import { useCookies } from "react-cookie";
import SingleMessage from "@/components/chat/single_message";
import styles from "@/styles/chat.module.css"
import {isBrowser} from "@/utils/store";
import {store} from "@/utils/store";

const ChatBoard = (props: any) => {
    const socket: any = store.getState().webSocket;
    const [cookie, setCookie] = useCookies(["id"]);
    const [messages, setMessages] = useState<any>([]);
    const id = cookie.id;

    if(isBrowser && socket && socket.readyState == true) socket.send(JSON.stringify({
        type: "pull",
        "sessionId": props.session.sessionId,
        "messageScale": 30})
    );
    if(isBrowser && socket && socket.readyState == true)
        socket.addEventListener("message", (res: any) => {
        if(res.type === 'pull') setMessages(res.messages);
    })
    if(isBrowser && socket && socket.readyState == true)
        socket.addEventListener("message", (res: any) => {
        if( res.type === 'send' && res.sessionId === props.session.sessionId) {
            setMessages((messages: any) => [...messages, {
                "senderId": res.senderId,
                "timestamp": res.timestamp,
                "message": res.message,
                "messageId": res.messageId
            }]);
        }
    })

    return (
        <div className={styles.container}>
            <div className={styles.title_bar}>
                {props.session.sessionName}
            </div>
            <div className={styles.display_board}>
                {messages.map((message: any) =>
                    message.senderId === store.getState().userId ? (
                        <div className={styles.message} key={message.messageId}>
                            <div className={styles.headshot_right}>
                                <img src="/headshot/01.svg"/>
                            </div>
                            <div className={styles.message_right}>
                                {message.message}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.message} key={message.messageId}>
                            <div className={styles.headshot_left}>
                                <img src="/headshot/02.svg"/>
                            </div>
                            <div className={styles.message_left}>
                                {message.message}
                            </div>
                        </div>
                ))}
            </div>
            <SingleMessage sessionId={props.session.sessionId}/>
        </div>

    )
};

export default ChatBoard;
