import {useEffect, useRef, useState} from "react";
import SingleMessage from "@/components/chat/single_message";
import styles from "@/styles/chat.module.css"
import { isBrowser } from "@/utils/store";
import { store } from "@/utils/store";

const socket: any = store.getState().webSocket;

const ChatBoard = (props: any) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const getPull = () => {
            setLoading(false);
            socket.send(JSON.stringify({
                    type: "pull",
                    sessionId: props.session.sessionId,
                    messageScale: 100
                })
            );
            setLoading(true);
        };

        const handleSend = (res: any) => {
            res = eval("(" + res.data + ")");
            if (res.type === 'send' && res.sessionId === props.session.sessionId) {
                getPull();
            }
        };

        const handlePull = (res: any) => {
            res = eval("(" + res.data + ")")
            if ( res.type === 'pull' ) {
                setMessages(res.messages);
                setMessages((messages) => messages.reverse());
            }
        };

        if(isBrowser && socket != null && socket.readyState === 1) {
            socket.addEventListener("message", handleSend);
            socket.addEventListener("message", handlePull);
            getPull();
        }

        return () => {
            socket.removeEventListener('message', handleSend);
            socket.removeEventListener('message', handlePull);
        };
    }, [props.session.sessionId]);

    return (
        <div className={styles.container}>
            <div className={styles.title_bar}>
                {props.session.sessionName}
            </div>
            <div className={styles.display_board} >
                {messages.map((message: any, index: any) =>
                    message.senderId === store.getState().userId ? (
                        <div className={styles.message} key={index+1}>
                            <div className={styles.headshot_right}>
                                <img src="/headshot/01.svg"/>
                            </div>
                            <div className={styles.message_right}>
                                {message.message}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.message} key={index+1}>
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
