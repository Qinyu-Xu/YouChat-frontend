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

    if(isBrowser && socket !== null && socket.readyState === 1) {
        socket.send(JSON.stringify({
                type: "pull",
                sessionId: props.session.sessionId,
                messageScale: 30
            })
        );
    }
    if(isBrowser && socket != null && socket.readyState === 1) {
        socket.addEventListener("message", (res: any) => {
            res = eval("("+res.data+")");
            if (res.type === 'pull') {
                setMessages(res.messages);
            }
        })
    }
    if(isBrowser && socket != null && socket.readyState === 1) {
        socket.addEventListener("message", (res: any) => {
            if (res.data.type === 'send' && res.data.sessionId === props.session.sessionId) {
                setMessages((messages: any) => [...messages, {
                    senderId: res.senderId,
                    timestamp: res.timestamp,
                    message: res.message,
                    messageId: res.messageId
                }]);
            }
        })
    }

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
                {
                    /*
                                    <div className={styles.message}>
                    <div className={styles.headshot_left}>
                        <img src="/headshot/00.svg"/>
                    </div>
                    <div className={styles.message_left}>
                        $ax^2+bx+c=0$ 的解是什么？
                    </div>
                </div>
                <div className={styles.message}>
                    <div className={styles.headshot_right}>
                        <img src="/headshot/01.svg"/>
                    </div>
                    <div className={styles.message_right}>
                        x _ 1,2 = \frac -b \pm \sqrt b^2-4ac 2a$
                    </div>
                </div>
                    */
                }
            </div>
            <SingleMessage sessionId={props.session.sessionId}/>
        </div>

    )
};

export default ChatBoard;
